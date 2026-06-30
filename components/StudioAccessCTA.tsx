'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

type AccessState = 'loading' | 'signedOut' | 'creator' | 'none' | 'pending' | 'approved'

interface StudioAccessCTAProps {
  creatorId: string
  /**
   * Wording for the request button. 'Request Access' (studio mode) or
   * 'Request to Join' (gathering mode).
   */
  joinLabel?: string
}

export default function StudioAccessCTA({ creatorId, joinLabel = 'Request Access' }: StudioAccessCTAProps) {
  const [state, setState] = useState<AccessState>('loading')
  const [existingRequestId, setExistingRequestId] = useState<string | null>(null)
  const [studentId, setStudentId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAccess = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (!session) {
          setState('signedOut')
          return
        }
        if (session.user.user_metadata?.role === 'creator') {
          setState('creator')
          return
        }

        setStudentId(session.user.id)

        const { data: access } = await supabase
          .from('studio_access')
          .select('id, status')
          .eq('student_id', session.user.id)
          .eq('creator_id', creatorId)
          .maybeSingle()

        if (access?.status === 'approved') {
          setState('approved')
        } else if (access?.status === 'pending') {
          setState('pending')
        } else {
          // No request yet, or a previously revoked one we can re-submit
          setExistingRequestId(access?.id ?? null)
          setState('none')
        }
      } catch (err) {
        console.error('Error loading studio access:', err)
        setState('signedOut')
      }
    }

    loadAccess()
  }, [creatorId])

  const handleRequestAccess = async () => {
    if (!studentId) return

    setIsSubmitting(true)
    setError(null)

    try {
      if (existingRequestId) {
        const { error: updateError } = await supabase
          .from('studio_access')
          .update({ status: 'pending' })
          .eq('id', existingRequestId)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from('studio_access').insert({
          student_id: studentId,
          creator_id: creatorId,
          status: 'pending',
        })
        if (insertError) throw insertError
      }

      setState('pending')
    } catch (err) {
      console.error('Error requesting access:', err)
      setError('Could not send your request. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Creators viewing a studio page don't need an access CTA
  if (state === 'loading' || state === 'creator') return null

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      {state === 'signedOut' && (
        <>
          <Link
            href="/student-signup"
            className="px-8 py-3 border border-[#B76E79] text-[#B76E79] font-semibold rounded-full hover:bg-[#B76E79]/10 transition-colors"
          >
            Sign up to {joinLabel.toLowerCase()}
          </Link>
          <p className="text-white/40 text-xs text-center max-w-xs">
            Access more content and join the community
          </p>
          <p className="text-white/40 text-sm">
            Already have an account?{' '}
            <Link href="/student-signin" className="text-[#B76E79] hover:underline">
              Sign in
            </Link>
          </p>
        </>
      )}

      {state === 'none' && (
        <>
          <button
            onClick={handleRequestAccess}
            disabled={isSubmitting}
            className="px-8 py-3 border border-[#B76E79] text-[#B76E79] font-semibold rounded-full hover:bg-[#B76E79]/10 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Requesting...' : joinLabel}
          </button>
          <p className="text-white/40 text-xs text-center max-w-xs">
            Access more content and join the community
          </p>
        </>
      )}

      {state === 'pending' && (
        <div className="px-10 py-4 bg-amber-500/15 text-amber-400 font-semibold rounded-full cursor-default">
          Request Pending
        </div>
      )}

      {state === 'approved' && (
        <Link
          href={`/student/studio/${creatorId}`}
          className="px-10 py-4 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
        >
          Enter Studio
        </Link>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
