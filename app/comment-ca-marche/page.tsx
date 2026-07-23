'use client'

import {
  MessageSquare,
  Search,
  FileText,
  Quote,
  FileCheck2,
  ExternalLink,
  XCircle,
  ArrowRight,
} from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal'
import { useI18n } from '@/lib/i18n'

const OFFICIAL_PDF =
  'https://finances.bj/wp-content/uploads/2019/11/code_du_numerique_du_benin_2018.pdf'

export default function HowItWorksPage() {
  const { t, lang } = useI18n()

  const steps = [
    { icon: <MessageSquare className="h-5 w-5" />, title: t.how.step1Title, text: t.how.step1Text },
    { icon: <Search className="h-5 w-5" />, title: t.how.step2Title, text: t.how.step2Text },
    { icon: <FileText className="h-5 w-5" />, title: t.how.step3Title, text: t.how.step3Text },
    { icon: <Quote className="h-5 w-5" />, title: t.how.step4Title, text: t.how.step4Text },
  ]

  return (
    <PageShell>
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <Reveal>
            <h1 className="text-4xl font-semibold leading-tight text-balance text-foreground md:text-5xl">
              {t.how.title}
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {t.how.subtitle}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
        {/* Steps */}
        <RevealGroup staggerDelay={0.12} className="flex flex-col gap-6">
          {steps.map((step, i) => (
            <RevealItem key={step.title}>
              <div className="flex gap-5 rounded-xl border border-border bg-card p-6 transition-shadow duration-300 hover:shadow-md">
                <div className="flex flex-col items-center">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {step.icon}
                  </span>
                  {i < steps.length - 1 && (
                    <span className="mt-2 h-full w-px flex-1 bg-border" aria-hidden />
                  )}
                </div>
                <div className="pt-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-meta">
                    {lang === 'en' ? `Step ${i + 1}` : `Étape ${i + 1}`}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground">
                    {step.title}
                  </h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">
                    {step.text}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {/* Exemple avant/après */}
        <div className="mt-16">
          <Reveal>
            <h2 className="font-serif text-2xl text-foreground md:text-3xl">
              {t.how.exampleTitle}
            </h2>
            <p className="mt-2 text-muted-foreground">{t.how.exampleSubtitle}</p>
          </Reveal>

          <div className="mt-8 grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-stretch md:gap-6">
            <Reveal direction="left" className="rounded-xl border border-border bg-secondary/50 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t.how.exampleJargonLabel}
              </p>
              <p className="mt-3 font-serif text-base leading-relaxed text-foreground/80 italic">
                {t.how.exampleJargonText}
              </p>
            </Reveal>

            <div className="hidden items-center justify-center md:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <ArrowRight className="h-5 w-5" />
              </span>
            </div>
            <div className="flex justify-center md:hidden">
              <span className="flex h-9 w-9 rotate-90 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>

            <Reveal direction="right" className="rounded-xl border border-primary/25 bg-primary/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {t.how.examplePlainLabel}
              </p>
              <p className="mt-3 text-base leading-relaxed text-foreground">
                {t.how.examplePlainText}
              </p>
              <p className="mt-4 text-xs font-medium text-meta">{t.how.exampleSource}</p>
            </Reveal>
          </div>
        </div>

        {/* Official source */}
        <Reveal className="mt-16 rounded-xl border border-primary/20 bg-primary/5 p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileCheck2 className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {t.common.officialSource}
              </p>
              <h2 className="mt-1 text-lg font-semibold text-foreground">
                {t.how.sourceTitle}
              </h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {t.how.sourceName}
              </p>
              <a
                href={OFFICIAL_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                {t.how.sourceLink}
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>

        {/* What it is not */}
        <div className="mt-12">
          <Reveal>
            <h2 className="text-2xl font-semibold text-foreground">
              {t.how.notTitle}
            </h2>
          </Reveal>
          <RevealGroup staggerDelay={0.08} className="mt-5 flex flex-col gap-3">
            {[t.how.not1, t.how.not2, t.how.not3].map((n) => (
              <RevealItem key={n}>
                <div className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber" />
                  <span className="leading-relaxed text-foreground">{n}</span>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </PageShell>
  )
}
