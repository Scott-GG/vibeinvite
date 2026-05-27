import type { Metadata } from "next";
import { Mail, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us — VibeInvite",
  description: "Get in touch with the VibeInvite team for support, billing, or general inquiries.",
};

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? "support@vibeinvite.bzwl.club";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto max-w-3xl px-6 py-16 sm:py-20">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Contact Us
        </h1>
        <p className="mt-3 text-stone-500">
          We are here to help. Reach out for support, billing questions, or anything else.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
              <Mail className="h-6 w-6 text-amber-700" />
            </div>
            <h2 className="mt-4 font-semibold text-stone-900">Email Support</h2>
            <p className="mt-2 text-sm text-stone-500">Primary support channel</p>
            <a
              href={`mailto:${supportEmail}`}
              className="mt-3 inline-block text-sm font-medium text-amber-700 hover:text-amber-800 underline"
            >
              {supportEmail}
            </a>
          </div>

          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
              <Clock className="h-6 w-6 text-amber-700" />
            </div>
            <h2 className="mt-4 font-semibold text-stone-900">Response Time</h2>
            <p className="mt-2 text-sm text-stone-500">
              We respond within <strong>24 hours</strong> on business days. Billing inquiries are prioritized.
            </p>
          </div>

          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
              <MessageCircle className="h-6 w-6 text-amber-700" />
            </div>
            <h2 className="mt-4 font-semibold text-stone-900">Self-Service</h2>
            <p className="mt-2 text-sm text-stone-500">
              Manage your subscription and view billing history from your{" "}
              <a href="/dashboard/billing" className="text-amber-700 underline hover:text-amber-800">
                Billing dashboard
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border bg-white p-10 shadow-sm">
          <h2 className="mb-6 font-serif text-xl font-semibold text-stone-900">About VibeInvite</h2>
          <div className="space-y-4 text-sm leading-relaxed text-stone-600">
            <p>
              VibeInvite is a premium digital invitation platform designed for hosts who care deeply about the
              experience of their guests. From the moment an invitation lands in their inbox — complete with a
              wax-sealed envelope animation — to the one-tap RSVP, every detail is crafted to feel like a ritual.
            </p>
            <p>
              We serve event hosts across the globe: weddings, galas, milestone birthdays, anniversary celebrations,
              and everything in between. Our platform combines designer-crafted templates, AI-powered copywriting,
              and zero-friction guest management so you can focus on what matters — the celebration itself.
            </p>
            <div className="mt-6 rounded-lg bg-stone-50 p-4 text-xs text-stone-500">
              <p className="font-medium text-stone-700">Payment Processing</p>
              <p className="mt-1">
                VibeInvite uses Creem (Armitage Labs O&Uuml;, Estonia) as our Merchant of Record. Creem handles
                all payment processing, tax collection and remittance, invoicing, and chargeback management.
                Your payment information is securely processed by Creem and is never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
