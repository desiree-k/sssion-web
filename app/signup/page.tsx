'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  AuthShell,
  Eyebrow,
  Masthead,
  authInput,
  authPrimaryBtn,
  authLink,
} from '@/components/auth/AuthChrome'

/**
 * One-door signup, mirroring the app: every account starts as a member
 * (role 'student', no creators row — same metadata the app's signup sends).
 * Starting a Space happens in the app only, behind policy acceptance and
 * the start_space guards. /join and /student-signup both redirect here.
 */

type View = 'form' | 'checkEmail' | 'accountExists'

function SignupInner() {
  const searchParams = useSearchParams()
  // A logged-out Join on a creator page sends the Space through signup so we
  // can land the new member back inside it after they verify (see completeJoin).
  const joinCreatorId = searchParams.get('creator')
  const joinOfferingId = searchParams.get('offering')
  const joinUsername = searchParams.get('u')

  const [view, setView] = useState<View>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Please enter your name')
      return
    }
    if (!email.trim()) {
      setError('Please enter your email')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (!agreedToTerms) {
      setError('Please agree to the Terms of Use, Privacy Policy, and Content Policy')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            role: 'student',
            full_name: name.trim(),
            // Carried through verification, then consumed by completeJoin. The
            // signup trigger ignores every key except full_name, so these are
            // safe to stash here.
            ...(joinCreatorId && joinOfferingId
              ? {
                  join_creator_id: joinCreatorId,
                  join_offering_id: joinOfferingId,
                  join_username: joinUsername,
                }
              : {}),
          },
          emailRedirectTo: 'https://sssion.studio/auth/callback',
        },
      })

      if (authError) {
        setError(authError.message)
        return
      }

      // Supabase returns a user with no identities when the email is already registered
      if (data.user && (data.user.identities?.length ?? 0) === 0) {
        setView('accountExists')
        return
      }

      // Stash the Space slug so the post-verify fallback page can offer an
      // "Open your Space" link on this device even if the session isn't
      // established there (the happy path redirects straight in via metadata).
      if (joinUsername) {
        try { localStorage.setItem('join_username', joinUsername) } catch { /* ignore */ }
      }

      setView('checkEmail')
    } catch (err) {
      console.error('Sign up error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell headerLink={{ label: 'Sign In', href: '/student-signin' }}>
      {view === 'form' && (
        <div className="space-y-8">
          <div className="text-center">
            <Eyebrow>Step one</Eyebrow>
            <Masthead className="mb-3">Create your account</Masthead>
            <p className="text-[#F4F1EA]/60">
              One account for everything — join communities, and start
              your own Space in the app
            </p>
          </div>

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#F4F1EA]/70 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={authInput}
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#F4F1EA]/70 mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className={authInput}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#F4F1EA]/70 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className={authInput}
              />
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-[#2A2A30] bg-[#1A1A20] accent-[#F4F1EA]"
              />
              <span className="text-sm text-[#F4F1EA]/60">
                I agree to the{' '}
                <a href="/terms" target="_blank" className={authLink}>
                  Terms of Use
                </a>
                ,{' '}
                <a href="/privacy" target="_blank" className={authLink}>
                  Privacy Policy
                </a>
                , and{' '}
                <a href="/content-policy" target="_blank" className={authLink}>
                  Content Policy
                </a>
              </span>
            </label>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className={authPrimaryBtn}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-[#F4F1EA]/40 text-sm">
            Already have an account?{' '}
            <a href="/student-signin" className={authLink}>
              Sign in
            </a>
          </p>
        </div>
      )}

      {view === 'checkEmail' && (
        <div className="space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 bg-[#1A1A20] border border-[#2A2A30] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#C9A96A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <Masthead className="text-2xl md:text-2xl mb-3">Check your email to verify</Masthead>
            <p className="text-[#F4F1EA]/60">
              We sent a verification link to{' '}
              <span className="text-[#F4F1EA]">{email.trim()}</span>.
            </p>
          </div>

          {/* The app is where everything happens — including starting a Space */}
          <div className="bg-[#1A1A20] rounded-xl p-5 border border-[#2A2A30]">
            <p className="text-sm text-[#F4F1EA]/60 mb-3">
              Download Sssion to join communities — and start your own Space
            </p>
            <a
              href="https://apps.apple.com/us/app/sssion/id6763607808"
              target="_blank"
              rel="noopener noreferrer"
              className={`${authPrimaryBtn} flex items-center justify-center gap-2 py-3`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download on the App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.sssion.studio"
              target="_blank"
              rel="noopener noreferrer"
              className={`${authPrimaryBtn} flex items-center justify-center gap-2 py-3 mt-3`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35zm13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27zm3.35-4.31c.34.27.59.68.59 1.19s-.25.92-.59 1.19l-2.29 1.32-2.5-2.5 2.5-2.5 2.29 1.3zM6.05 2.66l10.76 6.22-2.27 2.27L6.05 2.66z"/>
              </svg>
              Get it on Google Play
            </a>
          </div>

          <p className="text-center text-[#F4F1EA]/40 text-sm">
            Prefer the web? Verify your email, then{' '}
            <a href="/student-signin" className={authLink}>
              sign in
            </a>{' '}
            to explore Spaces.
          </p>
        </div>
      )}

      {view === 'accountExists' && (
        <div className="space-y-8 text-center">
          <div className="w-20 h-20 bg-amber-500/15 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div>
            <Masthead className="text-2xl md:text-2xl mb-3">Account exists</Masthead>
            <p className="text-[#F4F1EA]/60">
              An account with <span className="text-[#F4F1EA]">{email.trim()}</span>{' '}
              already exists. Sign in with your existing account instead.
            </p>
          </div>

          <a href="/student-signin" className={`${authPrimaryBtn} inline-block w-auto px-8 py-3`}>
            Sign In
          </a>

          <button
            onClick={() => setView('form')}
            className="block mx-auto text-[#F4F1EA]/40 text-sm hover:text-[#F4F1EA]/60 transition-colors"
          >
            &larr; Back to sign up
          </button>
        </div>
      )}
    </AuthShell>
  )
}

export default function SignupPage() {
  // useSearchParams requires a Suspense boundary in this Next version.
  return (
    <Suspense fallback={null}>
      <SignupInner />
    </Suspense>
  )
}
