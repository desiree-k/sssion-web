'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface ModerationItem {
  id: string
  subject_type: 'content_item' | 'community_post'
  title: string | null
  creator_name: string | null
  creator_id: string
  moderation_status: 'flagged' | 'blocked'
  moderation_scores: {
    max?: Record<string, number>
    text?: Record<string, number>
    frames?: { time: number; nudity?: Record<string, number> }[]
    original_playback_id?: string
    priority_flag?: boolean
  } | null
  moderated_at: string | null
  mux_playback_id: string | null
  monetization_frozen: boolean
}

type FilterTab = 'all' | 'flagged' | 'blocked'

async function adminPost(action: string, payload?: unknown) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token ?? ''
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ action, payload }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

function relativeTime(iso: string | null): string {
  if (!iso) return '—'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function scoreColor(score: number): string {
  if (score > 0.85) return 'text-red-400'
  if (score > 0.40) return 'text-amber-400'
  return 'text-white/30'
}

function scoreBarColor(score: number): string {
  if (score > 0.85) return 'bg-red-500'
  if (score > 0.40) return 'bg-amber-400'
  return 'bg-white/20'
}

function getMuxThumbId(item: ModerationItem): string | null {
  if (item.mux_playback_id) return item.mux_playback_id
  if (item.moderation_scores?.original_playback_id) return item.moderation_scores.original_playback_id
  return null
}

export default function ModerationPage() {
  const [items, setItems] = useState<ModerationItem[]>([])
  const [filter, setFilter] = useState<FilterTab>('flagged')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actingId, setActingId] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminPost('get_moderation_queue', {
        status: filter === 'all' ? undefined : filter,
      })
      setItems(res.items ?? [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }, [filter])

  useEffect(() => { load() }, [load])

  const handleAction = async (
    item: ModerationItem,
    action: 'moderation_unblock' | 'moderation_confirm_block'
  ) => {
    setActingId(item.id)
    try {
      await adminPost(action, { subject_type: item.subject_type, id: item.id })
      setSuccessId(item.id)
      setTimeout(() => setSuccessId(null), 2000)
      await load()
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Action failed')
    } finally {
      setActingId(null)
    }
  }

  const flaggedCount = items.filter(i => i.moderation_status === 'flagged').length
  const blockedCount = items.filter(i => i.moderation_status === 'blocked').length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-white">Moderation Queue</h1>
        <p className="text-white/40 text-sm mt-1">
          Auto-scanned content requiring review
          {!isLoading && items.length > 0 && (
            <span className="ml-2">
              {flaggedCount > 0 && (
                <span className="text-amber-400 font-medium">{flaggedCount} flagged</span>
              )}
              {flaggedCount > 0 && blockedCount > 0 && <span className="text-white/20 mx-1">·</span>}
              {blockedCount > 0 && (
                <span className="text-red-400 font-medium">{blockedCount} blocked</span>
              )}
            </span>
          )}
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#111127] rounded-lg p-1 w-fit">
        {(['flagged', 'all', 'blocked'] as FilterTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              filter === tab
                ? tab === 'blocked'
                  ? 'bg-red-500/20 text-red-400'
                  : tab === 'flagged'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-[#B76E79]/15 text-[#B76E79]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-[#111127] rounded-xl border border-white/6 px-6 py-14 text-center">
          <p className="text-white/40 text-sm">No items in this queue</p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(item => {
            const thumbId = item.subject_type === 'content_item' ? getMuxThumbId(item) : null
            const maxScores = item.moderation_scores?.max ?? {}
            const textScores = item.moderation_scores?.text ?? {}
            const frames = item.moderation_scores?.frames ?? []
            const isPriorityFlag = item.moderation_scores?.priority_flag === true
            const isActing = actingId === item.id
            const isSuccess = successId === item.id

            return (
              <div
                key={item.id}
                className={`bg-[#111127] rounded-xl border overflow-hidden transition-colors ${
                  item.moderation_status === 'blocked'
                    ? 'border-red-500/25'
                    : 'border-amber-500/25'
                }`}
              >
                <div className="flex gap-0 flex-col sm:flex-row">
                  {/* Thumbnail */}
                  {thumbId && (
                    <div className="sm:w-48 sm:flex-shrink-0 bg-black">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={`https://image.mux.com/${thumbId}/thumbnail.jpg?width=400&height=225&fit_mode=crop`}
                        alt={item.title ?? 'Content thumbnail'}
                        className="w-full h-36 sm:h-full object-cover opacity-90"
                      />
                    </div>
                  )}

                  {/* Main content */}
                  <div className="flex-1 p-5 space-y-4 min-w-0">
                    {/* Top row: title + badges */}
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {/* Status badge */}
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            item.moderation_status === 'blocked'
                              ? 'bg-red-500/15 text-red-400'
                              : 'bg-amber-500/15 text-amber-400'
                          }`}>
                            {item.moderation_status}
                          </span>
                          {/* Subject type */}
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-white/6 text-white/40">
                            {item.subject_type === 'content_item' ? 'video' : 'post'}
                          </span>
                          {/* Priority flag chip */}
                          {isPriorityFlag && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold">
                              Priority Review
                            </span>
                          )}
                          {/* Monetization frozen chip */}
                          {item.monetization_frozen && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-orange-500/15 text-orange-400 border border-orange-500/20">
                              <span className="text-[10px]">⚠</span> Monetization frozen
                            </span>
                          )}
                        </div>
                        <p className="text-white font-semibold text-sm leading-snug truncate">
                          {item.title ?? <span className="text-white/30 italic">Untitled</span>}
                        </p>
                        <p className="text-white/60 text-xs mt-0.5">
                          {item.creator_name ?? 'Unknown creator'}
                          <span className="text-white/25 ml-2">{relativeTime(item.moderated_at)}</span>
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2 flex-shrink-0">
                        {isSuccess ? (
                          <span className="px-3 py-1.5 text-xs text-green-400 border border-green-500/30 rounded-lg">
                            Done
                          </span>
                        ) : (
                          <>
                            <button
                              onClick={() => handleAction(item, 'moderation_unblock')}
                              disabled={isActing}
                              className="px-3 py-1.5 text-xs bg-teal-600/80 hover:bg-teal-600 text-white rounded-lg disabled:opacity-30 transition-colors font-medium"
                            >
                              {isActing ? '…' : 'Unblock'}
                            </button>
                            <button
                              onClick={() => handleAction(item, 'moderation_confirm_block')}
                              disabled={isActing}
                              className="px-3 py-1.5 text-xs bg-red-600/80 hover:bg-red-600 text-white rounded-lg disabled:opacity-30 transition-colors font-medium"
                            >
                              {isActing ? '…' : 'Confirm Block'}
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Scores: max */}
                    {Object.keys(maxScores).length > 0 && (
                      <div>
                        <p className="text-white/25 text-xs uppercase tracking-wider mb-2">Detection scores</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5">
                          {Object.entries(maxScores)
                            .sort((a, b) => b[1] - a[1])
                            .map(([cat, score]) => (
                              <div key={cat} className="flex items-center gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-white/50 text-xs truncate capitalize">{cat.replace(/_/g, ' ')}</span>
                                    <span className={`text-xs font-mono ml-2 flex-shrink-0 ${scoreColor(score)}`}>
                                      {Math.round(score * 100)}%
                                    </span>
                                  </div>
                                  <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${scoreBarColor(score)}`}
                                      style={{ width: `${Math.round(score * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Text scores (for community posts) */}
                    {Object.keys(textScores).length > 0 && (
                      <div>
                        <p className="text-white/25 text-xs uppercase tracking-wider mb-2">Text scores</p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1.5">
                          {Object.entries(textScores)
                            .sort((a, b) => b[1] - a[1])
                            .map(([cat, score]) => (
                              <div key={cat} className="flex items-center gap-2">
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-white/50 text-xs truncate capitalize">{cat.replace(/_/g, ' ')}</span>
                                    <span className={`text-xs font-mono ml-2 flex-shrink-0 ${scoreColor(score)}`}>
                                      {Math.round(score * 100)}%
                                    </span>
                                  </div>
                                  <div className="h-1 bg-white/8 rounded-full overflow-hidden">
                                    <div
                                      className={`h-full rounded-full ${scoreBarColor(score)}`}
                                      style={{ width: `${Math.round(score * 100)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Frame thumbnails */}
                    {frames.length > 0 && thumbId && (
                      <div>
                        <p className="text-white/25 text-xs uppercase tracking-wider mb-2">
                          Flagged frames ({frames.length})
                        </p>
                        <div className="flex gap-2 overflow-x-auto pb-1">
                          {frames.slice(0, 6).map((frame, idx) => (
                            <div key={idx} className="flex-shrink-0 relative">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={`https://image.mux.com/${thumbId}/thumbnail.jpg?width=160&height=90&fit_mode=crop&time=${frame.time}`}
                                alt={`Frame at ${frame.time}s`}
                                className="w-28 h-16 object-cover rounded-lg border border-white/10"
                              />
                              <span className="absolute bottom-1 right-1 text-[10px] text-white/60 bg-black/60 px-1 rounded">
                                {frame.time}s
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
