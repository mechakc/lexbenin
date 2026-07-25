'use client'

import { useEffect } from 'react'
import { checkHealth } from '@/lib/api'

const PING_INTERVAL_MS = 5 * 60 * 1000 // 5 minutes

/**
 * Ping silencieux du backend à intervalle régulier. Le tier gratuit de Render
 * met le service en veille après 15 min d'inactivité (le premier appel après
 * réveil prend alors 30-60s) -- ce composant maintient le backend éveillé tant
 * qu'un onglet du site reste ouvert, pour éviter ce délai à l'utilisateur.
 *
 * Ne rend rien à l'écran ; à monter une seule fois à la racine de l'app
 * (voir components/providers.tsx) pour qu'il tourne quelle que soit la page.
 */
export function KeepAlive() {
  useEffect(() => {
    // Ping immédiat au montage, puis toutes les 5 minutes
    checkHealth()
    const interval = setInterval(() => {
      checkHealth()
    }, PING_INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  return null
}
