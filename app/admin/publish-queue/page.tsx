'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface PendingProfile {
  id: string
  username: string | null
  full_name: string | null
  email: string | null
}

interface PendingSpace {
  id: string
  display_name: string
  publish_applied_at: string | null
  publish_application_note: string | null
  sessionCount: number
  memberCount: number
  postCount: number
  profile: PendingProfile | null
}

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

export default function PublishQueuePage() {
  const [queue, setQueue] = useState<PendingSpace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [confirmApprove, setConfirmApprove] = useState<PendingSpace | null>(null)
  const [confirmDecline, setConfirmDecline] = useState<PendingSpace | null>(null)
  const [declineNote, setDeclineNote] = useState('')
  const [reviewingId, setReviewingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminPost('get_publish_queue')
      setQueue(res.queue)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleReview = async (space: PendingSpace, approve: boolean, note?: string) => {
    setReviewingId(space.id)
    setError(null)
    try {
      const res = await adminPost('review_publish', { creatorId: space.id, approve, note })
      setQueue(prev => prev.filter(s => s.id !== space.id))
      const delivery = res.pushSent && res.emailSent
        ? 'notified by push + email'
        : res.pushSent
          ? 'notified by push (email failed or unavailable)'
          : res.emailSent
            ? 'notified by email (no push — they may have no registered device)'
            : 'NOT notified — push and email both unavailable, reach out manually'
      setSuccessMsg(`${space.display_name || 'Space'} ${approve ? 'published' : 'declined'} — creator ${delivery}`)
      setTimeout(() => setSuccessMsg(null), 8000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to save review')
    } finally {
      setReviewingId(null)
      setConfirmApprove(null)
      setConfirmDecline(null)
      setDeclineNote('')
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Publish Queue</h1>
        <p className="text-white/40 text-sm mt-1">
          Spaces waiting for review. Open the profile link — that <span className="text-white/60">is</span> the review.
        </p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm">
          {successMsg}
        </div>
      )}

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-[#111127] rounded-xl border border-white/6 animate-pulse" />
          ))
        ) : queue.length === 0 ? (
          <div className="bg-[#111127] rounded-xl border border-white/6 px-6 py-10 text-white/30 text-sm text-center">
            No Spaces waiting for review 🎉
          </div>
        ) : (
          queue.map(space => {
            const username = space.profile?.username ?? null
            const isReviewing = reviewingId === space.id
            return (
              <div key={space.id} className="bg-[#111127] rounded-xl border border-white/6 px-5 py-4 space-y-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{space.display_name || '—'}</p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      {username ? (
                        <a
                          href={`/${username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B76E79] hover:underline text-xs font-mono"
                        >
                          sssion.studio/{username} ↗
                        </a>
                      ) : (
                        <span className="text-yellow-400/70 text-xs">No username — can&apos;t review the profile</span>
                      )}
                      <span className="text-white/30 text-xs">{space.profile?.email ?? '—'}</span>
                      <span className="text-white/30 text-xs">
                        Applied {space.publish_applied_at
                          ? new Date(space.publish_applied_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-center flex-shrink-0">
                    <div>
                      <p className="text-white font-semibold text-sm">{space.sessionCount}</p>
                      <p className="text-white/30 text-xs">sessions</p>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{space.memberCount}</p>
                      <p className="text-white/30 text-xs">members</p>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{space.postCount}</p>
                      <p className="text-white/30 text-xs">posts</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setConfirmApprove(space)}
                      disabled={isReviewing}
                      className="text-xs px-3 py-1.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-500 transition-colors disabled:opacity-40"
                    >
                      {isReviewing ? '…' : 'Approve'}
                    </button>
                    <button
                      onClick={() => { setConfirmDecline(space); setDeclineNote('') }}
                      disabled={isReviewing}
                      className="text-xs px-3 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-40"
                    >
                      {isReviewing ? '…' : 'Decline'}
                    </button>
                  </div>
                </div>

                {space.publish_application_note && (
                  <div className="border-t border-white/6 pt-3">
                    <p className="text-white/40 text-xs mb-1">Note from the creator</p>
                    <p className="text-white/70 text-sm">{space.publish_application_note}</p>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Confirm approve modal */}
      {confirmApprove && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111127] rounded-2xl border border-white/10 p-6 w-full max-w-md space-y-5">
            <h2 className="text-lg font-semibold text-white">Publish this Space?</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              <span className="text-white font-medium">{confirmApprove.display_name}</span> goes live in Discover
              and the creator is notified.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmApprove(null)}
                disabled={reviewingId === confirmApprove.id}
                className="flex-1 py-2.5 border border-white/10 text-white/60 text-sm rounded-lg hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview(confirmApprove, true)}
                disabled={reviewingId === confirmApprove.id}
                className="flex-1 py-2.5 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-500 disabled:opacity-50 transition-colors"
              >
                {reviewingId === confirmApprove.id ? 'Publishing…' : 'Publish Space'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline modal — note required */}
      {confirmDecline && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111127] rounded-2xl border border-white/10 p-6 w-full max-w-md space-y-5">
            <h2 className="text-lg font-semibold text-white">Decline this application?</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              <span className="text-white font-medium">{confirmDecline.display_name}</span> goes back to unlisted.
              The creator sees your note and can apply again.
            </p>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Review note (required — sent to the creator)</label>
              <textarea
                value={declineNote}
                onChange={e => setDeclineNote(e.target.value)}
                rows={3}
                placeholder="What should they change before applying again?"
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#B76E79]/50 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmDecline(null); setDeclineNote('') }}
                disabled={reviewingId === confirmDecline.id}
                className="flex-1 py-2.5 border border-white/10 text-white/60 text-sm rounded-lg hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReview(confirmDecline, false, declineNote)}
                disabled={reviewingId === confirmDecline.id || !declineNote.trim()}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-500 disabled:opacity-40 transition-colors"
              >
                {reviewingId === confirmDecline.id ? 'Declining…' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
