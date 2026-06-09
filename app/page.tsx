import AppStoreBadge from '@/components/AppStoreBadge'
import MobileDownloadBanner from '@/components/MobileDownloadBanner'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#1A1A2E', color: '#fff' }}>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-[#B76E79]">Sssion</span>
          <div className="flex items-center gap-5">
            <a href="/features" className="text-white/60 hover:text-white transition-colors text-sm hidden sm:block">
              Features &amp; Pricing
            </a>
            <a href="/discover" className="text-white/60 hover:text-white transition-colors text-sm hidden sm:block">
              Discover Creators
            </a>
            <a href="/signin" className="text-white/60 hover:text-white transition-colors text-sm hidden sm:block">
              Creator Sign In
            </a>
            <a
              href="/join"
              className="px-5 py-2 bg-[#B76E79] text-white text-sm font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
            >
              Join as Creator
            </a>
          </div>
        </div>
      </nav>

      {/* 1. HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center overflow-hidden">
        {/* Subtle gradient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 60%, rgba(183,110,121,0.12) 0%, transparent 70%)',
          }}
        />

        <p className="text-[#B76E79] text-sm uppercase tracking-[0.2em] mb-8 font-medium">
          Available now on iOS
        </p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight mb-8 max-w-4xl">
          Movement is art.{' '}
          <span className="text-[#B76E79]">Sssion</span> is where it lives.
        </h1>

        <p className="text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed mb-12">
          A private studio platform for dance and movement — pole, flexibility, floor work,
          contemporary, heels, strength, yoga and flow — built by and for the people who teach it.
        </p>

        <AppStoreBadge size="lg" />

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* 2. MISSION */}
      <section className="py-28 px-6" style={{ background: '#16162a' }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl md:text-3xl lg:text-4xl text-white/85 leading-[1.5] font-light">
            Find a teacher whose style moves you, train at your own pace, and become part of a real
            studio community.{' '}
            <span className="text-white font-normal">
              Not a feed. Not an algorithm. A room full of people getting better together.
            </span>
          </p>
        </div>
      </section>

      {/* 3. WHAT YOU'LL FIND */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm uppercase tracking-[0.2em] text-[#B76E79] font-medium mb-6 text-center">
            What you&apos;ll find inside
          </h2>

          <div className="flex flex-col gap-0 divide-y divide-white/8">
            {[
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                ),
                text: 'Real instructors, real classes — on-demand video you can train to anytime, anywhere, beginner to advanced',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4V2m10 2V2M3 8h18M5 20h14a2 2 0 002-2V8H3v10a2 2 0 002 2zm5-8h4m-4 4h4" />
                ),
                text: 'A discovery feed of free previews — swipe, watch, find the style and teacher that fit you',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                ),
                text: 'Live classes — RSVP, add to your calendar, join with one tap',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                ),
                text: 'Private studio communities — share your progress, celebrate wins, get encouragement from people on the same path',
              },
              {
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                ),
                text: 'Studios that belong to their creators — every instructor controls their space, their content, and their pricing',
              },
            ].map(({ icon, text }, i) => (
              <div key={i} className="flex items-start gap-5 py-7">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#B76E79]/15 flex items-center justify-center mt-0.5">
                  <svg className="w-5 h-5 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </div>
                <p className="text-white/75 text-lg leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. FOR INSTRUCTORS */}
      <section
        className="py-28 px-6"
        style={{ background: 'linear-gradient(135deg, #2a1520 0%, #1e1230 100%)' }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#B76E79] text-sm uppercase tracking-[0.2em] font-medium mb-6">
            For Instructors
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
            Your studio, your way.
          </h2>
          <p className="text-xl text-white/65 leading-relaxed mb-12 max-w-xl mx-auto">
            Upload from your phone, build a branded studio page, grow through the discovery feed,
            and teach students anywhere — all in one place.
          </p>
          <a
            href="/join"
            className="inline-block px-10 py-4 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors text-lg"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* 5. TRUST & SAFETY */}
      <section className="py-14 px-6" style={{ background: '#16162a' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-white/35 text-sm leading-relaxed">
            Studios are creator-moderated with tools to set guidelines, review and remove content,
            block users, and report concerns. Sssion responds to reports promptly. Intended for
            adults (17+).
          </p>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section className="py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            Your body. Your art. Your studio.
          </h2>
          <p className="text-xl text-white/55 mb-12">
            Download Sssion and find your movement.
          </p>
          <div className="flex flex-col items-center gap-4">
            <AppStoreBadge size="lg" />
            <p className="text-white/30 text-xs mt-2">Android coming soon</p>
          </div>
        </div>
      </section>

      {/* Floating mobile download banner */}
      <MobileDownloadBanner />

      {/* 7. FOOTER */}
      <footer className="py-10 px-6 border-t border-white/8" style={{ background: '#1A1A2E' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <span className="text-[#B76E79] font-bold text-lg">Sssion</span>
            <span className="text-white/20 hidden sm:block">·</span>
            <p className="text-white/30 text-sm">&copy; 2026</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="/features" className="text-white/35 hover:text-white/60 text-sm transition-colors">
              Features &amp; Pricing
            </a>
            <a href="/discover" className="text-white/35 hover:text-white/60 text-sm transition-colors">
              Discover Creators
            </a>
            <a href="/signin" className="text-white/35 hover:text-white/60 text-sm transition-colors">
              Creator Sign In
            </a>
            <a href="/polecon" className="text-white/35 hover:text-white/60 text-sm transition-colors">
              PoleCon Planner
            </a>
            <a href="/privacy" className="text-white/35 hover:text-white/60 text-sm transition-colors">
              Privacy
            </a>
            <a href="/terms" className="text-white/35 hover:text-white/60 text-sm transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
