'use client'

import { useEffect, useRef } from 'react'

/**
 * A black "video well" on the ivory page — the ivory/black contrast is the
 * design system. Renders, in priority order:
 *   1. an autoplaying muted/looped video (lazy: only plays while in view), or
 *   2. a real image used as a dark poster in the black well, or
 *   3. a placeholder well with a slow "coming soon" shimmer.
 *
 * reduce-motion: video never autoplays (poster frame shows), shimmer is static.
 *
 * NOTE FOR FOOTAGE REPLACEMENT: pass `video` once real, licensed creator/app
 * footage exists. Poster-only and placeholder wells are marked TODO below and
 * are the spots awaiting real motion. Never wire up stock "generic fitness"
 * footage here.
 */
export default function VideoWell({
  video,
  poster,
  ratio = '16 / 9',
  label = 'Film coming',
  className = '',
}: {
  video?: string
  poster?: string
  ratio?: string
  label?: string
  className?: string
}) {
  const wellRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = wellRef.current
    const v = videoRef.current
    if (!el || !v) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return // leave the poster frame; never autoplay
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const p = v.play()
            if (p && typeof p.catch === 'function') p.catch(() => {})
          } else {
            v.pause()
          }
        })
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const isPlaceholder = !video && !poster

  return (
    <div
      ref={wellRef}
      className={`mk-well ${isPlaceholder ? 'mk-well-ph' : ''} ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {video ? (
        // Real footage. preload="none" keeps it lazy until it scrolls into view.
        <video ref={videoRef} poster={poster} muted loop playsInline preload="none" aria-hidden="true">
          <source src={video} type="video/mp4" />
        </video>
      ) : poster ? (
        // TODO(footage): real photo standing in for a video loop — swap to <video> when licensed.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={poster} alt="" aria-hidden="true" loading="lazy" />
      ) : (
        // TODO(footage): empty placeholder well — drop in a real vertical clip.
        <span className="mk-well-ph-label">{label}</span>
      )}
      {!isPlaceholder && <span className="mk-well-scrim" />}
    </div>
  )
}
