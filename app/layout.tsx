import './globals.css'
import PasswordGate from '@/components/PasswordGate'

export const metadata = {
  title: 'Bonavis — Plus de Google Reviews facilement',
  description: 'Abonnement NFC pour collecter des Google Reviews',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <PasswordGate>{children}</PasswordGate>
      </body>
    </html>
  )
}
