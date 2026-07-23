'use client'

import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

export function LanguageToggle({ onDark = false }: { onDark?: boolean }) {
  const { lang, setLang } = useI18n()

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        'inline-flex items-center rounded-md border p-0.5 text-xs font-medium',
        onDark ? 'border-white/15' : 'border-border',
      )}
    >
      {(['fr', 'en'] as const).map((code) => {
        const active = lang === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            aria-pressed={active}
            className={cn(
              'rounded px-2 py-1 uppercase transition-colors',
              active
                ? 'bg-primary text-primary-foreground'
                : onDark
                  ? 'text-navy-foreground/70 hover:text-navy-foreground'
                  : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {code}
          </button>
        )
      })}
    </div>
  )
}
