'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      // supabase-js automatically detects tokens in the URL hash
      // and establishes the session. We just need to wait for it.
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        console.error('Auth callback error:', error)
        router.push('/signin')
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
        router.push('/dashboard')
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
              router.push('/dashboard')
            }
          }
        )

        // Timeout after 10 seconds
        setTimeout(() => {
          subscription.unsubscribe()
          router.push('/signin?error=timeout')
        }, 10000)
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
        <p className="text-lg text-white/80">Verifying your account...</p>
      </div>
    </div>
  )
}
