'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Scale, KeyRound, Compass, ShieldOff } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal'

function TiltCard({
  icon: Icon,
  title,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  text: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: py * -5, y: px * 5 })
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 18 }}
      style={{ transformStyle: 'preserve-3d', perspective: 800 }}
      className="group h-full rounded-2xl border border-border bg-card p-7 transition-colors duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary transition-transform duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-5.5 w-5.5" />
      </span>
      <h3 className="mt-5 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 leading-relaxed text-muted-foreground">{text}</p>
    </motion.div>
  )
}

export function BenefitsSection() {
  const { t } = useI18n()

  const items = [
    { icon: ShieldOff, title: t.home.benefit1Title, text: t.home.benefit1Text },
    { icon: KeyRound, title: t.home.benefit2Title, text: t.home.benefit2Text },
    { icon: Compass, title: t.home.benefit3Title, text: t.home.benefit3Text },
    { icon: Scale, title: t.home.benefit4Title, text: t.home.benefit4Text },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl leading-tight text-foreground text-balance sm:text-4xl">
          {t.home.benefitsTitle}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
          {t.home.benefitsSubtitle}
        </p>
      </Reveal>

      <RevealGroup staggerDelay={0.12} className="mt-14 grid gap-6 sm:grid-cols-2">
        {items.map((it) => (
          <RevealItem key={it.title}>
            <TiltCard icon={it.icon} title={it.title} text={it.text} />
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
