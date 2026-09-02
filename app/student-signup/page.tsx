'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type View = 'form' | 'checkEmail' | 'accountExists'

export default function StudentSignUpPage() {
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
      setError('Please agree to the Terms of Use and Privacy Policy')
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

      setView('checkEmail')
    } catch (err) {
      console.error('Sign up error:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0E0E12] flex flex-col">
      {/* Header */}
      <header className="py-6 px-6 border-b border-[#2A2A30]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#B76E79]">
            Sssion
          </a>
          <a
            href="/student-signin"
            className="text-[#F4F1EA]/60 hover:text-[#F4F1EA] text-sm transition-colors"
          >
            Sign In
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
                  Create Your Student Account
                </h1>
                <p className="text-[#F4F1EA]/60">
                  Join studios and learn from creators you love
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
                    className="w-full px-4 py-3 bg-[#1A1A20] border border-white/20 rounded-xl text-[#F4F1EA] placeholder:text-[#F4F1EA]/30 focus:outline-none focus:border-[#B76E79] transition-colors"
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
                    className="w-full px-4 py-3 bg-[#1A1A20] border border-white/20 rounded-xl text-[#F4F1EA] placeholder:text-[#F4F1EA]/30 focus:outline-none focus:border-[#B76E79] transition-colors"
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
                    className="w-full px-4 py-3 bg-[#1A1A20] border border-white/20 rounded-xl text-[#F4F1EA] placeholder:text-[#F4F1EA]/30 focus:outline-none focus:border-[#B76E79] transition-colors"
                  />
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/20 bg-[#1A1A20] accent-[#B76E79]"
                  />
                  <span className="text-sm text-[#F4F1EA]/60">
                    I agree to the{' '}
                    <a href="/terms" target="_blank" className="text-[#B76E79] hover:underline">
                      Terms of Use
                    </a>{' '}
                    and{' '}
                    <a href="/privacy" target="_blank" className="text-[#B76E79] hover:underline">
                      Privacy Policy
                    </a>
                  </span>
                </label>

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
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <p className="text-center text-[#F4F1EA]/40 text-sm">
                Already have an account?{' '}
                <a href="/student-signin" className="text-[#B76E79] hover:underline">
                  Sign in
                </a>
              </p>
            </div>
          )}

          {view === 'checkEmail' && (
            <div className="space-y-8 text-center">
              <div className="w-20 h-20 bg-[#B76E79]/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">Check your email to verify</h2>
                <p className="text-[#F4F1EA]/60">
                  We sent a verification link to{' '}
                  <span className="text-[#F4F1EA]">{email.trim()}</span>. Verify your
                  email, then sign in to start exploring studios.
                </p>
              </div>

              <a
                href="/student-signin"
                className="inline-block px-8 py-3 bg-[#B76E79] text-[#F4F1EA] font-semibold rounded-xl hover:bg-[#a05f69] transition-colors"
              >
                Go to Sign In
              </a>
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
                <h2 className="text-2xl font-bold mb-3">Account exists</h2>
                <p className="text-[#F4F1EA]/60">
                  An account with <span className="text-[#F4F1EA]">{email.trim()}</span>{' '}
                  already exists. Sign in with your existing account instead.
                </p>
              </div>

              <a
                href="/student-signin"
                className="inline-block px-8 py-3 bg-[#B76E79] text-[#F4F1EA] font-semibold rounded-xl hover:bg-[#a05f69] transition-colors"
              >
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
