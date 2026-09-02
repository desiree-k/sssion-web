'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { Session } from '@supabase/supabase-js'

type NavState = 'loading' | 'student' | 'creator' | 'signedOut'

const APP_STORE_URL = 'https://apps.apple.com/us/app/sssion/id6763607808'

function resolveState(session: Session | null): NavState {
  if (!session) return 'signedOut'
  return session.user.user_metadata?.role === 'creator' ? 'creator' : 'student'
}

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/discover' && pathname.startsWith(`${href}/`))

  return (
    <Link
      href={href}
      className={`text-sm transition-colors ${
        isActive ? 'text-[#B76E79] font-semibold' : 'text-[#F4F1EA]/70 hover:text-[#F4F1EA]'
      }`}
    >
      {label}
    </Link>
  )
}

const STUDENT_LINKS = [
  {
    href: '/discover',
    label: 'Discover',
    icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
  },
  {
    href: '/student/dashboard',
    label: 'My Studios',
    icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z',
  },
  {
    href: '/student/profile',
    label: 'Profile',
    icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
  },
]

export default function StudentNav() {
  const pathname = usePathname()
  const [navState, setNavState] = useState<NavState>('loading')

  // On /student/* pages, mobile gets a bottom tab bar instead of top links
  const useBottomNavOnMobile = navState === 'student' && pathname.startsWith('/student')

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (isMounted) setNavState(resolveState(session))
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) setNavState(resolveState(session))
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 py-4 px-6 border-b border-[#2A2A30] bg-[#0E0E12]/95 backdrop-blur">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#B76E79]">
          Sssion
        </Link>

        <nav className={`items-center gap-4 sm:gap-6 ${useBottomNavOnMobile ? 'hidden md:flex' : 'flex'}`}>
          {navState === 'student' && (
            <>
              <NavLink href="/discover" label="Discover" />
              <NavLink href="/student/dashboard" label="My Studios" />
              <NavLink href="/student/profile" label="Profile" />
            </>
          )}

          {navState === 'creator' && (
            <>
              <NavLink href="/discover" label="Discover" />
              <NavLink href="/dashboard" label="Dashboard" />
            </>
          )}

          {navState === 'signedOut' && (
            <>
              <NavLink href="/discover" label="Discover" />
              <NavLink href="/student-signin" label="Sign In" />
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-[#B76E79] text-[#F4F1EA] text-sm font-semibold rounded-full hover:bg-[#a05f69] transition-colors"
              >
                Download App
              </a>
            </>
          )}
        </nav>
      </div>

      {/* Mobile bottom tab bar for student pages */}
      {useBottomNavOnMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#1A1A20]/95 backdrop-blur border-t border-[#2A2A30]">
          <div className="flex justify-around">
            {STUDENT_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== '/discover' && pathname.startsWith(`${link.href}/`))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex flex-col items-center gap-1 py-2.5 px-5 text-[10px] font-medium transition-colors ${
                    isActive ? 'text-[#B76E79]' : 'text-[#F4F1EA]/50 hover:text-[#F4F1EA]'
                  }`}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={link.icon} />
                  </svg>
                  {link.label}
                </Link>
              )
            })}
          </div>
        </nav>
      )}
    </header>
  )
}
