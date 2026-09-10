'use client'

import { useEffect, useState } from 'react'
import type { EmailOtpType } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// 'verifying' — establishing a session from the link
// 'form'      — session confirmed, collect the new password
// 'success'   — password updated
// 'missing'   — no token in the URL at all
// 'expired'   — token present but rejected (expired / already used)
type Stage = 'verifying' | 'form' | 'success' | 'missing' | 'expired'

export default function ResetPasswordPage() {
  const [stage, setStage] = useState<Stage>('verifying')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const establishSession = async () => {
      // Supabase may bounce here with the error already in the URL when the
      // token is dead on arrival (?error=access_denied&error_code=otp_expired,
      // sometimes in the hash fragment instead of the query string).
      const search = new URLSearchParams(window.location.search)
      const hash = new URLSearchParams(window.location.hash.slice(1))
      if (
        search.get('error') || search.get('error_code') ||
        hash.get('error') || hash.get('error_code')
      ) {
        setStage('expired')
        return
      }

      // Primary flow: cross-client recovery. The email links straight here with
      // ?token_hash=...&type=recovery. verifyOtp needs no PKCE code-verifier, so
      // it works when the reset was requested in the app and opened in Safari.
      const tokenHash = search.get('token_hash')
      const type = (search.get('type') as EmailOtpType | null) ?? 'recovery'
      if (tokenHash) {
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type,
        })
        setStage(!verifyError && data.session ? 'form' : 'expired')
        return
      }

      // Backward support: web-initiated PKCE links land with ?code=.
      const code = search.get('code')
      if (code) {
        const { data, error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code)
        setStage(!exchangeError && data.session ? 'form' : 'expired')
        return
      }

      // Nothing to work with. If a recovery session somehow already exists
      // (e.g. a re-render after a successful verify), keep the form.
      const { data: { session } } = await supabase.auth.getSession()
      setStage(session ? 'form' : 'missing')
    }

    establishSession()
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
      // Update failed — stay on the form so they can retry.
      setError(updateError.message || 'Something went wrong updating your password. Please try again.')
      return
    }
    setStage('success')
  }

  const RequestNewLink = () => (
    <a
      href="/signin"
      className="inline-block mt-6 px-6 py-3 bg-[#B76E79] hover:bg-[#a05f69] text-[#F4F1EA] font-semibold rounded-full transition-colors"
    >
      Request a new link
    </a>
  )

  return (
    <div className="min-h-screen bg-[#0E0E12] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-[#B76E79] mb-10 text-center">Sssion</h1>

        {stage === 'verifying' && (
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-lg text-[#F4F1EA]/80">Checking your reset link...</p>
          </div>
        )}

        {stage === 'missing' && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#F4F1EA] mb-3">
              No reset link found
            </h2>
            <p className="text-[#F4F1EA]/60 leading-relaxed">
              Open the password reset link directly from your email. If you typed
              this address in by hand, request a new link to get started.
            </p>
            <RequestNewLink />
          </div>
        )}

        {stage === 'expired' && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#F4F1EA] mb-3">
              This reset link isn&apos;t valid anymore
            </h2>
            <p className="text-[#F4F1EA]/60 leading-relaxed">
              Password reset links only work once and expire after a while. This
              one has already been used or has timed out — request a new one and
              try again.
            </p>
            <RequestNewLink />
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
