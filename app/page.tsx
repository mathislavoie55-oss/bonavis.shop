'use client'

import Link from 'next/link'
import { ArrowRight, Smartphone, BarChart3, Check, Shield, Clock, MapPin, Store, Scissors, HeartPulse, Car } from 'lucide-react'
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
      window.location.href = `/login?redirect=checkout&plan=${plan}`
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
            <Link href="#pour-qui" className="text-sm hover:text-bonavie-600">Pour qui</Link>
            <Link href="#pricing" className="text-sm hover:text-bonavie-600">Tarifs</Link>
            <Link href={user ? '/dashboard' : '/login'} className="bg-bonavie-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-bonavie-700">
              {user ? 'Espace client' : 'Connexion'}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm px-4 py-1 rounded-full mb-6">
          <Shield size={14} /> 100 % conforme aux règles Google
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Plus d’avis Google,<br />
          <span className="text-bonavie-600">en un seul tap.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          La solution locale en français pour les commerces du Québec et de l’Ontario. Vos clients tapent, vous obtenez des avis. Vous suivez les résultats.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="#pricing" className="bg-bonavie-600 text-white px-8 py-4 rounded-lg font-medium inline-flex items-center gap-2 hover:bg-bonavie-700 text-lg">
            Choisir mon forfait <ArrowRight size={20} />
          </Link>
          <Link href="#comment-ca-marche" className="border px-8 py-4 rounded-lg font-medium hover:bg-gray-100 text-lg">
            Voir comment ça marche
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="comment-ca-marche" className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Comment ça marche</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Smartphone className="mx-auto text-bonavie-600 mb-4" size={32} />
              <h3 className="font-semibold mb-2">1. Posez la puce</h3>
              <p className="text-gray-600 text-sm">Collez-la sur votre comptoir. Aucune application à installer pour vos clients.</p>
            </div>
            <div className="text-center p-6">
              <ArrowRight className="mx-auto text-bonavie-600 mb-4" size={32} />
              <h3 className="font-semibold mb-2">2. Le client tape</h3>
              <p className="text-gray-600 text-sm">Il arrive directement sur votre page d’avis Google.</p>
            </div>
            <div className="text-center p-6">
              <BarChart3 className="mx-auto text-bonavie-600 mb-4" size={32} />
              <h3 className="font-semibold mb-2">3. Vous suivez</h3>
              <p className="text-gray-600 text-sm">Voyez les taps et les résultats dans votre espace client.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Bonavis */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-10">Pourquoi Bonavis plutôt qu’une simple plaque ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border">
              <Shield className="text-bonavie-600 mb-3" size={28} />
              <h3 className="font-semibold mb-2">La puce reste à vous</h3>
              <p className="text-gray-600 text-sm">Même si vous arrêtez l’abonnement, vos puces continuent de fonctionner. L’abonnement, c’est pour le suivi et les statistiques.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border">
              <Clock className="text-bonavie-600 mb-3" size={28} />
              <h3 className="font-semibold mb-2">Essai de 60 jours</h3>
              <p className="text-gray-600 text-sm">Testez sans risque. Si vous n’obtenez aucun nouvel avis, on vous rembourse. Garantie conforme aux règles Google.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border">
              <MapPin className="text-bonavie-600 mb-3" size={28} />
              <h3 className="font-semibold mb-2">Local et en français</h3>
              <p className="text-gray-600 text-sm">Pensé pour les commerces du Québec et de l’Ontario francophone. Support et accompagnement en français.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pour qui */}
      <section id="pour-qui" className="py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Pour qui ?</h2>
          <p className="text-gray-600 mb-10">Des kits simples pour les commerces qui veulent plus d’avis sans complexité.</p>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white border rounded-2xl p-6">
              <Store className="mx-auto text-bonavie-600 mb-3" size={28} />
              <h3 className="font-semibold">Restaurants</h3>
              <p className="text-sm text-gray-600 mt-2">Sur le comptoir ou les tables</p>
            </div>
            <div className="bg-white border rounded-2xl p-6">
              <Scissors className="mx-auto text-bonavie-600 mb-3" size={28} />
              <h3 className="font-semibold">Salons</h3>
              <p className="text-sm text-gray-600 mt-2">À la caisse ou en salle d’attente</p>
            </div>
            <div className="bg-white border rounded-2xl p-6">
              <HeartPulse className="mx-auto text-bonavie-600 mb-3" size={28} />
              <h3 className="font-semibold">Cliniques</h3>
              <p className="text-sm text-gray-600 mt-2">Discret et professionnel</p>
            </div>
            <div className="bg-white border rounded-2xl p-6">
              <Car className="mx-auto text-bonavie-600 mb-3" size={28} />
              <h3 className="font-semibold">Garages</h3>
              <p className="text-sm text-gray-600 mt-2">À la réception</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-8">Coaching d’équipe de 15 minutes inclus pour vous aider à démarrer.</p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Abonnements simples</h2>
          <p className="text-gray-600 mb-2">Prix en dollars canadiens. Sans engagement. Livraison incluse.</p>
          <p className="text-sm text-gray-500 mb-10">Essai de 60 jours. Si vous n’obtenez aucun nouvel avis, on vous rembourse.</p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Starter</h3>
              <div className="text-4xl font-bold mb-4">10$<span className="text-base font-normal text-gray-500">/mois</span></div>
              <ul className="text-left space-y-2 text-sm mb-6">
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> 1 puce NFC</li>
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> Statistiques</li>
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> Support</li>
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
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> Support prioritaire</li>
              </ul>
              <button onClick={() => handleSubscribe('standard')} disabled={loading} className="w-full bg-bonavie-600 text-white py-3 rounded-lg font-medium">Choisir</button>
            </div>
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-4">50$<span className="text-base font-normal text-gray-500">/mois</span></div>
              <ul className="text-left space-y-2 text-sm mb-6">
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> Jusqu’à 10 puces</li>
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> Statistiques avancées</li>
                <li className="flex gap-2"><Check size={16} className="text-bonavie-600 mt-0.5" /> Support dédié</li>
              </ul>
              <button onClick={() => handleSubscribe('pro')} disabled={loading} className="w-full border border-bonavie-600 text-bonavie-600 py-3 rounded-lg font-medium">Choisir</button>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Plusieurs établissements ?</h2>
          <p className="text-gray-600 mb-6">Une puce par emplacement, des statistiques séparées, et un prix qui baisse avec le volume. Parfait pour les chaînes ou les multi-sites. Coaching d’équipe inclus.</p>
          <a href="mailto:contact@bonavis.shop" className="inline-block bg-bonavie-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-bonavie-700">
            Demander un devis entreprise
          </a>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-gray-500">
        <div className="flex justify-center gap-6 mb-4">
          <Link href="/contact" className="hover:underline">Contact</Link>
          <Link href="/cgv" className="hover:underline">CGV</Link>
          <Link href="/confidentialite" className="hover:underline">Confidentialité</Link>
        </div>
        © {new Date().getFullYear()} Bonavis. Tous droits réservés.
      </footer>
    </div>
  )
}
