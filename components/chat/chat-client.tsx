'use client'

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react'
import Link from 'next/link'
import { AlertTriangle, Info, SendHorizontal, X } from 'lucide-react'
import { CountrySelect } from '@/components/chat/country-select'
import {
  MessageBubble,
  ThinkingBubble,
  type ChatMessage,
} from '@/components/chat/message-bubble'
import { ask, getPays, type Pays } from '@/lib/api'
import { useAuth } from '@/lib/auth'
import { useI18n } from '@/lib/i18n'

const FALLBACK_PAYS: Pays[] = [
  {
    code: 'benin',
    label: 'Bénin',
    domaine: 'droit_numerique',
    domaine_label: 'Droit numérique',
    statut: 'verifie',
  },
]

export function ChatClient() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [pays, setPays] = useState<Pays[]>(FALLBACK_PAYS)
  const [country, setCountry] = useState('benin')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Load available countries/domains for the selector.
  useEffect(() => {
    getPays()
      .then((data) => {
        if (data.length > 0) {
          setPays(data)
          setCountry(data[0].code)
        }
      })
      .catch(() => {
        // Keep the fallback option so the UI stays usable offline.
      })
  }, [])

  // Auto-scroll to the latest message.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, loading])

  async function submitQuestion(question: string) {
    const trimmed = question.trim()
    if (!trimmed || loading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: trimmed,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await ask(country, trimmed)
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: res.reponse,
          sources: res.sources,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: t.chat.errorGeneric,
          error: true,
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submitQuestion(input)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    // Respect IME composition (CJK) and Safari's 229 keyCode quirk.
    if (
      e.key === 'Enter' &&
      !e.shiftKey &&
      !e.nativeEvent.isComposing &&
      e.keyCode !== 229
    ) {
      e.preventDefault()
      submitQuestion(input)
    }
  }

  const suggestions = [
    t.chat.suggestion1,
    t.chat.suggestion2,
    t.chat.suggestion3,
  ]

  const showBanner = !user && !bannerDismissed

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col bg-background">
      {/* Top bar: country selector */}
      <div className="border-b border-border bg-card/60">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div>
            <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              {t.chat.countryLabel}
            </p>
            <div className="mt-1">
              <CountrySelect
                options={pays}
                value={country}
                onChange={setCountry}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Guest banner */}
      {showBanner && (
        <div className="border-b border-border bg-secondary/60">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2.5 text-sm">
            <Info className="h-4 w-4 shrink-0 text-primary" />
            <p className="text-secondary-foreground">
              {t.chat.guestBanner}{' '}
              <Link
                href="/inscription"
                className="font-semibold text-primary underline underline-offset-2"
              >
                {t.chat.guestBannerCta}
              </Link>
            </p>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              className="ml-auto text-muted-foreground hover:text-foreground"
              aria-label="Fermer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <h1 className="font-serif text-2xl font-semibold text-foreground">
                {t.chat.emptyTitle}
              </h1>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground text-pretty">
                {t.chat.emptyText}
              </p>
              <div className="mt-6 flex w-full max-w-md flex-col gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => submitQuestion(s)}
                    className="rounded-lg border border-border bg-card px-4 py-3 text-left text-sm text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {loading && <ThinkingBubble />}
            </div>
          )}
        </div>
      </div>

      {/* Composer + disclaimer */}
      <div className="border-t border-border bg-card/60">
        <div className="mx-auto max-w-3xl px-4 py-3">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={t.chat.placeholder}
              className="max-h-40 min-h-[2.75rem] flex-1 resize-none rounded-xl border border-input bg-background px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
              aria-label={t.chat.send}
            >
              <SendHorizontal className="h-5 w-5" />
            </button>
          </form>
          <div className="mt-2 flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber" />
            <span>{t.chat.disclaimer}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
