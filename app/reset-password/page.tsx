'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Stage = 'checking' | 'form' | 'success' | 'no-session'

export default function ResetPasswordPage() {
  const [stage, setStage] = useState<Stage>('checking')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let settled = false

    const settle = (next: Stage) => {
      if (settled) return
      settled = true
      setStage(next)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) settle('form')
    })

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) settle('form')
    })

    // Recovery tokens arrive in the URL hash and take a moment to process.
    const timer = setTimeout(() => settle('no-session'), 4000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timer)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }
    if (password !== confirm) {
      setError("Passwords don't match")
      return
    }
    setError(null)
    setIsSaving(true)
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setIsSaving(false)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setStage('success')
  }

  return (
    <div className="min-h-screen bg-[#0E0E12] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-[#B76E79] mb-10 text-center">Sssion</h1>

        {stage === 'checking' && (
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-lg text-[#F4F1EA]/80">Checking your reset link...</p>
          </div>
        )}

        {stage === 'no-session' && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#F4F1EA] mb-3">
              This reset link isn&apos;t valid anymore
            </h2>
            <p className="text-[#F4F1EA]/60 leading-relaxed">
              Password reset links only work once and expire after a while.
              Request a new one from the sign-in screen and try again.
            </p>
          </div>
        )}

        {stage === 'form' && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-semibold text-[#F4F1EA] mb-2 text-center">
              Set your new password
            </h2>
            <p className="text-[#F4F1EA]/50 text-sm mb-8 text-center">
              Choose something memorable — you&apos;ll use it next time you sign in.
            </p>
            <label className="block text-[#F4F1EA]/60 text-sm mb-2">New password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-3 mb-4 rounded-xl bg-white/5 border border-white/15 text-[#F4F1EA] focus:outline-none focus:border-[#B76E79] transition-colors"
            />
            <label className="block text-[#F4F1EA]/60 text-sm mb-2">Confirm password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
              className="w-full px-4 py-3 mb-6 rounded-xl bg-white/5 border border-white/15 text-[#F4F1EA] focus:outline-none focus:border-[#B76E79] transition-colors"
            />
            {error && (
              <p className="text-red-300/90 text-sm mb-4 text-center">{error}</p>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 bg-[#B76E79] hover:bg-[#a05f69] disabled:opacity-60 text-[#F4F1EA] font-semibold rounded-full transition-colors"
            >
              {isSaving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        {stage === 'success' && (
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[#B76E79]/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-[#F4F1EA] mb-3">Password updated!</h2>
            <p className="text-[#F4F1EA]/60 mb-8">You can now sign in with your new password.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="/signin"
                className="px-6 py-3 bg-[#B76E79] hover:bg-[#a05f69] text-[#F4F1EA] font-semibold rounded-full transition-colors"
              >
                Sign In
              </a>
              <a
                href="https://apps.apple.com/us/app/sssion/id6763607808"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-[#F4F1EA]/80 font-semibold rounded-full transition-colors"
              >
                Get the App
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
