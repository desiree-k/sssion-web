import { supabase } from '@/lib/supabase'
import { Metadata } from 'next'
import CreatorGrid from './CreatorGrid'

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
  created_at: string
  profile: {
    username: string
    profile_image_url: string | null
    bio: string | null
  } | null
}

async function getCreators() {
  const { data, error } = await supabase
    .from('creators')
    .select(`
      id,
      display_name,
      specialties,
      created_at,
      profile:profiles!creators_user_id_fkey (
        username,
        profile_image_url,
        bio
      )
    `)
    .order('created_at', { ascending: false })

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
  const creators = await getCreators()

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-6 px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <a href="/" className="text-2xl font-bold text-[#B76E79]">
            Sssion
          </a>
          <div className="flex items-center gap-4">
            <a
              href="/signin"
              className="text-white/70 hover:text-white text-sm transition-colors"
            >
              Creator Sign In
            </a>
            <a
              href="/join"
              className="px-5 py-2 bg-[#B76E79] text-white text-sm font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
            >
              Join as Creator
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 bg-gradient-to-b from-[#B76E79]/20 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Creators
          </h1>
          <p className="text-xl text-white/60">
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
      <section className="py-16 px-6 bg-[#16162a]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Are you a movement creator?
          </h2>
          <p className="text-white/60 mb-8">
            Build your private studio, share your content, and grow your community on Sssion.
          </p>
          <a
            href="/join"
            className="inline-block px-10 py-4 bg-[#B76E79] text-white font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
          >
            Join as Creator
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            &copy; 2026 Sssion
          </p>
          <div className="flex gap-6">
            <a href="/" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Home
            </a>
            <a href="/signin" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Creator Sign In
            </a>
            <a href="/join" className="text-white/40 hover:text-white/60 text-sm transition-colors">
              Creator Signup
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
