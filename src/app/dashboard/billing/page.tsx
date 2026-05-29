import Link from "next/link";
import { CreditCard, Check, X, Crown, ArrowUpRight } from "lucide-react";
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

const freeFeatures = [
  { label: "Up to 15 guests", included: true },
  { label: "1 basic theme (Classic Elegance)", included: true },
  { label: "Email invitations", included: true },
  { label: "RSVP tracking & stats", included: true },
  { label: "AI invitation copywriter", included: false },
  { label: "CSV bulk guest import", included: false },
  { label: "Dietary preferences & seating", included: false },
  { label: "Priority support", included: false },
];

const proFeatures = [
  { label: "Unlimited guests", included: true },
  { label: "All 6 premium themes", included: true },
  { label: "Email invitations", included: true },
  { label: "RSVP tracking & stats", included: true },
  { label: "AI invitation copywriter", included: true },
  { label: "CSV bulk guest import", included: true },
  { label: "Dietary preferences & seating", included: true },
  { label: "Priority support", included: true },
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
  const isPro = tier === "unlimited";

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
      <p className="text-muted-foreground">
        Manage your plan and view purchase history
      </p>

      {/* Plan comparison */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Free Card */}
        <Card className={isPro ? "opacity-70" : ""}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Free
            </CardTitle>
            <CardDescription>Current plan</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight">
              $0<span className="text-lg font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Great for trying it out
            </p>

            <ul className="mt-6 space-y-3">
              {freeFeatures.map((f, i) => {
                const Icon = f.included ? Check : X;
                return (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        f.included ? "text-emerald-500" : "text-stone-300"
                      }`}
                    />
                    <span
                      className={
                        f.included ? "text-stone-700" : "text-stone-400"
                      }
                    >
                      {f.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>

        {/* Pro Card */}
        <Card
          className={
            !isPro
              ? "relative border-amber-300 ring-2 ring-amber-100 shadow-lg"
              : ""
          }
        >
          {!isPro && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-100 px-4 py-0.5 text-xs font-medium text-amber-800">
              Most Popular
            </span>
          )}
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              Pro
              {!isPro && (
                <Badge className="ml-1 bg-amber-100 text-amber-800 hover:bg-amber-100">
                  Recommended
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              {isPro ? "Your current plan" : "For power hosts"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold tracking-tight">
              $12<span className="text-lg font-normal text-muted-foreground">/mo</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Unlimited everything
            </p>

            <ul className="mt-6 space-y-3">
              {proFeatures.map((f, i) => {
                const Icon = f.included ? Check : X;
                return (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <Icon
                      className={`h-4 w-4 shrink-0 ${
                        f.included ? "text-emerald-500" : "text-stone-300"
                      }`}
                    />
                    <span
                      className={
                        f.included ? "text-stone-700" : "text-stone-400"
                      }
                    >
                      {f.label}
                    </span>
                  </li>
                );
              })}
            </ul>

            {!isPro && (
              <div className="mt-6">
                <UpgradeButton
                  type="subscription"
                  label="Upgrade to Pro — $12/mo"
                />
                <p className="mt-2 text-center text-xs text-muted-foreground">
                  Cancel anytime · No hidden fees
                </p>
              </div>
            )}

            {isPro && profile?.paypal_subscriber_id && (
              <div className="mt-6">
                <PayPalPortalButton customerId={profile.paypal_subscriber_id} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Purchase History */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
            <CardDescription>
              One-time event upgrades and subscriptions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!purchases || purchases.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center">
                <CreditCard className="mb-3 h-10 w-10 text-stone-200" />
                <p className="text-sm font-medium text-stone-500">
                  No purchases yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Upgrade to Pro — your purchase history will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y rounded-lg border">
                {purchases.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between px-3 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {p.purchase_type.replace("_", " ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
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
    </div>
  );
}
