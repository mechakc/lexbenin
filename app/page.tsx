import { PageShell } from '@/components/page-shell'
import { Hero } from '@/components/home/hero'
import { BenefitsSection } from '@/components/home/benefits-section'
import { StatsSection } from '@/components/home/stats-section'
import { TrustSection } from '@/components/home/trust-section'
import { CultureSection } from '@/components/home/culture-section'
import { MapSection } from '@/components/home/map-section'
import { SourceSection, FinalCta } from '@/components/home/source-cta'

export default function HomePage() {
  return (
    <PageShell>
      <Hero />
      <BenefitsSection />
      <StatsSection />
      <SourceSection />
      <TrustSection />
      <CultureSection />
      <MapSection />
      <FinalCta />
    </PageShell>
  )
}
