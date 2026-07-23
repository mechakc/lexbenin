'use client'

import { useRef, useState } from 'react'
import { motion, type Variants } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { ButtonLink } from '@/components/ui/button-link'
import { ChatPreview } from '@/components/home/chat-preview'
import { ScrambleText } from '@/components/ui/scramble-text'
import { Marquee } from '@/components/ui/marquee'
import { useI18n } from '@/lib/i18n'

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

const TICKER_FR = [
  'VOS DROITS',
  'VOTRE PROTECTION',
  'VOS RECOURS',
  'VOTRE VOIX',
  'LA LOI, EXPLIQUÉE',
]
const TICKER_EN = [
  'YOUR RIGHTS',
  'YOUR PROTECTION',
  'YOUR RECOURSE',
  'YOUR VOICE',
  'THE LAW, EXPLAINED',
]

export function Hero() {
  const { t, lang } = useI18n()
  const sectionRef = useRef<HTMLElement>(null)
  const [glow, setGlow] = useState({ x: 50, y: 40 })

  function onMouseMove(e: React.MouseEvent<HTMLElement>) {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (!rect) return
    setGlow({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <section
      ref={sectionRef}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden bg-navy text-navy-foreground"
    >
      {/* Lueur qui suit le curseur -- profondeur interactive sans vidéo ni JS lourd */}
      <div
        className="pointer-events-none absolute inset-0 transition-[background] duration-300 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${glow.x}% ${glow.y}%, rgba(24,95,165,0.25), transparent 70%)`,
        }}
        aria-hidden="true"
      />

      {/* Grain subtil pour une texture tactile, façon papier/imprimé officiel */}
      <div
        className="grain-overlay pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay"
        aria-hidden="true"
      />

      <motion.div
        className="pointer-events-none absolute -bottom-40 -right-20 h-[480px] w-[480px] rounded-full bg-[#C98A3E]/10 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pt-16 pb-10 sm:px-6 lg:grid-cols-2 lg:items-center lg:pt-24 lg:pb-14">
        <motion.div variants={container} initial="hidden" animate="visible">
          <motion.p
            variants={item}
            className="text-xs font-semibold tracking-[0.18em] text-meta uppercase"
          >
            {t.home.heroEyebrow}
          </motion.p>

          <motion.h1
            variants={item}
            className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight text-balance sm:text-5xl"
          >
            <ScrambleText text={t.home.heroTitle} startDelay={0.5} />
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-5 max-w-lg text-lg leading-relaxed text-navy-foreground/75 text-pretty"
          >
            {t.home.heroSubtitle}
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink
              size="lg"
              href="/chat"
              className="h-12 bg-amber px-6 text-base text-amber-foreground hover:bg-amber/90"
            >
              {t.home.heroCta}
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <ButtonLink
              variant="outline"
              size="lg"
              href="/comment-ca-marche"
              className="h-12 border-white/20 bg-transparent px-6 text-base text-navy-foreground hover:bg-white/10 hover:text-navy-foreground"
            >
              {t.home.heroSecondary}
            </ButtonLink>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 flex items-center gap-2 text-sm text-navy-foreground/60"
          >
            <ShieldCheck className="h-4 w-4 text-meta" />
            {t.common.officialSource}
          </motion.div>
        </motion.div>

        <motion.div
          className="lg:pl-6"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <ChatPreview />
        </motion.div>
      </div>

      <div className="relative border-t border-white/10 py-4">
        <Marquee
          items={lang === 'fr' ? TICKER_FR : TICKER_EN}
          className="text-sm font-medium tracking-wide text-navy-foreground/40"
        />
      </div>
    </section>
  )
}
