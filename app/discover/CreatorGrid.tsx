'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'

interface CreatorWithProfile {
  id: string
  display_name: string | null
  specialties: string[] | null
  created_at: string
  profile: {
    username: string
    profile_image_url: string | null
    bio: string | null
  } | null
}

interface CreatorGridProps {
  creators: CreatorWithProfile[]
}

// Generate a consistent gradient based on username
function getGradient(username: string): string {
  const gradients = [
    'from-[#B76E79] to-[#8B5A62]',
    'from-[#A05F69] to-[#6B4A52]',
    'from-[#C4848D] to-[#9A6871]',
    'from-[#D4979F] to-[#B07880]',
    'from-[#8B6E79] to-[#6B4E59]',
  ]
  const index = username.charCodeAt(0) % gradients.length
  return gradients[index]
}

function CreatorCard({ creator }: { creator: CreatorWithProfile }) {
  const username = creator.profile?.username || ''
  const displayName = creator.display_name || username
  const bio = creator.profile?.bio || ''
  const truncatedBio = bio.length > 80 ? bio.substring(0, 80) + '...' : bio
  const profileImageUrl = creator.profile?.profile_image_url
  const initials = displayName.charAt(0).toUpperCase()
  const gradient = getGradient(username)

  return (
    <Link
      href={`/${username}`}
      className="group block bg-[#16162a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#B76E79]/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-[#B76E79]/10"
    >
      {/* Profile Image / Gradient Header */}
      <div className="relative h-48 overflow-hidden">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-5xl font-bold text-white/80">
              {initials}
            </span>
          </div>
        )}
        {/* Gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#16162a] via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#B76E79] transition-colors">
          {displayName}
        </h3>

        {/* Specialties */}
        {creator.specialties && creator.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {creator.specialties.slice(0, 3).map((specialty, index) => (
              <span
                key={index}
                className="px-2.5 py-0.5 bg-[#B76E79]/15 text-[#B76E79] rounded-full text-xs font-medium"
              >
                {specialty}
              </span>
            ))}
            {creator.specialties.length > 3 && (
              <span className="px-2.5 py-0.5 bg-white/5 text-white/40 rounded-full text-xs">
                +{creator.specialties.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bio */}
        {truncatedBio && (
          <p className="text-white/50 text-sm leading-relaxed mb-4">
            {truncatedBio}
          </p>
        )}

        {/* View Studio Button */}
        <div className="pt-2 border-t border-white/5">
          <span className="inline-flex items-center gap-2 text-[#B76E79] text-sm font-medium group-hover:gap-3 transition-all">
            View Studio
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function CreatorGrid({ creators }: CreatorGridProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCreators = useMemo(() => {
    if (!searchQuery.trim()) return creators

    const query = searchQuery.toLowerCase()
    return creators.filter(creator => {
      const displayName = (creator.display_name || '').toLowerCase()
      const username = (creator.profile?.username || '').toLowerCase()
      const specialties = (creator.specialties || []).map(s => s.toLowerCase())

      return (
        displayName.includes(query) ||
        username.includes(query) ||
        specialties.some(s => s.includes(query))
      )
    })
  }, [creators, searchQuery])

  if (creators.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Creators are joining soon
        </h3>
        <p className="text-white/50">
          Check back to discover amazing movement instructors!
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-10 max-w-xl mx-auto">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-[#16162a] border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#B76E79] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Results count */}
      {searchQuery && (
        <p className="text-white/40 text-sm mb-6">
          {filteredCreators.length} {filteredCreators.length === 1 ? 'creator' : 'creators'} found
        </p>
      )}

      {/* Grid */}
      {filteredCreators.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map(creator => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-white/50">
            No creators match &ldquo;{searchQuery}&rdquo;
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-[#B76E79] hover:underline"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  )
}
