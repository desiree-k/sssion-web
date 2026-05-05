import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// Verify the requesting user is an admin
async function verifyAdmin(req: NextRequest): Promise<string | null> {
  const serviceClient = getServiceClient()
  const authHeader = req.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  const token = authHeader.slice(7)
  const { data: { user } } = await serviceClient.auth.getUser(token)
  if (!user) return null
  const { data: profile } = await serviceClient
    .from('profiles')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  return profile?.is_admin ? user.id : null
}

export async function POST(req: NextRequest) {
  const adminId = await verifyAdmin(req)
  if (!adminId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const serviceClient = getServiceClient()
  const { action, payload } = await req.json()

  try {
    switch (action) {
      case 'get_overview': {
        const [creators, students, videos, reports, inviteCodes, recentSignups] = await Promise.all([
          serviceClient.from('creators').select('id', { count: 'exact', head: true }),
          serviceClient.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
          serviceClient.from('content_items').select('id', { count: 'exact', head: true }),
          serviceClient.from('content_reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          serviceClient.from('invite_codes').select('id', { count: 'exact', head: true }).eq('is_active', true).is('used_by', null),
          serviceClient
            .from('profiles')
            .select('id, display_name, role, created_at')
            .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
            .order('created_at', { ascending: false })
            .limit(20),
        ])
        return NextResponse.json({
          creatorCount: creators.count ?? 0,
          studentCount: students.count ?? 0,
          videoCount: videos.count ?? 0,
          pendingReports: reports.count ?? 0,
          activeInviteCodes: inviteCodes.count ?? 0,
          recentSignups: recentSignups.data ?? [],
        })
      }

      case 'get_invite_codes': {
        const { data, error } = await serviceClient
          .from('invite_codes')
          .select(`
            id, code, is_active, created_at, used_at,
            used_by,
            creator:used_by(display_name),
            profile:used_by(email)
          `)
          .order('created_at', { ascending: false })
        if (error) throw error
        // Fetch emails separately since profiles has email
        const codes = data ?? []
        const usedByIds = codes.filter(c => c.used_by).map(c => c.used_by as string)
        let emailMap: Record<string, string> = {}
        if (usedByIds.length > 0) {
          const { data: profileData } = await serviceClient
            .from('profiles')
            .select('id, email')
            .in('id', usedByIds)
          for (const p of profileData ?? []) {
            emailMap[p.id] = p.email
          }
        }
        const enriched = codes.map(c => ({
          ...c,
          used_by_email: c.used_by ? emailMap[c.used_by] ?? null : null,
        }))
        return NextResponse.json({ codes: enriched })
      }

      case 'create_invite_code': {
        const { code } = payload as { code: string }
        const { data, error } = await serviceClient
          .from('invite_codes')
          .insert({ code: code.toUpperCase(), created_by: 'admin', is_active: true })
          .select()
          .single()
        if (error) throw error
        return NextResponse.json({ code: data })
      }

      case 'create_batch_codes': {
        const { count } = payload as { count: number }
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
        const codes = Array.from({ length: count }, () =>
          Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
        )
        const rows = codes.map(c => ({ code: c, created_by: 'admin', is_active: true }))
        const { data, error } = await serviceClient
          .from('invite_codes')
          .insert(rows)
          .select()
        if (error) throw error
        return NextResponse.json({ codes: data })
      }

      case 'toggle_invite_code': {
        const { id, is_active } = payload as { id: string; is_active: boolean }
        const { error } = await serviceClient
          .from('invite_codes')
          .update({ is_active })
          .eq('id', id)
        if (error) throw error
        return NextResponse.json({ ok: true })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
