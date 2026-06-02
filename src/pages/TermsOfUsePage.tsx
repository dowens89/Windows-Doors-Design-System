import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function TermsOfUsePage() {
  useSEO({
    title: 'Terms of Use | Windows & Doors Online',
    description: 'Terms of use for Windows & Doors Online.',
  })

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-4">Terms of Use</h1>
        <p className="font-sans text-sm text-ink-muted mb-16">Last updated: June 2026</p>

        <Section heading="What this service is">
          <p>
            Windows & Doors Online (WDO) is a lead generation platform. We provide an online
            tool for homeowners to configure windows and doors, see indicative installed prices,
            and submit a request for a free survey from a vetted local installer.
          </p>
          <p>
            WDO is not an installer. We do not supply windows, doors, or installation services.
            All installation work is carried out by independent, vetted local installers who are
            not employed by or agents of WDO.
          </p>
        </Section>

        <Section heading="Indicative pricing">
          <p>
            Prices shown on this site are indicative installed prices. They are based on standard
            installation conditions for West Yorkshire and are not a contractual offer or a
            guaranteed quote.
          </p>
          <p>
            The final price for any job is confirmed only after a surveyor has visited your
            property and verified the specification and installation conditions. In most
            straightforward replacements, the final price matches the indicative price shown
            online. Where it does not, your installer will explain the reason in writing
            before any work begins.
          </p>
          <p>
            You are under no obligation to proceed at any stage. No payment is taken through
            this platform.
          </p>
        </Section>

        <Section heading="Our role and liability">
          <p>
            WDO matches homeowners with installers and facilitates the initial contact. We
            do not supervise, manage, or guarantee installation work carried out by
            independent installers.
          </p>
          <p>
            WDO accepts no liability for:
          </p>
          <ul>
            <li>The quality, timeliness, or outcome of any installation work</li>
            <li>Any injury, damage to property, or financial loss arising from installation</li>
            <li>
              Any difference between the indicative price shown online and the final price
              agreed with an installer, provided the variation is for a legitimate reason as
              defined on our Pricing Promise page
            </li>
            <li>
              Any failure by an installer to contact you within the stated timeframes
            </li>
          </ul>
          <p>
            Nothing in these terms limits our liability for death or personal injury caused by
            our negligence, or for fraud or fraudulent misrepresentation.
          </p>
        </Section>

        <Section heading="Your obligations">
          <p>When using this service, you agree to:</p>
          <ul>
            <li>Provide accurate information about your property and requirements</li>
            <li>
              Not submit requests for properties where you do not have authority to commission
              installation work
            </li>
            <li>
              Not use the platform for commercial purposes other than as a homeowner or
              authorised representative of a residential property
            </li>
            <li>
              Not misuse the platform, including by submitting false, speculative, or duplicate
              requests
            </li>
          </ul>
        </Section>

        <Section heading="Installer obligations">
          <p>
            Installers accepted onto the WDO platform commit to contacting survey requesters
            within 24 hours, arranging a survey within 48 hours, and providing a written price
            before any work begins.
          </p>
          <p>
            Installers commit to the WDO Pricing Promise: prices may only vary from the
            indicative figure for the reasons defined on our Pricing Promise page. Installers
            who reprice without a legitimate cause are removed from the platform.
          </p>
          <p>
            These commitments are between WDO and our installers. They do not create a direct
            contractual obligation between WDO and the homeowner, but form part of how we
            select and manage the installers we work with.
          </p>
        </Section>

        <Section heading="Intellectual property">
          <p>
            All content on this website — including pricing information, product descriptions,
            guides, and design — is owned by Windows & Doors Online. You may not reproduce,
            distribute, or use it for commercial purposes without our written permission.
          </p>
        </Section>

        <Section heading="Governing law">
          <p>
            These terms are governed by the laws of England and Wales. Any disputes arising
            from use of this service will be subject to the exclusive jurisdiction of the
            courts of England and Wales.
          </p>
        </Section>

        <Section heading="Changes to these terms">
          <p>
            We may update these terms from time to time. We will post any changes on this page
            and update the "last updated" date above. Continued use of the service after a
            material change constitutes acceptance of the revised terms.
          </p>
        </Section>

        <Section heading="Contact">
          <p>
            For any questions about these terms, email{' '}
            <a href="mailto:hello@buywindowsanddoors.co.uk" className="text-brand hover:underline">
              hello@buywindowsanddoors.co.uk
            </a>
            .
          </p>
        </Section>
      </div>
    </Layout>
  )
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="mb-14">
      <h2 className="font-display text-2xl text-ink mb-5">{heading}</h2>
      <div className="space-y-4 font-sans text-base text-ink leading-relaxed [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul]:list-disc [&_strong]:font-semibold">
        {children}
      </div>
    </section>
  )
}
