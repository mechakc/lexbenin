'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Scale } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export function ChatPreview() {
  const { t } = useI18n()
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -6, y: px * 8 })
  }

  return (
    <motion.div
      style={{ perspective: 1200 }}
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={() => setTilt({ x: 0, y: 0 })}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="rounded-2xl border border-white/10 bg-white/5 p-3 shadow-2xl shadow-black/30 backdrop-blur"
      >
        <div className="flex items-center gap-2 border-b border-white/10 px-2 pb-3">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-meta/20 text-meta">
            <Scale className="h-4 w-4" />
          </span>
          <span className="text-sm font-medium text-navy-foreground">
            Bénin — {t.chat.countryLabel}
          </span>
          <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t.common.officialSource}
          </span>
        </div>

        <div className="space-y-3 px-1 py-4">
          <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-4 py-2.5 text-sm text-primary-foreground">
              {t.home.previewUser}
            </div>
          </div>

          <div className="flex justify-start">
            <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-ai px-4 py-3 text-sm leading-relaxed text-ai-foreground">
              <p>{t.home.previewAi}</p>
              <div className="mt-3 rounded-lg border-l-2 border-meta bg-navy/40 py-2 pr-3 pl-3">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-meta uppercase">
                  <FileText className="h-3 w-3" />
                  {t.chat.sources}
                </div>
                <p className="mt-1 text-xs text-navy-foreground/80">
                  {t.home.previewSource}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
