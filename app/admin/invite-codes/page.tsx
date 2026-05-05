'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface InviteCode {
  id: string
  code: string
  is_active: boolean
  created_at: string
  used_at: string | null
  used_by: string | null
  used_by_email: string | null
  creator: { display_name: string } | null
}

type FilterTab = 'all' | 'active' | 'used' | 'deactivated'

async function adminPost(action: string, payload?: unknown) {
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token ?? ''
  const res = await fetch('/api/admin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ action, payload }),
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export default function InviteCodesPage() {
  const [codes, setCodes] = useState<InviteCode[]>([])
  const [filter, setFilter] = useState<FilterTab>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  // Create single modal
  const [showCreate, setShowCreate] = useState(false)
  const [customCode, setCustomCode] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Batch modal
  const [showBatch, setShowBatch] = useState(false)
  const [batchCount, setBatchCount] = useState('10')
  const [isBatching, setIsBatching] = useState(false)
  const [batchError, setBatchError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminPost('get_invite_codes')
      setCodes(res.codes)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const handleCopy = async (code: string) => {
    await navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const handleToggle = async (id: string, current: boolean) => {
    try {
      await adminPost('toggle_invite_code', { id, is_active: !current })
      setCodes(prev => prev.map(c => c.id === id ? { ...c, is_active: !current } : c))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed to update')
    }
  }

  const handleCreate = async () => {
    const code = customCode.trim().toUpperCase() || generateCode()
    if (code.length < 3) {
      setCreateError('Code must be at least 3 characters')
      return
    }
    setIsCreating(true)
    setCreateError(null)
    try {
      await adminPost('create_invite_code', { code })
      setShowCreate(false)
      setCustomCode('')
      await load()
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Failed to create')
    } finally {
      setIsCreating(false)
    }
  }

  const handleBatch = async () => {
    const n = parseInt(batchCount)
    if (isNaN(n) || n < 1 || n > 100) {
      setBatchError('Enter a number between 1 and 100')
      return
    }
    setIsBatching(true)
    setBatchError(null)
    try {
      await adminPost('create_batch_codes', { count: n })
      setShowBatch(false)
      setBatchCount('10')
      await load()
    } catch (e: unknown) {
      setBatchError(e instanceof Error ? e.message : 'Failed to create batch')
    } finally {
      setIsBatching(false)
    }
  }

  const filtered = codes.filter(c => {
    if (filter === 'all') return true
    if (filter === 'used') return !!c.used_by
    if (filter === 'active') return c.is_active && !c.used_by
    if (filter === 'deactivated') return !c.is_active && !c.used_by
    return true
  })

  const counts = {
    all: codes.length,
    active: codes.filter(c => c.is_active && !c.used_by).length,
    used: codes.filter(c => !!c.used_by).length,
    deactivated: codes.filter(c => !c.is_active && !c.used_by).length,
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-white">Invite Codes</h1>
          <p className="text-white/40 text-sm mt-1">{codes.length} total codes</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBatch(true)}
            className="px-4 py-2 border border-white/15 text-white/70 text-sm font-medium rounded-lg hover:text-white hover:bg-white/5 transition-colors"
          >
            Create Batch
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="px-4 py-2 bg-[#B76E79] text-white text-sm font-medium rounded-lg hover:bg-[#a55f69] transition-colors"
          >
            + New Code
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#111127] rounded-lg p-1 w-fit">
        {(['all', 'active', 'used', 'deactivated'] as FilterTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              filter === tab
                ? 'bg-[#B76E79]/20 text-[#B76E79]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            {tab} <span className="text-xs opacity-60">({counts[tab]})</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#111127] rounded-xl border border-white/6 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 bg-white/4 rounded animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="px-6 py-10 text-white/30 text-sm text-center">No codes in this category</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/6">
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Code</th>
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Created</th>
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Used By</th>
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Used</th>
                  <th className="px-5 py-3 text-right text-white/40 font-medium text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((code, i) => {
                  const isUsed = !!code.used_by
                  const status = isUsed ? 'used' : code.is_active ? 'active' : 'deactivated'
                  return (
                    <tr
                      key={code.id}
                      className={i < filtered.length - 1 ? 'border-b border-white/4' : ''}
                    >
                      <td className="px-5 py-3">
                        <span className="font-mono text-white font-medium tracking-wider">{code.code}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          status === 'active'
                            ? 'bg-green-500/15 text-green-400'
                            : status === 'used'
                              ? 'bg-white/8 text-white/50'
                              : 'bg-red-500/10 text-red-400'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-white/40 text-xs">
                        {new Date(code.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-5 py-3">
                        {isUsed ? (
                          <div>
                            <p className="text-white text-sm">{code.creator?.display_name ?? '—'}</p>
                            <p className="text-white/40 text-xs">{code.used_by_email ?? ''}</p>
                          </div>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-white/40 text-xs">
                        {code.used_at
                          ? new Date(code.used_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : <span className="text-white/20">—</span>
                        }
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => handleCopy(code.code)}
                            className="p-1.5 text-white/30 hover:text-white transition-colors"
                            title="Copy code"
                          >
                            {copied === code.code ? (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
                                <polyline points="2,7 5,10 12,3" />
                              </svg>
                            ) : (
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="4" y="4" width="8" height="8" rx="1" />
                                <path d="M2 10V2h8" />
                              </svg>
                            )}
                          </button>
                          {!isUsed && (
                            <button
                              onClick={() => handleToggle(code.id, code.is_active)}
                              className={`relative w-9 h-5 rounded-full transition-colors ${code.is_active ? 'bg-[#B76E79]' : 'bg-white/15'}`}
                              title={code.is_active ? 'Deactivate' : 'Activate'}
                            >
                              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${code.is_active ? 'left-4' : 'left-0.5'}`} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create single code modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111127] rounded-2xl border border-white/10 p-6 w-full max-w-md space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Create Invite Code</h2>
              <button onClick={() => { setShowCreate(false); setCustomCode(''); setCreateError(null) }} className="text-white/30 hover:text-white">✕</button>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">Custom Code (leave blank to auto-generate)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCode}
                  onChange={e => setCustomCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
                  placeholder="e.g. DANCEWITH"
                  maxLength={20}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white font-mono text-sm placeholder-white/20 focus:outline-none focus:border-[#B76E79]/50"
                />
                <button
                  onClick={() => setCustomCode(generateCode())}
                  className="px-3 py-2 text-xs text-white/50 border border-white/10 rounded-lg hover:text-white hover:bg-white/5 transition-colors whitespace-nowrap"
                >
                  Auto
                </button>
              </div>
              {createError && <p className="text-red-400 text-xs mt-2">{createError}</p>}
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setShowCreate(false); setCustomCode(''); setCreateError(null) }}
                className="flex-1 py-2.5 border border-white/10 text-white/60 text-sm rounded-lg hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={isCreating}
                className="flex-1 py-2.5 bg-[#B76E79] text-white text-sm font-medium rounded-lg hover:bg-[#a55f69] disabled:opacity-50 transition-colors"
              >
                {isCreating ? 'Creating…' : 'Create Code'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Batch create modal */}
      {showBatch && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111127] rounded-2xl border border-white/10 p-6 w-full max-w-md space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Create Batch Codes</h2>
              <button onClick={() => { setShowBatch(false); setBatchCount('10'); setBatchError(null) }} className="text-white/30 hover:text-white">✕</button>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-2">Number of codes to generate (max 100)</label>
              <input
                type="number"
                value={batchCount}
                onChange={e => setBatchCount(e.target.value)}
                min={1}
                max={100}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#B76E79]/50"
              />
              {batchError && <p className="text-red-400 text-xs mt-2">{batchError}</p>}
              <p className="text-white/30 text-xs mt-2">Each code is a unique 8-character alphanumeric string.</p>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => { setShowBatch(false); setBatchCount('10'); setBatchError(null) }}
                className="flex-1 py-2.5 border border-white/10 text-white/60 text-sm rounded-lg hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBatch}
                disabled={isBatching}
                className="flex-1 py-2.5 bg-[#B76E79] text-white text-sm font-medium rounded-lg hover:bg-[#a55f69] disabled:opacity-50 transition-colors"
              >
                {isBatching ? 'Generating…' : `Generate ${batchCount || '?'} Codes`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
