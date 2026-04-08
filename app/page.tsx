export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-bold text-[#B76E79]">Sssion</span>
          <div className="flex items-center gap-6">
            <a
              href="/discover"
              className="text-white/70 hover:text-white transition-colors hidden sm:block"
            >
              Discover Creators
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

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-bold text-[#B76E79] tracking-tight mb-6">
          Sssion
        </h1>
        <p className="text-2xl md:text-3xl font-light text-white/90 mb-4">
          Movement. Mastered.
        </p>
        <p className="text-lg md:text-xl text-white/60 max-w-xl mb-12">
          A private studio platform for movement creators and their students
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/join"
            className="px-8 py-4 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
          >
            I&apos;m a Creator
          </a>
          <a
            href="/discover"
            className="px-8 py-4 border-2 border-[#B76E79] text-[#B76E79] font-semibold rounded-full hover:bg-[#B76E79]/10 transition-colors"
          >
            I&apos;m a Student
          </a>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 animate-bounce">
          <svg className="w-6 h-6 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* What is Sssion Section */}
      <section id="features" className="py-24 px-6 bg-[#16162a]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            What is Sssion?
          </h2>
          <p className="text-white/60 text-center mb-16 max-w-2xl mx-auto">
            Everything you need to build and grow your movement instruction business
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-8 border border-white/10">
              <div className="w-14 h-14 bg-[#B76E79]/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Your Private Studio</h3>
              <p className="text-white/60 leading-relaxed">
                Upload videos, build your library, set your terms. Create a beautiful space that&apos;s uniquely yours.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-8 border border-white/10">
              <div className="w-14 h-14 bg-[#B76E79]/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Your Community</h3>
              <p className="text-white/60 leading-relaxed">
                Post updates, interact with students, build relationships. Foster a supportive learning environment.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#1A1A2E] rounded-2xl p-8 border border-white/10">
              <div className="w-14 h-14 bg-[#B76E79]/20 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-[#B76E79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Your Business</h3>
              <p className="text-white/60 leading-relaxed">
                Accept payments your way, grow at your own pace. Keep 100% of what you earn through your preferred platforms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to start your studio?
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Join creators who are building thriving movement instruction businesses on Sssion.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/join"
              className="px-10 py-4 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
            >
              Join as Creator
            </a>
            <a
              href="#"
              className="px-10 py-4 border-2 border-white/20 text-white/80 font-semibold rounded-full hover:bg-white/5 transition-colors"
            >
              Download App
            </a>
          </div>
        </div>
      </section>

      {/* Browse Creators Section */}
      <section className="py-16 px-6 bg-[#16162a]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Find Your Instructor
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            Browse our growing community of talented movement creators
          </p>
          <a
            href="/discover"
            className="inline-flex items-center gap-2 px-10 py-4 border-2 border-[#B76E79] text-[#B76E79] font-semibold rounded-full hover:bg-[#B76E79]/10 transition-colors"
          >
            Browse Creators
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; 2026 Sssion
          </p>
          <div className="flex gap-6">
            <a href="/discover" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Discover
            </a>
            <a href="/join" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Creator Signup
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
