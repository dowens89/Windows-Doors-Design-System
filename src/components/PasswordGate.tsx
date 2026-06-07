import React, { useState } from 'react'
import { Lock } from 'lucide-react'

const UAT_PASSWORD = 'bg8JWDCF73YRmcs'
const SESSION_KEY = 'wdo_uat_unlocked'

interface PasswordGateProps {
  children: React.ReactNode
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [unlocked, setUnlocked] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === 'true'
  )
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)

  if (unlocked) return <>{children}</>

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (input === UAT_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setUnlocked(true)
    } else {
      setError(true)
      setInput('')
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand bg-opacity-10 mb-4">
            <Lock className="w-5 h-5 text-brand" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl text-ink mb-2">Preview access</h1>
          <p className="font-sans text-sm text-ink-muted">
            Enter the access code to view this site.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={input}
              onChange={(e) => { setInput(e.target.value); setError(false) }}
              placeholder="Access code"
              autoFocus
              autoComplete="off"
              className={`w-full px-4 py-3 font-sans text-base text-ink bg-paper border rounded-sm transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand ${
                error ? 'border-error' : 'border-hairline hover:border-ink-muted'
              }`}
            />
            {error && (
              <p className="font-sans text-sm text-error mt-2">
                Incorrect code. Please try again.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!input}
            className="w-full bg-brand text-paper font-sans text-sm font-medium py-3 px-4 rounded-sm hover:bg-brand-hover transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </form>

        <p className="font-sans text-xs text-ink-muted text-center mt-8">
          Windows &amp; Doors Online — UAT preview
        </p>
      </div>
    </div>
  )
}
