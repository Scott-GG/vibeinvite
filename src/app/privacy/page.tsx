import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — VibeInvite",
  description: "How VibeInvite collects, uses, and protects your personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Last updated: May 27, 2026
        </p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-stone-600">
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">1. Introduction</h2>
            <p>
              VibeInvite (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your
              privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when
              you use our digital invitation platform (the &ldquo;Service&rdquo;). By using the Service, you consent to
              the data practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">2. Information We Collect</h2>

            <h3 className="mb-2 mt-4 font-semibold text-stone-800">2.1 Account Information</h3>
            <p>
              When you create an account, we collect your email address and, if you use Google OAuth, your Google
              account name and profile picture. This information is managed through Supabase Auth.
            </p>

            <h3 className="mb-2 mt-4 font-semibold text-stone-800">2.2 Event and Guest Data</h3>
            <p>
              When you create events, we store event details (title, date, location, theme preferences) and guest
              information (names, email addresses, phone numbers, dietary preferences, RSVP responses) as provided
              by you. This data is stored in Supabase PostgreSQL.
            </p>

            <h3 className="mb-2 mt-4 font-semibold text-stone-800">2.3 Payment Information</h3>
            <p>
              Payment processing is handled by Creem (Armitage Labs O&Uuml;), our Merchant of Record. We do not
              store or have access to your full credit card details. Creem collects billing information necessary to
              process your payments. See{" "}
              <a href="https://www.creem.io/privacy" className="text-amber-700 underline hover:text-amber-800"
                target="_blank" rel="noopener noreferrer">
                Creem&rsquo;s Privacy Policy
              </a>{" "}
              for details on their data handling.
            </p>

            <h3 className="mb-2 mt-4 font-semibold text-stone-800">2.4 Automatically Collected Information</h3>
            <p>
              We may automatically collect certain information when you visit our website, including your IP address,
              browser type, operating system, referring URLs, and usage patterns. This data is used for analytics and
              service improvement purposes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">3. How We Use Your Information</h2>
            <ul className="list-disc space-y-1 pl-5">
              <li>To provide, maintain, and improve the Service</li>
              <li>To process payments and manage subscriptions through Creem</li>
              <li>To send invitation emails on your behalf through Resend</li>
              <li>To authenticate your account and secure your data</li>
              <li>To generate AI-assisted invitation copy at your request</li>
              <li>To communicate with you about your account, updates, and support inquiries</li>
              <li>To comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">4. Data Sharing and Third Parties</h2>
            <p className="mb-2">
              We share your data only with the following third-party service providers, and only to the extent necessary
              to provide the Service:
            </p>
            <div className="mt-3 space-y-3">
              <div className="rounded-lg border bg-white p-4">
                <h3 className="font-semibold text-stone-800">Supabase</h3>
                <p className="mt-1 text-xs text-stone-500">
                  Database hosting, authentication, and file storage. Data is stored in Supabase-managed
                  infrastructure.{" "}
                  <a href="https://supabase.com/privacy" className="text-amber-700 underline hover:text-amber-800"
                    target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <h3 className="font-semibold text-stone-800">Creem (Armitage Labs O&Uuml;)</h3>
                <p className="mt-1 text-xs text-stone-500">
                  Merchant of Record for payment processing, tax collection, and invoicing. Creem is based in
                  Estonia (EU) and complies with GDPR.{" "}
                  <a href="https://www.creem.io/privacy" className="text-amber-700 underline hover:text-amber-800"
                    target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <h3 className="font-semibold text-stone-800">Resend</h3>
                <p className="mt-1 text-xs text-stone-500">
                  Transactional email delivery for sending invitations to your guests.{" "}
                  <a href="https://resend.com/legal/privacy-policy" className="text-amber-700 underline hover:text-amber-800"
                    target="_blank" rel="noopener noreferrer">Privacy Policy</a>
                </p>
              </div>
              <div className="rounded-lg border bg-white p-4">
                <h3 className="font-semibold text-stone-800">OpenAI / Anthropic</h3>
                <p className="mt-1 text-xs text-stone-500">
                  AI-powered copywriting assistance. Invitation text generation requests are sent to these providers
                  for processing. No guest personal data is included in AI requests.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">5. Data Retention</h2>
            <p>
              We retain your account data and event information for as long as your account is active. Guest data is
              retained as part of your event records. You may request deletion of your account and associated data by
              contacting us. Payment records are retained by Creem in accordance with applicable tax and accounting
              laws (typically 7 years).
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">6. Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption at rest (Supabase) and in transit
              (TLS/HTTPS). Authentication is managed through Supabase Auth with Row-Level Security policies on all
              database tables to ensure users can only access their own data. No security measure is perfect, and
              we cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">7. Your Rights</h2>
            <p className="mb-2">Depending on your jurisdiction, you may have the following rights regarding your personal data:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your data</li>
            </ul>
            <p className="mt-2">
              To exercise any of these rights, please contact us at{" "}
              <a href="mailto:support@vibeinvite.bzwl.club" className="text-amber-700 underline hover:text-amber-800">
                support@vibeinvite.bzwl.club
              </a>.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">8. Cookies</h2>
            <p>
              The Service uses essential cookies for authentication and session management (managed through Supabase
              Auth). We do not use third-party advertising or tracking cookies. You may configure your browser to
              reject cookies, but this may affect the functionality of the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">9. Children&rsquo;s Privacy</h2>
            <p>
              The Service is not directed to individuals under the age of 13. We do not knowingly collect personal
              information from children under 13. If you believe a child has provided us with personal data, please
              contact us and we will delete it.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">10. International Data Transfers</h2>
            <p>
              Our service providers operate in multiple jurisdictions. Supabase servers may be located in various
              regions worldwide. Creem is based in Estonia (EU) and processes data in compliance with GDPR. By using
              the Service, you consent to the transfer of your data to servers outside your country of residence.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">11. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Material changes will be posted on this page with
              an updated effective date. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">12. Contact</h2>
            <p>
              For privacy-related inquiries, contact us at{" "}
              <a href="mailto:support@vibeinvite.bzwl.club" className="text-amber-700 underline hover:text-amber-800">
                support@vibeinvite.bzwl.club
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
