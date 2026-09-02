/**
 * Small four-pointed champagne/rose "spark" shown after a founding creator's
 * name (creators.is_founding). Pass the themed accent via `color`. The <title>
 * gives the native "Founding creator" hover tooltip.
 */
export default function FoundingSpark({
  color,
  size = 20,
  title = 'Founding creator',
  className,
  style,
}: {
  color: string
  size?: number | string
  title?: string
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      role="img"
      aria-label={title}
      className={className}
      style={style}
    >
      <title>{title}</title>
      <path
        d="M8 0 Q8.72 7.28 16 8 Q8.72 8.72 8 16 Q7.28 8.72 0 8 Q7.28 7.28 8 0 Z"
        fill={color}
      />
    </svg>
  )
}
