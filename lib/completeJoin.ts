import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface JoinResult {
  /** True when this session carried join metadata (whether or not every
   *  write succeeded) — the caller should route to the Space, not a dashboard. */
  joined: boolean
  /** The Space slug to land the member on, if known. */
  username: string | null
}

/**
 * Finishes a "tap Join on a creator page → sign up → verify" flow.
 *
 * A logged-out Join stashes join_* in the user's signup metadata (see
 * app/signup). Once the account is verified and a session exists, we mirror
 * OfferingCards.join(): insert the member_offerings row with the same status
 * logic, auto-follow the creator, then clear the metadata so a later
 * verification or revisit can't re-run it.
 *
 * No-ops (returns { joined: false }) when there's no join metadata, preserving
 * the pre-existing post-verify behaviour for plain signups.
 */
export async function completeJoinFromSession(session: Session): Promise<JoinResult> {
  const meta = session.user.user_metadata || {}
  const offeringId = meta.join_offering_id as string | undefined
  const creatorId = meta.join_creator_id as string | undefined
  const username = (meta.join_username as string | undefined) || null

  if (!offeringId || !creatorId) return { joined: false, username: null }

  try {
    // Look up the offering so we can apply the exact status logic the
    // logged-in join uses (active only for free + auto_approve + is_active).
    const { data: offering } = await supabase
      .from('offerings')
      .select('id, is_free, auto_approve, is_active, creator_id, access_duration_days')
      .eq('id', offeringId)
      .maybeSingle()

    if (offering) {
      const autoApproved = !!(offering.is_free && offering.auto_approve && offering.is_active)
      const expiresAt = offering.access_duration_days
        ? new Date(Date.now() + offering.access_duration_days * 86400000).toISOString()
        : null

      const { error: insertError } = await supabase
        .from('member_offerings')
        .insert({
          user_id: session.user.id,
          offering_id: offering.id,
          creator_id: offering.creator_id,
          status: autoApproved ? 'active' : 'pending',
          ...(autoApproved
            ? { granted_at: new Date().toISOString(), expires_at: expiresAt }
            : {}),
        })
      // 23505 = the unique index already has a pending/active row for this
      // (user, offering) — already requested, treat as success.
      if (insertError && insertError.code !== '23505') {
        console.error('completeJoin: member_offerings insert failed', insertError)
      }
    } else {
      console.error('completeJoin: offering not found', offeringId)
    }

    // Auto-follow, mirroring the app's ensureFollow() on every join. Skip if
    // a follow already exists; tolerate a racing duplicate (23505).
    const { data: existingFollow } = await supabase
      .from('follows')
      .select('id')
      .eq('follower_id', session.user.id)
      .eq('creator_id', creatorId)
      .maybeSingle()
    if (!existingFollow) {
      const { error: followError } = await supabase
        .from('follows')
        .insert({ follower_id: session.user.id, creator_id: creatorId })
      if (followError && followError.code !== '23505') {
        console.error('completeJoin: follow insert failed', followError)
      }
    }
  } catch (err) {
    console.error('completeJoin error:', err)
  } finally {
    // Clear the join_* keys so re-verifying or revisiting doesn't re-run this.
    try {
      await supabase.auth.updateUser({
        data: { join_creator_id: null, join_offering_id: null, join_username: null },
      })
    } catch (err) {
      console.error('completeJoin: could not clear join metadata', err)
    }
  }

  return { joined: true, username }
}
