'use client'

import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal'
import { BeninMap } from '@/components/home/benin-map'

export function MapSection() {
  const { t } = useI18n()

  const domains = [
    { label: t.home.domainDigital, live: true },
    { label: t.home.domainLabor, live: false },
    { label: t.home.domainFamily, live: false },
    { label: t.home.domainLand, live: false },
    { label: t.home.domainCriminal, live: false },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <div className="relative mx-auto w-full max-w-xs text-primary lg:max-w-sm">
            <BeninMap className="w-full" />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="font-serif text-3xl leading-tight text-foreground text-balance sm:text-4xl">
              {t.home.mapTitle}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
              {t.home.mapText}
            </p>
          </Reveal>

          <RevealGroup staggerDelay={0.08} className="mt-8 flex flex-wrap gap-2.5">
            {domains.map((d) => (
              <RevealItem key={d.label}>
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={
                    'inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium ' +
                    (d.live
                      ? 'border-primary/30 bg-primary/10 text-primary'
                      : 'border-border bg-secondary text-muted-foreground')
                  }
                >
                  <span
                    className={
                      'h-1.5 w-1.5 rounded-full ' +
                      (d.live ? 'bg-primary' : 'bg-muted-foreground/50')
                    }
                  />
                  {d.label}
                  <span className="text-xs opacity-70">
                    {d.live ? t.home.domainLiveLabel : t.home.domainSoonLabel}
                  </span>
                </motion.span>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}
