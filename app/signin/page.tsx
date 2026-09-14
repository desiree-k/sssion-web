'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  AuthShell,
  Eyebrow,
  Masthead,
  authInput,
  authPrimaryBtn,
  authLink,
} from '@/components/auth/AuthChrome'

type View = 'form' | 'studentMessage' | 'forgotPassword' | 'resetSent'

export default function SignInPage() {
  const router = useRouter()
  const [view, setView] = useState<View>('form')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      setError('Please enter your email and password')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        if (authError.message.includes('Email not confirmed')) {
          setError('Please check your email and verify your account first')
        } else if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password')
        } else {
          setError(authError.message)
        }
        return
      }

      if (data.user) {
        router.push('/dashboard')
      }
    } catch (err: any) {
      console.error('Sign in error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendReset = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError('Please enter your email')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: 'https://sssion.studio/reset-password',
      })

      if (resetError) {
        setError(resetError.message)
        return
      }

      setView('resetSent')
    } catch (err) {
      console.error('Password reset error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell headerLink={{ label: 'Create Account', href: '/join' }}>
      {view === 'form' && (
        <div className="space-y-8">
          <div className="text-center">
            <Eyebrow>Welcome back</Eyebrow>
            <Masthead className="mb-3">Creator sign in</Masthead>
            <p className="text-[#F4F1EA]/60">Access your studio dashboard</p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-5">
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
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-[#F4F1EA]/70">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError(null)
                    setView('forgotPassword')
                  }}
                  className={`text-sm ${authLink}`}
                >
                  Forgot password?
                </button>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={authInput}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className={authPrimaryBtn}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="space-y-4 pt-4">
            <p className="text-center text-[#F4F1EA]/40 text-sm">
              Don&apos;t have an account?{' '}
              <a href="/join" className={authLink}>
                Join here
              </a>
            </p>

            <div className="border-t border-[#2A2A30] pt-4">
              <button
                onClick={() => setView('studentMessage')}
                className="w-full text-center text-[#F4F1EA]/40 text-sm hover:text-[#F4F1EA]/60 transition-colors"
              >
                I&apos;m a student &rarr;
              </button>
            </div>
          </div>
        </div>
      )}

      {view === 'studentMessage' && (
        <div className="space-y-8 text-center">
          <div className="w-20 h-20 bg-[#1A1A20] border border-[#2A2A30] rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-[#C9A96A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>

          <div>
            <Masthead className="text-2xl md:text-2xl mb-3">Download the Sssion app</Masthead>
            <p className="text-[#F4F1EA]/60">
              Students access studios through the Sssion mobile app
            </p>
          </div>

          <div className="space-y-4">
            <a
              href="https://apps.apple.com/us/app/sssion/id6763607808"
              target="_blank"
              rel="noopener noreferrer"
              className={`${authPrimaryBtn} flex items-center justify-center gap-2`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              Download on the App Store
            </a>
            <p className="text-xs text-[#F4F1EA]/40">
              Available now on the App Store
            </p>
          </div>

          <a href="/discover" className={`inline-block ${authLink}`}>
            Browse creators on web &rarr;
          </a>

          <button
            onClick={() => setView('form')}
            className="block mx-auto text-[#F4F1EA]/40 text-sm hover:text-[#F4F1EA]/60 transition-colors"
          >
            &larr; Back to creator sign in
          </button>
        </div>
      )}

      {view === 'forgotPassword' && (
        <div className="space-y-8">
          <div className="text-center">
            <Masthead className="mb-3">Reset password</Masthead>
            <p className="text-[#F4F1EA]/60">
              Enter your email and we&apos;ll send you a reset link
            </p>
          </div>

          <form onSubmit={handleSendReset} className="space-y-5">
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
                autoFocus
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading} className={authPrimaryBtn}>
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <button
            onClick={() => {
              setError(null)
              setView('form')
            }}
            className="block mx-auto text-[#F4F1EA]/40 text-sm hover:text-[#F4F1EA]/60 transition-colors"
          >
            &larr; Back to sign in
          </button>
        </div>
      )}

      {view === 'resetSent' && (
        <div className="space-y-8 text-center">
          <div className="w-20 h-20 bg-[#1A1A20] border border-[#2A2A30] rounded-full flex items-center justify-center mx-auto">
            <svg className="w-10 h-10 text-[#C9A96A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div>
            <Masthead className="text-2xl md:text-2xl mb-3">Reset link sent</Masthead>
            <p className="text-[#F4F1EA]/60">
              Check your inbox at <span className="text-[#F4F1EA]">{email.trim()}</span>{' '}
              for a link to reset your password.
            </p>
          </div>

          <button
            onClick={() => setView('form')}
            className="text-[#F4F1EA]/40 text-sm hover:text-[#F4F1EA]/60 transition-colors"
          >
            &larr; Back to sign in
          </button>
        </div>
      )}
    </AuthShell>
  )
}
