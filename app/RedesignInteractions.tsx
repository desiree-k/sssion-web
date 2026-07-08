'use client'

import { useEffect } from 'react'

/**
 * Imperative scroll/motion behaviors shared by the redesigned pages:
 *  - hero background video autoplay (some browsers ignore the muted attribute)
 *  - scroll-triggered reveals on [data-reveal] elements
 *  - the fixed header fading in a blurred background once scrolled
 *  - subtle hero parallax on #ss-hero-media
 * Renders nothing; operates on the markup rendered by the server component.
 * Honors prefers-reduced-motion by showing everything up front and skipping parallax.
 */
export default function RedesignInteractions() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Hero video autoplay
    const heroVideo = document.querySelector<HTMLVideoElement>('#ss-hero-media video')
    if (heroVideo) {
      heroVideo.muted = true
      heroVideo.playsInline = true
      const tryPlay = () => {
        const p = heroVideo.play()
        if (p && typeof p.catch === 'function') p.catch(() => {})
      }
      tryPlay()
      heroVideo.addEventListener('loadeddata', tryPlay, { once: true })
      heroVideo.addEventListener('canplay', tryPlay, { once: true })
    }

    // Scroll reveals
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    let io: IntersectionObserver | null = null
    if (reduce) {
      els.forEach((el) => {
        el.style.opacity = '1'
        el.style.transform = 'none'
      })
    } else {
      els.forEach((el) => {
        el.style.transition =
          'opacity .95s cubic-bezier(.2,.7,.2,1), transform .95s cubic-bezier(.2,.7,.2,1)'
        el.style.willChange = 'opacity, transform'
        el.style.opacity = '0'
        el.style.transform = 'translateY(34px)'
      })
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const target = e.target as HTMLElement
              const d = target.getAttribute('data-reveal-delay') || '0'
              target.style.transitionDelay = `${d}ms`
              target.style.opacity = '1'
              target.style.transform = 'none'
              io?.unobserve(target)
            }
          })
        },
        { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
      )
      els.forEach((el) => io?.observe(el))
    }

    // Header background on scroll + hero parallax
    const header = document.getElementById('ss-header')
    const heroMedia = document.getElementById('ss-hero-media')
    const onScroll = () => {
      const y = window.scrollY || 0
      if (header) {
        if (y > 40) {
          header.style.background = 'rgba(20,20,31,.72)'
          header.style.setProperty('backdrop-filter', 'blur(14px)')
          header.style.setProperty('-webkit-backdrop-filter', 'blur(14px)')
          header.style.borderBottomColor = 'rgba(255,255,255,.07)'
        } else {
          header.style.background = 'transparent'
          header.style.setProperty('backdrop-filter', 'none')
          header.style.setProperty('-webkit-backdrop-filter', 'none')
          header.style.borderBottomColor = 'transparent'
        }
      }
      if (!reduce && heroMedia && y < window.innerHeight) {
        heroMedia.style.transform = `translateY(${y * 0.28}px)`
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      io?.disconnect()
    }
  }, [])

  return null
}
