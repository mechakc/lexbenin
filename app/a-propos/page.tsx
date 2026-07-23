'use client'

import type { ReactNode } from 'react'
import {
  ShieldCheck,
  Search,
  Quote,
  Compass,
  AlertTriangle,
  Users,
  GraduationCap,
  Briefcase,
} from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import { ButtonLink } from '@/components/ui/button-link'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal'
import { useI18n } from '@/lib/i18n'

export default function AboutPage() {
  const { t } = useI18n()

  const audiences = [
    { icon: Users, title: t.about.audience1Title, text: t.about.audience1Text },
    { icon: GraduationCap, title: t.about.audience2Title, text: t.about.audience2Text },
    { icon: Briefcase, title: t.about.audience3Title, text: t.about.audience3Text },
  ]

  const roadmap = [
    { label: t.home.domainDigital, live: true },
    { label: t.home.domainLabor, live: false },
    { label: t.home.domainFamily, live: false },
    { label: t.home.domainLand, live: false },
    { label: t.home.domainCriminal, live: false },
  ]

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-navy-foreground">
        <div
          className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-4xl px-4 py-20 md:py-28">
          <Reveal>
            <p className="mb-4 text-sm font-medium uppercase tracking-wider text-navy-muted">
              {t.nav.about}
            </p>
            <h1 className="font-serif text-4xl leading-tight text-balance md:text-5xl">
              {t.about.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-navy-foreground/85">
              {t.about.intro}
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        <RevealGroup staggerDelay={0.12} className="flex flex-col gap-16">
          <RevealItem>
            <NarrativeBlock
              icon={<AlertTriangle className="h-5 w-5" />}
              title={t.about.problemTitle}
              text={t.about.problemText}
            />
          </RevealItem>
          <RevealItem>
            <NarrativeBlock
              icon={<Search className="h-5 w-5" />}
              title={t.about.approachTitle}
              text={t.about.approachText}
            />
          </RevealItem>
          <RevealItem>
            <NarrativeBlock
              icon={<Quote className="h-5 w-5" />}
              title={t.about.milTitle}
              text={t.about.milText}
              highlight
            />
          </RevealItem>
          <RevealItem>
            <NarrativeBlock
              icon={<Compass className="h-5 w-5" />}
              title={t.about.visionTitle}
              text={t.about.visionText}
            />
          </RevealItem>
        </RevealGroup>
      </div>

      {/* Bande visuelle -- ancrage Bénin */}
      <Reveal>
        <div className="relative mx-auto h-56 max-w-5xl overflow-hidden rounded-2xl sm:h-72">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/ganvie.jpg"
            alt="Ganvié, cité lacustre du Bénin"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/20 to-transparent" />
          <p className="absolute bottom-5 left-6 max-w-md text-lg font-medium text-white text-balance">
            {t.home.cultureTitle}
          </p>
        </div>
      </Reveal>

      {/* Pour qui */}
      <div className="mx-auto max-w-5xl px-4 py-16 md:py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl leading-tight text-foreground text-balance sm:text-4xl">
            {t.about.audienceTitle}
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
            {t.about.audienceSubtitle}
          </p>
        </Reveal>

        <RevealGroup staggerDelay={0.12} className="mt-12 grid gap-5 sm:grid-cols-3">
          {audiences.map((a) => (
            <RevealItem key={a.title}>
              <div className="h-full rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-secondary text-primary">
                  <a.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {a.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {a.text}
                </p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>

      {/* Roadmap */}
      <div className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-24">
          <Reveal>
            <h2 className="font-serif text-3xl leading-tight text-foreground text-balance sm:text-4xl">
              {t.about.roadmapTitle}
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
              {t.about.roadmapText}
            </p>
          </Reveal>

          <div className="mt-12 flex flex-col gap-0 sm:flex-row sm:items-start sm:gap-0">
            {roadmap.map((step, i) => (
              <Reveal key={step.label} delay={i * 0.08} direction="none" className="relative flex flex-1 items-start gap-3 sm:flex-col sm:items-center sm:gap-3">
                <div className="flex flex-col items-center sm:w-full">
                  <div className="flex w-full items-center">
                    <span
                      className={
                        'h-px flex-1 sm:hidden ' +
                        (i === 0 ? 'bg-transparent' : 'bg-border')
                      }
                    />
                  </div>
                  <span
                    className={
                      'relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ' +
                      (step.live
                        ? 'border-primary bg-primary'
                        : 'border-border bg-background')
                    }
                  >
                    {step.live && (
                      <span className="absolute h-4 w-4 animate-ping rounded-full bg-primary/50" />
                    )}
                  </span>
                  <span
                    className={
                      'hidden h-px flex-1 sm:block sm:w-full ' +
                      (i === roadmap.length - 1 ? 'bg-transparent' : 'bg-border')
                    }
                  />
                </div>
                <div className="pb-8 sm:pb-0 sm:pt-3 sm:text-center">
                  <p className="text-sm font-semibold text-foreground">{step.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {step.live ? t.home.domainLiveLabel : t.home.domainSoonLabel}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-16 md:py-24">
        {/* Values */}
        <Reveal className="rounded-xl border border-border bg-card p-8">
          <h2 className="font-serif text-2xl text-foreground">
            {t.about.valuesTitle}
          </h2>
          <ul className="mt-6 flex flex-col gap-4">
            {[t.about.value1, t.about.value2, t.about.value3].map((v) => (
              <li key={v} className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-base leading-relaxed text-foreground">
                  {v}
                </span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <ButtonLink size="lg" href="/chat">
            {t.nav.chat}
          </ButtonLink>
          <ButtonLink variant="outline" size="lg" href="/comment-ca-marche">
            {t.nav.how}
          </ButtonLink>
        </div>
      </div>
    </PageShell>
  )
}

function NarrativeBlock({
  icon,
  title,
  text,
  highlight,
}: {
  icon: ReactNode
  title: string
  text: string
  highlight?: boolean
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span
          className={
            highlight
              ? 'flex h-10 w-10 items-center justify-center rounded-lg bg-amber/15 text-amber'
              : 'flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary'
          }
        >
          {icon}
        </span>
        <h2 className="font-serif text-2xl text-foreground md:text-3xl">
          {title}
        </h2>
      </div>
      <p
        className={
          highlight
            ? 'border-l-4 border-amber pl-5 text-lg leading-relaxed text-foreground'
            : 'text-lg leading-relaxed text-muted-foreground'
        }
      >
        {text}
      </p>
    </div>
  )
}
