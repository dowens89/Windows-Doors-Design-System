import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { Input } from '../components/ds/Input'
import { Alert } from '../components/ds/Alert'
import { Progress } from '../components/ds/Progress'
import { PriceDisplay } from '../components/ds/PriceDisplay'
import { useSEO } from '../utils/seo'
import { useBasketStore } from '../store/basketStore'
import { supabase } from '../lib/supabase'

interface FormFields {
  name: string
  email: string
  phone: string
  address1: string
  address2: string
  town: string
  postcode: string
  notes: string
}

type FormErrors = Partial<Record<keyof FormFields, string>>

export function CheckoutPage() {
  useSEO({
    title: 'Request Your Survey | Windows & Doors Online',
    description:
      'Submit your survey request. No payment taken. We will confirm your installer within 24 hours.',
  })

  const navigate = useNavigate()
  const { items, getTotal, clearBasket } = useBasketStore()
  const total = getTotal()

  useEffect(() => {
    if (items.length === 0) navigate('/basket', { replace: true })
  }, [items.length, navigate])

  const [form, setForm] = useState<FormFields>({
    name: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    town: '',
    postcode: '',
    notes: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [loading, setLoading] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  function update(field: keyof FormFields, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function validate(): boolean {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'Required'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Enter a valid email address'
    if (!form.phone.trim()) newErrors.phone = 'Required'
    if (!form.address1.trim()) newErrors.address1 = 'Required'
    if (!form.town.trim()) newErrors.town = 'Required'
    if (!form.postcode.trim()) newErrors.postcode = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)
    setSubmitError(false)

    const reference = `WDO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`

    try {
      const { error } = await supabase.from('quote_requests').insert({
        reference,
        name: form.name,
        email: form.email,
        phone: form.phone,
        address_line1: form.address1,
        address_line2: form.address2 || '',
        town: form.town,
        postcode: form.postcode,
        products: items,
        indicative_total: total,
        notes: form.notes || '',
        status: 'new',
      })

      if (error) {
        setSubmitError(true)
        setLoading(false)
        return
      }
    } catch {
      setSubmitError(true)
      setLoading(false)
      return
    }

    const capturedItems = [...items]
    const capturedTotal = total

    navigate('/confirmation', {
      state: {
        reference,
        name: form.name,
        items: capturedItems,
        total: capturedTotal,
        submitted: true,
      },
    })
    clearBasket()
    setLoading(false)
  }

  if (items.length === 0) return null

  return (
    <Layout>
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 py-12">
        <div className="mb-10">
          <Progress currentStep={1} totalSteps={3} />
        </div>

        <h1 className="font-display text-3xl md:text-4xl text-ink mb-10">
          Request your free survey
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12">
          {/* Form */}
          <div className="space-y-10">
            <section>
              <h2 className="font-display text-xl text-ink mb-6">Your details</h2>
              <div className="space-y-5">
                <Input
                  label="Full name"
                  value={form.name}
                  onChange={(e) => update('name', e.target.value)}
                  error={errors.name}
                />
                <Input
                  label="Email address"
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                  error={errors.email}
                />
                <Input
                  label="Phone number"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  error={errors.phone}
                  helperText="We use this to confirm your installer and survey time"
                />
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl text-ink mb-6">Installation address</h2>
              <div className="space-y-5">
                <Input
                  label="Address line 1"
                  value={form.address1}
                  onChange={(e) => update('address1', e.target.value)}
                  error={errors.address1}
                />
                <Input
                  label="Address line 2"
                  value={form.address2}
                  onChange={(e) => update('address2', e.target.value)}
                  helperText="Optional"
                />
                <Input
                  label="Town or city"
                  value={form.town}
                  onChange={(e) => update('town', e.target.value)}
                  error={errors.town}
                />
                <Input
                  label="Postcode"
                  value={form.postcode}
                  onChange={(e) => update('postcode', e.target.value)}
                  error={errors.postcode}
                />
              </div>
            </section>

            <section>
              <h2 className="font-display text-xl text-ink mb-6">About your job</h2>
              <div className="space-y-5">
                <Input
                  label="Photo of your current window or door"
                  type="file"
                  accept="image/*"
                  helperText="Optional — helps your installer prepare before the survey visit"
                  onChange={() => {}}
                />
                <div>
                  <label className="block font-sans text-sm font-medium text-ink mb-1.5">
                    Anything else we should know?
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => update('notes', e.target.value)}
                    rows={4}
                    placeholder="Non-standard openings, access issues, or specific requirements"
                    className="w-full border border-hairline bg-paper font-sans text-base text-ink px-4 py-3 rounded focus:outline-none focus:border-brand resize-none"
                  />
                  <p className="font-sans text-sm text-ink-muted mt-1">
                    Non-standard openings, access issues, or specific requirements
                  </p>
                </div>
              </div>
            </section>

            {submitError && (
              <Alert
                variant="error"
                message="Something went wrong submitting your request. Please email hello@buywindowsanddoors.co.uk and we will get back to you within one working day."
              />
            )}

            <Button
              variant="primary"
              size="lg"
              className="w-full lg:hidden"
              isLoading={loading}
              onClick={handleSubmit}
            >
              Confirm Your Survey Request
            </Button>
          </div>

          {/* Order summary sidebar */}
          <div>
            <div className="border border-hairline bg-surface p-6 sticky top-6 space-y-6">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">
                  Your quote
                </p>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="pb-4 border-b border-hairline last:border-0">
                      <p className="font-sans text-sm font-medium text-ink">{item.productName}</p>
                      <p className="font-sans text-xs text-ink-muted mb-2">{item.variantSummary}</p>
                      <PriceDisplay
                        price={item.indicativePrice}
                        size="inline"
                        assuranceText=""
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-hairline">
                <p className="font-sans text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
                  Indicative total
                </p>
                <PriceDisplay price={total} size="medium" assuranceText="" />
              </div>

              <div className="space-y-3 pt-2">
                <Alert variant="info" message="No payment today" />
                <Alert
                  variant="info"
                  message="Your details go to one vetted local installer — not a list of companies"
                />
                <Alert
                  variant="info"
                  message="We confirm your installer within 24 hours"
                />
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full hidden lg:flex"
                isLoading={loading}
                onClick={handleSubmit}
              >
                Confirm Your Survey Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
