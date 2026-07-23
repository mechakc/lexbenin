'use client'

import { useI18n } from '@/lib/i18n'
import { Reveal } from '@/components/ui/reveal'
import { AnimatedCounter } from '@/components/ui/animated-counter'

export function StatsSection() {
  const { t } = useI18n()

  const stats = [
    { value: 624, suffix: '', label: t.home.stat1Label },
    { value: 100, suffix: '%', label: t.home.stat2Label },
    { value: 5, suffix: '', label: t.home.stat3Label },
  ]

  return (
    <section className="bg-navy text-navy-foreground">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-3">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1} className="text-center sm:text-left">
              <AnimatedCounter
                value={s.value}
                suffix={s.suffix}
                className="font-serif text-5xl tabular-nums text-amber sm:text-6xl"
              />
              <p className="mt-3 text-sm leading-relaxed text-navy-foreground/70">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
