'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface UserRef {
  full_name: string | null
  email: string
}

interface Report {
  id: string
  reason: string
  details: string | null
  report_type: string | null
  status: 'pending' | 'resolved' | 'dismissed'
  created_at: string
  content_item_id: string | null
  post_id: string | null
  reporter: UserRef | null
  reported_user: UserRef | null
}

type FilterTab = 'all' | 'pending' | 'resolved' | 'dismissed'

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

function userName(u: UserRef | null) {
  return u?.full_name || u?.email || '—'
}

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState<FilterTab>('pending')
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actingId, setActingId] = useState<string | null>(null)
  const PAGE_SIZE = 50

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminPost('get_reports', { status: filter, page })
      setReports(res.reports)
      setTotal(res.total)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load')
    } finally {
      setIsLoading(false)
    }
  }, [filter, page])

  useEffect(() => { load() }, [load])

  const handleAction = async (id: string, action: 'resolve_report' | 'dismiss_report') => {
    setActingId(id)
    try {
      await adminPost(action, { id })
      setReports(prev => prev.map(r =>
        r.id === id
          ? { ...r, status: action === 'resolve_report' ? 'resolved' : 'dismissed' }
          : r
      ))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally {
      setActingId(null)
    }
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const pendingCount = filter === 'pending' ? total : null

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Content Reports</h1>
        <p className="text-white/40 text-sm mt-1">
          {total} {filter === 'all' ? 'total' : filter} report{total !== 1 ? 's' : ''}
          {pendingCount !== null && pendingCount > 0 && (
            <span className="ml-2 text-red-400 font-medium">— needs review</span>
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
        {(['pending', 'all', 'resolved', 'dismissed'] as FilterTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => { setFilter(tab); setPage(1) }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors capitalize ${
              filter === tab
                ? tab === 'pending'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-[#B76E79]/20 text-[#B76E79]'
                : 'text-white/40 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Report list */}
      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-28 bg-[#111127] rounded-xl border border-white/6 animate-pulse" />
          ))
        ) : reports.length === 0 ? (
          <div className="bg-[#111127] rounded-xl border border-white/6 px-6 py-10 text-white/30 text-sm text-center">
            No {filter === 'all' ? '' : filter} reports
          </div>
        ) : (
          reports.map(report => (
            <div
              key={report.id}
              className={`bg-[#111127] rounded-xl border overflow-hidden ${
                report.status === 'pending' ? 'border-red-500/25' : 'border-white/6'
              }`}
            >
              <div className="px-5 py-4 space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                      report.status === 'pending'
                        ? 'bg-red-500/15 text-red-400'
                        : report.status === 'resolved'
                          ? 'bg-green-500/15 text-green-400'
                          : 'bg-white/8 text-white/40'
                    }`}>
                      {report.status}
                    </span>
                    {report.report_type && (
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-white/6 text-white/50">
                        {report.report_type}
                      </span>
                    )}
                    <span className="text-white/25 text-xs">
                      {new Date(report.created_at).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {report.status === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleAction(report.id, 'dismiss_report')}
                        disabled={actingId === report.id}
                        className="px-3 py-1.5 text-xs border border-white/10 text-white/50 rounded-lg hover:text-white hover:bg-white/5 disabled:opacity-30 transition-colors"
                      >
                        Dismiss
                      </button>
                      <button
                        onClick={() => handleAction(report.id, 'resolve_report')}
                        disabled={actingId === report.id}
                        className="px-3 py-1.5 text-xs bg-[#B76E79]/80 text-white rounded-lg hover:bg-[#B76E79] disabled:opacity-30 transition-colors"
                      >
                        {actingId === report.id ? 'Saving…' : 'Mark Resolved'}
                      </button>
                    </div>
                  )}
                </div>

                {/* Reason */}
                <div>
                  <p className="text-white text-sm font-medium">{report.reason}</p>
                  {report.details && (
                    <p className="text-white/50 text-sm mt-1">{report.details}</p>
                  )}
                </div>

                {/* People */}
                <div className="flex gap-6 text-xs flex-wrap">
                  <div>
                    <span className="text-white/30">Reported by: </span>
                    <span className="text-white/70">{userName(report.reporter)}</span>
                  </div>
                  <div>
                    <span className="text-white/30">Reported user: </span>
                    <span className="text-white/70">{userName(report.reported_user)}</span>
                  </div>
                  {report.content_item_id && (
                    <div>
                      <span className="text-white/30">Content ID: </span>
                      <span className="text-white/40 font-mono">{report.content_item_id.slice(0, 8)}…</span>
                    </div>
                  )}
                  {report.post_id && (
                    <div>
                      <span className="text-white/30">Post ID: </span>
                      <span className="text-white/40 font-mono">{report.post_id.slice(0, 8)}…</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
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
