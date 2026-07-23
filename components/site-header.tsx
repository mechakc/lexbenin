'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ChevronDown, LogOut, Menu, User as UserIcon, X } from 'lucide-react'
import { Logo } from '@/components/logo'
import { LanguageToggle } from '@/components/language-toggle'
import { ButtonLink } from '@/components/ui/button-link'
import { useI18n } from '@/lib/i18n'
import { useAuth } from '@/lib/auth'
import { cn } from '@/lib/utils'

export function SiteHeader() {
  const { t } = useI18n()
  const { user, displayName, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const links = [
    { href: '/', label: t.nav.home },
    { href: '/a-propos', label: t.nav.about },
    { href: '/comment-ca-marche', label: t.nav.how },
    { href: '/contact', label: t.nav.contact },
  ]

  useEffect(() => {
    setMobileOpen(false)
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function handleLogout() {
    logout()
    setMenuOpen(false)
    router.push('/')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
          {links.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageToggle />

          {user ? (
            <div className="relative hidden md:block" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="inline-flex items-center gap-2 rounded-md border border-border px-2.5 py-1.5 text-sm font-medium hover:bg-muted"
              >
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-navy text-navy-foreground">
                  <UserIcon className="h-3.5 w-3.5" />
                </span>
                <span className="max-w-[10rem] truncate">{displayName}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-48 overflow-hidden rounded-lg border border-border bg-popover shadow-lg"
                >
                  <Link
                    href="/chat"
                    role="menuitem"
                    className="block px-4 py-2.5 text-sm hover:bg-muted"
                  >
                    {t.nav.chat}
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-border px-4 py-2.5 text-left text-sm text-destructive hover:bg-muted"
                  >
                    <LogOut className="h-4 w-4" />
                    {t.nav.logout}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 md:flex">
              <ButtonLink variant="ghost" size="lg" href="/connexion">
                {t.nav.login}
              </ButtonLink>
              <ButtonLink size="lg" href="/inscription">
                {t.nav.register}
              </ButtonLink>
            </div>
          )}

          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <nav
            className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6"
            aria-label="Mobile"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
              >
                {link.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-border" />
            {user ? (
              <>
                <Link
                  href="/chat"
                  className="rounded-md px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                >
                  {t.nav.chat}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm font-medium text-destructive hover:bg-muted"
                >
                  <LogOut className="h-4 w-4" />
                  {t.nav.logout}
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 px-1 pt-1">
                <ButtonLink
                  variant="outline"
                  size="lg"
                  href="/connexion"
                  className="justify-center"
                >
                  {t.nav.login}
                </ButtonLink>
                <ButtonLink size="lg" href="/inscription" className="justify-center">
                  {t.nav.register}
                </ButtonLink>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
