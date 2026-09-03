import { redirect } from 'next/navigation'

// Open Door: invite codes are retired — the old invite-gated join flow
// now forwards to the open signup. (creator_waitlist data is untouched.)
export default function JoinPage() {
  redirect('/signup')
}
