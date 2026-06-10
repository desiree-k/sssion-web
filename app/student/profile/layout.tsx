import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile | Sssion',
  description: 'Manage your Sssion student profile and account settings.',
}

export default function StudentProfileLayout({ children }: { children: React.ReactNode }) {
  return children
}
