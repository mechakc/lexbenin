'use client'

import type { ReactNode } from 'react'
import { I18nProvider } from '@/lib/i18n'
import { AuthProvider } from '@/lib/auth'
import { KeepAlive } from '@/components/keep-alive'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <KeepAlive />
        {children}
      </AuthProvider>
    </I18nProvider>
  )
}
