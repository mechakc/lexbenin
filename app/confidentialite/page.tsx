'use client'

import { ShieldCheck, Database, Eye, UserCheck } from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import { useI18n } from '@/lib/i18n'

export default function PrivacyPage() {
  const { t } = useI18n()

  const sections = [
    { icon: <ShieldCheck className="h-5 w-5" />, title: t.privacy.introTitle, text: t.privacy.introText },
    { icon: <Database className="h-5 w-5" />, title: t.privacy.collectTitle, text: t.privacy.collectText },
    { icon: <Eye className="h-5 w-5" />, title: t.privacy.useTitle, text: t.privacy.useText },
    { icon: <UserCheck className="h-5 w-5" />, title: t.privacy.rightsTitle, text: t.privacy.rightsText },
  ]

  return (
    <PageShell>
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
          <h1 className="text-4xl font-semibold leading-tight text-balance text-foreground md:text-5xl">
            {t.privacy.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            {t.privacy.updated}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16 md:py-20">
        <div className="flex flex-col gap-6">
          {sections.map((section) => (
            <div
              key={section.title}
              className="flex gap-5 rounded-xl border border-border bg-card p-6"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                {section.icon}
              </span>
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {section.title}
                </h2>
                <p className="mt-2 leading-relaxed text-muted-foreground">
                  {section.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
