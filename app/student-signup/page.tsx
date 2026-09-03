import { redirect } from 'next/navigation'

// Open Door: one signup for everyone — the old member-only form's flow
// lives on at /signup (same account type, same metadata).
export default function StudentSignUpPage() {
  redirect('/signup')
}
