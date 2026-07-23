'use client'

import { BookMarked, MessageSquareText, ShieldQuestion } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal'

export function TrustSection() {
  const { t } = useI18n()

  const items = [
    {
      icon: BookMarked,
      title: t.home.trust1Title,
      text: t.home.trust1Text,
    },
    {
      icon: MessageSquareText,
      title: t.home.trust2Title,
      text: t.home.trust2Text,
    },
    {
      icon: ShieldQuestion,
      title: t.home.trust3Title,
      text: t.home.trust3Text,
    },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <RevealGroup staggerDelay={0.1} className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <RevealItem key={item.title}>
            <div className="h-full rounded-xl border border-border bg-card p-6 transition-shadow duration-300 hover:shadow-md">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-secondary text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.text}
              </p>
            </div>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
