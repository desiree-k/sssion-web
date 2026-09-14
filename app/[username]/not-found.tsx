import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0E0E12] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-6xl font-bold text-[#F4F1EA] mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-[#F4F1EA] mb-4">Creator Not Found</h2>
      <p className="text-[#F4F1EA]/60 mb-8 max-w-md">
        We couldn&apos;t find a creator with that username. They may have changed their username or the link may be incorrect.
      </p>
      <Link
        href="/"
        className="px-8 py-3 bg-[#F4F1EA] text-[#0E0E12] font-semibold rounded-full hover:bg-white transition-colors"
      >
        Go Home
      </Link>
    </div>
  )
}
