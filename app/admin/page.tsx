'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type AdminLink = {
  id: string
  code: string
  google_review_url: string
  business_name: string | null
  user_email: string | null
  tap_count: number
  created_at: string
}

export default function AdminPage() {
  const [links, setLinks] = useState<AdminLink[]>([])
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
      loadAllLinks()
    })
  }, [router])

  async function loadAllLinks() {
    const { data: linksData } = await supabase
      .from('links')
      .select('*, users:user_id(email)')
      .order('created_at', { ascending: false })

    if (!linksData) {
      setLoading(false)
      return
    }

    const withStats = await Promise.all(
      linksData.map(async (link: any) => {
        const { count } = await supabase
          .from('taps')
          .select('*', { count: 'exact', head: true })
          .eq('link_code', link.code)

        return {
          id: link.id,
          code: link.code,
          google_review_url: link.google_review_url,
          business_name: link.business_name,
          user_email: link.users?.email || 'Inconnu',
          tap_count: count || 0,
          created_at: link.created_at,
        }
      })
    )

    setLinks(withStats)
    setLoading(false)
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Chargement...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-bonavie-600">Bonavis Admin</Link>
          <Link href="/dashboard" className="text-sm text-gray-600">Retour dashboard</Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">Tous les liens</h1>
        <p className="text-gray-600 mb-8">Vue d’ensemble pour programmer les puces NFC.</p>

        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-3">Entreprise</th>
                  <th className="text-left px-6 py-3">Code / Lien</th>
                  <th className="text-left px-6 py-3">Client</th>
                  <th className="text-right px-6 py-3">Taps</th>
                  <th className="text-left px-6 py-3">Créé</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{link.business_name || '—'}</td>
                    <td className="px-6 py-4">
                      <div className="font-mono">{link.code}</div>
                      <a href={`/r/${link.code}`} target="_blank" className="text-bonavie-600 hover:underline text-xs">
                        bonavis.shop/r/{link.code}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{link.user_email}</td>
                    <td className="px-6 py-4 text-right font-medium">{link.tap_count}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">
                      {new Date(link.created_at).toLocaleDateString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {links.length === 0 && (
            <div className="p-12 text-center text-gray-500">Aucun lien pour le moment.</div>
          )}
        </div>
      </main>
    </div>
  )
}
