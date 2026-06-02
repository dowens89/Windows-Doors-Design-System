import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Lock } from 'lucide-react'
import { Button } from '../components/ds/Button'
import { Input } from '../components/ds/Input'
import { Alert } from '../components/ds/Alert'
import { useSEO } from '../utils/seo'
import { useAuth } from '../contexts/AuthContext'

interface LocationState {
  from?: { pathname: string }
  unauthorised?: boolean
}

export function LoginPage() {
  useSEO({
    title: 'Sign In | Windows & Doors Online',
    description: 'Internal access.',
  })

  const { signIn, profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const state = location.state as LocationState | null
  const from = state?.from?.pathname ?? '/pricing-debug'
  const isUnauthorised = state?.unauthorised === true

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profile) navigate(from, { replace: true })
  }, [profile, from, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setError('Email and password are required.')
      return
    }
    setLoading(true)
    setError(null)
    const { error: signInError } = await signIn(email, password)
    setLoading(false)
    if (signInError) {
      setError('Incorrect email or password.')
      return
    }
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="mb-10 text-center">
          <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
            Windows & Doors Online
          </p>
          <div className="inline-flex items-center justify-center w-12 h-12 bg-ink rounded-full mb-5">
            <Lock className="w-5 h-5 text-paper" strokeWidth={1.5} />
          </div>
          <h1 className="font-display text-2xl text-ink">Internal access</h1>
        </div>

        {/* Authorisation error */}
        {isUnauthorised && (
          <div className="mb-6">
            <Alert
              variant="warning"
              message="Your account does not have permission to access that page."
            />
          </div>
        )}

        {/* Sign-in error */}
        {error && (
          <div className="mb-6">
            <Alert variant="error" message={error} />
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(null) }}
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(null) }}
          />
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={loading}
          >
            Sign in
          </Button>
        </form>

        <p className="font-sans text-xs text-ink-muted text-center mt-10">
          Need access?{' '}
          <a
            href="mailto:hello@buywindowsanddoors.co.uk"
            className="text-brand hover:underline"
          >
            hello@buywindowsanddoors.co.uk
          </a>
        </p>
      </div>
    </div>
  )
}
