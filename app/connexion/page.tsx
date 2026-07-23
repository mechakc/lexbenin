'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, LogIn } from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { useI18n } from '@/lib/i18n'
import { useAuth } from '@/lib/auth'
import { login, ApiError } from '@/lib/api'

export default function LoginPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { setSession } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setFormError('')
    if (!email || !password) {
      setFormError(t.auth.errValidation)
      return
    }
    setSubmitting(true)
    try {
      const res = await login(email, password)
      setSession(res)
      router.push('/chat')
    } catch (err) {
      if (err instanceof ApiError) {
        setFormError(err.status === 401 ? t.auth.errInvalid : err.message)
      } else {
        setFormError(t.common.backendOffline)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-md flex-col px-4 py-16 md:py-24">
        <h1 className="text-3xl font-semibold text-foreground">
          {t.auth.loginTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">{t.auth.loginSubtitle}</p>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
          <Field label={t.auth.email} htmlFor="email">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </Field>
          <Field label={t.auth.password} htmlFor="password">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </Field>

          {formError && (
            <p
              className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {formError}
            </p>
          )}

          <Button type="submit" size="lg" disabled={submitting} className="mt-1">
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            {t.auth.submitLogin}
          </Button>
        </form>

        <p className="mt-8 text-sm text-muted-foreground">
          {t.auth.noAccount}{' '}
          <Link
            href="/inscription"
            className="font-medium text-primary hover:underline"
          >
            {t.auth.registerLink}
          </Link>
        </p>
      </div>
    </PageShell>
  )
}
