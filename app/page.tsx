import AppStoreBadge from '@/components/AppStoreBadge'
import MobileDownloadBanner from '@/components/MobileDownloadBanner'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-[#B76E79]">Sssion</span>
          <div className="flex items-center gap-5">
            <a href="/features" className="text-white/60 hover:text-white transition-colors text-sm hidden md:block">
              Features &amp; Pricing
            </a>
            <a href="/discover" className="text-white/60 hover:text-white transition-colors text-sm hidden md:block">
              Discover Creators
            </a>
            <a href="/signin" className="text-white/60 hover:text-white transition-colors text-sm hidden md:block">
              Creator Sign In
            </a>
            <a href="/founding" className="text-white/60 hover:text-white transition-colors text-sm hidden md:block">
              Founding Studios
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
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 55% at 50% 65%, rgba(183,110,121,0.11) 0%, transparent 70%)',
          }}
        />

        <h1 className="text-[72px] sm:text-[96px] md:text-[120px] font-bold text-[#B76E79] tracking-tight leading-none mb-6">
          Sssion
        </h1>

        <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-6 max-w-2xl">
          Own your movement.
        </p>

        <p className="text-lg md:text-xl text-[#9999AA] max-w-xl leading-relaxed mb-12">
          A private home where movement creators gather their people &mdash; off the algorithm,
          somewhere they own.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <a
            href="/join"
            className="px-8 py-4 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors text-lg"
          >
            I&apos;m a Creator
          </a>
          <a
            href="/student-signup"
            className="px-8 py-4 border-2 border-[#B76E79] text-[#B76E79] font-semibold rounded-full hover:bg-[#B76E79]/10 transition-colors text-lg"
          >
            I&apos;m a Member
          </a>
        </div>

        <div className="flex flex-col items-center gap-3">
          <p className="text-white/35 text-xs uppercase tracking-[0.18em]">Available on iOS</p>
          <AppStoreBadge size="md" />
          <a
            href="/student-signup"
            className="text-[#B76E79] text-sm hover:underline"
          >
            or use Sssion on the web &rarr;
          </a>
        </div>

        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-5 h-5 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mx-6" />

      {/* 2. WHY SSSION EXISTS */}
      <section className="py-28 px-6" style={{ background: '#16162a' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-[#B76E79] text-xs uppercase tracking-[0.22em] font-medium mb-8">
            Why Sssion exists
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
            Built because movement deserves better.
          </h2>
          <p className="text-lg md:text-xl text-[#9999AA] leading-relaxed">
            Pole, floor work, heels, contemporary, flexibility, yoga and flow — the disciplines
            mainstream platforms shadowban, demonetize, and bury. Sssion is a home built for this
            art, on creators&apos; terms.{' '}
            <span className="text-white">No algorithm. No shadowbans. No cuts.</span>
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mx-6" />

      {/* 3. FOR MEMBERS */}
      <section className="py-28 px-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-[#B76E79] text-xs uppercase tracking-[0.22em] font-medium mb-8">
            For members
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
            Find your people. Train anywhere.
          </h2>
          <p className="text-lg md:text-xl text-[#9999AA] leading-relaxed mb-10">
            Find the teachers whose movement speaks to you, train on-demand or drop into live
            classes at your own pace, and belong to a real studio community — people who know your
            name, not a feed that forgets it.
          </p>
          <a
            href="/discover"
            className="inline-flex items-center gap-2 text-[#B76E79] font-semibold text-lg hover:text-[#c97f8a] transition-colors group"
          >
            Explore studios
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mx-6" />

      {/* 4. FOR CREATORS */}
      <section className="py-28 px-6" style={{ background: '#16162a' }}>
        <div className="max-w-2xl mx-auto">
          <p className="text-[#B76E79] text-xs uppercase tracking-[0.22em] font-medium mb-8">
            For creators
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-16">
            Gather your people. On your terms.
          </h2>

          <div className="flex flex-col divide-y divide-white/[0.07]">
            <div className="pb-12">
              <h3 className="text-[#B76E79] text-xl font-semibold mb-4">Bring your people together</h3>
              <p className="text-lg md:text-xl text-[#9999AA] leading-relaxed">
                Post updates, go live, celebrate wins, start the conversation. Sssion is a room
                full of people getting better together — not a one-way broadcast into a feed.
              </p>
            </div>
            <div className="pt-12">
              <h3 className="text-[#B76E79] text-xl font-semibold mb-4">A studio that&apos;s yours</h3>
              <p className="text-lg md:text-xl text-[#9999AA] leading-relaxed">
                Upload your classes, build your library, set the tone. A beautiful private space
                that&apos;s unmistakably yours — no algorithm deciding who sees it, no shadowbans,
                no gatekeepers.
              </p>
            </div>
          </div>

          <p className="text-base md:text-lg text-[#9999AA] leading-relaxed mt-12">
            And when you&apos;re ready to earn from it, you keep 100% —{' '}
            <span className="text-white">no platform cuts, no commissions, ever.</span>
          </p>

          <div className="mt-14">
            <a
              href="/join"
              className="inline-flex items-center gap-2 text-[#B76E79] font-semibold text-lg hover:text-[#c97f8a] transition-colors group"
            >
              Bring your people in
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mx-6" />

      {/* 5. CLOSING CTA */}
      <section className="py-28 px-6 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#B76E79] leading-tight mb-12">
            Your body. Your art.
            <br />
            Your studio.
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/join"
              className="px-8 py-4 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors text-lg"
            >
              I&apos;m a Creator
            </a>
            <a
              href="/student-signup"
              className="px-8 py-4 border-2 border-[#B76E79] text-[#B76E79] font-semibold rounded-full hover:bg-[#B76E79]/10 transition-colors text-lg"
            >
              I&apos;m a Member
            </a>
          </div>
        </div>
      </section>

      {/* Floating mobile download banner */}
      <MobileDownloadBanner />

      {/* 6. FOOTER */}
      <footer className="py-10 px-6 border-t border-white/[0.08]" style={{ background: '#16162a' }}>
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[#B76E79] font-bold text-lg">Sssion</span>
            <span className="text-white/20 hidden sm:block">·</span>
            <p className="text-white/30 text-sm hidden sm:block">&copy; 2026</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href="/founding" className="text-white/35 hover:text-white/60 text-sm transition-colors">
              Founding Studios
            </a>
            <a href="/features" className="text-white/35 hover:text-white/60 text-sm transition-colors">
              Features &amp; Pricing
            </a>
            <a href="/discover" className="text-white/35 hover:text-white/60 text-sm transition-colors">
              Discover Creators
            </a>
            <a href="/signin" className="text-white/35 hover:text-white/60 text-sm transition-colors">
              Creator Sign In
            </a>
            <a href="/student-signin" className="text-white/35 hover:text-white/60 text-sm transition-colors">
              Student Sign In
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
