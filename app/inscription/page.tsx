'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User2, Building2, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { PageShell } from '@/components/page-shell'
import { Button } from '@/components/ui/button'
import { Field, Input } from '@/components/ui/field'
import { useI18n } from '@/lib/i18n'
import { useAuth } from '@/lib/auth'
import { register, ApiError } from '@/lib/api'
import { cn } from '@/lib/utils'

type AccountType = 'individu' | 'institution'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function passwordStrength(pw: string): 0 | 1 | 2 | 3 {
  if (pw.length < 8) return pw.length === 0 ? 0 : 1
  let score = 1
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++
  if (/\d/.test(pw) || /[^A-Za-z0-9]/.test(pw)) score++
  return Math.min(score, 3) as 0 | 1 | 2 | 3
}

export default function RegisterPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { setSession } = useAuth()

  const [type, setType] = useState<AccountType | null>(null)
  const [values, setValues] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    nom_institution: '',
    secteur_activite: '',
    nombre_employes: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const set = (k: string, v: string) =>
    setValues((prev) => ({ ...prev, [k]: v }))

  const strength = passwordStrength(values.password)
  const strengthLabel = [
    '',
    t.auth.passwordWeak,
    t.auth.passwordMedium,
    t.auth.passwordStrong,
  ][strength]

  function validate(): boolean {
    const e: Record<string, string> = {}
    if (!EMAIL_RE.test(values.email)) e.email = t.auth.errEmailInvalid
    if (values.password.length < 8) e.password = t.auth.errPasswordShort

    if (type === 'individu') {
      if (!values.prenom.trim()) e.prenom = t.auth.errRequired
      if (!values.nom.trim()) e.nom = t.auth.errRequired
    } else {
      if (!values.nom_institution.trim()) e.nom_institution = t.auth.errRequired
      if (!values.secteur_activite.trim()) e.secteur_activite = t.auth.errRequired
      if (!values.nombre_employes.trim()) e.nombre_employes = t.auth.errRequired
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    setFormError('')
    if (!type || !validate()) return
    setSubmitting(true)
    try {
      const payload =
        type === 'individu'
          ? {
              type_compte: 'individu' as const,
              email: values.email,
              password: values.password,
              nom: values.nom,
              prenom: values.prenom,
            }
          : {
              type_compte: 'institution' as const,
              email: values.email,
              password: values.password,
              nom_institution: values.nom_institution,
              secteur_activite: values.secteur_activite,
              nombre_employes: Number(values.nombre_employes) || 0,
            }
      const res = await register(payload)
      setSession(res)
      router.push('/chat')
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) setFormError(t.auth.errEmailExists)
        else if (err.status === 422) setFormError(t.auth.errValidation)
        else setFormError(err.message)
      } else {
        setFormError(t.common.backendOffline)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageShell>
      <div className="mx-auto flex max-w-2xl flex-col px-4 py-14 md:py-20">
        <h1 className="text-3xl font-semibold text-foreground">
          {t.auth.registerTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">{t.auth.registerSubtitle}</p>

        {/* Step 1: choose account type */}
        {!type && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <TypeCard
              icon={<User2 className="h-6 w-6" />}
              title={t.auth.individual}
              desc={t.auth.individualDesc}
              onClick={() => setType('individu')}
            />
            <TypeCard
              icon={<Building2 className="h-6 w-6" />}
              title={t.auth.institution}
              desc={t.auth.institutionDesc}
              onClick={() => setType('institution')}
            />
          </div>
        )}

        {/* Step 2: form */}
        {type && (
          <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5" noValidate>
            <button
              type="button"
              onClick={() => {
                setType(null)
                setErrors({})
                setFormError('')
              }}
              className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              {t.auth.changeType}
            </button>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3">
              {type === 'individu' ? (
                <User2 className="h-5 w-5 text-primary" />
              ) : (
                <Building2 className="h-5 w-5 text-primary" />
              )}
              <span className="font-medium text-foreground">
                {type === 'individu' ? t.auth.individual : t.auth.institution}
              </span>
            </div>

            {type === 'individu' ? (
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label={t.auth.firstName} htmlFor="prenom" error={errors.prenom}>
                  <Input
                    id="prenom"
                    value={values.prenom}
                    onChange={(e) => set('prenom', e.target.value)}
                    autoComplete="given-name"
                  />
                </Field>
                <Field label={t.auth.lastName} htmlFor="nom" error={errors.nom}>
                  <Input
                    id="nom"
                    value={values.nom}
                    onChange={(e) => set('nom', e.target.value)}
                    autoComplete="family-name"
                  />
                </Field>
              </div>
            ) : (
              <>
                <Field
                  label={t.auth.institutionName}
                  htmlFor="nom_institution"
                  error={errors.nom_institution}
                >
                  <Input
                    id="nom_institution"
                    value={values.nom_institution}
                    onChange={(e) => set('nom_institution', e.target.value)}
                  />
                </Field>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field
                    label={t.auth.sector}
                    htmlFor="secteur_activite"
                    error={errors.secteur_activite}
                  >
                    <Input
                      id="secteur_activite"
                      value={values.secteur_activite}
                      onChange={(e) => set('secteur_activite', e.target.value)}
                    />
                  </Field>
                  <Field
                    label={t.auth.employees}
                    htmlFor="nombre_employes"
                    error={errors.nombre_employes}
                  >
                    <Input
                      id="nombre_employes"
                      type="number"
                      min={1}
                      value={values.nombre_employes}
                      onChange={(e) => set('nombre_employes', e.target.value)}
                    />
                  </Field>
                </div>
              </>
            )}

            <Field label={t.auth.email} htmlFor="email" error={errors.email}>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => set('email', e.target.value)}
                autoComplete="email"
              />
            </Field>

            <Field label={t.auth.password} htmlFor="password" error={errors.password}>
              <Input
                id="password"
                type="password"
                value={values.password}
                onChange={(e) => set('password', e.target.value)}
                autoComplete="new-password"
              />
              {values.password.length > 0 && (
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex h-1.5 flex-1 gap-1">
                    {[1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className={cn(
                          'h-full flex-1 rounded-full transition-colors',
                          i <= strength
                            ? strength === 1
                              ? 'bg-destructive'
                              : strength === 2
                                ? 'bg-amber'
                                : 'bg-primary'
                            : 'bg-border',
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {strengthLabel}
                  </span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">{t.auth.passwordHint}</p>
            </Field>

            {formError && (
              <p
                className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive"
                role="alert"
              >
                {formError}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="mt-1"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {t.auth.submitRegister}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>
        )}

        <p className="mt-8 text-sm text-muted-foreground">
          {t.auth.haveAccount}{' '}
          <Link
            href="/connexion"
            className="font-medium text-primary hover:underline"
          >
            {t.auth.loginLink}
          </Link>
        </p>
      </div>
    </PageShell>
  )
}

function TypeCard({
  icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col items-start gap-3 rounded-xl border border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-sm focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </span>
      <span className="text-lg font-semibold text-foreground">{title}</span>
      <span className="text-sm leading-relaxed text-muted-foreground">{desc}</span>
      <span className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-primary">
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </button>
  )
}
