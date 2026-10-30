'use client'

import Link from 'next/link'
import { ArrowRight, Smartphone, BarChart3, Shield } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(false)

  async function handleSubscribe() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Erreur : ' + (data.error || 'Impossible de créer la session'))
      }
    } catch (e) {
      alert('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-bonavie-600">Bonavie</div>
          <nav className="flex gap-6 items-center">
            <Link href="#comment-ca-marche" className="text-sm hover:text-bonavie-600">Comment ça marche</Link>
            <Link href="#pricing" className="text-sm hover:text-bonavie-600">Tarifs</Link>
            <Link href="/dashboard" className="bg-bonavie-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-bonavie-700">
              Espace client
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight mb-6">
          Plus de Google Reviews.<br />
          <span className="text-bonavie-600">En un tap.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Bonavie fournit des puces NFC à vos clients. Ils tapent, arrivent sur votre page Google Review. 
          Vous gardez le contrôle avec un abonnement simple.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="bg-bonavie-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-bonavie-700 disabled:opacity-50"
          >
            {loading ? 'Chargement...' : 'Commencer'} <ArrowRight size={18} />
          </button>
          <Link href="#comment-ca-marche" className="border px-6 py-3 rounded-lg font-medium hover:bg-gray-100">
            Voir le fonctionnement
          </Link>
        </div>
      </section>

      {/* Features */}
      <section id="comment-ca-marche" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-bonavie-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-bonavie-600" />
              </div>
              <h3 className="font-semibold mb-2">1. Puce NFC</h3>
              <p className="text-gray-600 text-sm">Le client tape sa puce sur le téléphone du client final.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-bonavie-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="text-bonavie-600" />
              </div>
              <h3 className="font-semibold mb-2">2. Redirection Bonavie</h3>
              <p className="text-gray-600 text-sm">La puce ouvre une URL Bonavie qui enregistre le tap et redirige.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-12 h-12 bg-bonavie-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-bonavie-600" />
              </div>
              <h3 className="font-semibold mb-2">3. Google Review</h3>
              <p className="text-gray-600 text-sm">Le client arrive directement sur la page d’avis Google. Vous suivez les stats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Abonnement simple</h2>
          <p className="text-gray-600 mb-10">Gardez vos clients plus longtemps. Les liens restent actifs tant que l’abonnement est payé.</p>
          <div className="bg-white border rounded-2xl p-8 max-w-md mx-auto">
            <div className="text-4xl font-bold mb-2">29€<span className="text-lg font-normal text-gray-500">/mois</span></div>
            <ul className="text-left space-y-3 my-8 text-sm">
              <li className="flex gap-2"><Shield size={16} className="text-bonavie-600 mt-0.5" /> Jusqu’à 5 puces NFC</li>
              <li className="flex gap-2"><Shield size={16} className="text-bonavie-600 mt-0.5" /> Statistiques de taps en temps réel</li>
              <li className="flex gap-2"><Shield size={16} className="text-bonavie-600 mt-0.5" /> Page de redirection personnalisée</li>
              <li className="flex gap-2"><Shield size={16} className="text-bonavie-600 mt-0.5" /> Support et mises à jour</li>
            </ul>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="block w-full bg-bonavie-600 text-white py-3 rounded-lg font-medium hover:bg-bonavie-700 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : 'Démarrer l’essai'}
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Bonavie. Tous droits réservés.
      </footer>
    </div>
  )
}