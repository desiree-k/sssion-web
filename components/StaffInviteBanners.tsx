'use client'

import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Staff-invitation banners for member-facing landings.
 *
 * A studio owner invites an instructor by email; the app's
 * `claim_staff_invites_on_signup` trigger attaches the new account's user_id to
 * the pending `studio_staff` row on signup, leaving status='invited'. That
 * invitee then lands on the web with a studio_staff row keyed by their user_id
 * — which the legacy "My Studios" page (studio_access only) never surfaced.
 *
 * Accepting is a plain status update, mirroring the app's _respond:
 *   status invited → active (+ joined_at)   /  invited → removed on decline.
 * RLS ("Staff update own rows", auth.uid() = user_id) and the
 * guard_staff_self_update trigger (whitelists exactly these transitions) apply
 * identically to this anon-key + user-JWT client — no app-side complexity, so
 * we implement Accept/Decline here rather than punting to the app.
 *
 * Self-contained (does its own auth + fetch) so it can drop into any member
 * landing.
 */

interface InviteCreator {
  id: string
  display_name: string | null
  profile: { full_name: string | null } | null
}

interface StaffInvite {
  id: string
  display_title: string | null
  creator: InviteCreator | null
}

// Supabase returns joined rows as an object or a single-element array.
function first<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) return value[0] ?? null
  return value
}

function studioName(creator: InviteCreator | null): string {
  return creator?.display_name || creator?.profile?.full_name || 'A studio'
}

export default function StaffInviteBanners() {
  const [invites, setInvites] = useState<StaffInvite[]>([])
  // id → 'accepted' | 'declined' once responded, for the inline confirmation
  const [responded, setResponded] = useState<Record<string, 'accepted' | 'declined'>>({})
  const [busyId, setBusyId] = useState<string | null>(null)
  const [errorId, setErrorId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('studio_staff')
      .select(`
        id,
        display_title,
        creator:creators!creator_id (
          id,
          display_name,
          profile:profiles!user_id ( full_name )
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'invited')

    if (error) {
      console.error('Error loading staff invites:', error)
      return
    }

    const rows: StaffInvite[] = (data || []).map((row) => ({
      id: row.id as string,
      display_title: row.display_title as string | null,
      creator: first(row.creator) as InviteCreator | null,
    }))
    setInvites(rows)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const respond = async (invite: StaffInvite, accept: boolean) => {
    setBusyId(invite.id)
    setErrorId(null)
    try {
      // .select() so we can verify the row actually changed — a Supabase
      // update() without it reports success on 0 rows (e.g. RLS mismatch).
      const { data, error } = await supabase
        .from('studio_staff')
        .update(
          accept
            ? { status: 'active', joined_at: new Date().toISOString() }
            : { status: 'removed' }
        )
        .eq('id', invite.id)
        .select()

      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('No row updated (permission?)')
      }

      setResponded((r) => ({ ...r, [invite.id]: accept ? 'accepted' : 'declined' }))
    } catch (err) {
      console.error('Error responding to staff invite:', err)
      setErrorId(invite.id)
    } finally {
      setBusyId(null)
    }
  }

  if (invites.length === 0) return null

  return (
    <div className="space-y-3 mb-8">
      {invites.map((invite) => {
        const name = studioName(invite.creator)
        const title = invite.display_title || 'a team member'
        const state = responded[invite.id]
        const isBusy = busyId === invite.id

        if (state === 'accepted') {
          return (
            <div
              key={invite.id}
              className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl"
            >
              <p className="text-emerald-300 text-sm">
                You&apos;ve joined <span className="font-semibold">{name}</span> as {title}.
                Open Sssion on your phone to start posting.
              </p>
            </div>
          )
        }

        if (state === 'declined') {
          return (
            <div
              key={invite.id}
              className="p-4 bg-[#1A1A20] border border-[#2A2A30] rounded-xl"
            >
              <p className="text-[#F4F1EA]/50 text-sm">
                Invitation from <span className="font-medium">{name}</span> declined.
              </p>
            </div>
          )
        }

        return (
          <div
            key={invite.id}
            className="p-5 bg-[#B76E79]/10 border border-[#B76E79]/30 rounded-xl"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#B76E79]/20 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 10-4-4 4 4 0 004 4zm6 0a4 4 0 10-3-6.7" />
                </svg>
              </div>
              <p className="text-[#F4F1EA] text-sm leading-relaxed pt-1">
                <span className="font-semibold">{name}</span> invited you to join their team
                as <span className="font-semibold">{title}</span>.
              </p>
            </div>

            {errorId === invite.id && (
              <p className="text-red-400 text-xs mb-3">
                Something went wrong. Please try again.
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => respond(invite, true)}
                disabled={isBusy}
                className="flex-1 py-2.5 bg-[#B76E79] text-[#F4F1EA] font-semibold rounded-lg hover:bg-[#a05f69] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBusy ? '…' : 'Accept'}
              </button>
              <button
                onClick={() => respond(invite, false)}
                disabled={isBusy}
                className="flex-1 py-2.5 border border-[#2A2A30] text-[#F4F1EA]/70 font-medium rounded-lg hover:text-[#F4F1EA] hover:border-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Decline
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
