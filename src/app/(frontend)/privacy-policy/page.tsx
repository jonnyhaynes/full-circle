import type { Metadata } from 'next'

import { PageHero } from '@/components/ui/PageHero'
import { getSiteChrome, itemsFrom } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How Full Circle Event Production Ltd collects, uses and protects your personal information.',
}

export default async function PrivacyPage() {
  const { settings, navigation } = await getSiteChrome()

  return (
    <>
      <PageHero
        nav={itemsFrom(navigation, 'header')}
        businessName={settings.businessName || 'Full Circle Event Production'}
        current="/privacy-policy"
        breadcrumb="Privacy policy"
        headline1="Privacy"
        headline2="Policy"
        script="Your data, handled with care"
        intro="How Full Circle Event Production Ltd collects, uses and protects your personal information."
        image={null}
      />

      <div className="fc-container">
        <section className="pt-[clamp(56px,7vw,96px)]">
          <p className="text-sm uppercase tracking-[0.2em] text-white/55">Last updated: July 05, 2026</p>

          <div className="mt-10 max-w-3xl space-y-6 text-white/72 [&_a]:text-accent [&_a]:underline [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-4xl [&_h2]:uppercase [&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-medium [&_h3]:text-white [&_li]:ml-6 [&_li]:list-disc [&_strong]:text-white">
            <p>
              At <strong>Full Circle Event Production Ltd</strong>, we are committed to protecting
              and respecting your privacy. This policy explains when, why, and how we collect personal
              information about people who visit our website, how we keep it secure, and the
              conditions under which we may disclose it to others.
            </p>

            <h2>1. Who We Are</h2>
            <p>
              Full Circle Event Production Ltd (“we”, “us”, or “our”) is a leading AV hire and event
              production company based in Sheffield, UK. For the purposes of the General Data
              Protection Regulation (GDPR) and the UK Data Protection Act 2018, we operate as the
              Data Controller for any personal data you provide to us.
            </p>
            <ul>
              <li>Company Name: Full Circle Event Production Ltd</li>
              <li>
                Registered Address: Meadowhall Road Industrial Estate, Amos Road, Sheffield, S9 1BX
              </li>
              <li>Contact Email: info@fullcircleevents.co.uk</li>
              <li>Contact Number: 0114 3499273</li>
            </ul>

            <h2>2. Information We Collect and How We Use It</h2>
            <p>
              We collect personal information from you only when you voluntarily submit it through
              our website interfaces.
            </p>

            <h3>A. Contact &amp; Quote Enquiries</h3>
            <ul>
              <li>Data Collected: Name, email address, phone number, and details regarding your event.</li>
              <li>
                Purpose: To respond to your query, provide accurate AV hire and event production
                quotes, and coordinate technical services.
              </li>
              <li>
                Legal Basis: Contractual Necessity (taking steps at your request to enter into a
                service contract).
              </li>
            </ul>

            <h3>B. Newsletter Subscriptions</h3>
            <ul>
              <li>Data Collected: Email address.</li>
              <li>
                Purpose: To send you updates, promotional offers, and company news regarding our
                event solutions.
              </li>
              <li>
                Legal Basis: Explicit Consent (which you grant by interacting with our subscription
                tools and can withdraw at any time).
              </li>
            </ul>

            <h3>C. Automated Data (Cookies &amp; Tracking)</h3>
            <ul>
              <li>Data Collected: IP address, browser type, geographic location, and pages visited.</li>
              <li>
                Purpose: To optimize website performance, analyze site traffic, and enhance user
                experience.
              </li>
              <li>Legal Basis: Consent via our website cookie management banner.</li>
            </ul>

            <h2>3. How Long We Keep Your Data</h2>
            <p>
              We will hold your personal information on our systems only for as long as is necessary
              for the relevant activity, or as long as is set out in any relevant contract you hold
              with us.
            </p>
            <ul>
              <li>
                Enquiry data is retained for up to 2 years following our last communication if no
                contract is signed.
              </li>
              <li>Newsletter marketing data is retained until you explicitly opt out or unsubscribe.</li>
            </ul>

            <h2>4. Third-Party Data Sharing</h2>
            <p>
              We do not sell or rent your information to third parties. We will not share your
              information with third parties for marketing purposes. Your data is only shared with
              trusted service providers (such as web hosting, CRM systems, or email delivery
              infrastructure) necessary to deliver our business operations to you, all of whom
              adhere to strict GDPR processing standards.
            </p>

            <h2>5. Your Legal Rights Under GDPR</h2>
            <p>
              As an individual whose data we process, you possess explicit rights under the UK GDPR.
              You may exercise these at any time by contacting us at info@fullcircleevents.co.uk:
            </p>
            <ul>
              <li>
                Right of Access: You have the right to request a copy of the personal information we
                hold about you.
              </li>
              <li>
                Right to Rectification: You can request that we correct any inaccurate or incomplete
                information.
              </li>
              <li>
                Right to Erasure (“Right to be Forgotten”): You can request that we delete your
                personal data from our systems where there is no overriding legal reason to keep it.
              </li>
              <li>
                Right to Withdraw Consent: Where processing is based on consent (e.g. newsletters),
                you can withdraw your consent at any time.
              </li>
            </ul>

            <h2>6. Use of Cookies</h2>
            <p>
              Our website uses cookies to distinguish you from other users. Cookies are small text
              files placed on your device to help the site provide a better user experience.
              Non-essential analytics or tracking cookies will not be dropped on your device unless
              you explicitly opt in via our on-screen Cookie Banner upon your first visit.
            </p>

            <h2>7. Security Measures</h2>
            <p>
              We use industry-standard security protocols, including active SSL encryption (HTTPS),
              to protect your personal data during transmission. While we strive to protect your
              personal information, we cannot guarantee the absolute security of data transmitted
              online; any transmission is at your own risk.
            </p>

            <h2>8. Complaints</h2>
            <p>
              If you believe your data has been handled incorrectly, you have the right to lodge a
              formal complaint with the UK supervisory authority, the Information Commissioner’s
              Office (ICO).
            </p>
          </div>
        </section>
      </div>
    </>
  )
}
