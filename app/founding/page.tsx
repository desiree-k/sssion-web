export const metadata = {
  title: 'Founding Studios | Sssion',
  description:
    'The first 50 instructors building Sssion with us. Apply to become a Founding Studio — free for good, built together.',
}

const APPLY_HREF =
  'mailto:desiree@sssion.com?subject=Founding%20Studio%20Application'

const benefits = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    ),
    headline: 'Free for good.',
    body: 'Your studio stays free, permanently. When we launch premium tools, you keep a founding tier far more generous than the standard plan.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    ),
    headline: 'A founding badge.',
    body: 'Marks you as day-one — and means more as we grow.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    ),
    headline: 'First access to everything.',
    body: 'Native payments, live streaming, analytics, multiple studios — Founding Studios get it first.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    ),
    headline: 'A real say.',
    body: 'Tell us what to build. We actually listen, and we\'ll tell you when your idea ships.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    ),
    headline: 'A direct line to the founder.',
    body: 'Personal onboarding, and a real human you can reach — not a support ticket.',
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 4v16m8-8H4"
      />
    ),
    headline: 'First dibs on referral rewards.',
    body: 'When we open them up, Founding Studios are first in line.',
  },
]

export default function FoundingPage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#B76E79]">Sssion</a>
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
              href={APPLY_HREF}
              className="px-5 py-2 bg-[#B76E79] text-white text-sm font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
            >
              Apply Now
            </a>
          </div>
        </div>
      </nav>

      {/* 1. HERO */}
      <section className="relative flex flex-col items-center justify-center min-h-[70vh] px-6 text-center overflow-hidden pt-24">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(183,110,121,0.13) 0%, transparent 70%)',
          }}
        />
        <p className="text-[#B76E79] text-sm uppercase tracking-[0.2em] font-medium mb-6">
          50 spots · First class only
        </p>
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white leading-[1.05] tracking-tight mb-6">
          Founding Studios
        </h1>
        <p className="text-xl md:text-2xl text-white/60 max-w-xl leading-relaxed">
          The first 50 instructors building Sssion with us
        </p>
      </section>

      {/* 2. INTRO */}
      <section className="py-24 px-6" style={{ background: '#16162a' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-8">
            Sssion is a private studio platform built for movement and dance creators — the people mainstream platforms shadowban, demonetize, and slap content warnings on for doing their art.
          </p>
          <p className="text-xl md:text-2xl text-white leading-relaxed">
            We&apos;re opening the doors to our first 50 Founding Studios.{' '}
            <span className="text-[#B76E79]">Not a beta test — a founding class.</span>{' '}
            The instructors who get in now will shape what this platform becomes.
          </p>
        </div>
      </section>

      {/* 3. WHAT A FOUNDING STUDIO GETS */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#B76E79] text-sm uppercase tracking-[0.2em] font-medium mb-4">
            What a Founding Studio gets
          </p>
          <p className="text-2xl text-white/75 leading-relaxed mb-16">
            Your own private studio — your content, your community, your rules, your pricing.
            We&apos;re the infrastructure, not the landlord.
          </p>

          <div className="flex flex-col divide-y divide-white/[0.07]">
            {benefits.map(({ icon, headline, body }, i) => (
              <div key={i} className="flex items-start gap-5 py-8">
                <div className="shrink-0 w-11 h-11 rounded-xl bg-[#B76E79]/15 flex items-center justify-center mt-0.5">
                  <svg className="w-5 h-5 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {icon}
                  </svg>
                </div>
                <div>
                  <p className="text-white font-semibold text-lg mb-1">{headline}</p>
                  <p className="text-white/60 leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WHY ONLY 50 */}
      <section className="py-24 px-6" style={{ background: '#16162a' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-[#B76E79] text-sm uppercase tracking-[0.2em] font-medium mb-6">
            Why only 50?
          </p>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
            Because we onboard every Founding Studio personally. We&apos;ll sit down with you, set up your studio together, and make sure you&apos;re live and ready before you share it with a single student. That kind of care doesn&apos;t scale past a small group — so we&apos;re keeping the first class small on purpose.
          </p>
        </div>
      </section>

      {/* 5. WHAT WE'RE LOOKING FOR */}
      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#B76E79] text-sm uppercase tracking-[0.2em] font-medium mb-6">
            What we&apos;re looking for
          </p>
          <p className="text-xl md:text-2xl text-white/80 leading-relaxed">
            Movement instructors who take their craft seriously and are tired of building on platforms that treat their art like a liability. Pole, flexibility, floor work, heels, contemporary, yoga and flow, strength — if you teach movement and you&apos;ve felt the censorship, this is for you.
          </p>
        </div>
      </section>

      {/* 6. BOTTOM CTA */}
      <section
        className="py-28 px-6"
        style={{ background: 'linear-gradient(135deg, #2a1520 0%, #1e1230 100%)' }}
      >
        <div className="max-w-xl mx-auto text-center">
          <p className="text-white/50 text-sm uppercase tracking-[0.2em] font-medium mb-6">
            50 spots · First come, first considered
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-10 leading-tight">
            Your body. Your art. Your studio.
          </h2>
          <a
            href={APPLY_HREF}
            className="inline-block px-12 py-5 bg-[#B76E79] text-white font-semibold text-lg rounded-full hover:bg-[#a05f69] transition-colors"
          >
            Apply to be a Founding Studio
          </a>
          <p className="text-white/35 text-sm mt-8 leading-relaxed">
            Applications reviewed personally.
            <br />
            We&apos;ll be in touch within 48 hours.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <a href="/" className="text-[#B76E79] font-bold text-lg">Sssion</a>
            <span className="text-white/20 hidden sm:block">·</span>
            <p className="text-white/30 text-sm hidden sm:block">&copy; 2026</p>
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
