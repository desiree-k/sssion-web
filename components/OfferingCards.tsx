'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export interface Offering {
  id: string
  name: string
  description: string | null
  price: number
  currency: string | null
  is_free: boolean
  payment_url: string | null
  access_duration_days: number | null
  access_scope: string
  includes_community: boolean
  auto_approve: boolean
}

interface MemberOffering {
  id: string
  offering_id: string
  status: string
  expires_at: string | null
}

interface ContentItem {
  id: string
  title: string
  difficulty_level: string | null
  duration_seconds: number | null
  mux_playback_id: string | null
}

interface LiveClass {
  id: string
  title: string
  scheduled_at: string
}

interface OfferingCardsProps {
  creatorId: string
  offerings: Offering[]
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$', MXN: 'MX$',
}

export function formatOfferingPrice(offering: Offering): string {
  if (offering.is_free) return 'Free'
  const currency = offering.currency || 'USD'
  const symbol = CURRENCY_SYMBOLS[currency] ?? `${currency} `
  const amount = Number.isInteger(offering.price)
    ? String(offering.price)
    : offering.price.toFixed(2)
  return `${symbol}${amount}`
}

function isLive(mo: MemberOffering): boolean {
  if (mo.status !== 'active') return false
  if (!mo.expires_at) return true
  return new Date(mo.expires_at) > new Date()
}

export default function OfferingCards({ creatorId, offerings }: OfferingCardsProps) {
  const [signedInStudentId, setSignedInStudentId] = useState<string | null>(null)
  const [signedOut, setSignedOut] = useState(false)
  const [mine, setMine] = useState<Record<string, MemberOffering>>({})
  const [awaitingPaymentId, setAwaitingPaymentId] = useState<string | null>(null)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  // "What's included" preview state
  const [contentByOffering, setContentByOffering] = useState<Record<string, ContentItem[]>>({})
  const [liveByOffering, setLiveByOffering] = useState<Record<string, LiveClass[]>>({})
  const [sessionCount, setSessionCount] = useState(0)
  const [hasLiveClasses, setHasLiveClasses] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session || session.user.user_metadata?.role === 'creator') {
        setSignedOut(!session)
      } else {
        setSignedInStudentId(session.user.id)
        const { data } = await supabase
          .from('member_offerings')
          .select('id, offering_id, status, expires_at')
          .eq('user_id', session.user.id)
          .eq('creator_id', creatorId)
        const byOffering: Record<string, MemberOffering> = {}
        const rank = (s: string) => (s === 'active' ? 2 : s === 'pending' ? 1 : 0)
        for (const row of (data || []).sort((a, b) => rank(a.status) - rank(b.status))) {
          byOffering[row.offering_id] = row
        }
        setMine(byOffering)
      }

      // Load preview data for all offerings
      const offeringIds = offerings.map((o) => o.id)
      if (offeringIds.length === 0) return

      const [contentRes, liveRes, sessionsRes, liveCheckRes] = await Promise.all([
        supabase
          .from('offering_content')
          .select('offering_id, content_id, content_items!content_id(id, title, difficulty_level, duration_seconds, mux_playback_id)')
          .in('offering_id', offeringIds),
        supabase
          .from('offering_live_classes')
          .select('offering_id, live_class_id, live_classes!live_class_id(id, title, scheduled_at)')
          .in('offering_id', offeringIds),
        supabase.from('content_items').select('id').eq('creator_id', creatorId),
        supabase.from('live_classes').select('id').eq('creator_id', creatorId).limit(1),
      ])

      // Group content by offering
      const cbo: Record<string, ContentItem[]> = {}
      for (const row of (contentRes.data || []) as any[]) {
        const item = row.content_items as ContentItem | null
        if (!item) continue
        const oid = row.offering_id as string
        if (!cbo[oid]) cbo[oid] = []
        cbo[oid].push(item)
      }
      setContentByOffering(cbo)

      // Group live classes by offering
      const lbo: Record<string, LiveClass[]> = {}
      for (const row of (liveRes.data || []) as any[]) {
        const lc = row.live_classes as LiveClass | null
        if (!lc) continue
        const oid = row.offering_id as string
        if (!lbo[oid]) lbo[oid] = []
        lbo[oid].push(lc)
      }
      setLiveByOffering(lbo)

      setSessionCount((sessionsRes.data || []).length)
      setHasLiveClasses((liveCheckRes.data || []).length > 0)
    }
    load()
  }, [creatorId, offerings])

  const join = async (offering: Offering, autoApproved: boolean) => {
    if (!signedInStudentId) return
    setProcessingId(offering.id)
    setError(null)
    try {
      const expiresAt = offering.access_duration_days
        ? new Date(Date.now() + offering.access_duration_days * 86400000).toISOString()
        : null
      const { error: insertError } = await supabase.from('member_offerings').insert({
        user_id: signedInStudentId,
        offering_id: offering.id,
        creator_id: creatorId,
        status: autoApproved ? 'active' : 'pending',
        ...(autoApproved ? { granted_at: new Date().toISOString(), expires_at: expiresAt } : {}),
      })
      if (insertError) throw insertError
      setMine((prev) => ({
        ...prev,
        [offering.id]: {
          id: 'local',
          offering_id: offering.id,
          status: autoApproved ? 'active' : 'pending',
          expires_at: autoApproved ? expiresAt : null,
        },
      }))
      setAwaitingPaymentId(null)
    } catch (err) {
      console.error('Error joining offering:', err)
      setError('Could not send your request. Please try again.')
    } finally {
      setProcessingId(null)
    }
  }

  const onCtaClick = (offering: Offering) => {
    if (offering.is_free && offering.auto_approve) {
      join(offering, true)
    } else if (offering.is_free || !offering.payment_url) {
      join(offering, false)
    } else if (awaitingPaymentId === offering.id) {
      join(offering, false)
    } else {
      window.open(offering.payment_url, '_blank', 'noopener,noreferrer')
      setAwaitingPaymentId(offering.id)
    }
  }

  if (offerings.length === 0) return null

  return (
    <section>
      <div>
        <h2
          className="text-3xl md:text-[34px] m-0 border-b border-[var(--pt-border,#ffffff1a)] pb-3 mb-6 text-[var(--pt-text,#ffffff)]"
          style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 400 }}
        >
          Offerings
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          {offerings.map((offering) => {
            const mineRow = mine[offering.id]
            const have = mineRow ? isLive(mineRow) : false
            const pending = mineRow?.status === 'pending'
            const awaiting = awaitingPaymentId === offering.id
            const processing = processingId === offering.id

            let label: string
            if (have) label = 'You have this'
            else if (pending) label = 'Requested — awaiting approval'
            else if (awaiting) label = "I've paid — request access"
            else if (offering.is_free) {
              label = offering.access_duration_days && offering.auto_approve ? 'Start Free Trial' : 'Join'
            } else label = 'Get Access'

            const priceLine = offering.access_duration_days
              ? `${formatOfferingPrice(offering)} · ${offering.access_duration_days} days`
              : formatOfferingPrice(offering)

            return (
              <div
                key={offering.id}
                className="p-8 bg-[var(--pt-surface,#1A1A2E)] border border-[var(--pt-border,#ffffff1a)] flex flex-col gap-4"
              >
                <div className="flex justify-between items-baseline gap-5">
                  <h3
                    className="text-[var(--pt-text,#ffffff)] text-2xl leading-[1.15] m-0"
                    style={{ fontFamily: 'var(--font-fraunces), serif', fontWeight: 400 }}
                  >
                    {offering.name}
                  </h3>
                  {have ? (
                    <span className="flex items-center gap-1.5 flex-none">
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: 'var(--pt-accent,#B76E79)' }}
                      />
                      <span
                        className="text-[10px] uppercase tracking-[0.2em]"
                        style={{ color: 'var(--pt-accent,#B76E79)' }}
                      >
                        Member
                      </span>
                    </span>
                  ) : (
                    <span className="text-[13px] tracking-[0.1em] text-[var(--pt-text,#ffffff)] flex-none">
                      {priceLine}
                    </span>
                  )}
                </div>
                {offering.description && (
                  <p className="text-[var(--pt-text2,#ffffff99)] text-sm m-0 leading-relaxed">{offering.description}</p>
                )}

                {/* What's included preview */}
                <WhatsIncluded
                  offering={offering}
                  sessions={contentByOffering[offering.id] || []}
                  liveClasses={liveByOffering[offering.id] || []}
                  sessionCount={sessionCount}
                  hasLiveClasses={hasLiveClasses}
                />

                <div className="mt-1 flex-1 flex flex-col justify-end">
                  {signedOut ? (
                    <Link
                      href="/student-signup"
                      className="block text-center px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-85 bg-[var(--pt-btn-bg,#B76E79)] text-[var(--pt-btn-text,#ffffff)]"
                    >
                      {offering.is_free ? 'Sign up to join' : 'Sign up to get access'}
                    </Link>
                  ) : (
                    <button
                      onClick={() => onCtaClick(offering)}
                      disabled={have || pending || processing || !signedInStudentId}
                      className={have
                        ? 'px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] cursor-default border border-[var(--pt-text,#ffffff)] text-[var(--pt-text,#ffffff)] bg-transparent'
                        : 'px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] transition-opacity hover:opacity-85 disabled:opacity-50 disabled:cursor-default bg-[var(--pt-btn-bg,#B76E79)] text-[var(--pt-btn-text,#ffffff)]'}
                    >
                      {processing ? 'One moment…' : label}
                    </button>
                  )}
                  {awaiting && !pending && !have && (
                    <p className="text-[var(--pt-text2,#ffffff66)] text-xs mt-2 leading-relaxed">
                      Paid on the linked page? Tap above to request access — the creator will confirm and let you in.
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}
      </div>
    </section>
  )
}

// ─── What's included preview ───────────────────────────────────────────────

function formatDuration(seconds: number | null): string {
  if (!seconds || seconds <= 0) return ''
  const mins = Math.floor(seconds / 60)
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m === 0 ? `${h}h` : `${h}h ${m}m`
}

function formatLiveDate(isoDate: string): string {
  const dt = new Date(isoDate)
  if (isNaN(dt.getTime())) return ''
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  const h = dt.getHours() % 12 || 12
  const m = dt.getMinutes().toString().padStart(2, '0')
  const amPm = dt.getHours() >= 12 ? 'PM' : 'AM'
  return `${days[dt.getDay()]}, ${months[dt.getMonth()]} ${dt.getDate()} · ${h}:${m} ${amPm}`
}

interface WhatsIncludedProps {
  offering: Offering
  sessions: ContentItem[]
  liveClasses: LiveClass[]
  sessionCount: number
  hasLiveClasses: boolean
}

function WhatsIncluded({ offering, sessions, liveClasses, sessionCount, hasLiveClasses }: WhatsIncludedProps) {
  if (offering.access_scope === 'all') {
    const chips: string[] = [
      ...(sessionCount > 0 ? [`All ${sessionCount} sessions`] : []),
      ...(offering.includes_community ? ['Community access'] : []),
      ...(hasLiveClasses ? ['Live sessions'] : []),
      'New content as added',
    ]
    if (chips.length === 0) return null
    return (
      <div className="mt-3 pt-4 border-t border-[var(--pt-border,#ffffff1a)]">
        <p className="text-[10px] font-semibold tracking-[0.22em] text-[var(--pt-text2,#ffffff66)] uppercase mb-2">
          What&apos;s included
        </p>
        <div className="flex flex-col gap-2">
          {chips.map((chip) => (
            <div key={chip} className="flex gap-2.5 text-sm text-[var(--pt-text,#ffffffcc)]">
              <span style={{ color: 'var(--pt-accent,#B76E79)' }}>—</span>
              {chip}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // specific scope — show individual sessions and live classes
  const shownSessions = sessions.slice(0, 4)
  const shownLive = liveClasses.slice(0, 3)
  const moreCount = Math.max(0, sessions.length - shownSessions.length)

  if (shownSessions.length === 0 && shownLive.length === 0) return null

  return (
    <div className="mt-3 pt-3 border-t border-[var(--pt-border,#ffffff1a)]">
      <p className="text-[10px] font-semibold tracking-[0.22em] text-[var(--pt-text2,#ffffff66)] uppercase mb-2">
        What&apos;s included
      </p>
      <div className="space-y-2">
        {shownSessions.map((s) => {
          const thumbUrl = s.mux_playback_id
            ? `https://image.mux.com/${s.mux_playback_id}/thumbnail.jpg?width=80`
            : null
          const meta = [
            s.difficulty_level ? s.difficulty_level.charAt(0).toUpperCase() + s.difficulty_level.slice(1) : null,
            formatDuration(s.duration_seconds),
          ].filter(Boolean).join(' · ')
          return (
            <div key={s.id} className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-md overflow-hidden shrink-0 bg-black border border-[var(--pt-border,#ffffff1a)] flex items-center justify-center">
                {thumbUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={thumbUrl}
                    alt=""
                    className="w-full h-full object-cover"
                    style={{ filter: 'blur(4px)', transform: 'scale(1.1)' }}
                  />
                ) : (
                  <svg className="w-4 h-4 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[var(--pt-text,#ffffffcc)] text-[13px] font-medium truncate">{s.title}</p>
                {meta && <p className="text-[var(--pt-text2,#ffffff66)] text-[11px]">{meta}</p>}
              </div>
            </div>
          )
        })}
        {shownLive.map((lc) => (
          <div key={lc.id} className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-md shrink-0 bg-black border border-[var(--pt-border,#ffffff1a)] flex items-center justify-center">
              <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[var(--pt-text,#ffffffcc)] text-[13px] font-medium truncate">{lc.title}</p>
              <p className="text-[var(--pt-text2,#ffffff66)] text-[11px]">{formatLiveDate(lc.scheduled_at)}</p>
            </div>
          </div>
        ))}
        {moreCount > 0 && (
          <p className="text-[var(--pt-text2,#ffffff66)] text-[12px]">+{moreCount} more</p>
        )}
      </div>
    </div>
  )
}
