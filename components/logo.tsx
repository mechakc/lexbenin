import Link from 'next/link'
import { Scale } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Logo({
  className,
  onDark = false,
}: {
  className?: string
  onDark?: boolean
}) {
  return (
    <Link
      href="/"
      className={cn('inline-flex items-center gap-2', className)}
      aria-label="LexBénin — accueil"
    >
      <span
        className={cn(
          'inline-flex h-9 w-9 items-center justify-center rounded-lg',
          onDark ? 'bg-meta/20 text-meta' : 'bg-navy text-navy-foreground',
        )}
      >
        <Scale className="h-5 w-5" aria-hidden="true" />
      </span>
      <span
        className={cn(
          'text-lg font-semibold tracking-tight',
          onDark ? 'text-navy-foreground' : 'text-foreground',
        )}
      >
        Lex<span className={onDark ? 'text-meta' : 'text-primary'}>Bénin</span>
      </span>
    </Link>
  )
}
