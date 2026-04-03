import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('profiles')
    .select('username, role')
    .eq('role', 'creator')
    .not('username', 'is', null)

  return NextResponse.json({ data, error,
    env_check: {
      url_set: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      key_set: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    }
  })
}
