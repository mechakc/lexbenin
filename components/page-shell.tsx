import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export function PageShell({
  children,
  footer = true,
}: {
  children: ReactNode
  footer?: boolean
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      {footer && <SiteFooter />}
    </div>
  )
}
