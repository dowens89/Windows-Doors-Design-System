import React, { useState } from 'react'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { Alert } from '../components/ds/Alert'
import { Input } from '../components/ds/Input'
import { useSEO } from '../utils/seo'
import { supabase } from '../lib/supabase'

const towns = [
  'Leeds',
  'Bradford',
  'Wakefield',
  'Huddersfield',
  'Halifax',
  'Harrogate',
  'Dewsbury',
  'Keighley',
  'Pontefract',
  'Castleford',
  'Morley',
  'Batley',
  'Bingley',
  'Shipley',
  'Otley',
  'Wetherby',
  'Ilkley',
  'Skipton',
]

export function ServiceAreaPage() {
  useSEO({
    title: 'Windows & Doors Installation — West Yorkshire | WDO',
    description:
      'WDO currently serves West Yorkshire including Leeds, Bradford, Wakefield, Huddersfield, Halifax, Harrogate and surrounding areas.',
  })

  const [interestEmail, setInterestEmail] = useState('')
  const [registered, setRegistered] = useState(false)
  const [registering, setRegistering] = useState(false)
  const [registerError, setRegisterError] = useState(false)

  async function handleRegisterInterest() {
    if (!interestEmail.trim()) return
    setRegistering(true)
    setRegisterError(false)

    try {
      const { error } = await supabase
        .from('interest_registrations')
        .insert({ email: interestEmail.trim(), postcode: '' })

      if (error) {
        setRegisterError(true)
        setRegistering(false)
        return
      }
    } catch {
      setRegisterError(true)
      setRegistering(false)
      return
    }

    setRegistered(true)
    setRegistering(false)
  }

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-6">
          Windows and Doors Installation — West Yorkshire Coverage
        </h1>
        <p className="font-sans text-base text-ink-muted mb-16 max-w-2xl">
          We currently serve the West Yorkshire area, with vetted installers covering the towns
          below and surrounding postcodes. We are expanding to additional regions and will
          announce new coverage areas as they become available.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {towns.map((town) => (
            <div
              key={town}
              className="bg-surface border border-hairline px-5 py-4"
            >
              <span className="font-sans text-base text-ink">{town}</span>
            </div>
          ))}
        </div>

        {registered ? (
          <Alert
            variant="success"
            message="Registered. We will let you know when we expand to your area."
          />
        ) : (
          <div className="bg-surface border border-hairline p-6 max-w-xl">
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-ink-muted mb-4">
              Not in West Yorkshire?
            </p>
            <Alert
              variant="info"
              message="We are expanding. Register your interest and we will let you know when we cover your area."
            />
            {registerError && (
              <div className="mt-4">
                <Alert variant="error" message="Something went wrong. Please try again." />
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <div className="flex-1">
                <Input
                  label="Email address"
                  type="email"
                  value={interestEmail}
                  onChange={(e) => { setInterestEmail(e.target.value); setRegisterError(false) }}
                  placeholder="your@email.com"
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  isLoading={registering}
                  onClick={handleRegisterInterest}
                >
                  Register Interest
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
