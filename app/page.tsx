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
            <Link href="#pricing" className="text-sm hover:text-bonavie-600">Tarifs</Link>
            <Link href={user ? '/dashboard' : '/login'} className="bg-bonavie-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-bonavie-700">
              {user ? 'Espace client' : 'Connexion'}
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Plus d’avis Google,<br />
          <span className="text-bonavie-600">en un seul tap.</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Posez une puce NFC Bonavis sur votre comptoir : vos clients approchent leur téléphone et arrivent directement sur votre page d’avis Google. Vous suivez les taps dans votre espace client.
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
              <p className="text-gray-600 text-sm">Collez la puce NFC Bonavis sur votre comptoir ou votre caisse.</p>
            </div>
            <div className="text-center p-6">
              <ArrowRight className="mx-auto text-bonavie-600 mb-4" size={32} />
              <h3 className="font-semibold mb-2">2. Le client tape</h3>
              <p className="text-gray-600 text-sm">Il approche son téléphone. Aucune application à installer.</p>
            </div>
            <div className="text-center p-6">
              <BarChart3 className="mx-auto text-bonavie-600 mb-4" size={32} />
              <h3 className="font-semibold mb-2">3. L’avis est publié</h3>
              <p className="text-gray-600 text-sm">Il arrive directement sur votre page Google. Vous suivez les taps.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Abonnements simples</h2>
          <p className="text-gray-600 mb-10">Aucune application à installer. Statistiques de taps incluses. Prix en CAD. Sans engagement.</p>
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

      {/* Trust / Différenciation */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-8">Pourquoi Bonavis ?</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">La puce reste à vous</h3>
              <p className="text-gray-600">Même si vous résiliez, vos puces continuent de fonctionner. L’abonnement, c’est pour les statistiques et le suivi.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">100 % conforme Google</h3>
              <p className="text-gray-600">Aucun filtrage d’avis. Aucune récompense en échange d’un avis. Simple et conforme.</p>
            </div>
            <div className="bg-white p-6 rounded-xl border">
              <h3 className="font-semibold mb-2">Suivi clair</h3>
              <p className="text-gray-600">Vous voyez exactement combien de taps génèrent des avis. Pas juste une puce, un résultat suivi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Plusieurs comptoirs ou plusieurs établissements ?</h2>
          <p className="text-gray-600 mb-6">Une puce par emplacement, des statistiques pour chaque puce, et un prix par puce qui baisse avec le volume.</p>
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
