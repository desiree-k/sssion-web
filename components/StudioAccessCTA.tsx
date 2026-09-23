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
  /**
   * Route slug for this Space. Signed-out visitors carry it through signup
   * (?creator&u) so they land back here after verifying. There's no offering
   * to join on this path (this CTA renders only when the Space has no active
   * offerings), so no ?offering param.
   */
  username?: string
}

export default function StudioAccessCTA({ creatorId, joinLabel = 'Request Access', username }: StudioAccessCTAProps) {
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

        // Access can come from a legacy studio_access grant OR an active
        // offering purchase (member_offerings) — check both.
        const [{ data: access }, { data: offeringRows }] = await Promise.all([
          supabase
            .from('studio_access')
            .select('id, status')
            .eq('student_id', session.user.id)
            .eq('creator_id', creatorId)
            .maybeSingle(),
          supabase
            .from('member_offerings')
            .select('expires_at')
            .eq('user_id', session.user.id)
            .eq('creator_id', creatorId)
            .eq('status', 'active'),
        ])

        // An active offering only grants access while unexpired — matches the
        // studio interior / watch gates so this CTA and those agree.
        const hasActiveOffering = (offeringRows || []).some(
          (r) => !r.expires_at || new Date(r.expires_at) > new Date()
        )

        if (access?.status === 'approved' || hasActiveOffering) {
          // Already a member — the hero "Enter Space" button handles entry.
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

  // Creators viewing a studio page don't need an access CTA. Members who
  // already have access see the hero "Enter Space" button instead, so this
  // request CTA hides for the 'approved' state too.
  if (state === 'loading' || state === 'creator' || state === 'approved') return null

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      {state === 'signedOut' && (
        <>
          <Link
            href={username
              ? `/signup?creator=${encodeURIComponent(creatorId)}&u=${encodeURIComponent(username)}`
              : '/signup'}
            className="px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] rounded-[var(--pt-radius,9999px)] transition-opacity hover:opacity-85 bg-[var(--pt-btn-bg,transparent)] text-[var(--pt-btn-text,#B76E79)] border border-[var(--pt-btn-bg,#B76E79)]"
          >
            Sign up to {joinLabel.toLowerCase()}
          </Link>
          <p className="text-[var(--pt-text2,#ffffff66)] text-xs text-center max-w-xs">
            Access more content and join the community
          </p>
          <p className="text-[var(--pt-text2,#ffffff66)] text-sm">
            Already have an account?{' '}
            <Link
              href="/student-signin"
              className="hover:underline text-[var(--pt-accent,#B76E79)]"
            >
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
            className="px-8 py-3 text-xs font-semibold uppercase tracking-[0.16em] rounded-[var(--pt-radius,9999px)] transition-opacity hover:opacity-85 disabled:opacity-50 bg-[var(--pt-btn-bg,transparent)] text-[var(--pt-btn-text,#B76E79)] border border-[var(--pt-btn-bg,#B76E79)]"
          >
            {isSubmitting ? 'Requesting...' : joinLabel}
          </button>
          <p className="text-[var(--pt-text2,#ffffff66)] text-xs text-center max-w-xs">
            Access more content and join the community
          </p>
        </>
      )}

      {state === 'pending' && (
        <div className="px-10 py-4 bg-amber-500/15 text-amber-400 font-semibold rounded-full cursor-default">
          Request Pending
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  )
}
