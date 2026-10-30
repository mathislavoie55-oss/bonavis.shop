import { notFound } from 'next/navigation'
import { getLinkByCode, logTap } from '@/lib/store'

export default async function RedirectPage({ params }: { params: { code: string } }) {
  const { code } = params
  const link = await getLinkByCode(code)

  if (!link) {
    return notFound()
  }

  // Log the tap (fire and forget)
  logTap(code, 'nfc-tap').catch(() => {})

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <div className="text-bonavie-600 font-bold text-xl mb-4">Bonavis</div>
        <p className="mb-6">Redirection vers Google Review...</p>
        <a
          href={link.google_review_url}
          className="bg-bonavie-600 text-white px-6 py-3 rounded-lg inline-block"
        >
          Continuer vers Google
        </a>
        <script
          dangerouslySetInnerHTML={{
            __html: `setTimeout(() => { window.location.href = "${link.google_review_url}"; }, 1500);`,
          }}
        />
      </div>
    </div>
  )
}