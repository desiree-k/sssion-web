import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const MODERATION_INBOX = 'moderation@sssion.studio'

const CATEGORIES: Record<string, string> = {
  sexual_content: 'Non-consensual / prohibited sexual content',
  minor_safety: 'Minor safety',
  violence: 'Violence or threats',
  hate: 'Hate or harassment',
  spam_misleading: 'Spam or misleading',
  copyright: 'Copyright / IP',
  other: 'Something else',
}

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function esc(s: string) {
  return s.replace(/[<>&]/g, (c) => (c === '<' ? '&lt;' : c === '>' ? '&gt;' : '&amp;'))
}

export async function POST(req: NextRequest) {
  let payload: {
    subject_url?: string
    subject_username?: string
    category?: string
    details?: string
    reporter_email?: string
    company?: string
  }
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot: silently accept (so bots think they succeeded) but do nothing.
  if (payload.company && payload.company.trim() !== '') {
    return NextResponse.json({ ok: true })
  }

  const category = (payload.category || '').trim()
  const subjectUrl = (payload.subject_url || '').trim().slice(0, 2000)
  const subjectUsername = (payload.subject_username || '').trim().replace(/^@/, '').slice(0, 120)
  const details = (payload.details || '').trim().slice(0, 5000)
  const reporterEmail = (payload.reporter_email || '').trim().slice(0, 254)

  if (!category || !CATEGORIES[category]) {
    return NextResponse.json({ error: 'Please choose a valid category.' }, { status: 400 })
  }
  if (!subjectUrl && !subjectUsername && !details) {
    return NextResponse.json(
      { error: 'Tell us what you are reporting — a link, a username, or a description.' },
      { status: 400 }
    )
  }
  if (reporterEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(reporterEmail)) {
    return NextResponse.json({ error: 'That email address looks invalid.' }, { status: 400 })
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    console.error('[report] missing Supabase env')
    return NextResponse.json({ error: 'Reporting is temporarily unavailable.' }, { status: 500 })
  }

  // 1. Persist the report (authoritative). reporter_id stays null for web reports.
  const serviceClient = getServiceClient()
  const { data: inserted, error: insertError } = await serviceClient
    .from('content_reports')
    .insert({
      reason: category,
      details: details || null,
      report_type: 'web',
      report_source: 'web',
      status: 'pending',
      subject_url: subjectUrl || null,
      subject_username: subjectUsername || null,
      reporter_email: reporterEmail || null,
    })
    .select('id')
    .single()

  if (insertError) {
    console.error('[report] insert failed:', insertError.message)
    return NextResponse.json(
      { error: 'We could not save your report. Please try again.' },
      { status: 500 }
    )
  }

  // 2. Notify moderation (best-effort — the report is already saved).
  const isMinorSafety = category === 'minor_safety'
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const rows: [string, string][] = [
        ['Category', CATEGORIES[category]],
        ['Username', subjectUsername || '—'],
        ['URL', subjectUrl || '—'],
        ['Reporter email', reporterEmail || '(anonymous)'],
        ['Report ID', inserted?.id ?? '—'],
      ]
      const html = `
        <p style="font:14px system-ui">New <strong>website report</strong>${isMinorSafety ? ' — <span style="color:#b00">MINOR SAFETY, escalate</span>' : ''}.</p>
        <table style="font:14px system-ui;border-collapse:collapse">
          ${rows.map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td style="padding:4px 0"><strong>${esc(String(v))}</strong></td></tr>`).join('')}
        </table>
        <p style="font:14px system-ui;white-space:pre-wrap;margin-top:12px">${esc(details || '(no details provided)')}</p>
        <p style="font:12px system-ui;color:#999">Review in the admin console → Reports.</p>`
      await resend.emails.send({
        from: 'Sssion Reports <updates@updates.sssion.studio>',
        to: MODERATION_INBOX,
        replyTo: reporterEmail || undefined,
        subject: `${isMinorSafety ? '[URGENT] ' : ''}Report: ${CATEGORIES[category]}${subjectUsername ? ` — @${subjectUsername}` : ''}`,
        html,
      })
    } catch (e) {
      // Do not fail the request — the report is safely stored and visible in admin.
      console.error('[report] moderation email failed:', e)
    }
  } else {
    console.warn('[report] RESEND_API_KEY not set — report stored but no email sent')
  }

  return NextResponse.json({ ok: true })
}
