'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type View = 'form' | 'needsVerification' | 'forgotPassword' | 'resetSent'

export default function StudentSignInPage() {
  const router = useRouter()
  const [view, setView] = useState<View>('form')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendMessage, setResendMessage] = useState<string | null>(null)

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
          setView('needsVerification')
        } else if (authError.message.includes('Invalid login credentials')) {
          setError('Invalid email or password')
        } else {
          setError(authError.message)
        }
        return
      }

      if (data.user) {
        // Creators who land here get sent to their own dashboard
        if (data.user.user_metadata?.role === 'creator') {
          router.push('/dashboard')
        } else {
          router.push('/student/dashboard')
        }
      }
    } catch (err) {
      console.error('Sign in error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setIsResending(true)
    setResendMessage(null)
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email.trim(),
        options: { emailRedirectTo: 'https://sssion.studio/auth/callback' },
      })
      setResendMessage(
        resendError ? resendError.message : 'Verification email sent! Check your inbox.'
      )
    } catch (err) {
      console.error('Resend error:', err)
      setResendMessage('Could not resend the email. Please try again.')
    } finally {
      setIsResending(false)
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

  const inputClass =
    'w-full px-4 py-3 bg-[#1A1A20] border border-white/20 rounded-xl text-[#F4F1EA] placeholder:text-[#F4F1EA]/30 focus:outline-none focus:border-[#B76E79] transition-colors'

  return (
    <div className="min-h-screen bg-[#0E0E12] flex flex-col">
      {/* Header */}
      <header className="py-6 px-6 border-b border-[#2A2A30]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#B76E79]">
            Sssion
          </a>
          <a
            href="/student-signup"
            className="text-[#F4F1EA]/60 hover:text-[#F4F1EA] text-sm transition-colors"
          >
            Create Account
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {view === 'form' && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  Student Sign In
                </h1>
                <p className="text-[#F4F1EA]/60">
                  Access your studios and keep learning
                </p>
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
                    className={inputClass}
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
                      className="text-sm text-[#B76E79] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className={inputClass}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#B76E79] text-[#F4F1EA] font-semibold rounded-xl hover:bg-[#a05f69] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="space-y-4 pt-4">
                <p className="text-center text-[#F4F1EA]/40 text-sm">
                  Don&apos;t have an account?{' '}
                  <a href="/student-signup" className="text-[#B76E79] hover:underline">
                    Sign up
                  </a>
                </p>
                <p className="text-center text-[#F4F1EA]/40 text-sm border-t border-[#2A2A30] pt-4">
                  Are you a creator?{' '}
                  <a href="/signin" className="text-[#B76E79] hover:underline">
                    Creator sign in
                  </a>
                </p>
              </div>
            </div>
          )}

          {view === 'needsVerification' && (
            <div className="space-y-8 text-center">
              <div className="w-20 h-20 bg-amber-500/15 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">Verify your email first</h2>
                <p className="text-[#F4F1EA]/60">
                  Your account isn&apos;t verified yet. Check your inbox at{' '}
                  <span className="text-[#F4F1EA]">{email.trim()}</span> for the
                  verification link, then sign in again.
                </p>
              </div>

              {resendMessage && (
                <p className="text-sm text-[#B76E79]">{resendMessage}</p>
              )}

              <div className="space-y-3">
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className="w-full py-3 bg-[#B76E79] text-[#F4F1EA] font-semibold rounded-xl hover:bg-[#a05f69] transition-colors disabled:opacity-50"
                >
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </button>
                <button
                  onClick={() => {
                    setResendMessage(null)
                    setView('form')
                  }}
                  className="text-[#F4F1EA]/40 text-sm hover:text-[#F4F1EA]/60 transition-colors"
                >
                  &larr; Back to sign in
                </button>
              </div>
            </div>
          )}

          {view === 'forgotPassword' && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-3">Reset Password</h1>
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
                    className={inputClass}
                    autoFocus
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <p className="text-red-400 text-sm text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 bg-[#B76E79] text-[#F4F1EA] font-semibold rounded-xl hover:bg-[#a05f69] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
              <div className="w-20 h-20 bg-[#B76E79]/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">Reset link sent</h2>
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
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-[#2A2A30]">
        <div className="max-w-6xl mx-auto text-center">
          <a href="/" className="text-[#F4F1EA]/40 text-sm hover:text-[#F4F1EA]/60 transition-colors">
            &larr; Back to sssion.studio
          </a>
        </div>
      </footer>
    </div>
  )
}
