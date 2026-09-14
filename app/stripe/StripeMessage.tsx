import { Fraunces, Hanken_Grotesk } from 'next/font/google'

// NOIR auth-family styling to match /signup, /signin, /reset-password, /auth/*:
// ebony page, ivory type, Fraunces masthead, letterspaced SSSION wordmark.
const fraunces = Fraunces({ subsets: ['latin'], weight: ['400', '500'] })
const hanken = Hanken_Grotesk({ subsets: ['latin'], weight: ['400', '500', '600'] })

export default function StripeMessage({
  title,
  body,
}: {
  title: string
  body: string
}) {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0E0E12',
        color: '#F4F1EA',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 24px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          maxWidth: 460,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <span
          className={hanken.className}
          style={{
            fontSize: 12,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#F4F1EA',
            fontWeight: 600,
            marginBottom: 22,
          }}
        >
          SSSION
        </span>
        <h1
          className={fraunces.className}
          style={{
            margin: 0,
            fontWeight: 400,
            fontSize: 'clamp(34px, 7vw, 46px)',
            lineHeight: 1.08,
            letterSpacing: '-0.02em',
          }}
        >
          {title}
        </h1>
        <p
          className={hanken.className}
          style={{
            marginTop: 18,
            marginBottom: 0,
            maxWidth: 380,
            fontSize: 16,
            lineHeight: 1.6,
            color: 'rgba(244, 241, 234, 0.6)',
          }}
        >
          {body}
        </p>
      </div>
    </main>
  )
}
