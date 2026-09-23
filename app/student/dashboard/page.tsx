'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import StaffInviteBanners from '@/components/StaffInviteBanners'

interface StudioProfile {
  username: string | null
  full_name: string | null
  profile_image_url: string | null
}

interface StudioCreator {
  id: string
  display_name: string | null
  specialties: string[] | null
  profile: StudioProfile | null
}

// A Space on the dashboard, whether reached via a legacy studio_access grant
// or an offering membership (member_offerings). Merged and de-duped by creator.
interface SpaceRow {
  key: string
  status: 'approved' | 'pending'
  creator: StudioCreator
  /** Set for offering-sourced pending rows — enables "Withdraw request". */
  offeringMemberId?: string
}

// Supabase can return joined rows as an object or a single-element array
function first<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const GRADIENTS = [
  'from-[#2A2A30] to-[#1A1A20]',
  'from-[#2A2A30] to-[#1A1A20]',
  'from-[#30303A] to-[#1D1D24]',
  'from-[#26262E] to-[#17171C]',
  'from-[#2E2E38] to-[#1A1A22]',
]

function studioName(creator: StudioCreator): string {
  return creator.display_name || creator.profile?.full_name || 'Studio'
}

function StudioCard({ creator }: { creator: StudioCreator }) {
  const name = studioName(creator)
  const imageUrl = creator.profile?.profile_image_url
  const gradient = GRADIENTS[name.charCodeAt(0) % GRADIENTS.length]

  return (
    <Link
      href={`/student/studio/${creator.id}`}
      className="group relative block aspect-[4/5] rounded-2xl overflow-hidden border border-[#2A2A30] hover:border-[#F4F1EA]/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#F4F1EA]/10"
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <span className="text-6xl font-bold text-[#F4F1EA]/70">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-lg font-bold text-[#F4F1EA] mb-1">{name}</h3>
        {creator.specialties && creator.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {creator.specialties.slice(0, 2).map((specialty, index) => (
              <span
                key={index}
                className="px-2 py-0.5 bg-white/15 backdrop-blur-sm text-[#F4F1EA]/90 rounded-full text-xs"
              >
                {specialty}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}

const CREATOR_SELECT = `
  id,
  display_name,
  specialties,
  profile:profiles!user_id (
    username,
    full_name,
    profile_image_url
  )
`

function normalizeCreator(value: unknown): StudioCreator | null {
  const c = first(value as StudioCreator | StudioCreator[] | null)
  if (!c) return null
  return { ...c, profile: first(c.profile) as StudioProfile | null }
}

export default function StudentDashboardPage() {
  const [approved, setApproved] = useState<SpaceRow[]>([])
  const [pending, setPending] = useState<SpaceRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStudios = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Two sources, merged: legacy studio_access grants and offering
        // memberships (member_offerings). Additive dual-read during the soak.
        const [legacyRes, offeringRes] = await Promise.all([
          supabase
            .from('studio_access')
            .select(`id, status, creator:creators!creator_id ( ${CREATOR_SELECT} )`)
            .eq('student_id', user.id)
            .in('status', ['approved', 'pending']),
          supabase
            .from('member_offerings')
            .select(`id, status, expires_at, creator:creators!creator_id ( ${CREATOR_SELECT} )`)
            .eq('user_id', user.id)
            .in('status', ['active', 'pending']),
        ])

        if (legacyRes.error) throw legacyRes.error
        if (offeringRes.error) throw offeringRes.error

        // De-dupe by creator: approved/active wins over pending. Offerings are
        // considered first so an offering-sourced pending row (which carries
        // offeringMemberId for Withdraw) is kept over an equal-rank legacy one.
        const byCreator = new Map<string, SpaceRow>()
        const rank = (s: SpaceRow['status']) => (s === 'approved' ? 2 : 1)
        const consider = (row: SpaceRow) => {
          const existing = byCreator.get(row.creator.id)
          if (!existing || rank(row.status) > rank(existing.status)) {
            byCreator.set(row.creator.id, row)
          }
        }

        for (const r of offeringRes.data || []) {
          const creator = normalizeCreator(r.creator)
          if (!creator) continue
          if (r.status === 'active') {
            // Expired active memberships don't count as access.
            if (r.expires_at && new Date(r.expires_at as string) <= new Date()) continue
            consider({ key: `off-${r.id}`, status: 'approved', creator })
          } else {
            consider({ key: `off-${r.id}`, status: 'pending', creator, offeringMemberId: r.id as string })
          }
        }

        for (const r of legacyRes.data || []) {
          const creator = normalizeCreator(r.creator)
          if (!creator) continue
          consider({
            key: `legacy-${r.id}`,
            status: r.status === 'approved' ? 'approved' : 'pending',
            creator,
          })
        }

        const rows = [...byCreator.values()]
        setApproved(rows.filter((row) => row.status === 'approved'))
        setPending(rows.filter((row) => row.status === 'pending'))
      } catch (err) {
        console.error('Error loading studios:', err)
        setError('Could not load your studios. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadStudios()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // Student layout redirects to the homepage on SIGNED_OUT
  }

  return (
    <main className="min-h-screen bg-[#0E0E12] px-6 py-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">My Studios</h1>
          <button
            onClick={handleSignOut}
            className="text-[#F4F1EA]/50 hover:text-[#F4F1EA] text-sm transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Staff invitations — surfaced for invitees whose studio_staff row
            (status='invited') the studio_access query below never returns. */}
        <StaffInviteBanners />

        {isLoading ? (
          <div className="py-24 flex justify-center">
            <div className="w-10 h-10 border-2 border-[#F4F1EA]/70 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
            <p className="text-red-400">{error}</p>
          </div>
        ) : (
          <>
            {/* Approved studios */}
            {approved.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mb-12">
                {approved.map((row) => (
                  <StudioCard key={row.key} creator={row.creator} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 mb-12 bg-[#1A1A20] rounded-2xl border border-[#2A2A30]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5">
                  <svg className="w-8 h-8 text-[#F4F1EA]/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#F4F1EA] mb-2">
                  No studios yet
                </h3>
                <p className="text-[#F4F1EA]/50 mb-6">
                  Discover creators and request access to their studios
                </p>
                <Link
                  href="/discover"
                  className="inline-block px-8 py-3 bg-[#F4F1EA] text-[#0E0E12] font-semibold rounded-full hover:bg-white transition-colors"
                >
                  Discover Creators
                </Link>
              </div>
            )}

            {/* Pending requests */}
            {pending.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold mb-4">Pending Requests</h2>
                <div className="space-y-3">
                  {pending.map((row) => {
                    const name = studioName(row.creator)
                    const imageUrl = row.creator.profile?.profile_image_url
                    const username = row.creator.profile?.username
                    const inner = (
                      <div className="flex items-center gap-4 p-4 bg-[#1A1A20] rounded-xl border border-[#2A2A30] hover:border-white/20 transition-colors">
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-[#F4F1EA]/10 flex items-center justify-center">
                            <span className="text-lg font-bold text-[#F4F1EA]">
                              {name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[#F4F1EA] font-medium truncate">{name}</p>
                        </div>
                        <span className="px-3 py-1 bg-amber-500/15 text-amber-400 text-xs font-medium rounded-full">
                          Pending
                        </span>
                      </div>
                    )
                    return username ? (
                      <Link key={row.key} href={`/${username}`} className="block">
                        {inner}
                      </Link>
                    ) : (
                      <div key={row.key}>{inner}</div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Discover more */}
            {approved.length > 0 && (
              <div className="text-center">
                <Link
                  href="/discover"
                  className="inline-flex items-center gap-2 text-[#F4F1EA]/60 hover:text-[#C9A96A] transition-colors"
                >
                  Discover more creators
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
