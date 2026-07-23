'use client'

import { Scale } from 'lucide-react'
import type { Source } from '@/lib/api'
import { Markdown } from '@/components/chat/markdown'
import { SourcesList } from '@/components/chat/sources-list'
import { useI18n } from '@/lib/i18n'

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  error?: boolean
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  if (message.role === 'user') {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground sm:max-w-[75%]">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start gap-3">
      <span className="mt-0.5 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy text-navy-foreground sm:inline-flex">
        <Scale className="h-4 w-4" />
      </span>
      <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-ai px-4 py-3 text-sm leading-relaxed text-ai-foreground sm:max-w-[80%]">
        <Markdown content={message.content} />
        {message.sources && <SourcesList sources={message.sources} />}
      </div>
    </div>
  )
}

export function ThinkingBubble() {
  const { t } = useI18n()
  return (
    <div className="flex justify-start gap-3">
      <span className="mt-0.5 hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-navy text-navy-foreground sm:inline-flex">
        <Scale className="h-4 w-4" />
      </span>
      <div className="rounded-2xl rounded-bl-sm bg-ai px-4 py-3 text-sm text-ai-foreground">
        <div className="flex items-center gap-2">
          <span className="flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-meta [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-meta [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-meta" />
          </span>
          <span className="text-navy-foreground/70">{t.chat.thinking}</span>
        </div>
      </div>
    </div>
  )
}
