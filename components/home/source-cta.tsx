'use client'

import { ArrowRight, FileCheck2 } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { useI18n } from '@/lib/i18n'
import { Reveal } from '@/components/ui/reveal'

export function SourceSection() {
  const { t } = useI18n()

  return (
    <section className="border-y border-border bg-secondary/50">
      <Reveal className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-[auto_1fr]">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-navy text-navy-foreground">
          <FileCheck2 className="h-7 w-7" />
        </span>
        <div>
          <h2 className="text-2xl font-semibold text-foreground text-balance">
            {t.home.sourceTitle}
          </h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
            {t.home.sourceText}
          </p>
        </div>
      </Reveal>
    </section>
  )
}

export function FinalCta() {
  const { t } = useI18n()

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-24">
      <Reveal className="relative overflow-hidden rounded-3xl bg-navy px-6 py-14 text-center sm:px-12">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, #e6f1fb 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
          aria-hidden="true"
        />
        <h2 className="relative mx-auto max-w-2xl font-serif text-3xl leading-tight text-navy-foreground text-balance sm:text-4xl">
          {t.home.finalCtaTitle}
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl leading-relaxed text-navy-foreground/70">
          {t.home.finalCtaText}
        </p>
        <div className="relative mt-8 flex justify-center">
          <ButtonLink
            size="lg"
            href="/chat"
            className="h-12 bg-amber px-7 text-base text-amber-foreground hover:bg-amber/90"
          >
            {t.home.finalCta}
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  )
}
