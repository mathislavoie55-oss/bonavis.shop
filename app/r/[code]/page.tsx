import { redirect } from 'next/navigation'
import { getLinkByCode, logTap } from '@/lib/store'

export default async function RedirectPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const link = await getLinkByCode(code)

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Lien introuvable</p>
          <p className="text-gray-500 mt-2">Ce code n’existe pas ou n’est plus actif.</p>
        </div>
      </div>
    )
  }

  // Log the tap
  await logTap(code, 'nfc-tap').catch(() => {})

  // Redirect immediately
  redirect(link.google_review_url)
}
