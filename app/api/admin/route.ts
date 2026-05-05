import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

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
  console.log('[admin] POST received')
  const adminId = await verifyAdmin(req)
  if (!adminId) {
    console.log('[admin] verifyAdmin failed — no valid admin token')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  console.log('[admin] verified admin:', adminId)

  const serviceClient = getServiceClient()
  const { action, payload } = await req.json()
  console.log('[admin] action:', action)

  try {
    switch (action) {
      case 'get_overview': {
        console.log('[admin] get_overview start')
        console.log('[admin] SUPABASE_URL set:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('[admin] SERVICE_ROLE_KEY set:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

        const safeCount = async (label: string, query: ReturnType<typeof serviceClient.from>) => {
          try {
            const res = await (query as any)
            console.log(`[admin] ${label}: count=${res.count}, error=${res.error?.message ?? 'none'}`)
            return res.count ?? 0
          } catch (e) {
            console.error(`[admin] ${label} threw:`, e)
            return 0
          }
        }

        const [creatorCount, studentCount, videoCount, pendingReports, activeInviteCodes, recentSignupsRes] =
          await Promise.all([
            safeCount('creators', serviceClient.from('creators').select('id', { count: 'exact', head: true }) as any),
            safeCount('students', serviceClient.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student') as any),
            safeCount('videos', serviceClient.from('content_items').select('id', { count: 'exact', head: true }) as any),
            safeCount('reports', serviceClient.from('content_reports').select('id', { count: 'exact', head: true }).eq('status', 'pending') as any),
            safeCount('invite_codes', serviceClient.from('invite_codes').select('id', { count: 'exact', head: true }).eq('is_active', true).is('used_by', null) as any),
            serviceClient
              .from('profiles')
              .select('id, display_name, role, created_at')
              .order('created_at', { ascending: false })
              .limit(10),
          ])

        console.log('[admin] recentSignups error:', recentSignupsRes.error?.message ?? 'none')
        console.log('[admin] recentSignups count:', recentSignupsRes.data?.length ?? 0)

        return NextResponse.json({
          creatorCount,
          studentCount,
          videoCount,
          pendingReports,
          activeInviteCodes,
          recentSignups: recentSignupsRes.data ?? [],
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

      case 'get_students': {
        const { search, page = 1 } = (payload ?? {}) as { search?: string; page?: number }
        const pageSize = 50
        let query = serviceClient
          .from('profiles')
          .select('id, full_name, email, created_at, username', { count: 'exact' })
          .eq('role', 'student')
          .order('created_at', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1)
        if (search) {
          query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
        }
        const { data, error, count } = await query
        console.log('[admin] get_students error:', error, 'count:', count)
        if (error) throw error
        // Fetch studio access counts per student
        const ids = (data ?? []).map(s => s.id)
        let accessMap: Record<string, number> = {}
        if (ids.length > 0) {
          const { data: accessData } = await serviceClient
            .from('studio_access')
            .select('user_id')
            .in('user_id', ids)
            .eq('status', 'approved')
          for (const row of accessData ?? []) {
            accessMap[row.user_id] = (accessMap[row.user_id] ?? 0) + 1
          }
        }
        return NextResponse.json({
          students: (data ?? []).map(s => ({ ...s, studioCount: accessMap[s.id] ?? 0 })),
          total: count ?? 0,
        })
      }

      case 'remove_student': {
        const { userId } = payload as { userId: string }
        // Revoke all studio access
        await serviceClient.from('studio_access').delete().eq('user_id', userId)
        return NextResponse.json({ ok: true })
      }

      case 'get_creators': {
        const { search, page = 1 } = (payload ?? {}) as { search?: string; page?: number }
        const pageSize = 50
        let query = serviceClient
          .from('creators')
          .select(`
            id, display_name, created_at,
            profile:user_id(id, email, full_name, username, bio, profile_image_url)
          `, { count: 'exact' })
          .order('created_at', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1)
        if (search) {
          query = query.ilike('display_name', `%${search}%`)
        }
        const { data, error, count } = await query
        console.log('[admin] get_creators error:', error, 'count:', count)
        if (error) throw error
        const creatorIds = (data ?? []).map(c => c.id)
        let studentMap: Record<string, number> = {}
        let videoMap: Record<string, number> = {}
        if (creatorIds.length > 0) {
          const [accessData, videoData] = await Promise.all([
            serviceClient
              .from('studio_access')
              .select('creator_id')
              .in('creator_id', creatorIds)
              .eq('status', 'approved'),
            serviceClient
              .from('content_items')
              .select('creator_id')
              .in('creator_id', creatorIds),
          ])
          for (const row of accessData.data ?? []) {
            studentMap[row.creator_id] = (studentMap[row.creator_id] ?? 0) + 1
          }
          for (const row of videoData.data ?? []) {
            videoMap[row.creator_id] = (videoMap[row.creator_id] ?? 0) + 1
          }
        }
        return NextResponse.json({
          creators: (data ?? []).map(c => ({
            ...c,
            studentCount: studentMap[c.id] ?? 0,
            videoCount: videoMap[c.id] ?? 0,
          })),
          total: count ?? 0,
        })
      }

      case 'get_reports': {
        const { status, page = 1 } = (payload ?? {}) as { status?: string; page?: number }
        const pageSize = 50
        let query = serviceClient
          .from('content_reports')
          .select('id, reason, details, report_type, status, created_at, content_item_id, post_id, reporter_id, reported_user_id', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1)
        if (status && status !== 'all') {
          query = query.eq('status', status)
        }
        const { data, error, count } = await query
        console.log('[admin] get_reports error:', error, 'count:', count)
        if (error) throw error

        const reports = data ?? []
        const allIds = [...new Set([
          ...reports.map(r => r.reporter_id).filter(Boolean),
          ...reports.map(r => r.reported_user_id).filter(Boolean),
        ])]
        let profileMap: Record<string, { full_name: string | null; email: string }> = {}
        if (allIds.length > 0) {
          const { data: profiles } = await serviceClient
            .from('profiles')
            .select('id, full_name, email')
            .in('id', allIds)
          for (const p of profiles ?? []) {
            profileMap[p.id] = { full_name: p.full_name, email: p.email }
          }
        }
        const enriched = reports.map(r => ({
          ...r,
          reporter: r.reporter_id ? profileMap[r.reporter_id] ?? null : null,
          reported_user: r.reported_user_id ? profileMap[r.reported_user_id] ?? null : null,
        }))
        return NextResponse.json({ reports: enriched, total: count ?? 0 })
      }

      case 'resolve_report': {
        const { id } = payload as { id: string }
        const { error } = await serviceClient
          .from('content_reports')
          .update({ status: 'actioned' })
          .eq('id', id)
        if (error) throw error
        return NextResponse.json({ ok: true })
      }

      case 'dismiss_report': {
        const { id } = payload as { id: string }
        const { error } = await serviceClient
          .from('content_reports')
          .update({ status: 'reviewed' })
          .eq('id', id)
        if (error) throw error
        return NextResponse.json({ ok: true })
      }

      case 'send_announcement': {
        const { subject, body, audience = 'creators' } = payload as {
          subject: string
          body: string
          audience?: 'creators' | 'students' | 'all'
        }
        if (!subject?.trim() || !body?.trim()) {
          return NextResponse.json({ error: 'Subject and body are required' }, { status: 400 })
        }

        // Fetch target emails
        let emails: string[] = []
        if (audience === 'creators' || audience === 'all') {
          const { data: creators } = await serviceClient
            .from('creators')
            .select('profile:user_id(email)')
          for (const c of creators ?? []) {
            const email = (c.profile as { email?: string } | null)?.email
            if (email) emails.push(email)
          }
        }
        if (audience === 'students' || audience === 'all') {
          const { data: students } = await serviceClient
            .from('profiles')
            .select('email')
            .eq('role', 'student')
          for (const s of students ?? []) {
            if (s.email) emails.push(s.email)
          }
        }
        // Deduplicate
        emails = [...new Set(emails.filter(Boolean))]
        console.log(`[admin] send_announcement to ${emails.length} recipients`)

        if (emails.length === 0) {
          return NextResponse.json({ error: 'No recipients found' }, { status: 400 })
        }

        const resend = new Resend(process.env.RESEND_API_KEY)
        const failures: string[] = []
        let sent = 0

        // Send in batches of 10 to avoid rate limits
        const BATCH = 10
        for (let i = 0; i < emails.length; i += BATCH) {
          const batch = emails.slice(i, i + BATCH)
          await Promise.all(batch.map(async (email) => {
            try {
              await resend.emails.send({
                from: 'Sssion <updates@updates.sssion.studio>',
                to: email,
                subject: subject.trim(),
                html: body,
              })
              sent++
            } catch (e) {
              console.error(`[admin] failed to send to ${email}:`, e)
              failures.push(email)
            }
          }))
        }

        return NextResponse.json({ sent, failures, total: emails.length })
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
    }
  } catch (err: unknown) {
    console.error('[admin] caught error:', err)
    // Supabase PostgrestError has a message property but is not an Error instance
    const message =
      err instanceof Error
        ? err.message
        : typeof err === 'object' && err !== null && 'message' in err
          ? String((err as { message: unknown }).message)
          : JSON.stringify(err)
    console.error('[admin] returning error message:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
