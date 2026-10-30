'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type LinkRow = {
  id: string
  code: string
  google_review_url: string
  business_name: string | null
  is_active: boolean
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [links, setLinks] = useState<LinkRow[]>([])
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
    const { data } = await supabase.from('links').select('*').order('created_at', { ascending: false })
    setLinks(data || [])
    setLoading(false)
  }

  async function createLink(e: React.FormEvent) {
    e.preventDefault()
    const { error } = await supabase.from('links').insert({
      code,
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

  if (loading) return <div className="p-8">Chargement...</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-bonavie-600">Bonavis</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button onClick={signOut} className="text-sm text-red-600">Déconnexion</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Espace client</h1>

        <form onSubmit={createLink} className="bg-white p-6 rounded-xl mb-8 space-y-4">
          <h2 className="font-semibold">Créer un nouveau lien</h2>
          <input
            placeholder="Code (ex: cafe123)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <input
            placeholder="URL Google Review"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
            required
          />
          <input
            placeholder="Nom de l’entreprise (optionnel)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-lg px-4 py-2"
          />
          <button type="submit" className="bg-bonavie-600 text-white px-6 py-2 rounded-lg">
            Créer le lien
          </button>
        </form>

        <div className="bg-white rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4">Code</th>
                <th className="text-left p-4">Entreprise</th>
                <th className="text-left p-4">Lien</th>
                <th className="text-left p-4">Statut</th>
              </tr>
            </thead>
            <tbody>
              {links.map((link) => (
                <tr key={link.id} className="border-t">
                  <td className="p-4 font-mono">{link.code}</td>
                  <td className="p-4">{link.business_name || '—'}</td>
                  <td className="p-4">
                    <a href={`/r/${link.code}`} className="text-bonavie-600" target="_blank">
                      /r/{link.code}
                    </a>
                  </td>
                  <td className="p-4">{link.is_active ? 'Actif' : 'Inactif'}</td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500">
                    Aucun lien pour le moment
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
