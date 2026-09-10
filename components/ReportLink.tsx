// Small, unobtrusive "Report" affordance for public content surfaces (creator
// profiles, public content views). Links to the /report page with the subject
// prefilled via query params — no client JS, no login required. Renders in the
// surrounding text color so it fits every theme.

export default function ReportLink({
  username,
  url,
  subject,
  label = 'Report',
  className = '',
  style,
}: {
  /** The @handle being reported (prefills subject_username). */
  username?: string | null
  /** The exact page URL being reported (prefills subject_url). */
  url?: string
  /** Optional human label for what's being reported (e.g. a video title). */
  subject?: string | null
  label?: string
  className?: string
  style?: React.CSSProperties
}) {
  const params = new URLSearchParams()
  if (username) params.set('username', username)
  if (url) params.set('url', url)
  if (subject) params.set('subject', subject)
  const href = `/report${params.toString() ? `?${params.toString()}` : ''}`

  return (
    <a
      href={href}
      className={className}
      title="Report this content or profile"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        fontSize: '12px',
        opacity: 0.7,
        textDecoration: 'none',
        ...style,
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M4 21V4a1 1 0 011-1h11l-2 4 2 4H5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </a>
  )
}
