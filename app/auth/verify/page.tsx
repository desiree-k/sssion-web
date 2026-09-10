'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EmailOtpType } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// 'verifying' — exchanging the token for a session
// 'expired'   — no token, or the token was rejected (invalid / expired / used)
type Stage = 'verifying' | 'expired'

// Token types we accept here. 'magiclink' is the live flow; 'email'/'signup'
// cover confirmation links if we ever turn those on.
const ALLOWED_TYPES: EmailOtpType[] = ['magiclink', 'email', 'signup']

export default function VerifyPage() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('verifying')

  useEffect(() => {
    const verify = async () => {
      // Supabase may bounce here with the error already in the URL when the
      // token is dead on arrival (?error=access_denied&error_code=otp_expired),
      // sometimes in the hash fragment instead of the query string.
      const search = new URLSearchParams(window.location.search)
      const hash = new URLSearchParams(window.location.hash.slice(1))
      if (
        search.get('error') || search.get('error_code') ||
        hash.get('error') || hash.get('error_code')
      ) {
        setStage('expired')
        return
      }

      const tokenHash = search.get('token_hash')
      const rawType = search.get('type')
      const type = (ALLOWED_TYPES.includes(rawType as EmailOtpType)
        ? (rawType as EmailOtpType)
        : 'magiclink')

      if (!tokenHash) {
        setStage('expired')
        return
      }

      const { data, error: verifyError } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      })

      if (verifyError || !data.session) {
        setStage('expired')
        return
      }

      // Signed in — students get their own dashboard, creators land on My Studios.
      if (data.session.user.user_metadata?.role === 'student') {
        router.replace('/student/dashboard')
      } else {
        router.replace('/dashboard')
      }
    }

    verify()
  }, [router])

  return (
    <div className="min-h-screen bg-[#0E0E12] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <h1 className="text-4xl font-bold text-[#B76E79] mb-10 text-center">Sssion</h1>

        {stage === 'verifying' && (
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-lg text-[#F4F1EA]/80">Signing you in...</p>
          </div>
        )}

        {stage === 'expired' && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-[#F4F1EA] mb-3">
              This link is invalid or expired
            </h2>
            <p className="text-[#F4F1EA]/60 leading-relaxed">
              Sign-in links only work once and time out after a while. Head back
              to sign in and we&apos;ll send you a fresh one.
            </p>
            <a
              href="/signin"
              className="inline-block mt-6 px-6 py-3 bg-[#B76E79] hover:bg-[#a05f69] text-[#F4F1EA] font-semibold rounded-full transition-colors"
            >
              Sign In
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
