import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const VALID_GROUPS = ['creator', 'studio', 'member'] as const
type UserGroup = (typeof VALID_GROUPS)[number]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const FETCH_TIMEOUT_MS = 8000

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  return createClient(url, key)
}

export async function POST(request: Request) {
  let payload: {
    email?: string
    first_name?: string
    user_group?: string
    source?: string
    company?: string // honeypot
  }
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: pretend success, do nothing.
  if (payload.company && payload.company.trim() !== '') {
    return NextResponse.json({ success: true })
  }

  const email = (payload.email || '').trim().toLowerCase()
  const firstName = (payload.first_name || '').trim().slice(0, 120)
  const userGroup = (payload.user_group || '').trim() as UserGroup
  const source = (payload.source || '').trim().slice(0, 120) || 'site'

  if (!email || !EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (!VALID_GROUPS.includes(userGroup)) {
    return NextResponse.json({ error: 'Please tell us how you use Sssion.' }, { status: 400 })
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('[newsletter] missing Supabase env')
    return NextResponse.json({ error: 'Signup is temporarily unavailable.' }, { status: 500 })
  }

  // 1. Persist to Supabase (authoritative). Upsert on email so re-signups are idempotent.
  const supabase = getServiceClient()
  const now = new Date().toISOString()
  const { data: row, error: upsertError } = await supabase
    .from('newsletter_signups')
    .upsert(
      {
        email,
        first_name: firstName || null,
        user_group: userGroup,
        source,
        updated_at: now,
      },
      { onConflict: 'email' }
    )
    .select('id, email')
    .single()

  if (upsertError || !row) {
    console.error('[newsletter] upsert failed:', upsertError?.message)
    return NextResponse.json(
      { error: 'We could not save your email. Please try again.' },
      { status: 500 }
    )
  }

  // 2. Sync to Loops (best-effort — the email is already saved).
  const loopsKey = process.env.LOOPS_API_KEY
  const loopsList = process.env.LOOPS_LIST_ID
  if (loopsKey && loopsList) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
    try {
      const res = await fetch('https://app.loops.so/api/v1/contacts/update', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${loopsKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName: firstName || undefined,
          userGroup,
          source,
          mailingLists: { [loopsList]: true },
        }),
        signal: controller.signal,
      })
      if (res.ok) {
        // 3. Mark synced. Best-effort — don't fail the request if this update errors.
        const { error: syncError } = await supabase
          .from('newsletter_signups')
          .update({ loops_synced: true, updated_at: new Date().toISOString() })
          .eq('id', row.id)
        if (syncError) {
          console.error('[newsletter] loops_synced flag update failed:', syncError.message)
        }
      } else {
        const body = await res.text().catch(() => '')
        console.error(`[newsletter] Loops sync failed (${res.status}): ${body.slice(0, 300)}`)
      }
    } catch (e) {
      // Timeout/abort/network — leave loops_synced false for later reconciliation.
      console.error('[newsletter] Loops sync error:', e instanceof Error ? e.message : e)
    } finally {
      clearTimeout(timeout)
    }
  } else {
    console.warn('[newsletter] LOOPS_API_KEY/LOOPS_LIST_ID not set — saved to Supabase only')
  }

  // We have the email. Always report success once it's stored.
  return NextResponse.json({ success: true })
}
