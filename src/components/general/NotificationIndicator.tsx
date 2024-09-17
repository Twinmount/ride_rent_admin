interface NotificationIndicatorProps {
  className?: string // Optional className prop
}

export default function NotificationIndicator({
  className = '',
}: NotificationIndicatorProps) {
  return (
    <span className={`absolute flex w-3 h-3 top-1 right-1 ${className}`}>
      <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-yellow animate-ping" />
      <span className="relative inline-flex w-3 h-3 rounded-full bg-yellow" />
    </span>
  )
}
