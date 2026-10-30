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

type DailyTap = {
  date: string
  count: number
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [links, setLinks] = useState<LinkWithStats[]>([])
  const [dailyTaps, setDailyTaps] = useState<DailyTap[]>([])
  const [loading, setLoading] = useState(true)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false)
  const [code, setCode] = useState('')
  const [url, setUrl] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) {
        router.push('/login')
        return
      }
      setUser(data.user)

      // Vérifier l'abonnement (simplifié : on considère actif si l'email a un abonnement)
      // Pour l'instant, on laisse passer en mode test. À renforcer plus tard.
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('user_id', data.user.id)
        .eq('status', 'active')
        .maybeSingle()

      setHasActiveSubscription(!!sub)
      loadData(data.user.id)
    })
  }, [router])

  async function loadData(userId: string) {
    const { data: linksData } = await supabase
      .from('links')
      .select('*')
      .eq('user_id', userId)
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

        return { ...link, tap_count: count || 0 }
      })
    )

    setLinks(linksWithStats)

    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const { data: tapsData } = await supabase
      .from('taps')
      .select('created_at, link_code')
      .gte('created_at', sevenDaysAgo.toISOString())
      .in('link_code', linksData.map(l => l.code))

    const daily: Record<string, number> = {}
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const key = d.toISOString().split('T')[0]
      daily[key] = 0
    }

    tapsData?.forEach(tap => {
      const day = tap.created_at.split('T')[0]
      if (daily[day] !== undefined) daily[day]++
    })

    setDailyTaps(Object.entries(daily).map(([date, count]) => ({ date, count })))
    setLoading(false)
  }

  async function createLink(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return

    if (!hasActiveSubscription) {
      alert('Vous devez avoir un abonnement actif pour créer des liens.')
      return
    }

    const { error } = await supabase.from('links').insert({
      code: code.toLowerCase().replace(/\s+/g, '-'),
      google_review_url: url,
      business_name: name || null,
      is_active: true,
      user_id: user.id,
    })

    if (error) {
      alert(error.message)
    } else {
      setCode('')
      setUrl('')
      setName('')
      loadData(user.id)
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  const maxTaps = Math.max(...dailyTaps.map(d => d.count), 1)

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Chargement...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-bonavie-600">Bonavis</Link>
          <div className="flex items-center gap-6">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button onClick={signOut} className="text-sm text-red-600 hover:underline">Déconnexion</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10">
        {!hasActiveSubscription && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4 mb-6">
            Vous n’avez pas d’abonnement actif. <Link href="/#pricing" className="underline font-medium">S’abonner</Link> pour créer des liens.
          </div>
        )}

        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold">Espace client</h1>
            <p className="text-gray-600 mt-1">Gérez vos puces NFC et suivez les avis.</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-bonavie-600">{links.length}</div>
            <div className="text-sm text-gray-500">Liens</div>
          </div>
        </div>

        {/* Graphique */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="font-semibold mb-4">Taps des 7 derniers jours</h2>
          <div className="flex items-end gap-2 h-32">
            {dailyTaps.map((day) => (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-bonavie-600 rounded-t"
                  style={{ height: `${(day.count / maxTaps) * 100}%`, minHeight: day.count > 0 ? '4px' : '0' }}
                />
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(day.date).toLocaleDateString('fr-FR', { weekday: 'short' })}
                </div>
                <div className="text-xs font-medium">{day.count}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Création */}
        <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm">
          <h2 className="font-semibold text-lg mb-4">Créer un nouveau lien</h2>
          <form onSubmit={createLink} className="grid md:grid-cols-4 gap-4">
            <input placeholder="Code (ex: cafe123)" value={code} onChange={(e) => setCode(e.target.value)} className="border rounded-lg px-4 py-3" required disabled={!hasActiveSubscription} />
            <input placeholder="URL Google Review" value={url} onChange={(e) => setUrl(e.target.value)} className="border rounded-lg px-4 py-3 md:col-span-2" required disabled={!hasActiveSubscription} />
            <button type="submit" className="bg-bonavie-600 text-white rounded-lg font-medium hover:bg-bonavie-700 disabled:opacity-50" disabled={!hasActiveSubscription}>
              Créer
            </button>
            <input placeholder="Nom de l’entreprise (optionnel)" value={name} onChange={(e) => setName(e.target.value)} className="border rounded-lg px-4 py-3 md:col-span-4" disabled={!hasActiveSubscription} />
          </form>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b"><h2 className="font-semibold">Vos liens</h2></div>
          <div className="divide-y">
            {links.length === 0 ? (
              <div className="p-12 text-center text-gray-500">Aucun lien. Créez-en un ci-dessus.</div>
            ) : (
              links.map((link) => (
                <div key={link.id} className="px-6 py-5 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <div className="font-medium">{link.business_name || link.code}</div>
                    <a href={`/r/${link.code}`} target="_blank" className="text-sm text-bonavie-600 hover:underline">
                      bonavis.shop/r/{link.code}
                    </a>
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
