// Simple in-memory store for demo. In production, replace with PostgreSQL / Supabase.
export type Link = {
  code: string
  companyName: string
  googleReviewUrl: string
  customMessage?: string
  isActive: boolean
  subscriptionActive: boolean
}

export type Tap = {
  id: string
  code: string
  tappedAt: string
  userAgent?: string
}

// Demo data
export const demoLinks: Link[] = [
  {
    code: 'demo123',
    companyName: 'Restaurant Le Bon Coin',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    customMessage: 'Merci de votre visite ! Votre avis nous aide beaucoup.',
    isActive: true,
    subscriptionActive: true,
  },
  {
    code: 'expired456',
    companyName: 'Salon Élégance',
    googleReviewUrl: 'https://search.google.com/local/writereview?placeid=EXAMPLE',
    isActive: true,
    subscriptionActive: false,
  },
]

export const taps: Tap[] = []

export function getLinkByCode(code: string): Link | undefined {
  return demoLinks.find(l => l.code === code)
}

export function logTap(code: string, userAgent?: string) {
  taps.push({
    id: Math.random().toString(36).slice(2),
    code,
    tappedAt: new Date().toISOString(),
    userAgent,
  })
}

export function getTapsForCode(code: string): Tap[] {
  return taps.filter(t => t.code === code)
}
