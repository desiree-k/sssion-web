'use client'

import { useEffect } from 'react'

/**
 * Scroll/motion behaviors for the ivory marketing pages:
 *  - [data-reveal] scroll-in reveals (skipped, shown up-front, under reduce-motion)
 *  - fixed header gains a blurred ivory background once scrolled (#ss-header)
 *  - subtle hero parallax on #ss-hero-media
 *  - hero <video> autoplay kick (some browsers ignore the muted attribute)
 * Renders nothing.
 */
export default function IvoryInteractions() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Hero video autoplay
    const heroVideo = document.querySelector<HTMLVideoElement>('#ss-hero-media video')
    if (heroVideo && !reduce) {
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
          'opacity .9s cubic-bezier(.2,.7,.2,1), transform .9s cubic-bezier(.2,.7,.2,1)'
        el.style.willChange = 'opacity, transform'
        el.style.opacity = '0'
        el.style.transform = 'translateY(30px)'
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
        { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
      )
      els.forEach((el) => io?.observe(el))
    }

    // Ivory header background on scroll + hero parallax
    const header = document.getElementById('ss-header')
    const heroMedia = document.getElementById('ss-hero-media')
    const onScroll = () => {
      const y = window.scrollY || 0
      if (header) {
        if (y > 40) {
          header.style.background = 'rgba(247,244,239,.82)'
          header.style.setProperty('backdrop-filter', 'blur(14px)')
          header.style.setProperty('-webkit-backdrop-filter', 'blur(14px)')
          header.style.borderBottomColor = '#E5E0D6'
        } else {
          header.style.background = 'transparent'
          header.style.setProperty('backdrop-filter', 'none')
          header.style.setProperty('-webkit-backdrop-filter', 'none')
          header.style.borderBottomColor = 'transparent'
        }
      }
      if (!reduce && heroMedia && y < window.innerHeight) {
        heroMedia.style.transform = `translateY(${y * 0.22}px)`
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
