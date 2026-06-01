import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/Layout'
import { Button } from '../components/ds/Button'
import { useSEO } from '../utils/seo'

export function HowItWorksPage() {
  useSEO({
    title: 'How It Works | Windows & Doors Online',
    description:
      'See how WDO helps West Yorkshire homeowners get honest installed prices and get matched with a vetted local installer.',
  })
  const navigate = useNavigate()

  return (
    <Layout>
      <div className="max-w-[720px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-16">
          How Windows & Doors Online works
        </h1>

        <section className="mb-16">
          <h2 className="font-display text-2xl text-ink mb-8">For you — the customer journey</h2>
          <div className="space-y-5 font-sans text-base text-ink leading-relaxed">
            <p>
              You browse our range online, choose the product type that suits your home, and
              configure your specification — size, colour, glazing — using the options on each
              product page. The price updates in real time as you make selections. No registration
              required. No contact details needed to see a price.
            </p>
            <p>
              When you're ready, you add your products to a quote and proceed to checkout. You give
              us your name, address, and phone number so we can arrange a survey. You can upload a
              photo of your current window or door if you have one — it helps your installer
              prepare. No payment is taken at any stage.
            </p>
            <p>
              You will not be pressured to buy at any point. The survey is a technical visit to
              confirm your exact measurements and check for anything non-standard. There is no
              salesperson involved. Your installer is a qualified fitter, not someone on commission.
            </p>
            <p>
              The price you see online is an honest indicative price based on standard installation
              conditions. In the majority of straightforward jobs, the final price after survey
              matches what you saw here. If something non-standard is found — a structural issue,
              scaffolding requirement, or access constraint — your installer will explain it in
              writing before any work begins. You can walk away at any point with no obligation.
            </p>
            <p>
              Once work is agreed and completed, you receive a FENSA certificate confirming
              building regulations compliance. This is required by law for replacement glazing in
              England and Wales and is important when you come to sell your home.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="font-display text-2xl text-ink mb-8">Our installers</h2>
          <div className="space-y-5 font-sans text-base text-ink leading-relaxed">
            <p>
              Every installer on our platform is vetted before being accepted. We check their FENSA
              registration, their public liability insurance, and their references. We do not accept
              self-certification without verification.
            </p>
            <p>
              Installers commit to contacting you within 24 hours of receiving your job, arranging
              a survey within 48 hours, and providing a written price before any work begins. They
              also commit to our pricing promise — the only legitimate reasons to vary from the
              indicative price are those defined on our Pricing Promise page.
            </p>
            <p>
              We take pricing integrity seriously. Any installer who reprices without a legitimate
              reason from our defined list is removed from the platform immediately. Our business
              model only works if customers trust the prices they see. That alignment is how we
              hold installers to account.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="font-display text-2xl text-ink mb-8">What indicative pricing means</h2>
          <div className="space-y-5 font-sans text-base text-ink leading-relaxed">
            <p>
              Every price on this site is an indicative installed price. It includes supply of the
              unit to your specification, professional installation, removal and disposal of your
              existing window or door, a FENSA certificate, and all sealing and finishing work.
              Standard installation means a straightforward like-for-like replacement in a
              structurally sound opening with normal access.
            </p>
            <p>
              The word "indicative" is important. We cannot confirm the exact final price until a
              surveyor has visited and measured your opening. Most jobs are completely standard and
              the price does not change. Some jobs involve circumstances that couldn't be known
              before the visit. In those cases, the surveyor explains the variation before any work
              is agreed and you have full choice over whether to proceed.
            </p>
            <p>
              We publish the complete list of legitimate reasons a price may vary on our Pricing
              Promise page. We believe in transparency about what "indicative" means — not using
              it as a word that gives installers licence to charge more whenever they feel like it.
            </p>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4 pt-8 border-t border-hairline">
          <Button variant="primary" onClick={() => navigate('/shop')}>
            Browse Products
          </Button>
          <Button variant="secondary" onClick={() => navigate('/quick-quote')}>
            Get a Quick Quote
          </Button>
        </div>
      </div>
    </Layout>
  )
}
