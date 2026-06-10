'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [showExpiredLink, setShowExpiredLink] = useState(false)

  useEffect(() => {
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
      return
    }

    const handleCallback = async () => {
      // supabase-js automatically detects tokens in the URL hash
      // and establishes the session. We just need to wait for it.
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth callback error:', error)
        // Even on error, this might be app-based verification
        setShowConfirmation(true)
        return
      }

      if (session) {
        // Session established — check for pending username
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
        // Students get their own dashboard; creators keep the existing one
        if (session.user.user_metadata?.role === 'student') {
          router.push('/student/dashboard')
        } else {
          router.push('/dashboard')
        }
      } else {
        // No session yet — supabase might still be processing
        // Listen for auth state change
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            if (event === 'SIGNED_IN' && session) {
              const pendingUsername = localStorage.getItem('pending_username')
              if (pendingUsername) {
                await supabase
                  .from('profiles')
                  .update({ username: pendingUsername.toLowerCase() })
                  .eq('id', session.user.id)
                localStorage.removeItem('pending_username')
              }
              subscription.unsubscribe()
              if (session.user.user_metadata?.role === 'student') {
                router.push('/student/dashboard')
              } else {
                router.push('/dashboard')
              }
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
  }, [router])

  // Expired / invalid link
  if (showExpiredLink) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold text-[#B76E79] mb-8">Sssion</h1>
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#B76E79]/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#B76E79]"
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
          <h2 className="text-2xl font-semibold text-white mb-3">
            This verification link has expired.
          </h2>
          <p className="text-white/60 text-base leading-relaxed">
            Go back to the app and tap <span className="text-[#B76E79] font-medium">&ldquo;Resend verification email&rdquo;</span> to get a new one.
          </p>
        </div>
      </div>
    )
  }

  // Show confirmation page for app-based email verification
  if (showConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          {/* Logo */}
          <h1 className="text-4xl font-bold text-[#B76E79] mb-8">Sssion</h1>

          {/* Success icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#B76E79]/20 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-[#B76E79]"
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
          <h2 className="text-2xl font-semibold text-white mb-3">
            Email verified!
          </h2>
          <p className="text-white/60 text-lg mb-8">
            You&apos;re all set. Head back to the Sssion app to sign in.
          </p>

          {/* App download section */}
          <div className="pt-6 border-t border-white/10">
            <p className="text-white/40 text-sm mb-4">
              Don&apos;t have the app yet?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://apps.apple.com/us/app/sssion/id6763607808"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span className="text-white/80">App Store</span>
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                </svg>
                <span className="text-white/80">Google Play</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading state while checking session
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-lg text-white/80">Verifying your account...</p>
      </div>
    </div>
  )
}
