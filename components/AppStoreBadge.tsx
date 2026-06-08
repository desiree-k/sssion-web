const APP_STORE_URL = 'https://apps.apple.com/us/app/sssion/id6763607808'

interface AppStoreBadgeProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function AppStoreBadge({ className = '', size = 'md' }: AppStoreBadgeProps) {
  const sizeClasses = {
    sm: 'px-4 py-2.5 gap-2.5 rounded-xl',
    md: 'px-5 py-3 gap-3 rounded-xl',
    lg: 'px-7 py-4 gap-4 rounded-2xl',
  }
  const iconClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }
  const labelClasses = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs',
  }
  const titleClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  }

  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center bg-black border border-white/20 hover:border-white/50 transition-all hover:scale-[1.02] active:scale-[0.98] ${sizeClasses[size]} ${className}`}
    >
      {/* Apple logo */}
      <svg className={`${iconClasses[size]} text-white shrink-0`} viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <div className="text-left">
        <div className={`text-white/60 leading-none uppercase tracking-wide ${labelClasses[size]}`}>Download on the</div>
        <div className={`text-white font-semibold leading-tight mt-0.5 ${titleClasses[size]}`}>App Store</div>
      </div>
    </a>
  )
}

export { APP_STORE_URL }
