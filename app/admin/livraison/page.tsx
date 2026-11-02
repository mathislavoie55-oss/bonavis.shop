'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type OrderLink = {
  id: string
  code: string
  business_name: string | null
  google_review_url: string
  user_email: string | null
  created_at: string
  status: 'to_prepare' | 'prepared' | 'shipped'
}

export default function AdminDeliveryPage() {
  const [links, setLinks] = useState<OrderLink[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user || data.user.email !== 'mathislavoie55@gmail.com') {
        router.push('/dashboard')
        return
      }
      setUser(data.user)
      loadLinks()
    })
  }, [router])

  async function loadLinks() {
    const { data: linksData } = await supabase
      .from('links')
      .select('*, users:user_id(email)')
      .order('created_at', { ascending: false })

    if (!linksData) {
      setLoading(false)
      return
    }

    const mapped: OrderLink[] = linksData.map((link: any) => ({
      id: link.id,
      code: link.code,
      business_name: link.business_name,
      google_review_url: link.google_review_url,
      user_email: link.users?.email || 'Inconnu',
      created_at: link.created_at,
      status: 'to_prepare',
    }))

    setLinks(mapped)
    setLoading(false)
  }

  function updateStatus(id: string, status: OrderLink['status']) {
    setLinks(links.map(l => l.id === id ? { ...l, status } : l))
  }

  const toPrepare = links.filter(l => l.status === 'to_prepare')
  const prepared = links.filter(l => l.status === 'prepared')
  const shipped = links.filter(l => l.status === 'shipped')

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-bonavie-600">Bonavis Admin</Link>
          <div className="flex gap-4">
            <Link href="/admin" className="text-sm text-gray-600">Tous les liens</Link>
            <Link href="/dashboard" className="text-sm text-gray-600">Dashboard</Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">Puces à préparer et livrer</h1>
        <p className="text-gray-600 mb-8">Suivi des puces NFC à programmer et expédier.</p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* À préparer */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
              À préparer ({toPrepare.length})
            </h2>
            <div className="space-y-3">
              {toPrepare.map(link => (
                <div key={link.id} className="border rounded-lg p-3 text-sm">
                  <div className="font-medium">{link.business_name || link.code}</div>
                  <div className="text-xs text-gray-500 mt-1">{link.user_email}</div>
                  <div className="font-mono text-xs mt-1 text-bonavie-600">/r/{link.code}</div>
                  <button
                    onClick={() => updateStatus(link.id, 'prepared')}
                    className="mt-2 text-xs bg-gray-100 hover:bg-gray-200 px-+2 py-1 rounded"
                  >
                    Marquer préparé
                  </button>
                </div>
              ))}
              {toPrepare.length === 0 && <p className="text-gray-400 text-sm">Rien à préparer</p>}
            </div>
          </div>

          {/* Préparé */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              Préparé ({prepared.length})
            </h2>
            <div className="space-y-3">
              {prepared.map(link => (
                <div key={link.id} className="border rounded-lg p-3 text-sm">
                  <div className="font-medium">{link.business_name || link.code}</div>
                  <div className="text-xs text-gray-500 mt-1">{link.user_email}</div>
                  <div className="font-mono text-xs mt-1 text-bonavie-600">/r/{link.code}</div>
                  <button
                    onClick={() => updateStatus(link.id, 'shipped')}
                    className="mt-2 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
                  >
                    Marquer expédié
                  </button>
                </div>
              ))}
              {prepared.length === 0 && <p className="text-gray-400 text-sm">Rien de préparé</p>}
            </div>
          </div>

          {/* Expédié */}
          <div className="bg-white rounded-2xl border p-6">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              Expédié ({shipped.length})
            </h2>
            <div className="space-y-3">
              {shipped.map(link => (
                <div key={link.id} className="border rounded-lg p-3 text-sm">
                  <div className="font-medium">{link.business_name || link.code}</div>
                  <div className="text-xs text-gray-500 mt-1">{link.user_email}</div>
                  <div className="font-mono text-xs mt-1 text-bonavie-600">/r/{link.code}</div>
                </div>
              ))}
              {shipped.length === 0 && <p className="text-gray-400 text-sm">Rien d’expédié</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
