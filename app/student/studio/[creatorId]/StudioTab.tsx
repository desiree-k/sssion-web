'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { formatVideoDuration, formatClassDate, countdownTo } from '@/lib/format'

interface VideoItem {
  id: string
  title: string
  thumbnail_url: string | null
  mux_playback_id: string | null
  duration_seconds: number | null
  difficulty_level: string | null
}

interface ContinueWatchingItem extends VideoItem {
  progress_seconds: number
}

interface LiveClass {
  id: string
  title: string
  description: string | null
  scheduled_at: string
  duration_minutes: number | null
  meeting_url: string | null
  meeting_platform: string | null
}

const DIFFICULTY_FILTERS = ['All', 'Beginner', 'Intermediate', 'Advanced']

function thumbnailUrl(video: VideoItem): string | null {
  if (video.thumbnail_url) return video.thumbnail_url
  if (video.mux_playback_id) {
    return `https://image.mux.com/${video.mux_playback_id}/thumbnail.jpg`
  }
  return null
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r?\n/g, '\\n')
}

function downloadIcsFile(liveClass: LiveClass) {
  const start = new Date(liveClass.scheduled_at)
  if (isNaN(start.getTime())) return
  const end = new Date(start.getTime() + (liveClass.duration_minutes ?? 60) * 60000)
  const formatIcsDate = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sssion//Live Class//EN',
    'BEGIN:VEVENT',
    `UID:${liveClass.id}@sssion.studio`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcsText(liveClass.title)}`,
    liveClass.meeting_url ? `LOCATION:${escapeIcsText(liveClass.meeting_url)}` : '',
    liveClass.description ? `DESCRIPTION:${escapeIcsText(liveClass.description)}` : '',
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${liveClass.title.replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'live-class'}.ics`
  anchor.click()
  URL.revokeObjectURL(url)
}

function VideoCard({ video, progressSeconds }: {
  video: VideoItem
  progressSeconds?: number
}) {
  const thumb = thumbnailUrl(video)
  const duration = formatVideoDuration(video.duration_seconds)
  const progressPct =
    progressSeconds !== undefined && video.duration_seconds
      ? Math.min(100, (progressSeconds / video.duration_seconds) * 100)
      : null

  return (
    <Link
      href={`/student/watch/${video.id}`}
      className="group block rounded-xl overflow-hidden bg-[#16162a] border border-white/10 hover:border-[#B76E79]/50 transition-colors"
    >
      <div className="relative aspect-video bg-black/40">
        {thumb ? (
          <img
            src={thumb}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>

        {duration && (
          <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 text-white text-xs rounded">
            {duration}
          </span>
        )}

        {video.difficulty_level && (
          <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white/90 text-xs rounded-full capitalize">
            {video.difficulty_level.replace('_', ' ')}
          </span>
        )}

        {progressPct !== null && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <div className="h-full bg-[#B76E79]" style={{ width: `${progressPct}%` }} />
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-sm font-medium text-white truncate">{video.title}</p>
      </div>
    </Link>
  )
}

export default function StudioTab({ creatorId, userId }: {
  creatorId: string
  userId: string
}) {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([])
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([])
  const [rsvpedClassIds, setRsvpedClassIds] = useState<Set<string>>(new Set())
  const [difficultyFilter, setDifficultyFilter] = useState('All')
  const [isLoading, setIsLoading] = useState(true)
  // Re-render every minute so countdowns stay fresh
  const [, setTick] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const load = async () => {
      try {
        const [videosRes, classesRes, watchRes] = await Promise.all([
          supabase
            .from('content_items')
            .select('id, title, thumbnail_url, mux_playback_id, duration_seconds, difficulty_level')
            .eq('creator_id', creatorId)
            .order('order_index', { ascending: true }),
          supabase
            .from('live_classes')
            .select('id, title, description, scheduled_at, duration_minutes, meeting_url, meeting_platform')
            .eq('creator_id', creatorId)
            .gt('scheduled_at', new Date().toISOString())
            .order('scheduled_at', { ascending: true }),
          supabase
            .from('watch_history')
            .select('progress_seconds, content_item:content_items!content_item_id(id, title, thumbnail_url, mux_playback_id, duration_seconds, difficulty_level, creator_id)')
            .eq('student_id', userId)
            .gt('progress_seconds', 0)
            .order('watched_at', { ascending: false })
            .limit(10),
        ])

        const loadedVideos = (videosRes.data || []) as VideoItem[]
        setVideos(loadedVideos)

        const classes = (classesRes.data || []) as LiveClass[]
        setLiveClasses(classes)

        // Continue watching: only this creator's videos
        const watching: ContinueWatchingItem[] = []
        for (const row of watchRes.data || []) {
          const item = Array.isArray(row.content_item) ? row.content_item[0] : row.content_item
          if (!item || item.creator_id !== creatorId) continue
          watching.push({ ...(item as VideoItem), progress_seconds: row.progress_seconds as number })
        }
        setContinueWatching(watching)

        // Which upcoming classes has this student RSVPed to?
        if (classes.length > 0) {
          const { data: rsvps } = await supabase
            .from('live_class_rsvps')
            .select('live_class_id')
            .eq('student_id', userId)
            .in('live_class_id', classes.map((c) => c.id))
          setRsvpedClassIds(new Set((rsvps || []).map((r) => r.live_class_id as string)))
        }
      } catch (err) {
        console.error('Error loading studio content:', err)
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [creatorId, userId])

  const handleRsvpToggle = async (classId: string) => {
    const wasGoing = rsvpedClassIds.has(classId)

    // Optimistic update
    setRsvpedClassIds((prev) => {
      const next = new Set(prev)
      if (wasGoing) next.delete(classId)
      else next.add(classId)
      return next
    })

    try {
      if (wasGoing) {
        const { error } = await supabase
          .from('live_class_rsvps')
          .delete()
          .eq('live_class_id', classId)
          .eq('student_id', userId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('live_class_rsvps')
          .insert({ live_class_id: classId, student_id: userId })
        if (error) throw error
      }
    } catch (err) {
      console.error('Error toggling RSVP:', err)
      setRsvpedClassIds((prev) => {
        const next = new Set(prev)
        if (wasGoing) next.add(classId)
        else next.delete(classId)
        return next
      })
    }
  }

  const filteredVideos =
    difficultyFilter === 'All'
      ? videos
      : videos.filter(
          (v) => (v.difficulty_level || '').toLowerCase() === difficultyFilter.toLowerCase()
        )

  if (isLoading) {
    return (
      <div className="py-16 flex justify-center">
        <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-10">
      {/* Continue Watching */}
      {continueWatching.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Continue Watching</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1">
            {continueWatching.map((item) => (
              <div key={item.id} className="w-64 flex-shrink-0">
                <VideoCard video={item} progressSeconds={item.progress_seconds} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Live Classes */}
      {liveClasses.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4">Upcoming Live Classes</h2>
          <div className="space-y-4">
            {liveClasses.map((liveClass) => {
              const isGoing = rsvpedClassIds.has(liveClass.id)
              return (
                <div
                  key={liveClass.id}
                  className="bg-gradient-to-br from-[#B76E79]/15 to-[#16162a] border border-[#B76E79]/25 rounded-2xl p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-white">{liveClass.title}</h3>
                      <p className="text-white/60 text-sm">
                        {formatClassDate(liveClass.scheduled_at)}
                        {liveClass.meeting_platform ? ` · ${liveClass.meeting_platform}` : ''}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-[#B76E79]/20 text-[#B76E79] text-xs font-semibold rounded-full whitespace-nowrap">
                      {countdownTo(liveClass.scheduled_at)}
                    </span>
                  </div>

                  {liveClass.description && (
                    <p className="text-white/60 text-sm mb-4">{liveClass.description}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => handleRsvpToggle(liveClass.id)}
                      className={`px-5 py-2 text-sm font-semibold rounded-full transition-colors ${
                        isGoing
                          ? 'bg-[#B76E79] text-white'
                          : 'bg-white/10 text-white hover:bg-white/15'
                      }`}
                    >
                      {isGoing ? "I'm Going ✓" : 'RSVP'}
                    </button>
                    <button
                      onClick={() => downloadIcsFile(liveClass)}
                      className="px-5 py-2 bg-white/10 text-white text-sm font-semibold rounded-full hover:bg-white/15 transition-colors"
                    >
                      Add to Calendar
                    </button>
                    {liveClass.meeting_url && (
                      <a
                        href={liveClass.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2 bg-[#B76E79] text-white text-sm font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
                      >
                        Join Class
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Video Library */}
      <section>
        <h2 className="text-xl font-bold mb-4">Video Library</h2>

        <div className="flex flex-wrap gap-2 mb-6">
          {DIFFICULTY_FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setDifficultyFilter(filter)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                difficultyFilter === filter
                  ? 'bg-[#B76E79] text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {filteredVideos.length === 0 ? (
          <p className="text-white/40 py-8 text-center">
            {videos.length === 0
              ? 'No videos in this studio yet.'
              : `No ${difficultyFilter.toLowerCase()} videos yet.`}
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
