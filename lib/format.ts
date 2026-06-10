// Shared date/duration formatting for the student web experience

export function timeAgo(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return ''

  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`

  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function formatVideoDuration(seconds: number | null | undefined): string {
  if (!seconds || seconds <= 0) return ''
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatClassDate(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Human countdown to a future time, e.g. "in 3d 4h", "in 25m", "Starting soon" */
export function countdownTo(iso: string): string {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return ''

  const diffMs = date.getTime() - Date.now()
  if (diffMs <= 0) return 'Live now'

  const minutes = Math.floor(diffMs / 60000)
  if (minutes < 5) return 'Starting soon'
  if (minutes < 60) return `in ${minutes}m`

  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `in ${hours}h ${minutes % 60}m`

  const days = Math.floor(hours / 24)
  return `in ${days}d ${hours % 24}h`
}
