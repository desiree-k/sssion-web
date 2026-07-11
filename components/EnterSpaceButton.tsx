'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

/**
 * Prominent "Enter Space" button for members who already have access to a
 * creator's space. Access can come from either a legacy studio_access grant
 * or an active offering purchase (member_offerings) — we check both.
 *
 * Renders nothing while loading, for signed-out visitors, or for people
 * without access. Self-gating so it can sit in the hero unconditionally.
 */
export default function EnterSpaceButton({ creatorId }: { creatorId: string }) {
  const [hasAccess, setHasAccess] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let active = true

    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (active) setReady(true)
        return
      }
      const userId = session.user.id

      const [{ data: legacyAccess }, { data: offeringAccess }] = await Promise.all([
        supabase
          .from('studio_access')
          .select('status')
          .eq('student_id', userId)
          .eq('creator_id', creatorId)
          .eq('status', 'approved')
          .maybeSingle(),
        supabase
          .from('member_offerings')
          .select('status')
          .eq('user_id', userId)
          .eq('creator_id', creatorId)
          .eq('status', 'active')
          .maybeSingle(),
      ])

      if (active) {
        setHasAccess(!!(legacyAccess || offeringAccess))
        setReady(true)
      }
    }

    check().catch((err) => {
      console.error('Error checking space access:', err)
      if (active) setReady(true)
    })

    return () => {
      active = false
    }
  }, [creatorId])

  if (!ready || !hasAccess) return null

  return (
    <Link
      href={`/student/studio/${creatorId}`}
      className="px-10 py-4 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
    >
      Enter Space
    </Link>
  )
}
