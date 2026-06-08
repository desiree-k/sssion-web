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

// ─── Waitlist form ────────────────────────────────────────────────────────────
function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('loading')
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), note: 'pro_interest' }),
      })
      if (res.ok) {
        setStatus('done')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <p className="text-[#B76E79] font-semibold text-sm mt-4">
        ✓ You&apos;re on the list. We&apos;ll reach out when Pro launches.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#B76E79] transition-colors text-sm"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3 bg-[#B76E79] text-white font-semibold rounded-xl hover:bg-[#a05f69] transition-colors text-sm disabled:opacity-60"
      >
        {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-xs text-center">Something went wrong. Try again.</p>
      )}
    </form>
  )
}

// ─── Feature card data ────────────────────────────────────────────────────────
const features = [
  {
    title: 'Your Video Library',
    description: 'Upload your classes without worrying about takedowns. Pole combos, floor work, sensual flow — it all belongs here.',
    icon: (
      <svg className="w-7 h-7 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Private Community',
    description: 'A space where your students can show up fully. Share wins, post progress, ask questions. No algorithms deciding who sees what.',
    icon: (
      <svg className="w-7 h-7 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Discovery Feed',
    description: "New students find you through a familiar feed, dedicated to Sssion creators — swipe, discover, fall in love with a new style. Your movement speaks for itself.",
    icon: (
      <svg className="w-7 h-7 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
      </svg>
    ),
  },
  {
    title: 'Access Control',
    description: "You choose who's in your studio. Approve students, set your own terms, revoke access whenever you need to. Your space, your boundaries.",
    icon: (
      <svg className="w-7 h-7 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    title: 'Live Classes',
    description: 'Schedule live sessions and your students show up with one tap. Bring the energy of a real class to anywhere in the world.',
    icon: (
      <svg className="w-7 h-7 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Your Studio Link',
    description: 'sssion.studio/yourname — one link for your bio, your DMs, your everything. Send anyone straight to your world.',
    icon: (
      <svg className="w-7 h-7 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
  },
  {
    title: 'Get Paid Your Way',
    description: 'CashApp, PayPal, Venmo, whatever works for you. We never touch your money or take a cut.',
    icon: (
      <svg className="w-7 h-7 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Safe Space',
    description: 'Report and block tools that actually work. Your community stays yours. We handle the rest.',
    icon: (
      <svg className="w-7 h-7 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
]

const freeFeatures = [
  'Up to 10 gated in-studio videos',
  '5 hours of video storage',
  'Unlimited preview clips (up to 5 min each)',
  'Private community feed',
  'Student access management',
  'External payment links',
  'Personal studio link',
  'Live class scheduling',
]

const proFeatures = [
  'Everything in Free',
  'Unlimited videos and storage',
  'In-app live streaming',
  'Analytics dashboard',
  'Priority in discovery feed',
  'Native payment processing',
  'Custom studio branding',
  'Multiple studio spaces — organize by style, level, or series',
]

const roadmap = [
  {
    title: 'In-app live streaming',
    eta: 'Coming Q3 2026',
    description: 'Go live directly in the app. No Zoom links, no setup. Just you and your students.',
  },
  {
    title: 'Analytics dashboard',
    eta: 'Coming Q3 2026',
    description: 'See who\'s watching, what\'s resonating, and where your community is growing.',
  },
  {
    title: 'Native payments',
    eta: 'Coming Q4 2026',
    description: 'Accept payments directly in the app. Subscriptions, drop-ins, bundles — all yours to design.',
  },
  {
    title: 'Android app',
    eta: 'In beta',
    description: 'Full Android support is in testing now. More movers, more reach.',
    isBeta: true,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function FeaturesPage() {
  function scrollToFeatures() {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

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

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#B76E79]/10 blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1.5 rounded-full bg-[#B76E79]/15 border border-[#B76E79]/30 text-[#B76E79] text-sm font-medium mb-8">
            Built for pole, exotic, and sensual movement
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Your movement.<br />
            Your art.<br />
            <span className="text-[#B76E79]">Your platform.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/60 leading-relaxed max-w-2xl mx-auto mb-12">
            No shadowbans. No content warnings on your craft. Just a space to teach, connect, and grow — built for movers, by movers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/join"
              className="px-8 py-4 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors text-lg"
            >
              Get Started Free
            </a>
            <button
              onClick={scrollToFeatures}
              className="px-8 py-4 border-2 border-white/20 text-white/80 font-semibold rounded-full hover:bg-white/5 transition-colors text-lg"
            >
              See What&apos;s Inside
            </button>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6 bg-[#16162a]">
        <div className="max-w-6xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Built for your movement
            </h2>
            <p className="text-white/50 text-center mb-16 max-w-xl mx-auto text-lg">
              Everything mainstream platforms won&apos;t give you. Everything you actually need.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 60}>
                <div className="h-full p-8 rounded-2xl bg-[#1A1A2E]/80 backdrop-blur-sm border border-white/8 hover:border-[#B76E79]/30 transition-colors group">
                  <div className="w-14 h-14 bg-[#B76E79]/15 rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#B76E79]/25 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-white/55 leading-relaxed">{f.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Simple pricing, no surprises
            </h2>
            <p className="text-white/50 text-center mb-16 max-w-xl mx-auto text-lg">
              Start for free. Upgrade when you&apos;re ready to scale.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-2 gap-8 items-start">

            {/* Free tier */}
            <FadeIn delay={0}>
              <div className="h-full p-8 rounded-2xl border border-white/15 bg-white/3 backdrop-blur-sm flex flex-col">
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">Free</h3>
                  <p className="text-white/50">Start for free. Seriously.</p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold">$0</span>
                    <span className="text-white/40 ml-2">/ forever</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                  {freeFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#B76E79] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white/70 text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="/join"
                  className="block w-full py-4 text-center border-2 border-[#B76E79] text-[#B76E79] font-semibold rounded-xl hover:bg-[#B76E79]/10 transition-colors"
                >
                  Get Started Free
                </a>
              </div>
            </FadeIn>

            {/* Pro tier */}
            <FadeIn delay={120}>
              <div className="h-full p-8 rounded-2xl border border-[#B76E79]/50 bg-gradient-to-br from-[#B76E79]/10 to-[#1A1A2E]/50 backdrop-blur-sm flex flex-col relative overflow-hidden">
                {/* Glow */}
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-[#B76E79]/20 rounded-full blur-3xl pointer-events-none" />

                <div className="mb-8 relative">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-bold">Pro</h3>
                    <span className="px-3 py-1 bg-[#B76E79]/20 border border-[#B76E79]/40 text-[#B76E79] text-xs font-bold rounded-full uppercase tracking-wide">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-white/50">When you&apos;re ready to go bigger.</p>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-[#B76E79]">TBD</span>
                  </div>
                  <p className="text-white/30 text-sm mt-2">Pricing announced soon</p>
                </div>

                <ul className="space-y-4 mb-10 flex-1 relative">
                  {proFeatures.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-[#B76E79] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-white/70 text-sm leading-relaxed">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="relative">
                  <WaitlistForm />
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>

      {/* ── Coming Soon ───────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-[#16162a]">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              What&apos;s next
            </h2>
            <p className="text-white/50 text-center mb-16 max-w-xl mx-auto text-lg">
              We&apos;re moving fast. Here&apos;s what&apos;s coming.
            </p>
          </FadeIn>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-5 top-2 bottom-2 w-px bg-gradient-to-b from-[#B76E79]/60 via-[#B76E79]/30 to-transparent hidden sm:block" />

            <div className="space-y-10">
              {roadmap.map((item, i) => (
                <FadeIn key={item.title} delay={i * 80}>
                  <div className="flex gap-6 items-start">
                    {/* Dot */}
                    <div className="relative shrink-0 hidden sm:block">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${item.isBeta ? 'border-green-400 bg-green-400/10' : 'border-[#B76E79] bg-[#B76E79]/10'}`}>
                        {item.isBeta ? (
                          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 pb-2">
                      <div className="flex flex-wrap items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.isBeta ? 'bg-green-400/15 text-green-400 border border-green-400/30' : 'bg-[#B76E79]/15 text-[#B76E79] border border-[#B76E79]/30'}`}>
                          {item.eta}
                        </span>
                      </div>
                      <p className="text-white/50 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="py-28 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#B76E79]/8 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <FadeIn>
            <p className="text-[#B76E79] font-semibold text-lg mb-4 uppercase tracking-widest text-sm">
              Your time is now
            </p>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Stop renting space on platforms that don&apos;t want you.
            </h2>
            <p className="text-2xl text-white/60 mb-12">
              Build your studio. Own your movement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center flex-wrap">
              <a
                href="/join"
                className="px-10 py-5 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors text-lg"
              >
                Get Started Free
              </a>
              <AppStoreBadge size="lg" />
            </div>
            <p className="mt-6 text-white/40 text-sm">
              Questions?{' '}
              <a href="mailto:support@sssion.studio" className="hover:text-white/70 transition-colors underline underline-offset-2">
                support@sssion.studio
              </a>
            </p>
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
