'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { EmailOtpType } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { completeJoinFromSession } from '@/lib/completeJoin'
import { AuthCenter, Masthead, authPrimaryBtn } from '@/components/auth/AuthChrome'

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

      // A pending Space join (tapped Join → signed up) wins over the
      // dashboards, so the new member lands inside the Space.
      const join = await completeJoinFromSession(data.session)
      if (join.joined && join.username) {
        router.replace(`/${join.username}`)
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
    <AuthCenter>
      {stage === 'verifying' && (
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#F4F1EA] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-lg text-[#F4F1EA]/80">Signing you in...</p>
        </div>
      )}

      {stage === 'expired' && (
        <div className="text-center">
          <Masthead className="text-2xl md:text-2xl mb-3">
            This link is invalid or expired
          </Masthead>
          <p className="text-[#F4F1EA]/60 leading-relaxed">
            Sign-in links only work once and time out after a while. Head back
            to sign in and we&apos;ll send you a fresh one.
          </p>
          <a
            href="/signin"
            className={`${authPrimaryBtn} inline-block w-auto mt-6 px-6 py-3`}
          >
            Sign In
          </a>
        </div>
      )}
    </AuthCenter>
  )
}
