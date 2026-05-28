import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund Policy — VibeInvite",
  description: "Our refund and cancellation policy for VibeInvite subscription and one-time purchases.",
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Refund Policy
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          Last updated: May 27, 2026
        </p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-stone-600">
          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">1. Overview</h2>
            <p>
              We want you to be completely satisfied with VibeInvite. This policy explains our refund and cancellation
              terms for both one-time event purchases and recurring subscriptions. All payments are processed through
              PayPal (Armitage Labs O&Uuml;, Estonia), our Merchant of Record.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">2. One-Time Event Purchases (Signature Plan)</h2>
            <p className="mb-2">
              The Signature plan is a one-time purchase of $29 USD for a single event. It includes:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Unlimited guests for that event</li>
              <li>All 6 premium themes</li>
              <li>AI copywriter access</li>
              <li>Seating chart tool</li>
              <li>Dietary preference tracking</li>
            </ul>
            <p className="mt-3">
              If you have not sent any invitations for the event you purchased the Signature plan for, you may request
              a full refund within <strong>7 days</strong> of purchase by contacting us. Once invitations have been
              sent, the purchase is non-refundable as the service has been utilized.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">3. Subscription Plans (Host Plan)</h2>
            <p className="mb-2">
              The Host plan is a recurring subscription of $9.99 USD/month. You may cancel at any time:
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>From your <Link href="/dashboard/billing" className="text-amber-700 underline hover:text-amber-800">Billing dashboard</Link></li>
              <li>Through the PayPal customer portal (accessible from your Billing page)</li>
              <li>By contacting us at{" "}
                <a href="mailto:support@vibeinvite.bzwl.club" className="text-amber-700 underline hover:text-amber-800">
                  support@vibeinvite.bzwl.club
                </a>
              </li>
            </ul>
            <p className="mt-3">
              Upon cancellation, you retain access to all Host features until the end of your current billing period.
              We do not provide refunds for partial billing periods. If you cancel within <strong>48 hours</strong>{" "}
              of your first subscription payment and have not used any premium features (beyond the Starter plan&rsquo;s
              capabilities), you are eligible for a full refund of your initial payment.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">4. How to Request a Refund</h2>
            <p>
              To request a refund, email us at{" "}
              <a href="mailto:support@vibeinvite.bzwl.club" className="text-amber-700 underline hover:text-amber-800">
                support@vibeinvite.bzwl.club
              </a>{" "}
              with your account email and purchase details (event name or subscription date). We will respond within{" "}
              <strong>3 business days</strong>. Approved refunds will be processed through PayPal and typically appear
              on your original payment method within 5–10 business days, depending on your card issuer.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">5. Non-Refundable Circumstances</h2>
            <p>The following are not eligible for refunds:</p>
            <ul className="list-disc space-y-1 pl-5 mt-2">
              <li>Subscription payments beyond the initial 48-hour window</li>
              <li>Signature (one-time) purchases where invitations have already been sent</li>
              <li>Partial months of subscription service</li>
              <li>Downgrades from Host to a lower-tier plan (you retain access until period end)</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">6. Chargebacks</h2>
            <p>
              If you believe a charge is erroneous or unauthorized, please contact us first before initiating a
              chargeback with your bank. We are committed to resolving billing issues promptly and fairly. PayPal
              handles chargeback disputes on our behalf as the Merchant of Record.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-serif text-xl font-semibold text-stone-900">7. Contact</h2>
            <p>
              For any refund or billing questions, contact us at{" "}
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
