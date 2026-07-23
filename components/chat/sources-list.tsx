'use client'

import { ExternalLink, FileText } from 'lucide-react'
import type { Source } from '@/lib/api'
import { useI18n } from '@/lib/i18n'

export function SourcesList({ sources }: { sources: Source[] }) {
  const { t } = useI18n()

  if (!sources || sources.length === 0) return null

  return (
    <div className="mt-4 border-t border-white/10 pt-3">
      <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-meta uppercase">
        <FileText className="h-3.5 w-3.5" />
        {t.chat.sources}
      </div>
      <ul className="mt-2 flex flex-col gap-2">
        {sources.map((source, i) => (
          <li
            key={`${source.numero_article}-${i}`}
            className="rounded-lg border-l-2 border-meta bg-navy/40 py-2.5 pr-3 pl-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-navy-foreground">
                  {t.chat.article} {source.numero_article}
                  {source.titre ? ` — ${source.titre}` : ''}
                </p>
                {source.livre && (
                  <p className="mt-0.5 text-[11px] text-meta">{source.livre}</p>
                )}
              </div>
              {source.source_url && (
                <a
                  href={source.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center gap-1 text-[11px] text-meta hover:text-navy-foreground"
                >
                  {t.chat.viewSource}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            {source.extrait && (
              <p className="mt-1.5 text-xs leading-relaxed text-navy-foreground/70 italic">
                “{source.extrait}”
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
