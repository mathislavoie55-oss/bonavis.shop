import { redirect } from 'next/navigation'
import { getLinkByCode, logTap } from '@/lib/store'
import { headers } from 'next/headers'

export default function RedirectPage({ params }: { params: { code: string } }) {
  const link = getLinkByCode(params.code)

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Lien introuvable</h1>
          <p className="text-gray-600">Ce code NFC n’existe pas ou a été désactivé.</p>
        </div>
      </div>
    )
  }

  if (!link.subscriptionActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-2">Service suspendu</h1>
          <p className="text-gray-600">
            L’abonnement de <strong>{link.companyName}</strong> n’est plus actif. 
            Contactez Bonavie pour réactiver les avis Google.
          </p>
        </div>
      </div>
    )
  }

  // Log the tap
  const headersList = headers()
  const userAgent = headersList.get('user-agent') || undefined
  logTap(params.code, userAgent)

  // In a real app this would be a server-side redirect.
  // For demo we show a branded intermediate page then redirect.
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center max-w-sm px-6">
        <div className="text-bonavie-600 font-bold text-xl mb-4">Bonavie</div>
        <h1 className="text-2xl font-semibold mb-2">{link.companyName}</h1>
        {link.customMessage && (
          <p className="text-gray-600 mb-6">{link.customMessage}</p>
        )}
        <p className="text-sm text-gray-500 mb-8">Redirection vers Google Reviews…</p>
        <a
          href={link.googleReviewUrl}
          className="inline-block bg-bonavie-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          Laisser un avis
        </a>
        <script
          dangerouslySetInnerHTML={{
            __html: `setTimeout(() => { window.location.href = ${JSON.stringify(link.googleReviewUrl)}; }, 1200);`,
          }}
        />
      </div>
    </div>
  )
}
