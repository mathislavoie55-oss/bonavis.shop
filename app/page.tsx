'use client'

import Link from 'next/link'
import { ArrowRight, Smartphone, BarChart3, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  async function handleSubscribe(plan: 'starter' | 'standard' | 'pro' = 'standard') {
    if (!user) {
      window.location.href = '/login?redirect=checkout'
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
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
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-bonavie-600">Bonavis</div>
          <nav className="flex gap-6 items-center">
            <Link href="#comment-ca-marche" className="text-sm hover:text-bonavie-600">Comment ça marche</Link>
            <Link href="#pricing" className="text-sm hover:text-bonavie-600">Tarifs</Link>
            <Link href={user ? '/dashboard' : '/login'} className="bg-bonavie-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-bonavie-700">
              {user ? 'Espace client' : 'Connexion'}
            </Link>
          </nav>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Plus de Google Reviews.<br />
          <span className="text-bonavie-600">En un tap.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Bonavis fournit des puces NFC à vos clients. Ils tapent, arrivent directement sur votre page Google Review.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => handleSubscribe('standard')} disabled={loading} className="bg-bonavie-600 text-white px-8 py-4 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-bonavie-700 disabled:opacity-50 text-lg">
            {loading ? 'Chargement...' : 'S’abonner'} <ArrowRight size={20} />
          </button>
          <Link href="#pricing" className="border px-8 py-4 rounded-lg font-medium hover:bg-gray-100 text-lg">Voir les tarifs</Link>
        </div>
      </section>

      <section id="comment-ca-marche" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Smartphone className="mx-auto text-bonavie-600 mb-4" size={32} />
              <h3 className="font-semibold mb-2">1. Puce NFC</h3>
              <p className="text-gray-600 text-sm">Le client tape la puce.</p>
            </div>
            <div className="text-center p-6">
              <ArrowRight className="mx-auto text-bonavie-600 mb-4" size={32} />
              <h3 className="font-semibold mb-2">2. Redirection</h3>
              <p className="text-gray-600 text-sm">Bonavis enregistre et redirige.</p>
            </div>
            <div className="text-center p-6">
              <BarChart3 className="mx-auto text-bonavie-600 mb-4" size={32} />
              <h3 className="font-semibold mb-2">3. Google Review</h3>
              <p className="text-gray-600 text-sm">Le client laisse son avis.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Abonnements simples</h2>
          <p className="text-gray-600 mb-10">Choisissez le forfait qui correspond à vos besoins.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Starter</h3>
              <div className="text-4xl font-bold mb-4">10$<span className="text-base font-normal text-gray-500">/mois</span></div>
              <ul className="text-left space-y-2 text-sm mb-6">
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> 1 puce NFC</li>
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> Statistiques</li>
              </ul>
              <button onClick={() => handleSubscribe('starter')} disabled={loading} className="w-full border border-bonavie-600 text-bonavie-600 py-3 rounded-lg font-medium">Choisir</button>
            </div>
            <div className="bg-white border-2 border-bonavie-600 rounded-2xl p-6 shadow-md relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-bonavie-600 text-white text-xs px-3 py-1 rounded-full">Recommandé</div>
              <h3 className="font-semibold text-lg mb-2">Standard</h3>
              <div className="text-4xl font-bold mb-4">35$<span className="text-base font-normal text-gray-500">/mois</span></div>
              <ul className="text-left space-y-2 text-sm mb-6">
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> Jusqu’à 5 puces</li>
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> Statistiques en temps réel</li>
              </ul>
              <button onClick={() => handleSubscribe('standard')} disabled={loading} className="w-full bg-bonavie-600 text-white py-3 rounded-lg font-medium">Choisir</button>
            </div>
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-4">50$<span className="text-base font-normal text-gray-500">/mois</span></div>
              <ul className="text-left space-y-2 text-sm mb-6">
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> Jusqu’à 10 puces</li>
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> Support prioritaire</li>
              </ul>
              <button onClick={() => handleSubscribe('pro')} disabled={loading} className="w-full border border-bonavie-600 text-bonavie-600 py-3 rounded-lg font-medium">Choisir</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Bonavis. Tous droits réservés.
      </footer>
    </div>
  )
}
