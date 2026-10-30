'use client'

import { useState, useEffect } from 'react'

const PASSWORD = 'bonavis2026'

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('bonavis_unlocked') === 'true') {
      setUnlocked(true)
    }
  }, [])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === PASSWORD) {
      localStorage.setItem('bonavis_unlocked', 'true')
      setUnlocked(true)
    } else {
      setError(true)
    }
  }

  if (unlocked) return <>{children}</>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-sm w-full max-w-sm">
        <h1 className="text-xl font-bold text-center mb-6">Bonavis</h1>
        <p className="text-sm text-gray-600 text-center mb-6">Site en cours de développement</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Mot de passe"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full border rounded-lg px-4 py-3"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm">Mot de passe incorrect</p>}
          <button type="submit" className="w-full bg-bonavie-600 text-white py-3 rounded-lg font-medium">
            Entrer
          </button>
        </form>
      </div>
    </div>
  )
}
