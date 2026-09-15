'use client'

/**
 * Live session room — sssion.studio/live/<token>
 *
 * The ONLY client for the deployed `daily-token` edge function (spec:
 * ~/Documents/sssion-327/docs/specs/live_sessions_daily.md, build item 6).
 * The edge function does all access control; this page:
 *   1. requires a signed-in Sssion session (else → sign-in w/ return URL)
 *   2. POSTs { live_token } + JWT to daily-token, which returns
 *      { token, room_url, is_owner, title, creator_username } (403 = no
 *      ticket, still carries creator_username; 410 = the session has ended)
 *   3. mounts Daily Prebuilt full-viewport and joins
 *   4. OWNER only: records creator-track-only (single-participant layout),
 *      re-pinning the layout on reconnect (guarded against double-start)
 *
 * Design: ebony functional surface, ivory/champagne accents, NO rose gold.
 * Mobile Safari first: 100dvh, safe-area insets, no hover-only affordances.
 */

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type {
  DailyCall,
  DailyEventObjectParticipants,
  DailyEventObjectFatalError,
} from '@daily-co/daily-js'

// Ebony palette (matches app/student/*). No rose gold (#B76E79) anywhere.
const EBONY = '#0E0E12'
const SURFACE = '#1A1A20'
const BORDER = '#2A2A30'
const IVORY = '#F4F1EA'
const CHAMPAGNE = '#C9A96A'

const TOKEN_FETCH_TIMEOUT_MS = 15000
// If the owner token did NOT auto-start recording, start it ourselves after a
// short grace period. When start_cloud_recording is on (current token shape),
// 'recording-started' fires first and this timer is cancelled.
const RECORDING_FALLBACK_MS = 4000

type TokenResponse = {
  token: string
  room_url: string
  is_owner: boolean
  title: string
  creator_username?: string
}

// Distinct phases so "empty" and "broken" never look the same.
type Phase =
  | { k: 'auth' } // checking the Sssion session
  | { k: 'loading' } // fetching the Daily token
  | { k: 'ready'; data: TokenResponse } // frame is mounting / live
  | { k: 'no-ticket'; spaceHref: string } // 403 — needs a ticket
  | { k: 'ended' } // token/room expired — the session is over
  | { k: 'error'; message: string } // anything else — retryable

export default function LiveRoomPage() {
  const router = useRouter()
  const params = useParams<{ token: string }>()
  const liveToken = params?.token ?? ''

  const [phase, setPhase] = useState<Phase>({ k: 'auth' })
  const [ownerNotice, setOwnerNotice] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const containerRef = useRef<HTMLDivElement | null>(null)
  const frameRef = useRef<DailyCall | null>(null)
  // Recording reconciliation state (owner only).
  const recRef = useRef<{
    active: boolean
    pinned: string | null
    localSessionId: string | null
    fallbackTimer: ReturnType<typeof setTimeout> | null
  }>({ active: false, pinned: null, localSessionId: null, fallbackTimer: null })

  // ---- Step 1+2: auth gate, then mint a Daily token -------------------------
  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!liveToken) {
        setPhase({ k: 'error', message: 'This live link is missing its session code.' })
        return
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (cancelled) return

      // Step 1 — require a signed-in Sssion session; return here after login.
      if (!session) {
        const here = `/live/${encodeURIComponent(liveToken)}`
        router.replace(`/student-signin?redirect=${encodeURIComponent(here)}`)
        return
      }

      setPhase({ k: 'loading' })

      // Step 2 — POST { live_token } + JWT to the daily-token edge function.
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), TOKEN_FETCH_TIMEOUT_MS)
      let res: Response
      try {
        res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/daily-token`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ live_token: liveToken }),
            signal: controller.signal,
          },
        )
      } catch (err) {
        // Network failure or timeout — never a silent catch.
        if (cancelled) return
        const timedOut = err instanceof DOMException && err.name === 'AbortError'
        setPhase({
          k: 'error',
          message: timedOut
            ? 'Connecting to the session timed out.'
            : 'We could not reach the session.',
        })
        return
      } finally {
        clearTimeout(timeout)
      }

      if (cancelled) return

      if (res.status === 401) {
        // JWT rejected server-side — treat as signed-out and bounce to login.
        const here = `/live/${encodeURIComponent(liveToken)}`
        router.replace(`/student-signin?redirect=${encodeURIComponent(here)}`)
        return
      }

      if (res.status === 403) {
        // No ticket. The response carries creator_username for a direct link.
        let creatorUsername: string | undefined
        try {
          const body = (await res.json()) as { creator_username?: string }
          creatorUsername = body?.creator_username || undefined
        } catch {
          /* body is optional here — fall back to /discover below */
        }
        if (cancelled) return
        setPhase({
          k: 'no-ticket',
          spaceHref: creatorUsername ? `/${creatorUsername}` : '/discover',
        })
        return
      }

      if (res.status === 410) {
        // The session's window has closed → over. { error: 'ended' }
        setPhase({ k: 'ended' })
        return
      }

      if (res.status === 404) {
        // Class/room not found: cancelled or already torn down → over.
        setPhase({ k: 'ended' })
        return
      }

      if (!res.ok) {
        setPhase({
          k: 'error',
          message: 'The session could not be started right now.',
        })
        return
      }

      let data: TokenResponse
      try {
        data = (await res.json()) as TokenResponse
      } catch {
        if (cancelled) return
        setPhase({ k: 'error', message: 'The session sent back an unexpected response.' })
        return
      }
      if (cancelled) return

      if (!data.token || !data.room_url) {
        setPhase({ k: 'error', message: 'The session sent back an incomplete response.' })
        return
      }

      setPhase({ k: 'ready', data })
    }

    run()
    return () => {
      cancelled = true
    }
    // Re-runs on Retry via `reloadKey`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveToken, reloadKey, router])

  // ---- Step 3+4: mount Daily Prebuilt and (owner) drive recording -----------
  useEffect(() => {
    if (phase.k !== 'ready' || !containerRef.current) return
    const { data } = phase
    const container = containerRef.current
    let frame: DailyCall | null = null
    let destroyed = false

    async function mount() {
      let DailyIframe
      try {
        DailyIframe = (await import('@daily-co/daily-js')).default
      } catch {
        if (!destroyed) setPhase({ k: 'error', message: 'The video engine failed to load.' })
        return
      }
      if (destroyed) return

      try {
        // Full-viewport Prebuilt; owner gets studio-quality music mic mode.
        frame = DailyIframe.createFrame(container, {
          showLeaveButton: false, // we provide our own Leave in the top bar
          showFullscreenButton: false,
          iframeStyle: {
            width: '100%',
            height: '100%',
            border: '0',
          },
          ...(data.is_owner ? { micAudioMode: 'music' as const } : {}),
        })
      } catch {
        if (!destroyed) setPhase({ k: 'error', message: 'The video room failed to start.' })
        return
      }
      frameRef.current = frame

      // --- Frame load / connection failures → Retry (or "ended" if expired) --
      frame.on('error', (ev?: DailyEventObjectFatalError) => {
        const type = ev?.error?.type
        // Token/room lifetime is over → the session has ended.
        if (
          type === 'exp-token' ||
          type === 'exp-room' ||
          type === 'nbf-token' ||
          type === 'no-room' ||
          type === 'end-of-life'
        ) {
          setPhase({ k: 'ended' })
        } else {
          setPhase({
            k: 'error',
            message: ev?.errorMsg || 'The connection to the session dropped.',
          })
        }
      })

      // Leaving (network end-of-life or programmatic) returns to the dashboard.
      frame.on('left-meeting', () => {
        if (!destroyed) router.replace('/student/dashboard')
      })

      // --- Owner-only recording control (creator-track-only) -----------------
      if (data.is_owner) {
        frame.on('joined-meeting', (ev?: DailyEventObjectParticipants) => {
          recRef.current.localSessionId = ev?.participants?.local?.session_id ?? null
          reconcileRecording()
        })
        frame.on('recording-started', () => {
          recRef.current.active = true
          if (recRef.current.fallbackTimer) {
            clearTimeout(recRef.current.fallbackTimer)
            recRef.current.fallbackTimer = null
          }
          reconcileRecording()
        })
        frame.on('recording-stopped', () => {
          recRef.current.active = false
          recRef.current.pinned = null
        })
        frame.on('recording-error', (ev) => {
          // Non-blocking: the class continues; the owner is told recording faltered.
          setOwnerNotice(
            (ev && 'errorMsg' in ev && (ev as { errorMsg?: string }).errorMsg) ||
              'Recording hit a problem. The class is still live — we’ll keep trying to record.',
          )
        })
      }

      try {
        await frame.join({ url: data.room_url, token: data.token })
      } catch (err) {
        if (destroyed) return
        setPhase({
          k: 'error',
          message: err instanceof Error ? err.message : 'Could not join the session.',
        })
      }
    }

    // Ensures the recording composites ONLY the creator's track, and re-pins it
    // to the creator's current session_id after a reconnect (otherwise the
    // pinned single-participant layout goes black when the creator's old
    // session_id disappears). Guards against starting a second recording.
    function reconcileRecording() {
      const st = recRef.current
      const sessionId = st.localSessionId
      if (!frame || !sessionId) return

      if (st.active) {
        // A recording is already running (owner token auto-starts one, or we're
        // reconnecting). Never start a second — just re-point the layout.
        if (st.pinned !== sessionId) {
          try {
            frame.updateRecording({
              layout: { preset: 'single-participant', session_id: sessionId },
            })
            st.pinned = sessionId
          } catch {
            setOwnerNotice('Could not update the recording layout after reconnecting.')
          }
        }
        return
      }

      // Not recording yet. Give the token's auto-start a moment; if it never
      // fires, start it ourselves with the creator-only layout.
      if (!st.fallbackTimer) {
        st.fallbackTimer = setTimeout(() => {
          st.fallbackTimer = null
          if (!frame || recRef.current.active) return
          const sid = recRef.current.localSessionId
          if (!sid) return
          try {
            frame.startRecording({
              layout: { preset: 'single-participant', session_id: sid },
            })
            recRef.current.pinned = sid
          } catch {
            setOwnerNotice('Could not start the recording. The class is still live.')
          }
        }, RECORDING_FALLBACK_MS)
      }
    }

    mount()

    return () => {
      destroyed = true
      if (recRef.current.fallbackTimer) {
        clearTimeout(recRef.current.fallbackTimer)
        recRef.current.fallbackTimer = null
      }
      const f = frameRef.current
      frameRef.current = null
      if (f) {
        try {
          f.destroy()
        } catch {
          /* frame already torn down */
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase.k])

  function handleLeave() {
    const f = frameRef.current
    if (f) {
      f.leave().finally(() => router.replace('/student/dashboard'))
    } else {
      router.replace('/student/dashboard')
    }
  }

  // --------------------------------------------------------------------------
  // Render
  // --------------------------------------------------------------------------
  const title = phase.k === 'ready' ? phase.data.title : 'Live session'
  const isMember = phase.k === 'ready' && !phase.data.is_owner

  return (
    <main
      className="flex flex-col overflow-hidden"
      style={{ height: '100dvh', backgroundColor: EBONY, color: IVORY }}
    >
      {/* Top chrome: title + Leave. Always-visible controls (no hover-only). */}
      <header
        className="flex items-center justify-between gap-4 px-4 sm:px-6 shrink-0"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top) + 0.75rem)',
          paddingBottom: '0.75rem',
          borderBottom: `1px solid ${BORDER}`,
          backgroundColor: EBONY,
        }}
      >
        <h1
          className="text-sm sm:text-base font-semibold truncate"
          style={{ color: IVORY }}
        >
          {title}
        </h1>
        <button
          type="button"
          onClick={handleLeave}
          className="shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-opacity active:opacity-70"
          style={{ backgroundColor: IVORY, color: EBONY }}
        >
          Leave
        </button>
      </header>

      {/* Members: recorded-session banner (one line). */}
      {isMember && (
        <div
          className="px-4 sm:px-6 py-2 text-xs sm:text-sm shrink-0"
          style={{
            backgroundColor: SURFACE,
            color: IVORY,
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          This class is recorded.{' '}
          <span style={{ color: CHAMPAGNE }}>
            Only the instructor appears in the recording.
          </span>
        </div>
      )}

      {/* Body: the Daily frame fills the rest; states swap in its place. */}
      <div className="relative flex-1 min-h-0">
        {phase.k === 'ready' ? (
          <div ref={containerRef} className="absolute inset-0" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <StateCard>
              {phase.k === 'auth' || phase.k === 'loading' ? (
                <Loading
                  label={phase.k === 'auth' ? 'Checking your account…' : 'Preparing your session…'}
                />
              ) : phase.k === 'no-ticket' ? (
                <>
                  <Heading>You need a ticket for this class</Heading>
                  <Body>
                    This live session is open to members with a ticket. Grab one from
                    the creator’s Space, then come back to this link.
                  </Body>
                  <PrimaryLink href={phase.spaceHref}>Go to the Space</PrimaryLink>
                </>
              ) : phase.k === 'ended' ? (
                <>
                  <Heading>This session has ended</Heading>
                  <Body>
                    The live room is closed. If it was recorded, the replay will
                    appear in the Space once it’s ready.
                  </Body>
                  <PrimaryLink href="/student/dashboard">Back to your dashboard</PrimaryLink>
                </>
              ) : (
                <>
                  <Heading>Something went wrong</Heading>
                  <Body>{phase.message}</Body>
                  <PrimaryButton onClick={retry}>Retry</PrimaryButton>
                </>
              )}
            </StateCard>
          </div>
        )}

        {/* Owner: non-blocking recording notice. */}
        {ownerNotice && (
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-4 max-w-[92%] w-max rounded-xl px-4 py-2 text-xs sm:text-sm flex items-center gap-3"
            style={{
              backgroundColor: SURFACE,
              color: IVORY,
              border: `1px solid ${CHAMPAGNE}`,
              paddingBottom: 'calc(0.5rem + env(safe-area-inset-bottom))',
            }}
          >
            <span>{ownerNotice}</span>
            <button
              type="button"
              onClick={() => setOwnerNotice(null)}
              className="shrink-0 font-semibold active:opacity-70"
              style={{ color: CHAMPAGNE }}
              aria-label="Dismiss"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </main>
  )

  function retry() {
    setPhase({ k: 'auth' })
    setReloadKey((k) => k + 1)
  }
}

// ---- Small presentational helpers (ebony card + ivory/champagne accents) ----

function StateCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="w-full max-w-md rounded-2xl p-8 text-center flex flex-col items-center gap-4"
      style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
    >
      {children}
    </div>
  )
}

function Loading({ label }: { label: string }) {
  return (
    <>
      <div
        className="w-10 h-10 rounded-full animate-spin"
        style={{ border: `2px solid ${IVORY}55`, borderTopColor: 'transparent' }}
      />
      <p className="text-sm" style={{ color: `${IVORY}b3` }}>
        {label}
      </p>
    </>
  )
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-semibold" style={{ color: IVORY }}>
      {children}
    </h2>
  )
}

function Body({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm leading-relaxed" style={{ color: `${IVORY}b3` }}>
      {children}
    </p>
  )
}

function PrimaryLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="mt-1 inline-block rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity active:opacity-70"
      style={{ backgroundColor: IVORY, color: EBONY }}
    >
      {children}
    </a>
  )
}

function PrimaryButton({
  onClick,
  children,
}: {
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-1 rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity active:opacity-70"
      style={{ backgroundColor: IVORY, color: EBONY }}
    >
      {children}
    </button>
  )
}
