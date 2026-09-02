'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

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

interface StudioAccessRow {
  id: string
  status: string
  creator: StudioCreator | null
}

// Supabase can return joined rows as an object or a single-element array
function first<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

const GRADIENTS = [
  'from-[#B76E79] to-[#8B5A62]',
  'from-[#A05F69] to-[#6B4A52]',
  'from-[#C4848D] to-[#9A6871]',
  'from-[#D4979F] to-[#B07880]',
  'from-[#8B6E79] to-[#6B4E59]',
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
      className="group relative block aspect-[4/5] rounded-2xl overflow-hidden border border-[#2A2A30] hover:border-[#B76E79]/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#B76E79]/10"
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

export default function StudentDashboardPage() {
  const [approved, setApproved] = useState<StudioAccessRow[]>([])
  const [pending, setPending] = useState<StudioAccessRow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadStudios = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error: queryError } = await supabase
          .from('studio_access')
          .select(`
            id,
            status,
            creator:creators!creator_id (
              id,
              display_name,
              specialties,
              profile:profiles!user_id (
                username,
                full_name,
                profile_image_url
              )
            )
          `)
          .eq('student_id', user.id)
          .in('status', ['approved', 'pending'])

        if (queryError) throw queryError

        const rows: StudioAccessRow[] = (data || []).map((row) => {
          const creator = first(row.creator) as StudioCreator | null
          return {
            id: row.id as string,
            status: row.status as string,
            creator: creator
              ? { ...creator, profile: first(creator.profile) as StudioProfile | null }
              : null,
          }
        }).filter((row) => row.creator !== null)

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

        {isLoading ? (
          <div className="py-24 flex justify-center">
            <div className="w-10 h-10 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
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
                  row.creator && <StudioCard key={row.id} creator={row.creator} />
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
                  className="inline-block px-8 py-3 bg-[#B76E79] text-[#F4F1EA] font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
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
                    if (!row.creator) return null
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
                          <div className="w-12 h-12 rounded-full bg-[#B76E79]/20 flex items-center justify-center">
                            <span className="text-lg font-bold text-[#B76E79]">
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
                      <Link key={row.id} href={`/${username}`} className="block">
                        {inner}
                      </Link>
                    ) : (
                      <div key={row.id}>{inner}</div>
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
                  className="inline-flex items-center gap-2 text-[#F4F1EA]/60 hover:text-[#B76E79] transition-colors"
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
