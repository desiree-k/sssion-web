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
              .select('id, full_name, role, created_at')
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
          .select('id, code, is_active, created_at, used_at, used_by')
          .order('created_at', { ascending: false })
        if (error) throw error
        const codes = data ?? []
        const usedByIds = codes.filter(c => c.used_by).map(c => c.used_by as string)
        let profileMap: Record<string, { full_name: string | null; email: string }> = {}
        if (usedByIds.length > 0) {
          const { data: profileData } = await serviceClient
            .from('profiles')
            .select('id, full_name, email')
            .in('id', usedByIds)
          for (const p of profileData ?? []) {
            profileMap[p.id] = { full_name: p.full_name, email: p.email }
          }
        }
        const enriched = codes.map(c => ({
          ...c,
          used_by_name: c.used_by ? (profileMap[c.used_by]?.full_name ?? null) : null,
          used_by_email: c.used_by ? (profileMap[c.used_by]?.email ?? null) : null,
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

      case 'delete_student': {
        const { userId } = payload as { userId: string }
        await serviceClient.from('community_likes').delete().eq('user_id', userId)
        await serviceClient.from('community_comments').delete().eq('author_id', userId)
        await serviceClient.from('community_posts').delete().eq('author_id', userId)
        await serviceClient.from('content_reports').delete().or(`reporter_id.eq.${userId},reported_user_id.eq.${userId}`)
        await serviceClient.from('blocked_users').delete().or(`user_id.eq.${userId},blocked_user_id.eq.${userId}`)
        await serviceClient.from('watch_history').delete().eq('user_id', userId)
        await serviceClient.from('studio_access').delete().eq('student_id', userId)
        await serviceClient.from('studio_access').delete().eq('user_id', userId)
        await serviceClient.from('profiles').delete().eq('id', userId)
        await serviceClient.auth.admin.deleteUser(userId)
        return NextResponse.json({ ok: true })
      }

      case 'delete_creator': {
        const { creatorId, userId } = payload as { creatorId: string; userId: string }
        // Clear invite code reference
        await serviceClient.from('invite_codes').update({ used_by: null, used_at: null }).eq('used_by', userId)
        // Delete related data
        await serviceClient.from('community_likes').delete().eq('user_id', userId)
        await serviceClient.from('community_comments').delete().eq('author_id', userId)
        await serviceClient.from('community_posts').delete().eq('studio_id', creatorId)
        await serviceClient.from('community_posts').delete().eq('author_id', userId)
        await serviceClient.from('content_reports').delete().or(`reporter_id.eq.${userId},reported_user_id.eq.${userId}`)
        await serviceClient.from('blocked_users').delete().or(`user_id.eq.${userId},blocked_user_id.eq.${userId}`)
        await serviceClient.from('reviews').delete().eq('creator_id', creatorId)
        await serviceClient.from('live_classes').delete().eq('creator_id', creatorId)
        // Delete watch history for their content
        const { data: contentIds } = await serviceClient.from('content_items').select('id').eq('creator_id', creatorId)
        if (contentIds?.length) {
          const ids = contentIds.map((c: { id: string }) => c.id)
          await serviceClient.from('watch_history').delete().in('content_item_id', ids)
        }
        await serviceClient.from('content_items').delete().eq('creator_id', creatorId)
        await serviceClient.from('studio_access').delete().eq('creator_id', creatorId)
        await serviceClient.from('studio_access').delete().eq('student_id', userId)
        await serviceClient.from('creators').delete().eq('id', creatorId)
        await serviceClient.from('profiles').delete().eq('id', userId)
        await serviceClient.auth.admin.deleteUser(userId)
        return NextResponse.json({ ok: true })
      }

      case 'get_creators': {
        const { search, page = 1 } = (payload ?? {}) as { search?: string; page?: number }
        const pageSize = 50
        let query = serviceClient
          .from('creators')
          .select(`
            id, display_name, created_at, is_visible, space_status, is_frozen, admin_note,
            profile:user_id(id, email, full_name, username, bio, profile_image_url)
          `, { count: 'exact' })
          .order('created_at', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1)
        if (search) {
          // Match display_name directly, or username via a profiles lookup
          // (PostgREST can't OR across the base table and an embedded one).
          const { data: usernameHits } = await serviceClient
            .from('profiles')
            .select('id')
            .ilike('username', `%${search}%`)
            .limit(100)
          const userIds = (usernameHits ?? []).map(p => p.id)
          query = userIds.length > 0
            ? query.or(`display_name.ilike.%${search}%,user_id.in.(${userIds.join(',')})`)
            : query.ilike('display_name', `%${search}%`)
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

        if (!process.env.RESEND_API_KEY) {
          return NextResponse.json({ error: 'RESEND_API_KEY environment variable is not set' }, { status: 500 })
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

      case 'toggle_creator_visibility': {
        const { creatorId, isVisible } = (payload ?? {}) as { creatorId: string; isVisible: boolean }
        const { error } = await serviceClient
          .from('creators')
          .update({ is_visible: isVisible })
          .eq('id', creatorId)
        if (error) throw error
        return NextResponse.json({ ok: true })
      }

      case 'set_creator_frozen': {
        const { creatorId, frozen, note } = (payload ?? {}) as {
          creatorId: string; frozen: boolean; note?: string
        }
        // .select() so a 0-row update (bad id) surfaces instead of lying
        const { data, error } = await serviceClient
          .from('creators')
          .update({
            is_frozen: frozen,
            ...(note?.trim() && { admin_note: note.trim() }),
          })
          .eq('id', creatorId)
          .select('id, is_frozen')
        if (error) throw error
        if (!data || data.length === 0) throw new Error('Creator not found')
        return NextResponse.json({ ok: true, is_frozen: data[0].is_frozen })
      }

      case 'get_publish_queue': {
        const { data, error } = await serviceClient
          .from('creators')
          .select(`
            id, display_name, publish_applied_at, publish_application_note,
            profile:user_id(id, username, full_name, email)
          `)
          .eq('space_status', 'pending')
          .order('publish_applied_at', { ascending: true })
        if (error) throw error
        const rows = data ?? []
        const creatorIds = rows.map(c => c.id)
        const sessionMap: Record<string, number> = {}
        const memberMap: Record<string, number> = {}
        const postMap: Record<string, number> = {}
        if (creatorIds.length > 0) {
          const [sessions, legacyAccess, offeringAccess, posts] = await Promise.all([
            // Sessions = full-length classes only, matching app vocabulary
            serviceClient.from('content_items').select('creator_id').in('creator_id', creatorIds).eq('content_type', 'class'),
            serviceClient.from('studio_access').select('creator_id, student_id, user_id').in('creator_id', creatorIds).eq('status', 'approved'),
            serviceClient.from('member_offerings').select('creator_id, user_id').in('creator_id', creatorIds).eq('status', 'active'),
            serviceClient.from('community_posts').select('studio_id').in('studio_id', creatorIds),
          ])
          for (const r of sessions.data ?? []) {
            sessionMap[r.creator_id] = (sessionMap[r.creator_id] ?? 0) + 1
          }
          // Members = distinct users across legacy studio_access + active member_offerings
          const memberSets: Record<string, Set<string>> = {}
          for (const r of legacyAccess.data ?? []) {
            const uid = r.student_id ?? r.user_id
            if (uid) (memberSets[r.creator_id] ??= new Set()).add(uid)
          }
          for (const r of offeringAccess.data ?? []) {
            if (r.user_id) (memberSets[r.creator_id] ??= new Set()).add(r.user_id)
          }
          for (const [cid, users] of Object.entries(memberSets)) {
            memberMap[cid] = users.size
          }
          for (const r of posts.data ?? []) {
            postMap[r.studio_id] = (postMap[r.studio_id] ?? 0) + 1
          }
        }
        return NextResponse.json({
          queue: rows.map(c => ({
            ...c,
            sessionCount: sessionMap[c.id] ?? 0,
            memberCount: memberMap[c.id] ?? 0,
            postCount: postMap[c.id] ?? 0,
          })),
        })
      }

      case 'review_publish': {
        const { creatorId, approve, note } = (payload ?? {}) as {
          creatorId: string; approve: boolean; note?: string
        }
        if (!approve && !note?.trim()) {
          return NextResponse.json({ error: 'A review note is required to decline' }, { status: 400 })
        }
        // .select() so a 0-row update (bad id / already reviewed) surfaces instead of lying
        const { data, error } = await serviceClient
          .from('creators')
          .update({
            space_status: approve ? 'published' : 'unlisted',
            publish_reviewed_at: new Date().toISOString(),
            ...(note?.trim() && { publish_review_note: note.trim() }),
          })
          .eq('id', creatorId)
          .eq('space_status', 'pending')
          .select('id, user_id, display_name, space_status, profile:user_id(username, full_name, email)')
        if (error) throw error
        if (!data || data.length === 0) throw new Error('Space not found in the pending queue (it may already have been reviewed)')

        const creator = data[0]
        const userProfile = creator.profile as { username?: string | null; full_name?: string | null; email?: string | null } | null
        const title = approve ? 'Your Space is live 🎉' : 'Update on your Space'
        const pushBody = approve
          ? `${creator.display_name || 'Your Space'} is now published and visible in Discover.`
          : `Your Space wasn't published this time. Note from the team: ${note!.trim()}`

        // Notifications are best-effort — the review itself already succeeded.
        let pushSent = false
        let emailSent = false
        if (creator.user_id) {
          try {
            const { error: pushError } = await serviceClient.functions.invoke('send-notification', {
              body: {
                user_id: creator.user_id,
                title,
                body: pushBody,
                data: { type: 'publish_review', status: creator.space_status },
              },
            })
            pushSent = !pushError
          } catch (e) {
            console.error('[admin] review_publish push failed:', e)
          }
        }
        if (userProfile?.email && process.env.RESEND_API_KEY) {
          try {
            const resend = new Resend(process.env.RESEND_API_KEY)
            const firstName = (userProfile.full_name || '').split(' ')[0] || 'there'
            const spaceUrl = userProfile.username ? `https://sssion.studio/${userProfile.username}` : 'https://sssion.studio'
            const html = approve
              ? `<p>Hi ${firstName},</p>
                 <p><strong>${creator.display_name || 'Your Space'}</strong> has been approved and is now published — it's visible in Discover and open to new members.</p>
                 <p><a href="${spaceUrl}">${spaceUrl.replace('https://', '')}</a></p>
                 <p>— The Sssion team</p>`
              : `<p>Hi ${firstName},</p>
                 <p>We reviewed <strong>${creator.display_name || 'your Space'}</strong> and it isn't ready to publish just yet. Your Space is still yours — it's back to unlisted, and you can apply again any time.</p>
                 <p>Note from the team:</p>
                 <blockquote style="margin:0;padding:8px 16px;border-left:3px solid #B76E79;">${note!.trim()}</blockquote>
                 <p>— The Sssion team</p>`
            await resend.emails.send({
              from: 'Sssion <updates@updates.sssion.studio>',
              to: userProfile.email,
              subject: approve ? 'Your Space is live on Sssion' : 'An update on your Space',
              html,
            })
            emailSent = true
          } catch (e) {
            console.error('[admin] review_publish email failed:', e)
          }
        }

        return NextResponse.json({ ok: true, space_status: creator.space_status, pushSent, emailSent })
      }

      case 'get_moderation_queue': {
        const { status: mqStatus } = (payload ?? {}) as { status?: 'flagged' | 'blocked' }

        // Fetch flagged/blocked content_items
        let ciQuery = serviceClient
          .from('content_items')
          .select('id, title, creator_id, moderation_status, moderation_scores, moderated_at, mux_playback_id')
          .in('moderation_status', ['flagged', 'blocked'])
        if (mqStatus) ciQuery = ciQuery.eq('moderation_status', mqStatus)
        const { data: ciData, error: ciError } = await ciQuery.limit(100)
        if (ciError) throw ciError

        // Fetch flagged/blocked community_posts
        let cpQuery = serviceClient
          .from('community_posts')
          .select('id, body, author_id, moderation_status, moderation_scores, moderated_at')
          .in('moderation_status', ['flagged', 'blocked'])
        if (mqStatus) cpQuery = cpQuery.eq('moderation_status', mqStatus)
        const { data: cpData, error: cpError } = await cpQuery.limit(100)
        if (cpError) throw cpError

        // Gather all creator/author IDs to resolve names + monetization_frozen
        const ciCreatorIds = [...new Set((ciData ?? []).map(c => c.creator_id).filter(Boolean))]
        const cpAuthorIds = [...new Set((cpData ?? []).map(p => p.author_id).filter(Boolean))]
        const allCreatorIds = [...new Set([...ciCreatorIds])]
        const allAuthorIds = [...new Set([...cpAuthorIds])]

        // creator rows keyed by id
        const creatorMap: Record<string, { display_name: string | null; monetization_frozen: boolean }> = {}
        if (allCreatorIds.length > 0) {
          const { data: creators } = await serviceClient
            .from('creators')
            .select('id, display_name, monetization_frozen')
            .in('id', allCreatorIds)
          for (const c of creators ?? []) {
            creatorMap[c.id] = { display_name: c.display_name, monetization_frozen: c.monetization_frozen ?? false }
          }
        }
        // For community post authors, resolve via creators.user_id
        const authorCreatorMap: Record<string, { display_name: string | null; creator_id: string; monetization_frozen: boolean }> = {}
        if (allAuthorIds.length > 0) {
          const { data: authorCreators } = await serviceClient
            .from('creators')
            .select('id, user_id, display_name, monetization_frozen')
            .in('user_id', allAuthorIds)
          for (const c of authorCreators ?? []) {
            if (c.user_id) {
              authorCreatorMap[c.user_id] = { display_name: c.display_name, creator_id: c.id, monetization_frozen: c.monetization_frozen ?? false }
            }
          }
        }

        const ciItems = (ciData ?? []).map(c => ({
          id: c.id,
          subject_type: 'content_item' as const,
          title: c.title ?? null,
          creator_name: creatorMap[c.creator_id]?.display_name ?? null,
          creator_id: c.creator_id,
          moderation_status: c.moderation_status as 'flagged' | 'blocked',
          moderation_scores: c.moderation_scores ?? null,
          moderated_at: c.moderated_at ?? null,
          mux_playback_id: c.mux_playback_id ?? null,
          monetization_frozen: creatorMap[c.creator_id]?.monetization_frozen ?? false,
        }))

        const cpItems = (cpData ?? []).map(p => {
          const body = (p.body as string | null) ?? ''
          const ac = authorCreatorMap[p.author_id]
          return {
            id: p.id,
            subject_type: 'community_post' as const,
            title: body.length > 120 ? body.slice(0, 120) + '…' : body || null,
            creator_name: ac?.display_name ?? null,
            creator_id: ac?.creator_id ?? p.author_id,
            moderation_status: p.moderation_status as 'flagged' | 'blocked',
            moderation_scores: p.moderation_scores ?? null,
            moderated_at: p.moderated_at ?? null,
            mux_playback_id: null,
            monetization_frozen: ac?.monetization_frozen ?? false,
          }
        })

        const combined = [...ciItems, ...cpItems].sort((a, b) => {
          if (!a.moderated_at) return 1
          if (!b.moderated_at) return -1
          return new Date(b.moderated_at).getTime() - new Date(a.moderated_at).getTime()
        }).slice(0, 100)

        return NextResponse.json({ items: combined })
      }

      case 'moderation_unblock': {
        // Clears a flagged OR blocked item. For blocked items, restores the Mux playback ID.
        // For flagged items (content was never taken offline), skips the Mux step.
        const { subject_type: unblockType, id: unblockId } = payload as {
          subject_type: 'content_item' | 'community_post'
          id: string
        }
        const now = new Date().toISOString()

        if (unblockType === 'content_item') {
          const { data: ciRow, error: ciErr } = await serviceClient
            .from('content_items')
            .select('id, mux_asset_id, mux_playback_id, moderation_status, creator_id')
            .eq('id', unblockId)
            .single()
          if (ciErr) throw ciErr

          const wasBlocked = ciRow?.moderation_status === 'blocked'
          const ciUpdate: Record<string, unknown> = { moderation_status: 'clear', moderated_at: now }

          // Only restore Mux when content was actually blocked (playback was revoked)
          if (wasBlocked && ciRow?.mux_asset_id && !ciRow.mux_playback_id) {
            if (process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET) {
              try {
                const muxAuth = Buffer.from(`${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`).toString('base64')
                const muxRes = await fetch(
                  `https://api.mux.com/video/v1/assets/${ciRow.mux_asset_id}/playback-ids`,
                  {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${muxAuth}` },
                    body: JSON.stringify({ policy: 'public' }),
                  }
                )
                if (muxRes.ok) {
                  const muxData = await muxRes.json()
                  const newId = muxData?.data?.id ?? null
                  if (newId) ciUpdate.mux_playback_id = newId
                } else {
                  console.error('[admin] Mux playback-id creation failed:', await muxRes.text())
                }
              } catch (muxErr) {
                console.error('[admin] Mux API error:', muxErr)
              }
            }
          }

          const { error: updateErr } = await serviceClient
            .from('content_items').update(ciUpdate).eq('id', unblockId)
          if (updateErr) throw updateErr

          // Unfreeze monetization if no remaining blocked or priority-flagged content
          const creatorId = ciRow.creator_id
          const { data: remainingCi } = await serviceClient
            .from('content_items')
            .select('id, moderation_status, moderation_scores')
            .eq('creator_id', creatorId)
            .in('moderation_status', ['blocked', 'flagged'])
            .neq('id', unblockId)
            .limit(10)
          const { data: remainingCp } = await serviceClient
            .from('community_posts')
            .select('id, moderation_status, moderation_scores')
            .eq('studio_id', creatorId)
            .in('moderation_status', ['blocked', 'flagged'])
            .limit(10)

          const freezingItems = [...(remainingCi ?? []), ...(remainingCp ?? [])].filter(
            item => item.moderation_status === 'blocked' ||
              (item.moderation_status === 'flagged' && (item.moderation_scores as Record<string,unknown>)?.priority_flag === true)
          )

          const logEvents: object[] = [{ subject_type: 'content_item', subject_id: unblockId, creator_id: creatorId, action: 'unblocked', actor: 'admin', created_at: now }]

          if (freezingItems.length === 0) {
            await serviceClient.from('creators').update({ monetization_frozen: false }).eq('id', creatorId)
            logEvents.push({ subject_type: 'content_item', subject_id: unblockId, creator_id: creatorId, action: 'monetization_restored', actor: 'admin', created_at: now })
          }

          await serviceClient.from('moderation_events').insert(logEvents)
        } else {
          // community_post: studio_id is the creator FK per CLAUDE.md
          const { data: postRow, error: postErr } = await serviceClient
            .from('community_posts')
            .select('id, studio_id, moderation_status')
            .eq('id', unblockId)
            .single()
          if (postErr) throw postErr

          const { error: updateErr } = await serviceClient
            .from('community_posts')
            .update({ moderation_status: 'clear', moderated_at: now })
            .eq('id', unblockId)
          if (updateErr) throw updateErr

          const creatorId = postRow.studio_id
          const logEvents: object[] = [{ subject_type: 'community_post', subject_id: unblockId, creator_id: creatorId, action: 'unblocked', actor: 'admin', created_at: now }]

          if (creatorId) {
            const { data: remainingCi } = await serviceClient
              .from('content_items')
              .select('id, moderation_status, moderation_scores')
              .eq('creator_id', creatorId)
              .in('moderation_status', ['blocked', 'flagged'])
              .limit(10)
            const { data: remainingCp } = await serviceClient
              .from('community_posts')
              .select('id, moderation_status, moderation_scores')
              .eq('studio_id', creatorId)
              .in('moderation_status', ['blocked', 'flagged'])
              .neq('id', unblockId)
              .limit(10)

            const freezingItems = [...(remainingCi ?? []), ...(remainingCp ?? [])].filter(
              item => item.moderation_status === 'blocked' ||
                (item.moderation_status === 'flagged' && (item.moderation_scores as Record<string,unknown>)?.priority_flag === true)
            )

            if (freezingItems.length === 0) {
              await serviceClient.from('creators').update({ monetization_frozen: false }).eq('id', creatorId)
              logEvents.push({ subject_type: 'community_post', subject_id: unblockId, creator_id: creatorId, action: 'monetization_restored', actor: 'admin', created_at: now })
            }
          }

          await serviceClient.from('moderation_events').insert(logEvents)
        }

        return NextResponse.json({ success: true })
      }

      case 'moderation_confirm_block': {
        // Admin blocks a flagged item: revoke Mux playback (content goes offline), set blocked.
        const { subject_type: cbType, id: cbId } = payload as {
          subject_type: 'content_item' | 'community_post'
          id: string
        }
        const now = new Date().toISOString()

        if (cbType === 'content_item') {
          const { data: ciRow, error: ciErr } = await serviceClient
            .from('content_items')
            .select('id, mux_asset_id, mux_playback_id, creator_id')
            .eq('id', cbId)
            .single()
          if (ciErr) throw ciErr

          // Revoke the live Mux playback ID so the stream goes dark
          if (ciRow?.mux_asset_id && ciRow.mux_playback_id) {
            if (process.env.MUX_TOKEN_ID && process.env.MUX_TOKEN_SECRET) {
              try {
                const muxAuth = Buffer.from(`${process.env.MUX_TOKEN_ID}:${process.env.MUX_TOKEN_SECRET}`).toString('base64')
                const muxDel = await fetch(
                  `https://api.mux.com/video/v1/assets/${ciRow.mux_asset_id}/playback-ids/${ciRow.mux_playback_id}`,
                  { method: 'DELETE', headers: { 'Authorization': `Basic ${muxAuth}` } }
                )
                if (!muxDel.ok) console.error('[admin] Mux revoke failed:', await muxDel.text())
              } catch (muxErr) {
                console.error('[admin] Mux revoke error:', muxErr)
              }
            }
          }

          const { error: updateErr } = await serviceClient
            .from('content_items')
            .update({ moderation_status: 'blocked', mux_playback_id: null, moderated_at: now })
            .eq('id', cbId)
          if (updateErr) throw updateErr

          const creatorId = ciRow?.creator_id
          await serviceClient.from('moderation_events').insert({
            subject_type: 'content_item',
            subject_id: cbId,
            creator_id: creatorId ?? undefined,
            action: 'blocked',
            actor: 'admin',
            created_at: now,
          })
        } else {
          const { data: postRow, error: postErr } = await serviceClient
            .from('community_posts')
            .select('id, studio_id')
            .eq('id', cbId)
            .single()
          if (postErr) throw postErr

          const { error: updateErr } = await serviceClient
            .from('community_posts')
            .update({ moderation_status: 'blocked', moderated_at: now })
            .eq('id', cbId)
          if (updateErr) throw updateErr

          await serviceClient.from('moderation_events').insert({
            subject_type: 'community_post',
            subject_id: cbId,
            creator_id: postRow?.studio_id ?? undefined,
            action: 'blocked',
            actor: 'admin',
            created_at: now,
          })
        }

        return NextResponse.json({ success: true })
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
