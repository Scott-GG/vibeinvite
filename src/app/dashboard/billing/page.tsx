import Link from "next/link";
import { CreditCard, Check, X, Crown, Sparkles, ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createClient, requireUser } from "@/lib/supabase/server";
import { UpgradeButton } from "./upgrade-button";
import { PayPalPortalButton } from "./paypal-portal-button";

interface FeatureRow {
  label: string;
  free: boolean;
  pro: boolean;
  wedding: boolean;
}

const featureRows: FeatureRow[] = [
  { label: "Active events", free: true, pro: true, wedding: true },
  { label: "Guest capacity", free: true, pro: true, wedding: true },
  { label: "Premium themes", free: true, pro: true, wedding: true },
  { label: "Email invitations", free: true, pro: true, wedding: true },
  { label: "RSVP tracking", free: true, pro: true, wedding: true },
  { label: "AI copywriter", free: false, pro: true, wedding: true },
  { label: "CSV bulk import", free: false, pro: true, wedding: true },
  { label: "Auto reminders", free: false, pro: true, wedding: true },
  { label: "Guest export", free: false, pro: true, wedding: true },
  { label: "Dietary tracking", free: false, pro: true, wedding: true },
  { label: "Multi-event mgmt", free: false, pro: false, wedding: true },
  { label: "Seating chart", free: false, pro: false, wedding: true },
  { label: "Custom domain", free: false, pro: false, wedding: true },
  { label: "White label", free: false, pro: false, wedding: true },
];

const freeDetails = [
  { text: "1 active event", icon: true },
  { text: "Up to 15 guests", icon: true },
  { text: "1 basic theme", icon: true },
  { text: "Email invitations", icon: true },
];

const proDetails = [
  { text: "Unlimited events", icon: true },
  { text: "Unlimited guests", icon: true },
  { text: "All 6 premium themes", icon: true },
  { text: "AI copywriter", icon: true },
  { text: "14-day free trial", icon: true },
];

const weddingDetails = [
  { text: "Everything in Pro", icon: true },
  { text: "Seating charts", icon: true },
  { text: "Custom domain", icon: true },
  { text: "White label (no VibeInvite logo)", icon: true },
  { text: "Multi-event management", icon: true },
];

export default async function BillingPage() {
  const supabase = await createClient();
  const user = await requireUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_tier, paypal_subscriber_id")
    .eq("id", user.id)
    .maybeSingle();

  const { data: purchases } = await supabase
    .from("purchases")
    .select("id, event_id, amount, purchase_type, status, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const tier = profile?.subscription_tier ?? "free";
  const isPro = tier === "unlimited" || tier === "pro";
  const isWedding = tier === "wedding";

  const FeatureIcon = ({ included }: { included: boolean }) =>
    included ? (
      <Check className="h-4 w-4 shrink-0" style={{ color: "#4A7C59" }} />
    ) : (
      <X className="h-4 w-4 shrink-0" style={{ color: "#D4C5B2" }} />
    );

  return (
    <div className="p-6 lg:p-8" style={{ background: "#FAF7F2" }}>
      <div className="mb-8">
        <h1
          className="font-display text-3xl tracking-wide"
          style={{ color: "#1A1410" }}
        >
          Billing
        </h1>
        <p style={{ color: "#8B7355" }} className="mt-1 font-sans text-sm">
          Choose the plan that fits your celebration
        </p>
      </div>

      {/* Current plan banner for free users */}
      {!isPro && !isWedding && (
        <div
          className="mb-8 rounded-2xl p-6"
          style={{
            background: "#1A1410",
            border: "1px solid rgba(201,168,76,0.2)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-widest" style={{ color: "#A89880" }}>
                Your Current Plan: <span style={{ color: "#C9A84C" }}>FREE</span>
              </p>
              <p className="mt-2 text-sm leading-relaxed" style={{ color: "#8B7355" }}>
                You&apos;re missing unlimited events, all 6 premium themes, AI copywriter,
                CSV import, and auto reminder emails.
              </p>
            </div>
            <div className="flex gap-3">
              <UpgradeButton
                type="subscription"
                label="Upgrade to Pro — $12/mo"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3-Column pricing */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* FREE */}
        <Card
          className="border-stone-200/60 shadow-sm"
          style={{ background: "#FFFFFF" }}
        >
          <CardHeader>
            <CardTitle
              className="font-serif text-xl"
              style={{ color: "#1A1410" }}
            >
              Free
            </CardTitle>
            <CardDescription>Perfect for trying it out</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p
                className="font-serif text-4xl font-light tracking-tight"
                style={{ color: "#1A1410" }}
              >
                $0
              </p>
              <p className="text-xs" style={{ color: "#A89880" }}>
                forever free
              </p>
            </div>
            <ul className="space-y-3">
              {freeDetails.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm" style={{ color: "#6B5744" }}>
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#4A7C59" }} />
                  {f.text}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <div
                className="flex h-10 w-full items-center justify-center rounded-lg border text-sm font-medium"
                style={{
                  borderColor: "rgba(201,168,76,0.3)",
                  color: "#8B7355",
                  cursor: "default",
                }}
              >
                Current Plan
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PRO — Dark card */}
        <Card
          className="relative border-2 shadow-xl"
          style={{
            background: "#1A1410",
            borderColor: "#C9A84C",
          }}
        >
          <div
            className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-0.5 text-xs font-medium"
            style={{ background: "#C9A84C", color: "#1A1410" }}
          >
            Most Popular
          </div>
          <CardHeader>
            <CardTitle
              className="font-serif text-xl"
              style={{ color: "#C9A84C" }}
            >
              Pro{" "}
              <span className="font-sans text-xs" style={{ color: "#8B7355" }}>
                &#9733;
              </span>
            </CardTitle>
            <CardDescription style={{ color: "#A89880" }}>
              For power hosts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p
                className="font-serif text-4xl font-light tracking-tight"
                style={{ color: "#FAF5E4" }}
              >
                $12
                <span className="font-sans text-base" style={{ color: "#8B7355" }}>
                  /mo
                </span>
              </p>
              <p className="text-xs" style={{ color: "#A89880" }}>
                or $99/year (save 31%)
              </p>
            </div>
            <ul className="space-y-3">
              {proDetails.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm" style={{ color: "#D4C5B2" }}>
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#C9A84C" }} />
                  {f.text}
                </li>
              ))}
            </ul>
            {!isPro && !isWedding ? (
              <div className="mt-6">
                <UpgradeButton
                  type="subscription"
                  label="Start Pro Trial"
                />
                <p className="mt-2 text-center text-xs" style={{ color: "#8B7355" }}>
                  14-day free trial · Cancel anytime
                </p>
              </div>
            ) : isPro && profile?.paypal_subscriber_id ? (
              <div className="mt-6">
                <PayPalPortalButton customerId={profile.paypal_subscriber_id} />
              </div>
            ) : (
              <div className="mt-6">
                <div
                  className="flex h-10 w-full items-center justify-center rounded-lg border text-sm font-medium"
                  style={{
                    borderColor: "rgba(201,168,76,0.3)",
                    color: "#C9A84C",
                    cursor: "default",
                  }}
                >
                  Current Plan
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* WEDDING */}
        <Card
          className="border-stone-200/60 shadow-sm"
          style={{ background: "#FFFFFF" }}
        >
          <CardHeader>
            <CardTitle
              className="font-serif text-xl"
              style={{ color: "#1A1410" }}
            >
              Wedding
            </CardTitle>
            <CardDescription>For large celebrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <p
                className="font-serif text-4xl font-light tracking-tight"
                style={{ color: "#1A1410" }}
              >
                $29
                <span className="font-sans text-base" style={{ color: "#8B7355" }}>
                  /mo
                </span>
              </p>
              <p className="text-xs" style={{ color: "#A89880" }}>
                or $249/year (save 28%)
              </p>
            </div>
            <ul className="space-y-3">
              {weddingDetails.map((f) => (
                <li key={f.text} className="flex items-start gap-2.5 text-sm" style={{ color: "#6B5744" }}>
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#4A7C59" }} />
                  {f.text}
                </li>
              ))}
            </ul>
            {!isWedding ? (
              <div className="mt-6">
                <Link
                  href="/contact"
                  className="flex h-10 w-full items-center justify-center rounded-lg border text-sm font-medium transition-colors"
                  style={{
                    borderColor: "rgba(201,168,76,0.3)",
                    color: "#8B7355",
                    background: "#FAF7F2",
                  }}
                >
                  Contact Sales
                  <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="mt-6">
                <div
                  className="flex h-10 w-full items-center justify-center rounded-lg border text-sm font-medium"
                  style={{
                    borderColor: "rgba(201,168,76,0.3)",
                    color: "#C9A84C",
                    cursor: "default",
                  }}
                >
                  Current Plan
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Feature comparison table */}
      <div className="mt-12">
        <Card style={{ background: "#FFFFFF", borderColor: "rgba(201,168,76,0.15)" }}>
          <CardHeader>
            <CardTitle
              className="font-serif text-xl"
              style={{ color: "#1A1410" }}
            >
              Full Feature Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(201,168,76,0.15)" }}>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: "#8B7355" }}>
                      Feature
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: "#8B7355" }}>
                      Free
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: "#C9A84C" }}>
                      Pro
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider" style={{ color: "#8B7355" }}>
                      Wedding
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {featureRows.map((row, i) => (
                    <tr
                      key={row.label}
                      style={{
                        borderBottom: i < featureRows.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none",
                        background: i % 2 === 0 ? "rgba(250,247,242,0.5)" : "transparent",
                      }}
                    >
                      <td className="px-6 py-3 text-sm" style={{ color: "#3D3530" }}>
                        {row.label}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <FeatureIcon included={row.free} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <FeatureIcon included={row.pro} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <FeatureIcon included={row.wedding} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase History */}
      <div className="mt-8">
        <Card style={{ background: "#FFFFFF", borderColor: "rgba(201,168,76,0.15)" }}>
          <CardHeader>
            <CardTitle
              className="font-serif text-xl"
              style={{ color: "#1A1410" }}
            >
              Purchase History
            </CardTitle>
            <CardDescription>
              One-time event upgrades and subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!purchases || purchases.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <CreditCard className="mb-3 h-10 w-10" style={{ color: "#D4C5B2" }} />
                <p className="text-sm font-medium" style={{ color: "#8B7355" }}>
                  No purchases yet
                </p>
                <p className="mt-1 text-xs" style={{ color: "#A89880" }}>
                  Upgrade to Pro — your purchase history will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y rounded-lg border" style={{ borderColor: "rgba(201,168,76,0.15)" }}>
                {purchases.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize" style={{ color: "#3D3530" }}>
                        {p.purchase_type.replace("_", " ")}
                      </p>
                      <p className="text-xs" style={{ color: "#A89880" }}>
                        {new Date(p.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: "#1A1410" }}>
                        ${(p.amount / 100).toFixed(2)}
                      </span>
                      <Badge
                        variant={p.status === "completed" ? "default" : "outline"}
                      >
                        {p.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Trust footer */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs" style={{ color: "#A89880" }}>
        <span>Cancel anytime</span>
        <span className="inline-block h-1 w-1 rounded-full" style={{ background: "#C9A84C" }} />
        <span>No hidden fees</span>
        <span className="inline-block h-1 w-1 rounded-full" style={{ background: "#C9A84C" }} />
        <span>Secure payment via PayPal</span>
      </div>
    </div>
  );
}
