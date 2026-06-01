import React from 'react'
import { Layout } from '../components/Layout'
import { useSEO } from '../utils/seo'

export function AboutPage() {
  useSEO({
    title: 'About Us | Why We Built This | Windows & Doors Online',
    description:
      'Why we built a transparent online platform for windows and doors in West Yorkshire. The industry problem and what we are doing about it.',
  })

  return (
    <Layout>
      <div className="max-w-[720px] mx-auto px-6 md:px-8 py-16">
        <h1 className="font-display text-3xl md:text-4xl text-ink mb-16">
          Why we built Windows & Doors Online
        </h1>

        <section className="mb-14">
          <h2 className="font-display text-2xl text-ink mb-6">The industry problem</h2>
          <div className="space-y-5 font-sans text-base text-ink leading-relaxed">
            <p>
              The windows and doors industry has operated the same sales model for twenty years.
              A homeowner searches online, fills in a form, and within hours receives calls from
              three or four companies. A salesperson visits the home, stays for two or three hours,
              shows a fake original price, crosses it out, and offers a "today only" discount.
              The whole encounter is designed to manufacture pressure.
            </p>
            <p>
              Companies running this model budget for 15–20% conversion rates. They expect most
              people to say no. They compensate by making the selling process as uncomfortable as
              possible for the people who say yes. The homeowner who just wanted to know what a
              casement window costs has no way of finding out without going through all of that.
            </p>
            <p>
              Fake discounts, high-pressure closes, fake urgency — none of it is necessary. It
              is a cultural habit from before the internet existed, still running because no one
              in the industry has had a strong enough reason to change it. Until now.
            </p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="font-display text-2xl text-ink mb-6">What we are doing differently</h2>
          <div className="space-y-5 font-sans text-base text-ink leading-relaxed">
            <p>
              We put honest prices on the internet and let people see them before anyone comes to
              their house. That is the whole idea. If you want to know what a composite door costs
              in Harrogate, you can find out in two minutes without giving us your phone number.
            </p>
            <p>
              We send one installer per job. Not a list of three companies who will call you
              repeatedly and compete for your number — one vetted local fitter who will arrange
              a survey, confirm the price, and do the work. We charge the installer a fee when
              the job completes. Our interests are aligned with yours: we want straightforward
              jobs done at honest prices, because that is what creates the reviews that build our
              platform.
            </p>
            <p>
              We are starting in West Yorkshire, where we know the market and the installer
              network. We will expand to other areas as our installer vetting process scales.
            </p>
          </div>
        </section>

        <section className="mb-14">
          <h2 className="font-display text-2xl text-ink mb-6">Who we are</h2>
          <div className="space-y-5 font-sans text-base text-ink leading-relaxed">
            <p>
              I have spent a decade in e-commerce and retail product management, building consumer
              platforms where price transparency and straightforward buying experiences are the
              norm. I grew up watching my family run a windows and doors installation business for
              thirty years. I have seen both sides of this market close up.
            </p>
            <p>
              The specific frustration that led to this was watching someone I know — not a
              naive person, someone who buys things online every day — sit through a four-hour
              sales visit to get a price for four windows. They knew the price was inflated. They
              bought anyway because they were exhausted and couldn't face starting again. That
              should not happen in 2026.
            </p>
            <p>
              We are not trying to replace local installers. We are trying to give them a better
              way to find customers, and give customers a way to find them without being put
              through a process designed to wear them down.
            </p>
          </div>
        </section>
      </div>
    </Layout>
  )
}
