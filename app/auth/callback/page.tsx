'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState('Verifying your email...')

  useEffect(() => {
    handleCallback()
  }, [])

  const handleCallback = async () => {
    try {
      const code = searchParams.get('code')

      if (!code) {
        setStatus('Invalid verification link')
        setTimeout(() => router.push('/signin'), 2000)
        return
      }

      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('Error exchanging code:', error)
        setStatus('Verification failed. Please try again.')
        setTimeout(() => router.push('/signin'), 2000)
        return
      }

      if (!data.user) {
        setStatus('Verification failed. Please try again.')
        setTimeout(() => router.push('/signin'), 2000)
        return
      }

      setStatus('Email verified! Setting up your account...')

      // Check for pending username from signup flow
      const pendingUsername = localStorage.getItem('pending_username')
      if (pendingUsername) {
        console.log('Found pending username, applying:', pendingUsername)

        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ username: pendingUsername })
          .eq('id', data.user.id)
          .select()
          .single()

        if (updatedProfile) {
          console.log('Username updated successfully:', updatedProfile)
          localStorage.removeItem('pending_username')
        } else {
          console.error('Failed to update username:', updateError)
          // Continue anyway - user can update in app
        }
      }

      setStatus('Success! Redirecting to dashboard...')
      router.push('/dashboard')
    } catch (err) {
      console.error('Callback error:', err)
      setStatus('An error occurred. Redirecting...')
      setTimeout(() => router.push('/signin'), 2000)
    }
  }

  return (
    <div className="text-center">
      <div className="w-12 h-12 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
      <p className="text-lg text-white/80">{status}</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <Suspense
        fallback={
          <div className="text-center">
            <div className="w-12 h-12 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin mx-auto mb-6" />
            <p className="text-lg text-white/80">Loading...</p>
          </div>
        }
      >
        <CallbackHandler />
      </Suspense>
    </div>
  )
}
