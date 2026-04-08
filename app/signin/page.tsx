'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showStudentMessage, setShowStudentMessage] = useState(false)

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="py-6 px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#B76E79]">
            Sssion
          </a>
          <a
            href="/join"
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            Create Account
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {!showStudentMessage ? (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">
                  Creator Sign In
                </h1>
                <p className="text-white/60">
                  Access your studio dashboard
                </p>
              </div>

              <form onSubmit={handleSignIn} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 bg-[#16162a] border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#B76E79] transition-colors"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 bg-[#16162a] border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#B76E79] transition-colors"
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
                  className="w-full py-4 bg-[#B76E79] text-white font-semibold rounded-xl hover:bg-[#a05f69] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="space-y-4 pt-4">
                <p className="text-center text-white/40 text-sm">
                  Don&apos;t have an account?{' '}
                  <a href="/join" className="text-[#B76E79] hover:underline">
                    Join here
                  </a>
                </p>

                <div className="border-t border-white/10 pt-4">
                  <button
                    onClick={() => setShowStudentMessage(true)}
                    className="w-full text-center text-white/40 text-sm hover:text-white/60 transition-colors"
                  >
                    I&apos;m a student &rarr;
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 text-center">
              <div className="w-20 h-20 bg-[#B76E79]/20 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-10 h-10 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl font-bold mb-3">
                  Download the Sssion App
                </h2>
                <p className="text-white/60">
                  Students access studios through the Sssion mobile app
                </p>
              </div>

              <div className="space-y-4">
                <a
                  href="https://testflight.apple.com/join/PLACEHOLDER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-4 bg-[#B76E79] text-white font-semibold rounded-xl hover:bg-[#a05f69] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  Download on TestFlight
                </a>
                <p className="text-xs text-white/40">
                  Coming soon to the App Store
                </p>
              </div>

              <a
                href="/discover"
                className="inline-block text-[#B76E79] hover:underline"
              >
                Browse creators on web &rarr;
              </a>

              <button
                onClick={() => setShowStudentMessage(false)}
                className="text-white/40 text-sm hover:text-white/60 transition-colors"
              >
                &larr; Back to creator sign in
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <a href="/" className="text-white/40 text-sm hover:text-white/60 transition-colors">
            &larr; Back to sssion.studio
          </a>
        </div>
      </footer>
    </div>
  )
}
