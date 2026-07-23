'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'up' | 'left' | 'right' | 'none'
}

const variantsFor = (direction: RevealProps['direction']): Variants => {
  const offset = 28
  const hidden =
    direction === 'up'
      ? { opacity: 0, y: offset }
      : direction === 'left'
        ? { opacity: 0, x: -offset }
        : direction === 'right'
          ? { opacity: 0, x: offset }
          : { opacity: 0 }

  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }
}

/** Fait apparaître son contenu en fondu + léger décalage quand il entre dans le viewport.
 * Ne se déclenche qu'une fois (viewport once: true) pour ne pas ré-animer à chaque scroll. */
export function Reveal({ children, className, delay = 0, direction = 'up' }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variantsFor(direction)}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/** Version "stagger" : anime une liste d'enfants les uns après les autres.
 * Utiliser avec RevealItem pour chaque enfant direct. */
export function RevealGroup({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({
  children,
  className,
  direction = 'up',
}: {
  children: ReactNode
  className?: string
  direction?: RevealProps['direction']
}) {
  return (
    <motion.div className={className} variants={variantsFor(direction)}>
      {children}
    </motion.div>
  )
}
