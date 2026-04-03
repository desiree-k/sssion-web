import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#1A1A2E] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold text-[#B76E79] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-white mb-4">Creator Not Found</h2>
      <p className="text-white/60 mb-8 max-w-md">
        We couldn&apos;t find a creator with that username. They may have changed their username or the link may be incorrect.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
