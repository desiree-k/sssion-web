import { Bodoni_Moda, Archivo } from 'next/font/google'

// Matches the ivory editorial look of the profile pages: Bodoni masthead,
// Archivo body, ivory tokens.
const bodoni = Bodoni_Moda({ subsets: ['latin'], weight: ['400', '500'] })
const archivo = Archivo({ subsets: ['latin'], weight: ['400', '500', '600'] })

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
        background: '#F7F4EF',
        color: '#1D1B18',
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
          className={archivo.className}
          style={{
            fontSize: 11,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#9E5C68',
            fontWeight: 600,
            marginBottom: 22,
          }}
        >
          Sssion
        </span>
        <h1
          className={bodoni.className}
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
          className={archivo.className}
          style={{
            marginTop: 18,
            marginBottom: 0,
            maxWidth: 380,
            fontSize: 16,
            lineHeight: 1.6,
            color: '#8D877D',
          }}
        >
          {body}
        </p>
      </div>
    </main>
  )
}
