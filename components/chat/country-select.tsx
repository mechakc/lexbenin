'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, ChevronDown, Scale } from 'lucide-react'
import type { Pays } from '@/lib/api'
import { cn } from '@/lib/utils'

export function CountrySelect({
  options,
  value,
  onChange,
}: {
  options: Pays[]
  value: string
  onChange: (code: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const selected = options.find((o) => o.code === value)
  const label = selected
    ? `${selected.label} — ${selected.domaine_label}`
    : '—'

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={options.length === 0}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-primary">
          <Scale className="h-3.5 w-3.5" />
        </span>
        <span className="max-w-[16rem] truncate">{label}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {open && options.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 z-30 mt-2 w-72 overflow-hidden rounded-lg border border-border bg-popover p-1 shadow-lg"
        >
          {options.map((option) => {
            const active = option.code === value
            return (
              <li key={option.code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.code)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted',
                    active && 'bg-muted',
                  )}
                >
                  <span>
                    <span className="font-medium text-foreground">
                      {option.label}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {option.domaine_label}
                    </span>
                  </span>
                  {active && <Check className="h-4 w-4 text-primary" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
