'use client'

import { useEffect, useRef, useState } from 'react'
import AppStoreBadge from '@/components/AppStoreBadge'
import MobileDownloadBanner from '@/components/MobileDownloadBanner'

// ─── Scroll-fade wrapper ──────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect() } },
      { threshold: 0.12 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

const STUDIO_MAILTO = 'mailto:desiree@sssion.com?subject=Studio%20Interest'

// ─── "Grow when you're ready" cards (aspirational, no pricing) ────────────────
const growCards = [
  {
    title: 'Earn from your community',
    description: 'Take payments, offer paid sessions and memberships',
  },
  {
    title: 'Scale your content',
    description: 'Unlimited sessions, more storage, deeper tools',
  },
  {
    title: 'Understand your growth',
    description: 'Analytics and insights',
  },
  {
    title: 'Run multiple spaces',
    description: 'Separate communities by location, level, or instructor',
  },
]

// ─── Pricing promises (clean list, no icons) ──────────────────────────────────
const promises = [
  'The community core stays free.',
  'We’ll never take a cut of what you earn.',
  'Paid tools are for when you’re ready — never a wall in front of getting started.',
  'We’re building the paid layer with our creators, not at them.',
]

// ─── Roadmap stages (minimal timeline) ────────────────────────────────────────
const roadmap = [
  {
    when: 'Now',
    description: 'Free community spaces, content hosting, live sessions, discovery',
  },
  {
    when: 'Soon',
    description: 'The tools to earn — payments, paid memberships, the things you need once your community is thriving',
  },
  {
    when: 'Ahead',
    description: 'Deeper analytics, multiple spaces, tools built for studios and teachers running something bigger',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#1A1A2E] text-white">

      {/* Nav */}
      <nav className="sticky top-0 z-50 py-5 px-6 bg-[#1A1A2E]/90 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#B76E79]">Sssion</a>
          <div className="flex items-center gap-6">
            <a href="/features" className="text-[#B76E79] font-medium text-sm hidden sm:block">
              Features &amp; Pricing
            </a>
            <a href="/discover" className="text-white/60 hover:text-white transition-colors text-sm hidden sm:block">
              Discover
            </a>
            <a href="/signin" className="text-white/60 hover:text-white transition-colors text-sm hidden sm:block">
              Sign In
            </a>
            <a href="/join" className="px-5 py-2 bg-[#B76E79] text-white text-sm font-semibold rounded-full hover:bg-[#a05f69] transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* ── 1. Hero ──────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#B76E79]/10 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
            Start free. <span className="text-[#B76E79]">Always.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed max-w-2xl mx-auto mb-8">
            Building a community on Sssion is free — and the core of what we do always will be.
          </p>
          <p className="text-lg md:text-xl text-white/55 leading-relaxed max-w-2xl mx-auto mb-12">
            Gather your people, share your movement, host your community in a space that&apos;s yours.
            No algorithm, no cuts, no catch. If all you ever do is build a thriving community here for
            free, that&apos;s a win for us.
          </p>
          <div className="flex justify-center">
            <a
              href="/join"
              className="px-8 py-4 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors text-lg"
            >
              Start your free community →
            </a>
          </div>
        </div>
      </section>

      {/* ── 2. Grow when you're ready ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#16162a]">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Grow when you&apos;re ready
            </h2>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mb-4">
              Some creators reach a point where they want more — to earn from their work, to scale,
              to run something bigger. That&apos;s where our paid tools come in.
            </p>
            <p className="text-[#B76E79] font-semibold text-lg mb-12">
              When you&apos;re ready to:
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 gap-6">
            {growCards.map((c, i) => (
              <FadeIn key={c.title} delay={i * 70}>
                <div className="h-full p-8 rounded-2xl bg-[#1A1A2E]/80 backdrop-blur-sm border border-white/8 hover:border-[#B76E79]/30 transition-colors">
                  <h3 className="text-xl font-semibold text-[#B76E79] mb-3">{c.title}</h3>
                  <p className="text-white/55 leading-relaxed">{c.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={120}>
            <p className="text-white/40 text-sm mt-10 italic">
              We&apos;re shaping it now, alongside the creators and studios using Sssion.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 3. For studios ───────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight">
              For studios &amp; teachers with a physical space
            </h2>
            <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-6">
              If you run a studio or teach in person, Sssion isn&apos;t here to compete with you —
              it&apos;s here to extend what you already do.
            </p>
            <p className="text-white/55 text-lg leading-relaxed mb-6">
              Imagine keeping your members connected between classes, giving them a home online that
              carries your brand, and running separate spaces for your locations or levels — all
              without replacing the in-person community that makes your studio special.
            </p>
            <p className="text-white/55 text-lg leading-relaxed mb-10">
              We&apos;re actively talking with studio owners to build this right. If that&apos;s you,
              we&apos;d love to learn how you think about it.
            </p>
            <a
              href={STUDIO_MAILTO}
              className="inline-flex items-center gap-2 text-[#B76E79] font-semibold text-lg hover:text-[#c97f8a] transition-colors"
            >
              Reach out →
            </a>
          </FadeIn>
        </div>
      </section>

      {/* ── 4. Our promise on pricing ────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#16162a]">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-12">
              Our promise on pricing
            </h2>
          </FadeIn>
          <ul className="space-y-6">
            {promises.map((p, i) => (
              <FadeIn key={p} delay={i * 70}>
                <li className="text-xl md:text-2xl text-white/80 leading-relaxed border-l-2 border-[#B76E79] pl-6">
                  {p}
                </li>
              </FadeIn>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 5. Where we're headed ────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Where we&apos;re headed
            </h2>
            <p className="text-white/60 text-lg md:text-xl leading-relaxed mb-16 max-w-2xl">
              We&apos;re early, and building in the open. Here&apos;s the direction:
            </p>
          </FadeIn>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-[#B76E79]/60 via-[#B76E79]/30 to-transparent" />

            <div className="space-y-12">
              {roadmap.map((item, i) => (
                <FadeIn key={item.when} delay={i * 90}>
                  <div className="flex gap-6 items-start">
                    <div className="relative shrink-0 mt-2">
                      <div className="w-4 h-4 rounded-full bg-[#B76E79]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-[#B76E79] mb-2">{item.when}</h3>
                      <p className="text-white/60 text-lg leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>

          <FadeIn delay={120}>
            <p className="text-white/50 text-lg leading-relaxed mt-16 max-w-2xl">
              Timelines flex as we learn from the people using Sssion. If there&apos;s something you
              need, tell us — we&apos;re listening.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ── 6. Bottom CTA ────────────────────────────────────────────────── */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#B76E79]/8 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <FadeIn>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/join"
                className="px-8 py-4 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors text-lg"
              >
                Start your free community →
              </a>
              <a
                href={STUDIO_MAILTO}
                className="px-8 py-4 border-2 border-[#B76E79] text-[#B76E79] font-semibold rounded-full hover:bg-[#B76E79]/10 transition-colors text-lg"
              >
                Talk to us about studios →
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Floating mobile download banner */}
      <MobileDownloadBanner />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-white/30 text-sm">&copy; 2026 Sssion</p>
            <AppStoreBadge />
          </div>
          <div className="flex flex-wrap gap-6 justify-center">
            <a href="/features" className="text-white/30 hover:text-white/60 text-sm transition-colors">Features &amp; Pricing</a>
            <a href="/discover" className="text-white/30 hover:text-white/60 text-sm transition-colors">Discover</a>
            <a href="/signin" className="text-white/30 hover:text-white/60 text-sm transition-colors">Creator Sign In</a>
            <a href="/join" className="text-white/30 hover:text-white/60 text-sm transition-colors">Join</a>
            <a href="/privacy" className="text-white/30 hover:text-white/60 text-sm transition-colors">Privacy</a>
            <a href="/terms" className="text-white/30 hover:text-white/60 text-sm transition-colors">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
