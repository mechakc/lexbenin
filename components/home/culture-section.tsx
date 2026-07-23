'use client'

import { useI18n } from '@/lib/i18n'
import { Reveal, RevealGroup, RevealItem } from '@/components/ui/reveal'

export function CultureSection() {
  const { t } = useI18n()

  const images = [
    { src: '/images/ganvie.jpg', caption: t.home.cultureCaption1 },
    { src: '/images/dantokpa.jpg', caption: t.home.cultureCaption2 },
    { src: '/images/ouidah.jpg', caption: t.home.cultureCaption3 },
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <h2 className="font-serif text-3xl leading-tight text-foreground text-balance sm:text-4xl">
          {t.home.cultureTitle}
        </h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground text-pretty">
          {t.home.cultureText}
        </p>
      </Reveal>

      <RevealGroup
        staggerDelay={0.15}
        className="mt-14 grid gap-5 sm:grid-cols-3"
      >
        {images.map((img) => (
          <RevealItem key={img.src}>
            <figure className="group relative overflow-hidden rounded-2xl bg-secondary">
              <div className="aspect-[4/5] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.caption}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/0 to-navy/0" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 text-sm font-medium text-white">
                {img.caption}
              </figcaption>
            </figure>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  )
}
