import Link from 'next/link'

export default function GuideNFCPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-bonavie-600">Bonavis</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Programmer une puce avec NFC Tools</h1>
        <p className="text-gray-600 mb-10">Guide simple pour installer le lien Bonavis sur une puce NFC.</p>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="font-semibold text-lg mb-3">1. Télécharge NFC Tools</h2>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
              <li>Android : cherche « NFC Tools » sur le Play Store</li>
              <li>iPhone : cherche « NFC Tools » sur l’App Store</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="font-semibold text-lg mb-3">2. Ouvre l’onglet Écrire</h2>
            <p className="text-sm text-gray-700">Lance l’application et va dans l’onglet <strong>Écrire</strong>.</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="font-semibold text-lg mb-3">3. Ajoute un enregistrement URL</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
              <li>Clique sur <strong>Ajouter un enregistrement</strong></li>
              <li>Choisis <strong>URL / URI</strong></li>
              <li>Colle le lien Bonavis (ex. <code className="bg-gray-100 px-1 rounded">https://www.bonavis.shop/r/aki</code>)</li>
              <li>Clique sur <strong>OK</strong></li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="font-semibold text-lg mb-3">4. Écris sur la puce</h2>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
              <li>Clique sur <strong>Écrire</strong></li>
              <li>Approche la puce du téléphone</li>
              <li>Attends la confirmation « Écriture réussie »</li>
            </ol>
          </div>

          <div className="bg-white rounded-2xl p-6 border">
            <h2 className="font-semibold text-lg mb-3">5. Teste</h2>
            <p className="text-sm text-gray-700">Approche un autre téléphone de la puce. Il devrait ouvrir directement le lien Google Review.</p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
            <h2 className="font-semibold text-lg mb-2">Astuce</h2>
            <p className="text-sm text-yellow-800">Tu peux aussi imprimer un QR code avec le même lien et le coller à côté de la puce comme secours.</p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <Link href="/admin" className="text-bonavie-600 hover:underline">← Retour à l’admin</Link>
        </div>
      </main>
    </div>
  )
}
