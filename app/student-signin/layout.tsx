import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Student Sign In | Sssion',
  description: 'Sign in to your Sssion student account to access your studios and keep learning.',
}

export default function StudentSignInLayout({ children }: { children: React.ReactNode }) {
  return children
}
