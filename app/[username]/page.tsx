export const dynamic = 'force-dynamic'
export const revalidate = 0

import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import PreviewContentGrid from '@/components/PreviewContentGrid'
import AppStoreBadge from '@/components/AppStoreBadge'
import MobileDownloadBanner from '@/components/MobileDownloadBanner'
import StudentNav from '@/components/StudentNav'
import StudioAccessCTA from '@/components/StudioAccessCTA'
import FollowButton from '@/components/FollowButton'

interface Profile {
  id: string
  username: string | null
  full_name: string | null
  profile_image_url: string | null
  bio: string | null
  role: string
}

interface Creator {
  id: string
  user_id: string
  display_name: string | null
  bio: string | null
  specialties: string[] | null
  studio_description: string | null
  pricing_info: string | null
  whats_included: string[] | null
  cashapp_username: string | null
  paypal_username: string | null
  venmo_username: string | null
  zelle_info: string | null
  accent_color: string | null
  payment_links: {
    cashapp?: string
    paypal?: string
    venmo?: string
    gumroad?: string
    kofi?: string
    square?: string
    custom_label?: string
    custom_url?: string
  } | null
  is_visible?: boolean
  space_mode?: string | null
}

interface ContentItem {
  id: string
  title: string
  mux_playback_id: string | null
  is_preview: boolean
  difficulty_level: string | null
}

interface Review {
  id: string
  rating: number
  comment: string | null
  created_at: string
  profiles: {
    full_name: string | null
  } | null
}

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

async function getCreatorByUsernameOrId(identifier: string) {
  console.log('=== CREATOR LOOKUP DEBUG ===')
  console.log('Identifier received:', identifier)

  let profile = null
  let creator = null

  // First try to find by username (must be a creator)
  const { data: profileByUsername, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', identifier)
    .eq('role', 'creator')
    .single()

  console.log('Profile query result:', profileByUsername)
  console.log('Profile query error:', profileError)

  if (profileByUsername) {
    profile = profileByUsername
    // Get creator data - use user_id, not id
    const { data: creatorData, error: creatorError } = await supabase
      .from('creators')
      .select('*')
      .eq('user_id', profile.id)
      .single()
    console.log('Creator query result:', creatorData)
    console.log('Creator query error:', creatorError)
    creator = creatorData
  } else if (UUID_PATTERN.test(identifier)) {
    // Try to find by creator ID (UUID)
    console.log('Username not found, trying ID lookup...')
    const { data: creatorById, error: creatorIdError } = await supabase
      .from('creators')
      .select('*')
      .eq('id', identifier)
      .single()

    console.log('Creator by ID result:', creatorById)
    console.log('Creator by ID error:', creatorIdError)

    if (creatorById) {
      creator = creatorById
      // Get profile data using creator's user_id
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', creatorById.user_id)
        .single()
      profile = profileData
      console.log('Profile by ID result:', profileData)
    }
  }

  if (!creator || !profile) {
    console.log('Creator or profile not found, returning null')
    return null
  }

  console.log('=== LOOKUP SUCCESS ===')

  // Get preview content items
  const { data: contentItems, error: contentError } = await supabase
    .from('content_items')
    .select('id, title, mux_playback_id, is_preview, difficulty_level')
    .eq('creator_id', creator.id)
    .eq('is_preview', true)
    .not('mux_playback_id', 'is', null)
    .order('created_at', { ascending: false })

  console.log('Content items result:', contentItems)
  console.log('Content items error:', contentError)

  // Get student count from studio_access
  const { count: studentCount } = await supabase
    .from('studio_access')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', creator.id)
    .eq('status', 'approved')

  // Get content count
  const { count: videoCount } = await supabase
    .from('content_items')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', creator.id)

  // Get follower count
  const { count: followerCount } = await supabase
    .from('follows')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', creator.id)

  // Get total review count
  const { count: reviewCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('creator_id', creator.id)

  // Get reviews
  const { data: reviews } = await supabase
    .from('reviews')
    .select(`
      id,
      rating,
      comment,
      created_at,
      profiles!reviews_student_id_fkey (
        full_name
      )
    `)
    .eq('creator_id', creator.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return {
    profile: profile as Profile,
    creator: creator as Creator,
    contentItems: (contentItems || []) as ContentItem[],
    reviews: (reviews || []).map(r => ({
      ...r,
      profiles: Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
    })) as Review[],
    studentCount: studentCount || 0,
    videoCount: videoCount || 0,
    followerCount: followerCount || 0,
    reviewCount: reviewCount || 0,
  }
}

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params
  const data = await getCreatorByUsernameOrId(username)

  if (!data) {
    return {
      title: 'Creator Not Found | Sssion',
    }
  }

  const { creator, profile } = data
  const displayName = creator.display_name || profile.full_name || username

  const profileImageUrl = profile.profile_image_url

  return {
    title: `${displayName} | Sssion`,
    description: creator.studio_description || creator.bio || `Join ${displayName}'s studio on Sssion`,
    openGraph: {
      title: `${displayName} | Sssion`,
      description: creator.studio_description || creator.bio || `Join ${displayName}'s studio on Sssion`,
      images: profileImageUrl ? [profileImageUrl] : [],
      type: 'profile',
    },
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-white/20'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default async function CreatorStudioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const data = await getCreatorByUsernameOrId(username)

  if (!data) {
    notFound()
  }

  const { profile, creator, contentItems, reviews, studentCount, videoCount, followerCount, reviewCount } = data

  if (creator.is_visible === false) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-white mb-3">This studio is currently unavailable</h1>
          <p className="text-white/40 text-sm leading-relaxed">
            The creator has temporarily paused their studio. Check back later.
          </p>
          <a href="/" className="inline-block mt-8 text-[#B76E79] text-sm hover:underline">
            ← Back to Sssion
          </a>
        </div>
      </div>
    )
  }
  const displayName = creator.display_name || profile.full_name || username
  const profileImageUrl = profile.profile_image_url

  const pl = creator.payment_links
  const hasPaymentLinks = creator.cashapp_username || creator.paypal_username || creator.venmo_username || creator.zelle_info ||
    pl?.square || (pl?.custom_label && pl?.custom_url)

  // Space mode controls what the public page shows. Follow is always visible.
  const spaceMode = creator.space_mode || 'home'
  // Gathering & Studio share community features (member count, reviews, join CTA).
  const showGatheringFeatures = spaceMode === 'gathering' || spaceMode === 'studio'
  // Studio-only: pricing, what's included, payment links.
  const showStudioFeatures = spaceMode === 'studio'
  const joinLabel = 'Request to Join Community'

  return (
    <div className="min-h-screen bg-[#1A1A2E]">
      {/* Navigation */}
      <StudentNav />

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-6 bg-gradient-to-b from-[#B76E79]/30 to-[#1A1A2E]">
        <div className="max-w-4xl mx-auto text-center">
          {/* Profile Image */}
          <div className="relative w-32 h-32 mx-auto mb-6">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt={displayName}
                className="w-full h-full rounded-full object-cover border-4 border-[#B76E79]"
              />
            ) : (
              <div className="w-full h-full rounded-full bg-[#B76E79]/20 flex items-center justify-center border-4 border-[#B76E79]">
                <span className="text-4xl font-bold text-[#B76E79]">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Name */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {displayName}
          </h1>

          {/* Specialties */}
          {creator.specialties && creator.specialties.length > 0 && (
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {creator.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="px-4 py-1.5 bg-[#B76E79]/20 text-[#B76E79] rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          )}

          {/* Follow is the hero action in every mode */}
          <div className="mt-8 flex flex-col items-center gap-2">
            <FollowButton
              creatorId={creator.id}
              creatorUserId={creator.user_id}
              hero
              label="Stay Updated"
              emailFollowName={displayName}
              consentSource={`web_studio_page_${username}`}
              accentColor={creator.accent_color}
            />
            <p className="text-white/40 text-xs text-center max-w-xs">
              Get important email updates and app notifications from this creator
            </p>
          </div>

          {/* Join/access CTA — secondary, only in Gathering & Studio modes */}
          {showGatheringFeatures && (
            <StudioAccessCTA creatorId={creator.id} joinLabel={joinLabel} />
          )}
        </div>
      </section>

      {/* About Section */}
      {(creator.studio_description || creator.bio) && (
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">About</h2>
            <p className="text-white/70 leading-relaxed whitespace-pre-wrap">
              {creator.studio_description || creator.bio}
            </p>
          </div>
        </section>
      )}

      {/* What's Included Section (Studio mode only) */}
      {showStudioFeatures && creator.whats_included && creator.whats_included.length > 0 && (
        <section className="py-12 px-6 bg-[#16162a]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">What&apos;s Included</h2>
            <ul className="space-y-3">
              {creator.whats_included.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#B76E79] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Pricing Section (Studio mode only) */}
      {showStudioFeatures && creator.pricing_info && (
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Pricing</h2>
            <div className="bg-gradient-to-br from-[#B76E79]/20 to-[#B76E79]/5 rounded-2xl p-8 border border-[#B76E79]/30">
              <p className="text-white/90 text-lg whitespace-pre-wrap">{creator.pricing_info}</p>
            </div>
          </div>
        </section>
      )}

      {/* Stats Bar */}
      <section className="py-8 px-6 bg-[#16162a]">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-x-12 gap-y-6">
          {/* Member count — Gathering & Studio only */}
          {showGatheringFeatures && (
            <div className="text-center">
              <p className="text-3xl font-bold text-[#B76E79]">{studentCount}</p>
              <p className="text-white/60 text-sm">Students</p>
            </div>
          )}
          {/* Follower count — all modes */}
          <div className="text-center">
            <p className="text-3xl font-bold text-[#B76E79]">{followerCount}</p>
            <p className="text-white/60 text-sm">Followers</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-[#B76E79]">{videoCount}</p>
            <p className="text-white/60 text-sm">Videos</p>
          </div>
          {/* Review count — Gathering & Studio only */}
          {showGatheringFeatures && (
            <div className="text-center">
              <p className="text-3xl font-bold text-[#B76E79]">{reviewCount}</p>
              <p className="text-white/60 text-sm">Reviews</p>
            </div>
          )}
        </div>
      </section>

      {/* Preview Content Section */}
      {contentItems.length > 0 && (
        <section className="py-12 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Preview Content</h2>
            <PreviewContentGrid
              contentItems={contentItems}
              creatorName={displayName}
            />
          </div>
        </section>
      )}

      {/* Reviews Section (Gathering & Studio modes) */}
      {showGatheringFeatures && reviews.length > 0 && (
        <section className="py-12 px-6 bg-[#16162a]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">Student Reviews</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-[#1A1A2E] rounded-xl p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white font-medium">
                      {review.profiles?.full_name || 'Student'}
                    </span>
                    <StarRating rating={review.rating} />
                  </div>
                  {review.comment && (
                    <p className="text-white/70">{review.comment}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Payment Links Section (Studio mode only) */}
      {showStudioFeatures && hasPaymentLinks && (
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Payment Options</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {creator.cashapp_username && (
                <a
                  href={`https://cash.app/$${creator.cashapp_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#00D632] text-black font-semibold rounded-full hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <span className="font-bold">$</span> Cash App
                </a>
              )}
              {creator.paypal_username && (
                <a
                  href={`https://paypal.me/${creator.paypal_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#0070ba] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  PayPal
                </a>
              )}
              {creator.venmo_username && (
                <a
                  href={`https://venmo.com/${creator.venmo_username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#008CFF] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  Venmo
                </a>
              )}
              {creator.zelle_info && (
                <div className="px-6 py-3 bg-[#6D1ED4] text-white font-semibold rounded-full">
                  Zelle: {creator.zelle_info}
                </div>
              )}
              {pl?.square && (
                <a
                  href={pl.square.startsWith('http') ? pl.square : `https://${pl.square}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-black text-white font-semibold rounded-full hover:opacity-80 transition-opacity flex items-center gap-2"
                >
                  <span className="inline-block w-4 h-4 border-2 border-white rounded-sm" /> Square
                </a>
              )}
              {pl?.custom_label && pl?.custom_url && (
                <a
                  href={pl.custom_url.startsWith('http') ? pl.custom_url : `https://${pl.custom_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#B76E79] text-white font-semibold rounded-full hover:opacity-90 transition-opacity"
                >
                  {pl.custom_label}
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-gradient-to-t from-[#B76E79]/25 to-transparent">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#B76E79] font-semibold text-sm uppercase tracking-widest mb-4">
            Available on iOS
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join {displayName}&apos;s Studio
          </h2>
          <p className="text-white/60 mb-10 max-w-md mx-auto">
            Download Sssion to access all content, join live classes, and connect directly with {displayName}.
          </p>
          <div className="flex justify-center">
            <AppStoreBadge size="lg" />
          </div>
        </div>
      </section>

      {/* Floating mobile download banner */}
      <MobileDownloadBanner />

      {/* Discover More */}
      <section className="py-12 px-6 bg-[#16162a]">
        <div className="max-w-3xl mx-auto text-center">
          <a
            href="/discover"
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#B76E79] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Discover more creators
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; 2026 Sssion
          </p>
          <div className="flex gap-6">
            <a href="/" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Home
            </a>
            <a href="/discover" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Discover
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
