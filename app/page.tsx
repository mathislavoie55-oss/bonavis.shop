'use client'

import Link from 'next/link'
import { ArrowRight, Smartphone, BarChart3, Shield, Check } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [loading, setLoading] = useState(false)

  async function handleSubscribe() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-bonavie-600">Bonavis</div>
          <nav className="flex gap-6 items-center">
            <Link href="#comment-ca-marche" className="text-sm hover:text-bonavie-600">Comment ça marche</Link>
            <Link href="#pricing" className="text-sm hover:text-bonavie-600">Tarifs</Link>
            <Link href="/login" className="bg-bonavie-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-bonavie-700">
              Espace client
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Plus de Google Reviews.<br />
          <span className="text-bonavie-600">En un tap.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Bonavis fournit des puces NFC à vos clients. Ils tapent, arrivent directement sur votre page Google Review. 
          Vous gardez le contrôle avec un abonnement simple.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="bg-bonavie-600 text-white px-8 py-4 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-bonavie-700 disabled:opacity-50 text-lg"
          >
            {loading ? 'Chargement...' : 'Commencer'} <ArrowRight size={20} />
          </button>
          <Link href="#comment-ca-marche" className="border px-8 py-4 rounded-lg font-medium hover:bg-gray-100 text-lg">
            Voir le fonctionnement
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="comment-ca-marche" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">Comment ça marche</h2>
          <p className="text-center text-gray-600 mb-12">Simple pour vous. Simple pour vos clients.</p>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-bonavie-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="text-bonavie-600" size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">1. Puce NFC</h3>
              <p className="text-gray-600">Votre client tape la puce sur le téléphone de son client.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-bonavie-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ArrowRight className="text-bonavie-600" size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">2. Redirection Bonavis</h3>
              <p className="text-gray-600">La puce ouvre une page Bonavis qui enregistre le tap et redirige.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-bonavie-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="text-bonavie-600" size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">3. Google Review</h3>
              <p className="text-gray-600">Le client arrive sur votre page d’avis. Vous suivez les statistiques.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Abonnement simple</h2>
          <p className="text-gray-600 mb-10">Gardez vos clients plus longtemps. Les liens restent actifs tant que l’abonnement est payé.</p>
          <div className="bg-white border rounded-2xl p-8 max-w-md mx-auto shadow-sm">
            <div className="text-5xl font-bold mb-2">35$<span className="text-lg font-normal text-gray-500">/mois</span></div>
            <ul className="text-left space-y-3 my-8">
              <li className="flex gap-3"><Check size={18} className="text-bonavie-600 mt-0.5 shrink-0" /> Jusqu’à 5 puces NFC</li>
              <li className="flex gap-3"><Check size={18} className="text-bonavie-600 mt-0.5 shrink-0" /> Statistiques de taps en temps réel</li>
              <li className="flex gap-3"><Check size={18} className="text-bonavie-600 mt-0.5 shrink-0" /> Page de redirection personnalisée</li>
              <li className="flex gap-3"><Check size={18} className="text-bonavie-600 mt-0.5 shrink-0" /> Support et mises à jour</li>
            </ul>
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="block w-full bg-bonavie-600 text-white py-4 rounded-lg font-medium hover:bg-bonavie-700 disabled:opacity-50 text-lg"
            >
              {loading ? 'Chargement...' : 'S’abonner'}
            </button>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Bonavis. Tous droits réservés.
      </footer>
    </div>
  )
}
