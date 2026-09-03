'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface CreatorProfile {
  id: string
  email: string
  full_name: string | null
  username: string | null
  bio: string | null
  profile_image_url: string | null
}

interface Creator {
  id: string
  display_name: string
  created_at: string
  is_visible: boolean
  space_status: string | null
  is_frozen: boolean | null
  admin_note: string | null
  studentCount: number
  videoCount: number
  profile: CreatorProfile | null
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

export default function CreatorsPage() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Creator | null>(null)
  const [confirmFreeze, setConfirmFreeze] = useState<Creator | null>(null)
  const [freezeReason, setFreezeReason] = useState('')
  const [freezingId, setFreezingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const PAGE_SIZE = 50

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminPost('get_creators', { search, page })
      setCreators(res.creators)
      setTotal(res.total)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }, [search, page])

  useEffect(() => { load() }, [load])

  const handleSearchChange = (val: string) => {
    setSearchInput(val)
    if (searchTimeout.current) clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      setSearch(val)
      setPage(1)
    }, 400)
  }

  const handleToggleVisibility = async (creator: Creator) => {
    setTogglingId(creator.id)
    try {
      await adminPost('toggle_creator_visibility', { creatorId: creator.id, isVisible: !creator.is_visible })
      setCreators(prev => prev.map(c => c.id === creator.id ? { ...c, is_visible: !c.is_visible } : c))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update visibility')
    } finally {
      setTogglingId(null)
    }
  }

  const handleFreeze = async (creator: Creator, reason: string) => {
    setFreezingId(creator.id)
    const frozen = !(creator.is_frozen === true)
    try {
      await adminPost('set_creator_frozen', { creatorId: creator.id, frozen, note: reason })
      setCreators(prev => prev.map(c =>
        c.id === creator.id
          ? { ...c, is_frozen: frozen, ...(reason.trim() && { admin_note: reason.trim() }) }
          : c
      ))
      setSuccessMsg(`${creator.display_name} has been ${frozen ? 'frozen' : 'unfrozen'}`)
      setTimeout(() => setSuccessMsg(null), 4000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update freeze state')
    } finally {
      setFreezingId(null)
      setConfirmFreeze(null)
      setFreezeReason('')
    }
  }

  const handleDelete = async (creator: Creator) => {
    const userId = creator.profile?.id
    if (!userId) return
    setDeletingId(creator.id)
    try {
      await adminPost('delete_creator', { creatorId: creator.id, userId })
      setCreators(prev => prev.filter(c => c.id !== creator.id))
      setTotal(prev => prev - 1)
      setSuccessMsg(`${creator.display_name} has been deleted`)
      setTimeout(() => setSuccessMsg(null), 4000)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete')
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-white">Creators</h1>
          <p className="text-white/40 text-sm mt-1">{total.toLocaleString()} total</p>
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="Search by name or username…"
          className="bg-[#111127] border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#B76E79]/50 w-64"
        />
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
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-20 bg-[#111127] rounded-xl border border-white/6 animate-pulse" />
          ))
        ) : creators.length === 0 ? (
          <div className="bg-[#111127] rounded-xl border border-white/6 px-6 py-10 text-white/30 text-sm text-center">
            {search ? 'No creators match your search' : 'No creators yet'}
          </div>
        ) : (
          creators.map(creator => {
            const isExpanded = expanded === creator.id
            const username = creator.profile?.username ?? null
            const studioUrl = username ? `sssion.studio/${username}` : null

            return (
              <div key={creator.id} className="bg-[#111127] rounded-xl border border-white/6 overflow-hidden">
                {/* Row */}
                <div className="flex items-center gap-4 px-5 py-4">
                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-[#B76E79]/20 border border-[#B76E79]/30 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {creator.profile?.profile_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={creator.profile.profile_image_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[#B76E79] text-sm font-medium">
                        {(creator.display_name || '?')[0].toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm">{creator.display_name || '—'}</p>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      {studioUrl && (
                        <span className="text-white/30 text-xs font-mono">{studioUrl}</span>
                      )}
                      <span className="text-white/30 text-xs">{creator.profile?.email ?? '—'}</span>
                    </div>
                  </div>

                  {/* Status badges + toggles */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {creator.space_status && creator.space_status !== 'published' && (
                      <span className="px-2 py-0.5 rounded-full bg-white/8 border border-white/15 text-white/50 text-xs font-medium capitalize">
                        {creator.space_status}
                      </span>
                    )}
                    {creator.is_frozen === true && (
                      <span className="px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-400 text-xs font-medium">
                        Frozen
                      </span>
                    )}
                    {!creator.is_visible && (
                      <span className="px-2 py-0.5 rounded-full bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 text-xs font-medium">
                        Hidden
                      </span>
                    )}
                    <button
                      onClick={() => { setConfirmFreeze(creator); setFreezeReason('') }}
                      disabled={freezingId === creator.id}
                      title={creator.is_frozen ? 'Unfreeze Space' : 'Freeze Space'}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-40 ${
                        creator.is_frozen
                          ? 'border-sky-500/30 text-sky-400 hover:bg-sky-500/10'
                          : 'border-white/10 text-white/40 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {freezingId === creator.id ? '…' : creator.is_frozen ? 'Unfreeze' : 'Freeze'}
                    </button>
                    <button
                      onClick={() => handleToggleVisibility(creator)}
                      disabled={togglingId === creator.id}
                      title={creator.is_visible ? 'Hide studio' : 'Show studio'}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors disabled:opacity-40 ${
                        creator.is_visible
                          ? 'border-white/10 text-white/40 hover:text-white hover:border-white/30'
                          : 'border-[#B76E79]/30 text-[#B76E79] hover:bg-[#B76E79]/10'
                      }`}
                    >
                      {togglingId === creator.id ? '…' : creator.is_visible ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6 text-center flex-shrink-0">
                    <div>
                      <p className="text-white font-semibold text-sm">{creator.studentCount}</p>
                      <p className="text-white/30 text-xs">students</p>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">{creator.videoCount}</p>
                      <p className="text-white/30 text-xs">videos</p>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => setConfirmDelete(creator)}
                    disabled={deletingId === creator.id}
                    title="Delete creator"
                    className="text-red-400/40 hover:text-red-400 transition-colors p-1 flex-shrink-0 disabled:opacity-30"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                      <path d="M10 11v6M14 11v6" />
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                    </svg>
                  </button>

                  {/* Expand */}
                  <button
                    onClick={() => setExpanded(isExpanded ? null : creator.id)}
                    className="text-white/30 hover:text-white transition-colors p-1 flex-shrink-0"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                    >
                      <polyline points="2,4 7,10 12,4" />
                    </svg>
                  </button>
                </div>

                {/* Expanded detail */}
                {isExpanded && (
                  <div className="border-t border-white/6 px-5 py-4 bg-black/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-white/40 text-xs mb-1">Joined</p>
                      <p className="text-white">
                        {new Date(creator.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-1">Students</p>
                      <p className="text-white">{creator.studentCount}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-1">Videos</p>
                      <p className="text-white">{creator.videoCount}</p>
                    </div>
                    <div>
                      <p className="text-white/40 text-xs mb-1">Studio Link</p>
                      {studioUrl ? (
                        <a
                          href={`https://${studioUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#B76E79] hover:underline font-mono text-xs"
                        >
                          {studioUrl} ↗
                        </a>
                      ) : (
                        <span className="text-white/20">No username set</span>
                      )}
                    </div>
                    {creator.profile?.bio && (
                      <div className="col-span-2 sm:col-span-4">
                        <p className="text-white/40 text-xs mb-1">Bio</p>
                        <p className="text-white/70 text-sm">{creator.profile.bio}</p>
                      </div>
                    )}
                    {creator.admin_note && (
                      <div className="col-span-2 sm:col-span-4">
                        <p className="text-white/40 text-xs mb-1">Admin note</p>
                        <p className="text-white/70 text-sm">{creator.admin_note}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-white/30">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-white/10 text-white/60 rounded-lg disabled:opacity-30 hover:text-white hover:bg-white/5 transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-white/10 text-white/60 rounded-lg disabled:opacity-30 hover:text-white hover:bg-white/5 transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Confirm freeze/unfreeze modal */}
      {confirmFreeze && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111127] rounded-2xl border border-white/10 p-6 w-full max-w-md space-y-5">
            <h2 className="text-lg font-semibold text-white">
              {confirmFreeze.is_frozen ? 'Unfreeze' : 'Freeze'} this Space?
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              {confirmFreeze.is_frozen ? (
                <>Unfreeze <span className="text-white font-medium">{confirmFreeze.display_name}</span>? Their Space becomes available again everywhere.</>
              ) : (
                <>Freeze <span className="text-white font-medium">{confirmFreeze.display_name}</span>? Visitors and members will see &ldquo;This Space is unavailable&rdquo; on every surface until unfrozen.</>
              )}
            </p>
            <div>
              <label className="text-white/40 text-xs block mb-1.5">Reason (stored as admin note)</label>
              <textarea
                value={freezeReason}
                onChange={e => setFreezeReason(e.target.value)}
                rows={3}
                placeholder={confirmFreeze.is_frozen ? 'Why is this Space being unfrozen?' : 'Why is this Space being frozen?'}
                className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#B76E79]/50 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmFreeze(null); setFreezeReason('') }}
                disabled={freezingId === confirmFreeze.id}
                className="flex-1 py-2.5 border border-white/10 text-white/60 text-sm rounded-lg hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
              >
                Cancel
              </button>
              <button
                onClick={() => handleFreeze(confirmFreeze, freezeReason)}
                disabled={freezingId === confirmFreeze.id}
                className="flex-1 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-lg hover:bg-sky-500 disabled:opacity-50 transition-colors"
              >
                {freezingId === confirmFreeze.id
                  ? 'Saving…'
                  : confirmFreeze.is_frozen ? 'Unfreeze Space' : 'Freeze Space'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111127] rounded-2xl border border-white/10 p-6 w-full max-w-md space-y-5">
            <h2 className="text-lg font-semibold text-white">Delete Creator?</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Delete <span className="text-white font-medium">{confirmDelete.display_name}</span> and all their data? This removes their videos, community posts, student access, and account. <span className="text-red-400 font-medium">This cannot be undone.</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                disabled={deletingId === confirmDelete.id}
                className="flex-1 py-2.5 border border-white/10 text-white/60 text-sm rounded-lg hover:text-white hover:bg-white/5 transition-colors disabled:opacity-30"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                disabled={deletingId === confirmDelete.id}
                className="flex-1 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-500 disabled:opacity-50 transition-colors"
              >
                {deletingId === confirmDelete.id ? 'Deleting…' : 'Delete Creator'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
