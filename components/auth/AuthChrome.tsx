import { Fraunces, Hanken_Grotesk } from 'next/font/google'
import ComplianceFooterLinks from '@/components/ComplianceFooterLinks'

// Shared NOIR chrome for the auth family (/signup, /signin, /student-signin,
// /reset-password, /auth/*, /stripe/*). Mirrors the app's redesigned entry flow
// (Sssion Onboarding "noir welcome" screen): ebony page, ivory type, Fraunces
// masthead, letterspaced SSSION wordmark, ivory-fill pill buttons, champagne
// links. Rose gold (#B76E79) is deliberately absent here.
//
// Palette: page #0E0E12 · field #1A1A20 · hairline #2A2A30 · ivory #F4F1EA ·
// champagne #C9A96A · ink #0E0E12.

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  weight: ['400', '500', '600'],
})
const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-hanken',
})

export const authFontVars = `${fraunces.variable} ${hanken.variable}`

/** Fraunces display class for mastheads. */
export const displayFont = fraunces.className

// ── Shared Tailwind class tokens ─────────────────────────────────────────────
// Fields: #1A1A20 fill, #2A2A30 border, ivory text, ivory low-opacity focus ring
// (no rose). Reused across every form input in the family.
export const authInput =
  'w-full px-4 py-3 bg-[#1A1A20] border border-[#2A2A30] rounded-xl text-[#F4F1EA] placeholder:text-[#F4F1EA]/30 focus:outline-none focus:border-[#F4F1EA]/40 focus:ring-2 focus:ring-[#F4F1EA]/20 transition-colors'

// Primary button: ivory fill, ink text, pill radius.
export const authPrimaryBtn =
  'w-full py-4 bg-[#F4F1EA] text-[#0E0E12] font-semibold rounded-full hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

// Secondary / quiet button on the ebony surface.
export const authSecondaryBtn =
  'inline-flex items-center justify-center gap-2 py-3 px-6 bg-[#1A1A20] border border-[#2A2A30] text-[#F4F1EA]/80 font-semibold rounded-full hover:bg-[#22222a] transition-colors'

// Inline links — champagne, underline on hover.
export const authLink = 'text-[#C9A96A] hover:underline'

/** Letterspaced SSSION wordmark, ivory (matches the noir welcome screen). */
export function Wordmark({ className = '', href = '/' }: { className?: string; href?: string }) {
  const mark = (
    <span
      className={`text-lg font-semibold tracking-[0.32em] text-[#F4F1EA] ${className}`}
    >
      SSSION
    </span>
  )
  return href ? (
    <a href={href} aria-label="Sssion home" className="inline-flex">
      {mark}
    </a>
  ) : (
    mark
  )
}

/** Uppercase eyebrow ("STEP ONE" style) above a masthead. */
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#F4F1EA]/45 mb-4">
      {children}
    </p>
  )
}

/** Fraunces masthead heading. */
export function Masthead({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <h1
      className={`${displayFont} font-normal text-3xl md:text-4xl text-[#F4F1EA] tracking-tight ${className}`}
    >
      {children}
    </h1>
  )
}

/**
 * Full noir page shell with ebony header (wordmark + optional right link) and
 * footer (compliance links + back-to-site). Used by the chrome pages
 * (/signup, /signin, /student-signin).
 */
export function AuthShell({
  headerLink,
  children,
}: {
  headerLink?: { label: string; href: string }
  children: React.ReactNode
}) {
  return (
    <div className={`${authFontVars} min-h-screen bg-[#0E0E12] flex flex-col font-[family-name:var(--font-hanken)]`}>
      <header className="py-6 px-6 border-b border-[#2A2A30]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Wordmark />
          {headerLink && (
            <a
              href={headerLink.href}
              className="text-[#F4F1EA]/60 hover:text-[#F4F1EA] text-sm transition-colors"
            >
              {headerLink.label}
            </a>
          )}
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="py-6 px-6 border-t border-[#2A2A30] text-[#F4F1EA]/50">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
          <ComplianceFooterLinks />
          <a href="/" className="text-sm hover:text-[#F4F1EA]/70 transition-colors">
            &larr; Back to sssion.studio
          </a>
        </div>
      </footer>
    </div>
  )
}

/**
 * Minimal centered noir shell (no header/footer) for the transactional pages
 * (/reset-password, /auth/*): ebony page, centered wordmark, content below.
 */
export function AuthCenter({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${authFontVars} min-h-screen bg-[#0E0E12] flex items-center justify-center px-6 font-[family-name:var(--font-hanken)]`}>
      <div className="w-full max-w-md">
        <div className="mb-10 flex justify-center">
          <Wordmark />
        </div>
        {children}
      </div>
    </div>
  )
}
