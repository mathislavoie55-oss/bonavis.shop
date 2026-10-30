import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bonavis — Plus de Google Reviews facilement',
  description: 'Système d’abonnement NFC pour collecter des Google Reviews pour votre entreprise.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
