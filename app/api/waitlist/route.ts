import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase env vars missing')
  return createClient(url, key)
}

export async function POST(request: Request) {
  try {
    const { email, note } = await request.json()
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const supabase = getServiceClient()
    const { error } = await supabase.from('waitlist').insert({
      email: email.trim().toLowerCase(),
      note: note ?? null,
      created_at: new Date().toISOString(),
    })

    if (error) {
      // Duplicate email — treat as success so we don't leak info
      if (error.code === '23505') {
        return NextResponse.json({ success: true })
      }
      console.error('Waitlist insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Waitlist error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
