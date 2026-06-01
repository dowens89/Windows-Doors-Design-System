import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { Input } from '../components/ds/Input'
import { Alert } from '../components/ds/Alert'
import { useSEO } from '../utils/seo'

export function ContactPage() {
  useSEO({
    title: 'Contact | Windows & Doors Online',
    description: 'Get in touch. We respond to every message within one working day.',
  })

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  function handleSubmit() {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = 'Required'
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = 'Enter a valid email address'
    if (!message.trim()) newErrors.message = 'Required'
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return
    console.log('Contact form submission:', { name, email, message })
    setSent(true)
  }

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-12">Get in touch</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Form */}
          <div>
            {sent ? (
              <Alert
                variant="success"
                message="Message received. We reply within one working day."
              />
            ) : (
              <div className="space-y-6">
                <Input
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  error={errors.name}
                />
                <Input
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                />
                <div>
                  <label className="block font-sans text-sm font-medium text-ink mb-1.5">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    className={`w-full border bg-paper font-sans text-base text-ink px-4 py-3 rounded focus:outline-none focus:border-brand resize-none ${
                      errors.message ? 'border-error' : 'border-hairline'
                    }`}
                  />
                  {errors.message && (
                    <p className="font-sans text-sm text-error mt-1">{errors.message}</p>
                  )}
                </div>
                <Button variant="primary" onClick={handleSubmit}>
                  Send message
                </Button>
              </div>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <p className="font-display text-xl text-ink mb-2">
                hello@buywindowsanddoors.co.uk
              </p>
              <p className="font-sans text-base text-ink-muted">
                We respond within one working day.
              </p>
            </div>
            <div className="h-px bg-hairline" />
            <p className="font-sans text-sm text-ink-muted leading-relaxed">
              We are a small team. We do not have a call centre. We read every message and reply
              personally.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
