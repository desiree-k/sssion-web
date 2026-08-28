export const dynamic = 'force-dynamic'
export const revalidate = 0

import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Bodoni_Moda, Archivo } from 'next/font/google'
import { resolveProfileTheme, profileThemeVars } from '@/lib/profileThemes'
import PreviewContentGrid from '@/components/PreviewContentGrid'
import AppStoreBadge from '@/components/AppStoreBadge'
import MobileDownloadBanner from '@/components/MobileDownloadBanner'
import StudentNav from '@/components/StudentNav'
import StudioAccessCTA from '@/components/StudioAccessCTA'
import FollowButton from '@/components/FollowButton'
import EnterSpaceButton from '@/components/EnterSpaceButton'
import OfferingCards, { Offering } from '@/components/OfferingCards'

// The approved design's type pairing: Bodoni Moda display, Archivo body.
const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
})
const archivo = Archivo({ subsets: ['latin'], variable: '--font-body' })

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
  cover_image_url: string | null
  profile_theme: string | null
  theme_accent: string | null
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
  community_enabled?: boolean | null
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

  // Get publicly visible content — these show on the creator page in every
  // space mode. (The legacy is_preview flag is no longer set by the app.)
  const { data: contentItems, error: contentError } = await supabase
    .from('content_items')
    .select('id, title, mux_playback_id, is_preview, difficulty_level')
    .eq('creator_id', creator.id)
    .in('visibility', ['discovery', 'both', 'free'])
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

  // Get active offerings (RLS only exposes is_active = true to visitors)
  const { data: offerings } = await supabase
    .from('offerings')
    .select('id, name, description, price, currency, is_free, payment_url, access_duration_days, access_scope, includes_community, auto_approve')
    .eq('creator_id', creator.id)
    .eq('is_active', true)
    .order('sort_order')
    .order('created_at')

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
    offerings: (offerings || []) as Offering[],
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
          className="w-4 h-4"
          style={{ color: star <= rating ? 'var(--pt-accent)' : 'var(--pt-border)' }}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

/** Small letterspaced-caps label — the editorial section marker. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--pt-text2)] mb-5">
      {children}
    </p>
  )
}

export default async function CreatorStudioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const data = await getCreatorByUsernameOrId(username)

  if (!data) {
    notFound()
  }

  const { profile, creator, offerings, contentItems, reviews, studentCount, videoCount, followerCount, reviewCount } = data

  // Theme resolved server-side from the creator row; the whole page renders
  // from these tokens (accent_color is no longer read here).
  const theme = resolveProfileTheme(creator.profile_theme, creator.theme_accent)
  const themeStyle = {
    ...profileThemeVars(theme),
    backgroundColor: 'var(--pt-page)',
    color: 'var(--pt-text)',
    fontFamily: 'var(--font-body), system-ui, sans-serif',
  } as React.CSSProperties

  if (creator.is_visible === false) {
    return (
      <div className={`${bodoni.variable} ${archivo.variable} min-h-screen flex items-center justify-center px-6`} style={themeStyle}>
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full border border-[var(--pt-border)] flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-[var(--pt-text2)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl mb-3" style={{ fontFamily: 'var(--font-display), serif' }}>
            This studio is currently unavailable
          </h1>
          <p className="text-[var(--pt-text2)] text-sm leading-relaxed">
            The creator has temporarily paused their studio. Check back later.
          </p>
          <a href="/" className="inline-block mt-8 text-sm hover:underline" style={{ color: 'var(--pt-accent)' }}>
            ← Back to Sssion
          </a>
        </div>
      </div>
    )
  }
  const displayName = creator.display_name || profile.full_name || username
  const profileImageUrl = profile.profile_image_url
  const coverImageUrl = creator.cover_image_url

  // Magazine-cover masthead: first name on its own line, the rest below.
  const nameParts = displayName.trim().split(/\s+/)
  const nameTop = nameParts[0]
  const nameRest = nameParts.slice(1).join(' ')

  // community_enabled (migrated from the retired space_mode) controls what the
  // public page shows. When it's on, offerings/Join is the hero and Follow is
  // demoted to a quiet "Stay Updated"; when off, there's no community, so Stay
  // Updated is the primary action and no join/offering CTAs appear. Default to
  // community when the flag is unset — the DB is migrated, this only guards a
  // stray null. Follow is always available either way.
  const communityEnabled = creator.community_enabled !== false
  const showCommunityFeatures = communityEnabled
  const joinLabel = 'Request to Join Community'

  return (
    <div
      className={`${bodoni.variable} ${archivo.variable} min-h-screen`}
      style={{ ...themeStyle, ['--pt-radius' as string]: '0px' } as React.CSSProperties}
    >
      {/* Navigation */}
      <StudentNav />

      {/* Cover band — always present; dark placeholder when no image */}
      <div className="relative w-full h-72 md:h-[440px] bg-black border-b border-[var(--pt-border)] overflow-hidden">
        {coverImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverImageUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: 'radial-gradient(120% 90% at 22% 15%, #2C2A2E 0%, #131316 46%, #000 100%)' }}
          />
        )}
      </div>

      {/* Masthead — only the portrait overlaps the cover (the name stays in
          normal flow so its top line can never ride up and clip) */}
      <header className="px-6 md:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
            {/* Mobile: light ~22% overlap of the cover's bottom edge; the
                deeper editorial overlap is desktop-only. */}
            <div className="relative z-10 w-[120px] h-[120px] md:w-[200px] md:h-[200px] -mt-[26px] md:-mt-24 rounded-full flex-none overflow-hidden bg-black border-4 border-[var(--pt-page)]">
              {profileImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profileImageUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-6xl text-white/60" style={{ fontFamily: 'var(--font-display), serif' }}>
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="flex flex-col pt-1 md:pt-0 md:pb-2 min-w-0">
              <h1
                className="m-0 tracking-[-0.02em] break-words"
                style={{
                  fontFamily: 'var(--font-display), serif',
                  fontWeight: 400,
                  fontSize: 'clamp(3.5rem, 14vw, 9rem)',
                  lineHeight: 0.95,
                }}
              >
                {nameTop}
                {nameRest && (
                  <>
                    <br />
                    {nameRest}
                  </>
                )}
              </h1>
              {creator.specialties && creator.specialties.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 mt-5">
                  {creator.specialties.map((specialty, index) => (
                    <span key={index} className="contents">
                      {index > 0 && <span className="w-4 h-px bg-[var(--pt-border)]" />}
                      <span
                        className="text-[10px] font-semibold uppercase tracking-[0.22em]"
                        style={{ color: 'var(--pt-accent)' }}
                      >
                        {specialty}
                      </span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* About + Stay Updated, side by side */}
          <div className="grid md:grid-cols-[1.35fr_1fr] gap-10 md:gap-14 items-start mt-8 md:mt-10">
            {(creator.studio_description || creator.bio) ? (
              <p className="text-[17px] leading-[1.68] whitespace-pre-wrap text-pretty m-0">
                {creator.studio_description || creator.bio}
              </p>
            ) : (
              <div className="hidden md:block" />
            )}
            {communityEnabled ? (
              /* Community: Join is the hero; Stay Updated sits back as a quiet
                 secondary beneath it (the offering cards below are the main
                 way in). */
              <div>
                <div className="border border-[var(--pt-border)] bg-[var(--pt-surface)] p-7">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--pt-text2)] m-0">
                    Join the community
                  </p>
                  <p className="text-sm leading-[1.55] text-[var(--pt-text2)] mt-2.5 mb-4">
                    Get access to {displayName}&apos;s sessions, live classes, and community.
                  </p>
                  <div className="flex flex-col items-stretch gap-2.5 [&_a]:text-center">
                    <EnterSpaceButton creatorId={creator.id} />
                    {/* No offerings → the request-to-join CTA lives here; with
                        offerings, the cards below carry each CTA. */}
                    {offerings.length === 0 ? (
                      <StudioAccessCTA creatorId={creator.id} joinLabel={joinLabel} />
                    ) : (
                      <a
                        href="#offerings"
                        className="text-xs font-semibold uppercase tracking-[0.16em] text-center hover:underline"
                        style={{ color: 'var(--pt-accent)' }}
                      >
                        See ways to join ↓
                      </a>
                    )}
                  </div>
                </div>
                {/* Demoted Stay Updated — quiet outline follow, consent kept. */}
                <div className="mt-4 flex flex-col items-start gap-2">
                  <FollowButton
                    creatorId={creator.id}
                    creatorUserId={creator.user_id}
                    label="Stay Updated"
                    emailFollowName={displayName}
                    consentSource={`web_studio_page_${username}`}
                  />
                  <p className="text-xs leading-[1.5] text-[var(--pt-text2)] m-0">
                    Get important email updates and app notifications from this creator.
                  </p>
                  {followerCount > 0 && (
                    <p className="text-xs text-[var(--pt-text2)] m-0">
                      {followerCount.toLocaleString()} following
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* Page (community off): Stay Updated is the primary action and
                 there's nothing to join — no offering/access CTAs. */
              <div className="border border-[var(--pt-border)] bg-[var(--pt-surface)] p-7">
                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--pt-text2)] m-0">
                  Stay updated
                </p>
                <p className="text-sm leading-[1.55] text-[var(--pt-text2)] mt-2.5 mb-4">
                  Get important email updates and app notifications from this creator.
                </p>
                <div className="flex flex-col items-stretch gap-2.5 [&_a]:text-center">
                  <FollowButton
                    creatorId={creator.id}
                    creatorUserId={creator.user_id}
                    hero
                    label="Stay Updated"
                    emailFollowName={displayName}
                    consentSource={`web_studio_page_${username}`}
                  />
                </div>
                {followerCount > 0 && (
                  <p className="text-xs text-[var(--pt-text2)] mt-4 mb-0">
                    {followerCount.toLocaleString()} following
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="px-6 md:px-16 pb-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-16 md:gap-20 mt-16 md:mt-20">
          {/* Offerings — the hero way to get access (free or paid). Only shown
              when the Space is community-enabled; a content-only page has no
              join/offering CTAs. */}
          {showCommunityFeatures && (
            <div id="offerings">
              <OfferingCards creatorId={creator.id} offerings={offerings} />
            </div>
          )}

          {/* Preview moments — vertical wells */}
          {contentItems.length > 0 && (
            <section>
              <div className="flex justify-between items-baseline border-b border-[var(--pt-border)] pb-3 mb-5">
                <h2
                  className="text-3xl md:text-[34px] m-0"
                  style={{ fontFamily: 'var(--font-display), serif', fontWeight: 400 }}
                >
                  Preview moments
                </h2>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--pt-text2)]">
                  Muted loops
                </span>
              </div>
              <PreviewContentGrid contentItems={contentItems} creatorName={displayName} />
            </section>
          )}

          {/* Reviews — editorial quotes (community-enabled Spaces) */}
          {showCommunityFeatures && reviews.length > 0 && (
            <section>
              <h2
                className="text-3xl md:text-[34px] m-0 mb-2"
                style={{ fontFamily: 'var(--font-display), serif', fontWeight: 400 }}
              >
                Reviews
              </h2>
              <div>
                {reviews.map((review, i) => (
                  <div
                    key={review.id}
                    className={`border-t border-[var(--pt-border)] py-6 grid md:grid-cols-[1fr_auto] gap-4 md:gap-10 items-start ${i === reviews.length - 1 ? 'border-b' : ''}`}
                  >
                    <p
                      className="text-xl md:text-[22px] leading-[1.45] italic text-pretty m-0"
                      style={{ fontFamily: 'var(--font-display), serif' }}
                    >
                      {review.comment || 'Loved it.'}
                    </p>
                    <div className="flex flex-col items-start md:items-end gap-1.5">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--pt-text2)] whitespace-nowrap">
                        {review.profiles?.full_name || 'Student'}
                      </span>
                      <StarRating rating={review.rating} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* App CTA */}
          <section className="border-t border-[var(--pt-border)] pt-14 pb-6 text-center">
            <p
              className="text-[11px] font-semibold uppercase tracking-[0.28em] mb-5"
              style={{ color: 'var(--pt-accent)' }}
            >
              Available on iOS
            </p>
            <h2
              className="text-3xl md:text-5xl mb-5 text-balance"
              style={{ fontFamily: 'var(--font-display), serif', fontWeight: 400 }}
            >
              Join {displayName}&apos;s Studio
            </h2>
            <p className="text-[var(--pt-text2)] mb-10 max-w-md mx-auto leading-relaxed">
              Download Sssion to access all content, join live classes, and connect directly with {displayName}.
            </p>
            <div className="flex justify-center">
              <AppStoreBadge size="lg" />
            </div>
          </section>
        </div>
      </main>

      {/* Floating mobile download banner */}
      <MobileDownloadBanner />

      {/* Footer */}
      <footer className="border-t border-[var(--pt-border)] py-6 px-6 md:px-16">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-[11px] uppercase tracking-[0.18em] text-[var(--pt-text2)]">
            Powered by Sssion
          </span>
          <div className="flex gap-6 items-center">
            <a
              href="/discover"
              className="text-[11px] hover:underline"
              style={{ color: 'var(--pt-accent)' }}
            >
              Discover more creators
            </a>
            <a href="/" className="text-[11px] text-[var(--pt-text2)] hover:text-[var(--pt-text)] transition-colors">
              Home
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
