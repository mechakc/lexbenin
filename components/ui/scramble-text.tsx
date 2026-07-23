'use client'

import { useEffect, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789§¶'

interface ScrambleTextProps {
  text: string
  className?: string
  /** Délai avant que l'effet ne démarre (secondes) */
  startDelay?: number
  /** Vitesse de résolution : plus haut = plus lent */
  speed?: number
}

/** Anime un texte qui se "décode" caractère par caractère depuis des symboles
 * aléatoires vers le texte final -- un clin d'œil au fait qu'on rend le langage
 * juridique lisible. Respecte `prefers-reduced-motion`. */
export function ScrambleText({ text, className, startDelay = 0, speed = 1 }: ScrambleTextProps) {
  const [display, setDisplay] = useState(text)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReduced) {
      setDisplay(text)
      setDone(true)
      return
    }

    let frame = 0
    let intervalId: ReturnType<typeof setInterval>
    let timeoutId: ReturnType<typeof setTimeout>

    const totalFrames = Math.round(text.length * 1.6 * speed)

    timeoutId = setTimeout(() => {
      intervalId = setInterval(() => {
        frame++
        const progress = frame / totalFrames

        const resolved = Math.floor(progress * text.length)

        setDisplay(
          text
            .split('')
            .map((char, i) => {
              if (char === ' ') return ' '
              if (i < resolved) return text[i]
              return CHARS[Math.floor(Math.random() * CHARS.length)]
            })
            .join(''),
        )

        if (frame >= totalFrames) {
          clearInterval(intervalId)
          setDisplay(text)
          setDone(true)
        }
      }, 28)
    }, startDelay * 1000)

    return () => {
      clearTimeout(timeoutId)
      clearInterval(intervalId)
    }
  }, [text, startDelay, speed])

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{display}</span>
      <span className="sr-only">{done ? '' : text}</span>
    </span>
  )
}
