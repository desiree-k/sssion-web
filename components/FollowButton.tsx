'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface FollowButtonProps {
  creatorId: string
  size?: 'sm' | 'lg'
  /**
   * The creator's auth user_id. Used to hide the button on the viewer's
   * OWN studio page (you can't follow yourself). Everyone else — students
   * AND other creators — sees the button.
   */
  creatorUserId?: string | null
  /**
   * Pass these when the parent already knows the viewer (e.g. the discover
   * grid loads follows once for all cards). Leave undefined to self-load.
   * userId of null means signed out — clicking sends to student signup.
   */
  userId?: string | null
  initialFollowing?: boolean
  /**
   * Hero treatment: a filled accent button instead of the default outline.
   * Used on the studio page where Follow is the primary action.
   */
  hero?: boolean
  /**
   * Label for the not-yet-following state. Defaults to 'Follow' (used by the
   * discover grid); the studio page overrides it to 'Stay Updated'.
   */
  label?: string
  /**
   * When set, signed-out visitors get an inline email capture (saved to
   * email_followers — no account needed) instead of the signup redirect.
   * The value is the creator's display name, used in the form copy.
   */
  emailFollowName?: string
  /**
   * Recorded as email_followers.consent_source so we can prove where the
   * opt-in happened (e.g. "web_studio_page_<username>").
   */
  consentSource?: string
  /** Creator's chosen accent color (hex). Falls back to rose gold. */
  accentColor?: string | null
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function FollowButton({
  creatorId,
  size = 'lg',
  creatorUserId,
  userId: userIdProp,
  initialFollowing,
  hero = false,
  label = 'Follow',
  emailFollowName,
  consentSource,
  accentColor,
}: FollowButtonProps) {
  const selfLoad = userIdProp === undefined
  const [userId, setUserId] = useState<string | null>(userIdProp ?? null)
  const [isFollowing, setIsFollowing] = useState(initialFollowing ?? false)
  const [isReady, setIsReady] = useState(!selfLoad)
  const [isHidden, setIsHidden] = useState(false)

  // Email-only follow flow (signed-out visitors on the studio page)
  const [emailMode, setEmailMode] = useState<'idle' | 'form' | 'connected' | 'already'>('idle')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const accent = accentColor || '#B76E79'

  // Keep in sync when the parent supplies viewer state
  useEffect(() => {
    if (!selfLoad) {
      setUserId(userIdProp ?? null)
      setIsFollowing(initialFollowing ?? false)
      setIsReady(true)
    }
  }, [selfLoad, userIdProp, initialFollowing])

  useEffect(() => {
    if (!selfLoad) return

    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
          setUserId(null)
          setIsReady(true)
          return
        }
        // Hide only on the viewer's OWN studio page — you can't follow
        // yourself. Everyone else (students AND other creators) can follow.
        if (creatorUserId && session.user.id === creatorUserId) {
          setIsHidden(true)
          return
        }

        setUserId(session.user.id)

        const { data: follow } = await supabase
          .from('follows')
          .select('id')
          .eq('follower_id', session.user.id)
          .eq('creator_id', creatorId)
          .maybeSingle()

        setIsFollowing(!!follow)
        setIsReady(true)
      } catch (err) {
        console.error('Error loading follow state:', err)
        setIsHidden(true)
      }
    }

    load()
  }, [selfLoad, creatorId, creatorUserId])

  const handleClick = async (e: React.MouseEvent) => {
    // Cards wrap this button in a Link — don't navigate
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      if (emailFollowName) {
        setEmailMode('form')
        return
      }
      window.location.assign('/student-signup')
      return
    }

    const wasFollowing = isFollowing
    setIsFollowing(!wasFollowing)

    try {
      if (wasFollowing) {
        const { error } = await supabase
          .from('follows')
          .delete()
          .eq('follower_id', userId)
          .eq('creator_id', creatorId)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('follows')
          .insert({ follower_id: userId, creator_id: creatorId })
        if (error) throw error
      }
    } catch (err) {
      console.error('Error toggling follow:', err)
      setIsFollowing(wasFollowing)
    }
  }

  const consentText = `Get updates from ${emailFollowName} — new sessions, community news, and important announcements. You can unsubscribe anytime.`

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const normalized = email.trim().toLowerCase()
    if (!EMAIL_PATTERN.test(normalized)) {
      setFormError('Please enter a valid email')
      return
    }
    setFormError(null)
    setIsSubmitting(true)
    const { error } = await supabase
      .from('email_followers')
      .insert({
        email: normalized,
        creator_id: creatorId,
        consent_text: consentText,
        consent_source: consentSource,
      })
    setIsSubmitting(false)
    if (!error) {
      setEmailMode('connected')
      return
    }
    if (error.code === '23505') {
      setEmailMode('already')
      return
    }
    console.error('Error saving email follow:', error)
    setFormError('Something went wrong. Please try again.')
  }

  if (isHidden || !isReady) return null

  if (emailMode === 'connected' || emailMode === 'already') {
    return (
      <div className="max-w-sm mx-auto text-center px-4">
        <p className="text-white text-base font-medium">
          {emailMode === 'already'
            ? `You're already following ${emailFollowName}`
            : `You're connected with ${emailFollowName} 🤍`}
        </p>
        <p className="text-white/50 text-sm mt-2">
          You&apos;ll get email updates when it matters most.
        </p>
      </div>
    )
  }

  if (emailMode === 'form') {
    return (
      <form onSubmit={handleEmailSubmit} className="w-full max-w-sm mx-auto px-4" noValidate>
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            autoFocus
            className="flex-1 min-w-0 px-4 py-3 rounded-full bg-white/5 border border-white/15 text-white text-sm placeholder:text-white/35 focus:outline-none focus:border-white/40 transition-colors"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            style={{ backgroundColor: accent }}
            className="px-6 py-3 rounded-full text-white text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isSubmitting ? '…' : 'Follow'}
          </button>
        </div>
        {formError && (
          <p className="text-red-300/90 text-xs mt-2 text-center">{formError}</p>
        )}
        <p className="text-white/40 text-xs mt-3 text-center">
          {consentText}{' '}
          <a href="/privacy" className="underline hover:text-white/60 transition-colors">
            Privacy Policy
          </a>
        </p>
      </form>
    )
  }

  const sizeClasses = hero
    ? 'px-10 py-4 text-base'
    : size === 'lg'
      ? 'px-8 py-2.5 text-sm'
      : 'px-3.5 py-1.5 text-xs'

  const colorClasses = isFollowing
    ? 'bg-white/10 text-white hover:bg-white/15'
    : hero
      ? 'text-white hover:opacity-90'
      : 'border border-[#B76E79] text-[#B76E79] hover:bg-[#B76E79]/10'

  return (
    <button
      onClick={handleClick}
      style={!isFollowing && hero ? { backgroundColor: accent } : undefined}
      className={`${sizeClasses} ${colorClasses} font-semibold rounded-full transition-all`}
    >
      {isFollowing ? 'Following ✓' : label}
    </button>
  )
}
