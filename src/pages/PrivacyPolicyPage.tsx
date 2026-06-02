import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function PrivacyPolicyPage() {
  useSEO({
    title: 'Privacy Policy | Windows & Doors Online',
    description:
      'Privacy policy for Windows & Doors Online — how we collect, use and protect your personal data.',
  })

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-4">Privacy Policy</h1>
        <p className="font-sans text-sm text-ink-muted mb-16">Last updated: June 2026</p>

        <Section heading="Who we are">
          <p>
            Windows & Doors Online is a lead generation platform operated from West Yorkshire,
            United Kingdom. We connect homeowners with vetted local installers for windows and
            doors. We are not the installer and we do not carry out installation work.
          </p>
          <p>
            For all data protection enquiries, contact us at{' '}
            <a href="mailto:hello@buywindowsanddoors.co.uk" className="text-brand hover:underline">
              hello@buywindowsanddoors.co.uk
            </a>
            .
          </p>
        </Section>

        <Section heading="What data we collect">
          <p>
            When you submit a survey request through our checkout, we collect:
          </p>
          <ul>
            <li>Your full name</li>
            <li>Your email address</li>
            <li>Your phone number</li>
            <li>Your installation address</li>
            <li>Your product specification (window and door choices, sizes, colours)</li>
            <li>An indicative price for your job</li>
            <li>Any notes or photos you choose to upload about your property</li>
          </ul>
          <p>
            When you submit a contact form enquiry, we collect your name, email address, and
            message.
          </p>
          <p>
            When you register your interest for future coverage areas, we collect your email
            address.
          </p>
          <p>
            We do not collect payment card details at any stage. No payment is taken through
            this platform.
          </p>
        </Section>

        <Section heading="Why we collect it">
          <p>
            We collect your contact and job details for one purpose: to pass them to one vetted
            local installer so they can arrange a free survey and confirm your price. This is
            the service you request when you complete our checkout.
          </p>
          <p>
            The legal basis for processing this data is the performance of a contract — you are
            asking us to arrange an installer contact and survey on your behalf.
          </p>
          <p>
            We collect contact form enquiries to respond to your message. The legal basis is our
            legitimate interest in communicating with people who contact us.
          </p>
          <p>
            We collect interest registration emails to notify you when we expand to your area.
            The legal basis is your consent, which you may withdraw at any time by emailing us.
          </p>
        </Section>

        <Section heading="Who we share it with">
          <p>
            Your survey request data is shared with one vetted installer. We share only the
            information that installer needs to contact you and carry out your survey: your name,
            phone number, address, and product specification.
          </p>
          <p>
            We do not sell your data. We do not share it with multiple companies. We do not
            pass it to any third-party marketing company.
          </p>
          <p>
            We use Supabase (a data infrastructure provider) to store your data securely. Supabase
            processes data on our behalf under a data processing agreement and does not use your
            data for its own purposes.
          </p>
        </Section>

        <Section heading="How long we keep it">
          <p>
            Survey request data is retained for 24 months from submission. This allows us to
            resolve any disputes or queries about a job.
          </p>
          <p>
            Contact form enquiries are retained for 12 months.
          </p>
          <p>
            Interest registration emails are retained until you ask to be removed or until we
            have notified you that coverage is available in your area.
          </p>
        </Section>

        <Section heading="Your rights under UK GDPR">
          <p>Under UK data protection law, you have the right to:</p>
          <ul>
            <li>
              <strong>Access</strong> — request a copy of the personal data we hold about you
            </li>
            <li>
              <strong>Rectification</strong> — ask us to correct inaccurate data
            </li>
            <li>
              <strong>Erasure</strong> — ask us to delete your data, subject to any legal
              obligation to retain it
            </li>
            <li>
              <strong>Restriction</strong> — ask us to restrict processing of your data in
              certain circumstances
            </li>
            <li>
              <strong>Portability</strong> — receive your data in a structured, machine-readable
              format
            </li>
            <li>
              <strong>Objection</strong> — object to processing based on legitimate interests
            </li>
            <li>
              <strong>Withdraw consent</strong> — where processing is based on consent, withdraw
              it at any time
            </li>
          </ul>
          <p>
            To exercise any of these rights, email{' '}
            <a href="mailto:hello@buywindowsanddoors.co.uk" className="text-brand hover:underline">
              hello@buywindowsanddoors.co.uk
            </a>
            . We will respond within one calendar month.
          </p>
          <p>
            If you are unhappy with how we handle your data, you have the right to complain to
            the Information Commissioner's Office (ICO) at{' '}
            <span className="text-ink">ico.org.uk</span>.
          </p>
        </Section>

        <Section heading="Cookies and tracking">
          <p>
            This website does not currently use analytics cookies or advertising trackers. We
            may add analytics in future, at which point this policy will be updated and
            appropriate consent mechanisms will be added.
          </p>
        </Section>

        <Section heading="Changes to this policy">
          <p>
            We will post any updates to this page and update the "last updated" date above.
            Continued use of the service after a material change constitutes acceptance of
            the revised policy.
          </p>
        </Section>

        <Section heading="Contact">
          <p>
            For any questions about this privacy policy or our data practices, email{' '}
            <a href="mailto:hello@buywindowsanddoors.co.uk" className="text-brand hover:underline">
              hello@buywindowsanddoors.co.uk
            </a>
            . We respond within one working day.
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
