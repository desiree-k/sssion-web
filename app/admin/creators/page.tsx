'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Creator {
  id: string
  display_name: string
  username: string | null
  created_at: string
  is_published: boolean | null
  studentCount: number
  videoCount: number
  profile: {
    id: string
    email: string
    profile_image_url: string | null
  } | null
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
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>(null)
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

  const handleTogglePublished = async (creator: Creator) => {
    setTogglingId(creator.id)
    const next = !creator.is_published
    try {
      await adminPost('toggle_creator_published', { creatorId: creator.id, is_published: next })
      setCreators(prev => prev.map(c => c.id === creator.id ? { ...c, is_published: next } : c))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally {
      setTogglingId(null)
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
          placeholder="Search by name…"
          className="bg-[#111127] border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/25 focus:outline-none focus:border-[#B76E79]/50 w-64"
        />
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
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
            const studioUrl = creator.username ? `sssion.studio/${creator.username}` : null
            const published = creator.is_published ?? false

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
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-medium text-sm">{creator.display_name || '—'}</p>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        published ? 'bg-green-500/15 text-green-400' : 'bg-white/8 text-white/40'
                      }`}>
                        {published ? 'Published' : 'Unlisted'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      {studioUrl && (
                        <span className="text-white/30 text-xs font-mono">{studioUrl}</span>
                      )}
                      <span className="text-white/30 text-xs">{creator.profile?.email ?? '—'}</span>
                    </div>
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

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <button
                      onClick={() => handleTogglePublished(creator)}
                      disabled={togglingId === creator.id}
                      className={`relative w-9 h-5 rounded-full transition-colors disabled:opacity-40 ${published ? 'bg-[#B76E79]' : 'bg-white/15'}`}
                      title={published ? 'Unlist studio' : 'Publish studio'}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${published ? 'left-4' : 'left-0.5'}`} />
                    </button>
                    <button
                      onClick={() => setExpanded(isExpanded ? null : creator.id)}
                      className="text-white/30 hover:text-white transition-colors p-1"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2"
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                      >
                        <polyline points="2,4 7,10 12,4" />
                      </svg>
                    </button>
                  </div>
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
    </div>
  )
}
