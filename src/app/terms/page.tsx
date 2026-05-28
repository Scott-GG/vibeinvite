import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — VibeInvite",
  description: "Terms and conditions governing the use of VibeInvite's digital invitation platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Last updated: May 27, 2026
        </p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-stone-600">
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using VibeInvite (&ldquo;the Service&rdquo;), you agree to be bound by these Terms of Service.
              If you do not agree to these terms, you may not use the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">2. Description of Service</h2>
            <p>
              VibeInvite is a digital invitation platform that allows users to create, customize, and send premium
              digital invitations for events such as weddings, galas, and milestone celebrations. The Service includes
              RSVP tracking, guest management, AI-assisted copywriting, and seating chart tools.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">3. Merchant of Record</h2>
            <p>
              VibeInvite uses PayPal (Armitage Labs O&Uuml;, Estonia) as its Merchant of Record. When you make a
              purchase through our platform, PayPal is the legal seller of record. PayPal handles payment processing,
              tax collection and remittance (including VAT, GST, and sales tax), invoicing, and chargeback management.
              By making a purchase, you acknowledge that your payment is processed by PayPal on our behalf.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">4. Account Registration</h2>
            <p>
              You must provide accurate and complete information when creating an account. You are solely responsible
              for maintaining the confidentiality of your account credentials and for all activities that occur under
              your account. You must notify us immediately of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">5. Subscriptions and Payments</h2>
            <p className="mb-2">
              VibeInvite offers both one-time event purchases and recurring subscription plans. By subscribing, you
              authorize us to charge your payment method on a recurring basis until you cancel.
            </p>
            <p>
              All prices are displayed in USD and are subject to applicable taxes collected by PayPal. We reserve the
              right to change pricing with reasonable notice. Price changes will not affect existing subscriptions
              until the next billing cycle.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">6. Cancellation</h2>
            <p>
              You may cancel your subscription at any time from your Billing dashboard or via the PayPal customer
              portal. Cancellation takes effect at the end of your current billing period. You will retain access
              to paid features until that date. No refunds are issued for partial billing periods. See our{" "}
              <a href="/refund" className="text-amber-700 underline hover:text-amber-800">
                Refund Policy
              </a>{" "}
              for details.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">7. Acceptable Use</h2>
            <p className="mb-2">You agree not to:</p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Use the Service for any unlawful purpose or in violation of any applicable laws</li>
              <li>Upload, transmit, or distribute viruses, malware, or any malicious code</li>
              <li>Use the AI copywriting feature to generate harmful, misleading, fraudulent, or NSFW content</li>
              <li>Send spam or unsolicited invitations through the platform</li>
              <li>Resell, sublicense, or redistribute the Service without authorization</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">8. Intellectual Property</h2>
            <p>
              VibeInvite and all associated branding, design assets, themes, and software code are the exclusive
              intellectual property of VibeInvite. You retain ownership of content you upload to the Service
              (event details, images, guest lists). By using the Service, you grant us a limited license to host
              and display your content solely for the purpose of providing the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">9. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, VibeInvite shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use of the Service. Our total liability
              for any claim shall not exceed the amount you paid us in the 12 months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">10. Disclaimer of Warranties</h2>
            <p>
              The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any
              kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free,
              or completely secure.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">11. Third-Party Services</h2>
            <p>
              The Service integrates with third-party platforms including Supabase (data storage and authentication),
              Resend (email delivery), PayPal (payment processing), and OpenAI / Anthropic (AI copywriting). Your use
              of these services is subject to their respective terms and privacy policies. We are not responsible for
              the availability or performance of third-party services.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">12. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware,
              United States, without regard to its conflict of law provisions. Any disputes arising from these Terms
              shall be resolved exclusively in the courts of Delaware.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">13. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. Material changes will be communicated via email
              or through the Service. Continued use of the Service after changes take effect constitutes acceptance of
              the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">14. Contact</h2>
            <p>
              For questions about these Terms, contact us at{" "}
              <a href="mailto:support@vibeinvite.bzwl.club" className="text-amber-700 underline hover:text-amber-800">
                support@vibeinvite.bzwl.club
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
