'use client'

import Link from 'next/link'
import { Logo } from '@/components/logo'
import { useI18n } from '@/lib/i18n'

export function SiteFooter() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-navy text-navy-foreground">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo onDark />
            <p className="mt-4 text-sm leading-relaxed text-navy-foreground/70">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-meta">
              {t.footer.product}
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>
                <Link href="/chat" className="text-navy-foreground/80 hover:text-navy-foreground">
                  {t.nav.chat}
                </Link>
              </li>
              <li>
                <Link
                  href="/comment-ca-marche"
                  className="text-navy-foreground/80 hover:text-navy-foreground"
                >
                  {t.nav.how}
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-navy-foreground/80 hover:text-navy-foreground">
                  {t.footer.about}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-meta">{t.footer.legal}</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>
                <Link
                  href="/confidentialite"
                  className="text-navy-foreground/80 hover:text-navy-foreground"
                >
                  {t.privacy.title}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-navy-foreground/80 hover:text-navy-foreground">
                  {t.nav.contact}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <p className="text-xs leading-relaxed text-navy-foreground/60">
            {t.footer.disclaimer}
          </p>
          <p className="mt-2 text-xs text-navy-foreground/50">
            © {year} LexBénin. {t.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  )
}
