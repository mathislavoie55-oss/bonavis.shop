'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type LinkWithStats = {
  id: string
  code: string
  google_review_url: string
  business_name: string | null
  is_active: boolean
  tap_count: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [links, setLinks] = useState<LinkWithStats[]>([])
  const [loading, setLoading] = useState(true)
  const [code, setCode] = useState('')
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login')
      } else {
        setUser(data.user)
        loadLinks()
      }
    })
  }, [router])

  async function loadLinks() {
    const { data: linksData } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false })

    if (!linksData) {
      setLoading(false)
      return
    }

    const linksWithStats = await Promise.all(
      linksData.map(async (link) => {
        const { count } = await supabase
          .from('taps')
          .select('*', { count: 'exact', head: true })
          .eq('link_code', link.code)

        return {
          ...link,
          tap_count: count || 0,
        }
      })
    )

    setLinks(linksWithStats)
    setLoading(false)
  }

  async function createLink(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('links').insert({
      code: code.toLowerCase().replace(/\s+/g, '-'),
      google_review_url: url,
      business_name: name || null,
      is_active: true,
    })
    if (error) {
      alert(error.message)
    } else {
      setCode('')
      setUrl('')
      setName('')
      loadLinks()
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-bonavie-600">Bonavis</Link>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button onClick={signOut} className="text-sm text-red-600 hover:underline">
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold">Espace client</h1>
            <p className="text-gray-600 mt-1">Gérez vos puces NFC et suivez les avis.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-bonavie-600">{links.length}</div>
            <div className="text-sm text-gray-500">Liens actifs</div>
          </div>
        </div>

        {/* Création de lien */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Créer un nouveau lien</h2>
          <form onSubmit={createLink} className="grid md:grid-cols-4 gap-4">
            <input
              placeholder="Code (ex: cafe123)"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="border rounded-lg px-4 py-3"
              required
            />
            <input
              placeholder="URL Google Review"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="border rounded-lg px-4 py-3 md:col-span-2"
              required
            />
            <button
              type="submit"
              className="bg-bonavie-600 text-white rounded-lg font-medium hover:bg-bonavie-700"
            >
              Créer
            </button>
            <input
              placeholder="Nom de l’entreprise (optionnel)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-4 py-3 md:col-span-4"
            />
          </form>
        </div>

        {/* Liste des liens */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="font-semibold">Vos liens</h2>
          </div>
          <div className="divide-y">
            {links.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                Aucun lien pour le moment. Créez-en un ci-dessus.
              </div>
            ) : (
              links.map((link) => (
                <div key={link.id} className="px-6 py-5 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <div className="font-medium">{link.business_name || link.code}</div>
                    <div className="text-sm text-gray-500 mt-1">
                      <a
                        href={`/r/${link.code}`}
                        target="_blank"
                        className="text-bonavie-600 hover:underline"
                      >
                        bonavis.shop/r/{link.code}
                      </a>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{link.tap_count}</div>
                    <div className="text-sm text-gray-500">taps</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
