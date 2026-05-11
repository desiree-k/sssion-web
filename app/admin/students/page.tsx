'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Student {
  id: string
  full_name: string | null
  email: string
  username: string | null
  created_at: string
  studioCount: number
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

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [confirmRemove, setConfirmRemove] = useState<Student | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Student | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const PAGE_SIZE = 50

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await adminPost('get_students', { search, page })
      setStudents(res.students)
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

  const handleRemove = async (student: Student) => {
    setRemovingId(student.id)
    try {
      await adminPost('remove_student', { userId: student.id })
      setStudents(prev => prev.map(s =>
        s.id === student.id ? { ...s, studioCount: 0 } : s
      ))
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : 'Failed')
    } finally {
      setRemovingId(null)
      setConfirmRemove(null)
    }
  }

  const handleDelete = async (student: Student) => {
    setDeletingId(student.id)
    try {
      await adminPost('delete_student', { userId: student.id })
      setStudents(prev => prev.filter(s => s.id !== student.id))
      setTotal(prev => prev - 1)
      setSuccessMsg(`${student.full_name || student.email} has been deleted`)
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
          <h1 className="text-2xl font-semibold text-white">Students</h1>
          <p className="text-white/40 text-sm mt-1">{total.toLocaleString()} total</p>
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={e => handleSearchChange(e.target.value)}
          placeholder="Search by name or email…"
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

      <div className="bg-[#111127] rounded-xl border border-white/6 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-10 bg-white/4 rounded animate-pulse" />
            ))}
          </div>
        ) : students.length === 0 ? (
          <p className="px-6 py-10 text-white/30 text-sm text-center">
            {search ? 'No students match your search' : 'No students yet'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/6">
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Email</th>
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Username</th>
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Studios</th>
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Joined</th>
                  <th className="px-5 py-3 text-right text-white/40 font-medium text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, i) => (
                  <tr key={student.id} className={i < students.length - 1 ? 'border-b border-white/4' : ''}>
                    <td className="px-5 py-3 text-white font-medium">{student.full_name || '—'}</td>
                    <td className="px-5 py-3 text-white/60">{student.email || '—'}</td>
                    <td className="px-5 py-3 text-white/40 font-mono text-xs">
                      {student.username ? `@${student.username}` : <span className="text-white/20">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-sm font-medium ${student.studioCount > 0 ? 'text-white' : 'text-white/30'}`}>
                        {student.studioCount}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/40 text-xs">
                      {new Date(student.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => setConfirmRemove(student)}
                          disabled={removingId === student.id || deletingId === student.id}
                          className="text-xs text-red-400/60 hover:text-red-400 transition-colors disabled:opacity-30"
                        >
                          Revoke Access
                        </button>
                        <button
                          onClick={() => setConfirmDelete(student)}
                          disabled={deletingId === student.id || removingId === student.id}
                          title="Delete student"
                          className="text-red-400/40 hover:text-red-400 transition-colors disabled:opacity-30"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-white/30">
            Page {page} of {totalPages}
          </p>
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

      {/* Confirm revoke access modal */}
      {confirmRemove && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111127] rounded-2xl border border-white/10 p-6 w-full max-w-md space-y-5">
            <h2 className="text-lg font-semibold text-white">Revoke Studio Access?</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              This will remove <span className="text-white font-medium">{confirmRemove.full_name || confirmRemove.email}</span> from all studios they have access to. They will not be deleted — just lose studio membership.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmRemove(null)}
                className="flex-1 py-2.5 border border-white/10 text-white/60 text-sm rounded-lg hover:text-white hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemove(confirmRemove)}
                disabled={removingId === confirmRemove.id}
                className="flex-1 py-2.5 bg-red-500/80 text-white text-sm font-medium rounded-lg hover:bg-red-500 disabled:opacity-50 transition-colors"
              >
                {removingId === confirmRemove.id ? 'Revoking…' : 'Revoke Access'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-[#111127] rounded-2xl border border-white/10 p-6 w-full max-w-md space-y-5">
            <h2 className="text-lg font-semibold text-white">Delete Student?</h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Delete <span className="text-white font-medium">{confirmDelete.full_name || confirmDelete.email}</span> and all their data? This removes their studio access, activity, and account. <span className="text-red-400 font-medium">This cannot be undone.</span>
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
                {deletingId === confirmDelete.id ? 'Deleting…' : 'Delete Student'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
