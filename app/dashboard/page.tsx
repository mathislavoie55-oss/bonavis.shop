import Link from 'next/link'
import { demoLinks, getTapsForCode } from '@/lib/store'
import { BarChart3, Link as LinkIcon, Plus } from 'lucide-react'

export default function Dashboard() {
  // In production this would be protected by auth (Clerk, NextAuth, etc.)
  const links = demoLinks

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-bonavie-600">Bonavie</Link>
          <div className="text-sm text-gray-600">Espace client</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <button className="bg-bonavie-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus size={16} /> Nouvelle puce
          </button>
        </div>

        <div className="grid gap-6">
          {links.map((link) => {
            const taps = getTapsForCode(link.code)
            return (
              <div key={link.code} className="bg-white border rounded-xl p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="font-semibold text-lg">{link.companyName}</h2>
                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                      <LinkIcon size={14} /> bonavie.com/r/{link.code}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    link.subscriptionActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {link.subscriptionActive ? 'Actif' : 'Suspendu'}
                  </span>
                </div>

                <div className="mt-6 flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={18} className="text-gray-400" />
                    <div>
                      <div className="text-2xl font-bold">{taps.length}</div>
                      <div className="text-xs text-gray-500">Taps enregistrés</div>
                    </div>
                  </div>
                  <a
                    href={`/r/${link.code}`}
                    target="_blank"
                    className="text-sm text-bonavie-600 hover:underline"
                  >
                    Tester la redirection →
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 p-6 bg-yellow-50 border border-yellow-200 rounded-xl text-sm">
          <strong>Note de démo :</strong> Les données sont en mémoire. Dans la version réelle, 
          connectez Stripe pour les abonnements et une base PostgreSQL pour les liens et les taps.
        </div>
      </main>
    </div>
  )
}
