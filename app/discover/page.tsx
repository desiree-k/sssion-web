// Cache the page for 60s — subsequent loads within the window are served
// from cache (instant) instead of hitting Supabase on every request.
// Data is at most 1 minute stale, which is fine for a discover page.
export const revalidate = 60

import { supabase } from '@/lib/supabase'
import { Metadata } from 'next'
import CreatorGrid from './CreatorGrid'
import StudentNav from '@/components/StudentNav'

export const metadata: Metadata = {
  title: 'Discover Creators | Sssion',
  description: 'Find movement instructors who inspire you. Browse dance and movement creators on Sssion.',
  openGraph: {
    title: 'Discover Creators | Sssion',
    description: 'Find movement instructors who inspire you. Browse dance and movement creators on Sssion.',
  },
}

interface CreatorWithProfile {
  id: string
  display_name: string | null
  specialties: string[] | null
  is_founding: boolean | null
  created_at: string
  profile: {
    username: string
    profile_image_url: string | null
    bio: string | null
  } | null
}

async function getCreators() {
  const start = Date.now()
  const { data, error } = await supabase
    .from('creators')
    .select(`
      id,
      display_name,
      specialties,
      is_founding,
      created_at,
      profile:profiles!creators_user_id_fkey (
        username,
        profile_image_url,
        bio
      )
    `)
    .eq('is_visible', true)
    .order('created_at', { ascending: false })
    .limit(50)
  console.log('Discover query took:', Date.now() - start, 'ms', '| rows:', data?.length ?? 0)

  if (error) {
    console.error('Error fetching creators:', error)
    return []
  }

  // Filter to only creators with a username set and flatten the profile data
  const creatorsWithUsernames = (data || [])
    .map(creator => ({
      ...creator,
      profile: Array.isArray(creator.profile) ? creator.profile[0] : creator.profile
    }))
    .filter(creator => creator.profile?.username)

  return creatorsWithUsernames as CreatorWithProfile[]
}

export default async function DiscoverPage() {
  const renderStart = Date.now()
  const creators = await getCreators()
  console.log('Discover page render took:', Date.now() - renderStart, 'ms')

  return (
    <div className="min-h-screen bg-[#0E0E12]">
      {/* Navigation */}
      <StudentNav />

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 bg-gradient-to-b from-[#B76E79]/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#F4F1EA] mb-4">
            Discover Creators
          </h1>
          <p className="text-xl text-[#F4F1EA]/60">
            Find movement instructors who inspire you
          </p>
        </div>
      </section>

      {/* Creator Grid */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <CreatorGrid creators={creators} />
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-6 bg-[#1A1A20]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#F4F1EA] mb-4">
            Are you a movement creator?
          </h2>
          <p className="text-[#F4F1EA]/60 mb-8">
            Build your private studio, share your content, and grow your community on Sssion.
          </p>
          <a
            href="/join"
            className="inline-block px-10 py-4 bg-[#B76E79] text-[#F4F1EA] font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
          >
            Join as Creator
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#2A2A30]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#F4F1EA]/40 text-sm">
            &copy; 2026 Sssion
          </p>
          <div className="flex gap-6">
            <a href="/" className="text-[#F4F1EA]/40 hover:text-[#F4F1EA]/60 text-sm transition-colors">
              Home
            </a>
            <a href="/signin" className="text-[#F4F1EA]/40 hover:text-[#F4F1EA]/60 text-sm transition-colors">
              Creator Sign In
            </a>
            <a href="/join" className="text-[#F4F1EA]/40 hover:text-[#F4F1EA]/60 text-sm transition-colors">
              Creator Signup
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
