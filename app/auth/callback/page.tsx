'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { completeJoinFromSession } from '@/lib/completeJoin'
import Link from 'next/link'
import { AuthCenter, Masthead, authPrimaryBtn, authSecondaryBtn } from '@/components/auth/AuthChrome'

export default function AuthCallback() {
  const router = useRouter()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showExpiredLink, setShowExpiredLink] = useState(false)
  // Stashed by /signup when a Space was carried through — lets the fallback
  // confirmation page offer "Open your Space" even without a session here.
  const [joinUsername, setJoinUsername] = useState<string | null>(null)

  useEffect(() => {
    try { setJoinUsername(localStorage.getItem('join_username')) } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    let recoveryHandled = false
    const goToReset = () => {
      if (recoveryHandled) return
      recoveryHandled = true
      router.replace('/reset-password')
    }

    // Primary recovery signal: supabase-js fires PASSWORD_RECOVERY when it
    // processes a recovery token from the URL. getSession() below awaits that
    // same init, so this fires before the dashboard routing — reliable even
    // after the URL hash has been cleared (which the hash check can race).
    // New reset emails point straight at /reset-password; this only has to
    // catch links already sent to /auth/callback.
    const { data: { subscription: recoverySub } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'PASSWORD_RECOVERY') goToReset()
      }
    )

    // Check URL hash and query params for Supabase error codes
    // Supabase puts expired-link errors in the hash fragment:
    // #error=access_denied&error_code=otp_expired&error_description=...
    const hash = window.location.hash.slice(1)
    const search = window.location.search.slice(1)
    const params = new URLSearchParams(hash || search)
    const errorCode = params.get('error_code')
    const error = params.get('error')
    if (
      errorCode === 'otp_expired' ||
      (error === 'access_denied' && (hash.includes('otp_expired') || search.includes('otp_expired')))
    ) {
      setShowExpiredLink(true)
      return () => recoverySub.unsubscribe()
    }

    // Fast path: if the recovery hash is still intact, route immediately.
    if (
      new URLSearchParams(hash).get('type') === 'recovery' ||
      new URLSearchParams(search).get('type') === 'recovery'
    ) {
      goToReset()
      return () => recoverySub.unsubscribe()
    }

    // Shared post-auth routing: apply any pending username, complete a
    // pending Space join, then route. A join always wins over the dashboards
    // so a new member lands inside the Space they tapped Join on.
    const finishAuth = async (session: Session) => {
      const pendingUsername = localStorage.getItem('pending_username')
      if (pendingUsername) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ username: pendingUsername.toLowerCase() })
          .eq('id', session.user.id)
        if (!updateError) {
          localStorage.removeItem('pending_username')
        } else {
          console.error('Username update error:', updateError)
        }
      }

      const join = await completeJoinFromSession(session)
      if (join.joined && join.username) {
        router.push(`/${join.username}`)
        return
      }

      // Students get their own dashboard; creators keep the existing one.
      if (session.user.user_metadata?.role === 'student') {
        router.push('/student/dashboard')
      } else {
        router.push('/dashboard')
      }
    }

    const handleCallback = async () => {
      // supabase-js automatically detects tokens in the URL hash
      // and establishes the session. We just need to wait for it.
      const { data: { session }, error } = await supabase.auth.getSession()

      // A recovery session was handled above (PASSWORD_RECOVERY / hash) — don't
      // fall through and route it to a dashboard.
      if (recoveryHandled) return

      if (error) {
        console.error('Auth callback error:', error)
        // Even on error, this might be app-based verification
        setShowConfirmation(true)
        return
      }

      if (session) {
        await finishAuth(session)
      } else {
        // No session yet — supabase might still be processing
        // Listen for auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              subscription.unsubscribe()
              await finishAuth(session)
            }
          }
        )

        // After 3 seconds, if no session, show confirmation page
        // (user likely verified from mobile app)
        setTimeout(() => {
          subscription.unsubscribe()
          setShowConfirmation(true)
        }, 3000)
      }
    }

    handleCallback()

    return () => recoverySub.unsubscribe()
  }, [router])

  // Expired / invalid link
  if (showExpiredLink) {
    return (
      <AuthCenter>
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1A1A20] border border-[#2A2A30] flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#C9A96A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <Masthead className="text-2xl md:text-2xl mb-3">
            This verification link has expired.
          </Masthead>
          <p className="text-[#F4F1EA]/60 text-base leading-relaxed">
            Go back to the app and tap <span className="text-[#C9A96A] font-medium">&ldquo;Resend verification email&rdquo;</span> to get a new one.
          </p>
        </div>
      </AuthCenter>
    )
  }

  // Show confirmation page for app-based email verification
  if (showConfirmation) {
    return (
      <AuthCenter>
        <div className="text-center">
          {/* Success icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#1A1A20] border border-[#2A2A30] flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#C9A96A]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Confirmation message */}
          <Masthead className="text-2xl md:text-2xl mb-3">
            Email verified!
          </Masthead>
          <p className="text-[#F4F1EA]/60 text-lg mb-8">
            You&apos;re all set. {joinUsername ? 'Open your Space to join.' : 'Jump into Sssion on the web.'}
          </p>

          {/* Primary action: land the member in the Space (web is first-class). */}
          <Link
            href={joinUsername ? `/${joinUsername}` : '/student/dashboard'}
            className={`${authPrimaryBtn} inline-block w-auto px-8 py-3`}
          >
            {joinUsername ? 'Open your Space' : 'Go to your Spaces'}
          </Link>

          {/* App download — secondary. Android has no public link while it's in
              closed testing (referrals route through the founder), so it's
              plain text, not a dead link. */}
          <div className="pt-8 mt-8 border-t border-[#2A2A30]">
            <p className="text-[#F4F1EA]/40 text-sm mb-4">
              Prefer the app?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <a
                href="https://apps.apple.com/us/app/sssion/id6763607808"
                target="_blank"
                rel="noopener noreferrer"
                className={authSecondaryBtn}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>App Store</span>
              </a>
              <span className="text-[#F4F1EA]/40 text-sm">Android: coming soon</span>
            </div>
          </div>
        </div>
      </AuthCenter>
    )
  }

  // Loading state while checking session
  return (
    <AuthCenter>
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#F4F1EA] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-lg text-[#F4F1EA]/80">Verifying your account...</p>
      </div>
    </AuthCenter>
  )
}
