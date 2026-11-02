import './globals.css'

export const metadata = {
  title: 'Bonavis — Puces NFC pour obtenir plus d’avis Google',
  description: 'Vos clients approchent leur téléphone de la puce NFC Bonavis et arrivent directement sur votre page d’avis Google. Suivez chaque tap. Dès 10 $/mois.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
