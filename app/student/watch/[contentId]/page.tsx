'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import HlsVideo from '@/components/HlsVideo'

interface ContentItem {
  id: string
  creator_id: string
  title: string
  description: string | null
  mux_playback_id: string | null
  difficulty_level: string | null
  duration_seconds: number | null
}

export default function WatchPage() {
  const params = useParams<{ contentId: string }>()
  const contentId = params.contentId
  const router = useRouter()

  const [video, setVideo] = useState<ContentItem | null>(null)
  const [creatorName, setCreatorName] = useState<string>('')
  const [userId, setUserId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const videoElementRef = useRef<HTMLVideoElement | null>(null)
  const resumeSecondsRef = useRef(0)
  const lastSavedSecondsRef = useRef(0)
  const completedRef = useRef(false)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return // student layout handles the sign-in redirect

        const { data: item } = await supabase
          .from('content_items')
          .select('id, creator_id, title, description, mux_playback_id, difficulty_level, duration_seconds, creator:creators!creator_id(display_name, profile:profiles!user_id(username, full_name))')
          .eq('id', contentId)
          .maybeSingle()

        if (!item) {
          setError('Video not found')
          setIsLoading(false)
          return
        }

        const creator = Array.isArray(item.creator) ? item.creator[0] : item.creator
        const profile = creator
          ? (Array.isArray(creator.profile) ? creator.profile[0] : creator.profile)
          : null

        // Studio access required — otherwise send to the public studio page
        const { data: access } = await supabase
          .from('studio_access')
          .select('status')
          .eq('student_id', user.id)
          .eq('creator_id', item.creator_id)
          .maybeSingle()

        if (access?.status !== 'approved') {
          router.replace(`/${profile?.username || item.creator_id}`)
          return
        }

        // Resume position from watch history
        const { data: history } = await supabase
          .from('watch_history')
          .select('progress_seconds, completed')
          .eq('student_id', user.id)
          .eq('content_item_id', contentId)
          .maybeSingle()

        if (history) {
          resumeSecondsRef.current = (history.progress_seconds as number) || 0
          completedRef.current = (history.completed as boolean) || false
        }

        setUserId(user.id)
        setCreatorName(creator?.display_name || profile?.full_name || '')
        setVideo({
          id: item.id,
          creator_id: item.creator_id,
          title: item.title,
          description: item.description,
          mux_playback_id: item.mux_playback_id,
          difficulty_level: item.difficulty_level,
          duration_seconds: item.duration_seconds,
        })
      } catch (err) {
        console.error('Error loading video:', err)
        setError('Could not load this video. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [contentId, router])

  const saveProgress = useCallback(
    async (progressSeconds: number, completed: boolean) => {
      if (!userId) return
      if (completed) completedRef.current = true
      try {
        await supabase.from('watch_history').upsert(
          {
            student_id: userId,
            content_item_id: contentId,
            progress_seconds: Math.floor(progressSeconds),
            completed: completedRef.current,
            last_watched_at: new Date().toISOString(),
          },
          { onConflict: 'student_id,content_item_id' }
        )
      } catch (err) {
        console.error('Error updating watch history:', err)
      }
    },
    [userId, contentId]
  )

  // Save progress when leaving the page
  useEffect(() => {
    return () => {
      const element = videoElementRef.current
      if (element && hasStartedRef.current && element.currentTime > 0) {
        saveProgress(element.currentTime, false)
      }
    }
  }, [saveProgress])

  const handleLoadedMetadata = () => {
    const element = videoElementRef.current
    if (!element) return
    const resume = resumeSecondsRef.current
    // Resume mid-video, but not if they were basically at the start or end
    if (resume > 5 && element.duration && resume < element.duration - 10) {
      element.currentTime = resume
    }
  }

  const handlePlay = () => {
    if (hasStartedRef.current) return
    hasStartedRef.current = true
    const element = videoElementRef.current
    saveProgress(element?.currentTime ?? 0, false)
  }

  const handleTimeUpdate = () => {
    const element = videoElementRef.current
    if (!element || !hasStartedRef.current) return
    const current = Math.floor(element.currentTime)
    // Persist every 10 seconds of playback
    if (Math.abs(current - lastSavedSecondsRef.current) >= 10) {
      lastSavedSecondsRef.current = current
      saveProgress(current, false)
    }
  }

  const handleEnded = () => {
    const element = videoElementRef.current
    saveProgress(element?.duration ?? element?.currentTime ?? 0, true)
  }

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-10 h-10 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !video) {
    return (
      <div className="py-24 px-6 text-center space-y-4">
        <p className="text-[#F4F1EA]/60">{error || 'Video not found'}</p>
        <Link href="/student/dashboard" className="inline-block text-[#B76E79] hover:underline">
          &larr; Back to My Studios
        </Link>
      </div>
    )
  }

  const playbackId = video.mux_playback_id

  return (
    <main className="min-h-screen bg-[#0E0E12] pb-16">
      <div className="max-w-5xl mx-auto px-6 pt-6">
        {/* Back button */}
        <Link
          href={`/student/studio/${video.creator_id}`}
          className="inline-flex items-center gap-2 text-[#F4F1EA]/50 hover:text-[#F4F1EA] text-sm transition-colors mb-5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Studio
        </Link>

        {/* Title row */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h1 className="text-2xl md:text-3xl font-bold">{video.title}</h1>
          {video.difficulty_level && (
            <span className="px-3 py-1 bg-[#B76E79]/20 text-[#B76E79] text-sm rounded-full capitalize">
              {video.difficulty_level.replace('_', ' ')}
            </span>
          )}
        </div>
        {creatorName && <p className="text-[#F4F1EA]/50 mb-5">{creatorName}</p>}

        {/* Player */}
        {playbackId ? (
          <div className="rounded-2xl overflow-hidden bg-black aspect-video">
            <HlsVideo
              src={`https://stream.mux.com/${playbackId}.m3u8`}
              videoRef={videoElementRef}
              poster={`https://image.mux.com/${playbackId}/thumbnail.jpg`}
              controls
              autoPlay
              className="w-full h-full"
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={handlePlay}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
            />
          </div>
        ) : (
          <div className="rounded-2xl bg-[#1A1A20] border border-[#2A2A30] aspect-video flex items-center justify-center">
            <p className="text-[#F4F1EA]/40">This video is still processing. Check back soon!</p>
          </div>
        )}

        {/* Description */}
        {video.description && (
          <div className="mt-6 bg-[#1A1A20] border border-[#2A2A30] rounded-2xl p-6">
            <p className="text-[#F4F1EA]/75 leading-relaxed whitespace-pre-wrap">
              {video.description}
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
