interface MarqueeProps {
  items: string[]
  className?: string
}

/** Bande de texte qui défile en boucle infinie. Duplique le contenu une fois
 * pour permettre une boucle transform sans saut visible. */
export function Marquee({ items, className }: MarqueeProps) {
  const content = items.join('   ·   ') + '   ·   '

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className ?? ''}`}>
      <div className="animate-marquee inline-flex w-max">
        <span>{content}</span>
        <span aria-hidden="true">{content}</span>
      </div>
    </div>
  )
}
