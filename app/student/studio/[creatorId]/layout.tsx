import { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ creatorId: string }>
}): Promise<Metadata> {
  const { creatorId } = await params

  const { data } = await supabase
    .from('creators')
    .select('display_name, profile:profiles!user_id(full_name)')
    .eq('id', creatorId)
    .maybeSingle()

  const profile = Array.isArray(data?.profile) ? data?.profile[0] : data?.profile
  const name = data?.display_name || profile?.full_name

  return {
    title: name ? `${name}'s Studio | Sssion` : 'Studio | Sssion',
    description: name
      ? `Train with ${name} on Sssion — classes, live sessions, and community.`
      : 'Your Sssion studio — classes, live sessions, and community.',
  }
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children
}
