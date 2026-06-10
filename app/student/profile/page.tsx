'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function StudentProfilePage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Edit profile state
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  // Delete account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        setUserId(user.id)
        setEmail(user.email || '')

        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .maybeSingle()

        const name =
          profile?.full_name || (user.user_metadata?.full_name as string | undefined) || ''
        setFullName(name)
        setEditName(name)
      } catch (err) {
        console.error('Error loading profile:', err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleSaveProfile = async () => {
    if (!userId || !editName.trim()) return

    setIsSaving(true)
    setSaveMessage(null)

    try {
      const trimmed = editName.trim()
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: trimmed })
        .eq('id', userId)

      if (profileError) throw profileError

      await supabase.auth.updateUser({ data: { full_name: trimmed } })

      setFullName(trimmed)
      setIsEditing(false)
      setSaveMessage('Profile updated')
    } catch (err) {
      console.error('Error saving profile:', err)
      setSaveMessage('Could not save your profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    // Student layout redirects to the homepage on SIGNED_OUT
  }

  const handleDeleteAccount = async () => {
    if (!userId) return

    setIsDeleting(true)
    setDeleteError(null)

    try {
      // Delete user data in order (respecting foreign key constraints),
      // mirroring the mobile app's account deletion flow
      await supabase.from('community_likes').delete().eq('user_id', userId)
      await supabase.from('community_comments').delete().eq('author_id', userId)
      await supabase.from('community_posts').delete().eq('author_id', userId)
      await supabase.from('reviews').delete().eq('student_id', userId)
      await supabase.from('watch_history').delete().eq('student_id', userId)
      await supabase.from('studio_access').delete().eq('student_id', userId)
      await supabase
        .from('invite_codes')
        .update({ used_by: null, used_at: null })
        .eq('used_by', userId)
      await supabase.from('profiles').delete().eq('id', userId)

      // Edge Function deletes the auth user
      await supabase.functions.invoke('delete-user')

      await supabase.auth.signOut()
      window.location.assign('/')
    } catch (err) {
      console.error('Error deleting account:', err)
      setDeleteError('Could not delete your account. Please try again or contact support.')
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="py-24 flex justify-center">
        <div className="w-10 h-10 border-2 border-[#B76E79] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <main className="px-6 py-10">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl md:text-4xl font-bold">Profile</h1>

        {/* Profile card */}
        <div className="bg-[#16162a] rounded-2xl border border-white/10 p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#B76E79]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-[#B76E79]">
                {(fullName || email).charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xl font-semibold text-white truncate">
                {fullName || 'Student'}
              </p>
              <p className="text-white/50 text-sm truncate">{email}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4 border-t border-white/10 pt-6">
              <div>
                <label className="block text-sm font-medium text-white/70 mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 bg-[#1A1A2E] border border-white/20 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#B76E79] transition-colors"
                  autoFocus
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving || !editName.trim()}
                  className="px-6 py-2.5 bg-[#B76E79] text-white font-semibold rounded-xl hover:bg-[#a05f69] transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditName(fullName)
                  }}
                  className="px-6 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-white/10 pt-6">
              <button
                onClick={() => {
                  setSaveMessage(null)
                  setIsEditing(true)
                }}
                className="px-6 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          )}

          {saveMessage && (
            <p className="text-sm text-[#B76E79]">{saveMessage}</p>
          )}
        </div>

        {/* Sign out */}
        <div className="bg-[#16162a] rounded-2xl border border-white/10 p-6">
          <button
            onClick={handleSignOut}
            className="text-white/70 hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Danger zone */}
        <div className="bg-[#16162a] rounded-2xl border border-red-500/20 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-red-400 mb-1">Delete Account</h2>
            <p className="text-white/50 text-sm">
              Permanently removes your account, studio memberships, and activity.
              This cannot be undone.
            </p>
          </div>

          {showDeleteConfirm ? (
            <div className="space-y-4 border-t border-red-500/20 pt-4">
              <p className="text-white/80 text-sm">
                Are you sure? All of your data will be permanently deleted.
              </p>
              {deleteError && (
                <p className="text-red-400 text-sm">{deleteError}</p>
              )}
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="px-6 py-2.5 bg-red-500/80 text-white font-semibold rounded-xl hover:bg-red-500 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete My Account'}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-6 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/15 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-6 py-2.5 border border-red-500/40 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors"
            >
              Delete Account
            </button>
          )}
        </div>
      </div>
    </main>
  )
}
