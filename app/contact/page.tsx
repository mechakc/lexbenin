'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { Loader2, Send, CheckCircle2, Bug, Scale, Handshake } from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { Reveal } from '@/components/ui/reveal'
import { useI18n } from '@/lib/i18n'

export default function ContactPage() {
  const { t } = useI18n()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const reasons = [
    { icon: Bug, title: t.contact.reason1Title, text: t.contact.reason1Text },
    { icon: Scale, title: t.contact.reason2Title, text: t.contact.reason2Text },
    { icon: Handshake, title: t.contact.reason3Title, text: t.contact.reason3Text },
  ]

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault()
    if (!name || !email || !message) return
    setSubmitting(true)
    // Pas d'endpoint /contact côté backend pour l'instant -- simulation d'envoi.
    await new Promise((resolve) => setTimeout(resolve, 600))
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <PageShell>
      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
        {/* Panneau narratif */}
        <div className="relative flex flex-col justify-center overflow-hidden bg-navy px-6 py-16 text-navy-foreground sm:px-12 lg:py-24">
          <div
            className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
            aria-hidden="true"
          />
          <Reveal className="relative max-w-md">
            <h1 className="font-serif text-3xl leading-tight text-balance sm:text-4xl">
              {t.contact.panelTitle}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-navy-foreground/75 text-pretty">
              {t.contact.panelText}
            </p>

            <div className="mt-10 flex flex-col gap-6">
              {reasons.map((r) => (
                <div key={r.title} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-meta">
                    <r.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-medium text-navy-foreground">{r.title}</p>
                    <p className="mt-0.5 text-sm text-navy-foreground/65">
                      {r.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Formulaire */}
        <div className="flex items-center justify-center px-6 py-16 sm:px-12 lg:py-24">
          <Reveal direction="right" className="w-full max-w-sm">
            <p className="text-sm text-muted-foreground">{t.contact.subtitle}</p>

            {submitted ? (
              <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-6 py-10 text-center">
                <CheckCircle2 className="h-9 w-9 text-primary" />
                <p className="font-semibold text-foreground">
                  {t.contact.successTitle}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t.contact.successText}
                </p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-5" noValidate>
                <Field label={t.contact.name} htmlFor="name">
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </Field>
                <Field label={t.contact.email} htmlFor="email">
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </Field>
                <Field label={t.contact.message} htmlFor="message">
                  <textarea
                    id="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="flex w-full rounded-lg border border-input bg-background px-3.5 py-2.5 text-base text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                  />
                </Field>

                <Button type="submit" size="lg" disabled={submitting} className="mt-1">
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {t.contact.submit}
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </PageShell>
  )
}
