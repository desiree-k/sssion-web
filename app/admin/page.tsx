'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Overview {
  creatorCount: number
  studentCount: number
  videoCount: number
  pendingReports: number
  activeInviteCodes: number
  recentSignups: { id: string; full_name: string | null; role: string; created_at: string }[]
}

async function fetchAdminToken() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.access_token ?? null
}

async function adminPost(action: string, payload?: unknown) {
  const token = await fetchAdminToken()
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

export default function AdminOverviewPage() {
  const router = useRouter()
  const [data, setData] = useState<Overview | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    adminPost('get_overview')
      .then(setData)
      .catch(e => setError(e.message))
  }, [])

  const statCards = data ? [
    { label: 'Total Creators', value: data.creatorCount, color: 'text-[#B76E79]' },
    { label: 'Total Students', value: data.studentCount, color: 'text-white' },
    { label: 'Videos Uploaded', value: data.videoCount, color: 'text-white' },
    {
      label: 'Pending Reports',
      value: data.pendingReports,
      color: data.pendingReports > 0 ? 'text-red-400' : 'text-white',
      highlight: data.pendingReports > 0,
    },
    { label: 'Active Invite Codes', value: data.activeInviteCodes, color: 'text-white' },
  ] : []

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
        <p className="text-white/40 text-sm mt-1">Platform overview</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Stat cards */}
      {!data ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-[#111127] rounded-xl p-4 animate-pulse h-20" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {statCards.map(card => (
            <div
              key={card.label}
              className={`bg-[#111127] rounded-xl p-4 border ${card.highlight ? 'border-red-500/40' : 'border-white/6'}`}
            >
              <p className="text-white/40 text-xs mb-2">{card.label}</p>
              <p className={`text-3xl font-semibold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-3">Quick Actions</h2>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => router.push('/admin/invite-codes')}
            className="px-4 py-2 bg-[#B76E79] text-white text-sm font-medium rounded-lg hover:bg-[#a55f69] transition-colors"
          >
            + Create Invite Code
          </button>
          <button
            onClick={() => router.push('/admin/reports')}
            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
              data?.pendingReports
                ? 'border-red-500/50 text-red-400 hover:bg-red-500/10'
                : 'border-white/15 text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            View Reports {data?.pendingReports ? `(${data.pendingReports})` : ''}
          </button>
        </div>
      </div>

      {/* Recent signups */}
      <div>
        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-widest mb-3">Recent Signups (Last 7 Days)</h2>
        <div className="bg-[#111127] rounded-xl border border-white/6 overflow-hidden">
          {!data ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 bg-white/5 rounded animate-pulse" />
              ))}
            </div>
          ) : data.recentSignups.length === 0 ? (
            <p className="px-6 py-8 text-white/30 text-sm text-center">No signups in the last 7 days</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/6">
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Name</th>
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Role</th>
                  <th className="px-5 py-3 text-left text-white/40 font-medium text-xs uppercase tracking-wider">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.recentSignups.map((user, i) => (
                  <tr key={user.id} className={i < data.recentSignups.length - 1 ? 'border-b border-white/4' : ''}>
                    <td className="px-5 py-3 text-white">{user.full_name || '—'}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'creator'
                          ? 'bg-[#B76E79]/15 text-[#B76E79]'
                          : 'bg-white/8 text-white/60'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-white/40">
                      {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
