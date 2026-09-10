// Legal + safety links for the site footer, required on every page for
// payment-processor / app-store compliance. Renders in the parent footer's own
// text color (uses `currentColor` via inherited color) so it works unchanged in
// the dark functional footers, the ivory marketing footer, and the per-profile
// ivory/noir themes. No client JS — plain server-rendered anchors.

const LINKS: { href: string; label: string }[] = [
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
  { href: '/content-policy', label: 'Content Policy' },
  { href: '/dmca', label: 'DMCA' },
  { href: '/report', label: 'Report' },
]

export default function ComplianceFooterLinks({
  className = '',
  align = 'center',
}: {
  className?: string
  align?: 'center' | 'start'
}) {
  return (
    <nav
      aria-label="Legal and safety"
      className={className}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 18px',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        alignItems: 'center',
        fontSize: '13px',
        lineHeight: 1.4,
        color: 'inherit',
      }}
    >
      {LINKS.map((l, i) => (
        <span key={l.href} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px 18px' }}>
          <a
            href={l.href}
            style={{ color: 'inherit' }}
            className="opacity-75 no-underline transition-opacity hover:opacity-100 hover:underline"
          >
            {l.label}
          </a>
          {i < LINKS.length - 1 && (
            <span aria-hidden style={{ opacity: 0.35 }}>·</span>
          )}
        </span>
      ))}
    </nav>
  )
}
