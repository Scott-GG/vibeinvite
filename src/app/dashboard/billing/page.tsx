import Link from "next/link";
import { CreditCard, ArrowUpRight } from "lucide-react";
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

  const tierLabels: Record<string, string> = {
    free: "Free",
    unlimited: "Unlimited",
  };

  return (
    <div className="p-6 lg:p-8">
      <h1 className="text-2xl font-semibold tracking-tight">Billing</h1>
      <p className="text-muted-foreground">
        Manage your plan and view purchase history
      </p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Current Plan
            </CardTitle>
            <CardDescription>Your subscription tier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{tierLabels[tier]}</p>
                <p className="text-sm text-muted-foreground">
                  {tier === "free"
                    ? "Up to 15 guests, basic templates"
                    : "Unlimited everything"}
                </p>
              </div>
              <Badge
                variant={tier === "unlimited" ? "default" : "outline"}
                className="capitalize"
              >
                {tier}
              </Badge>
            </div>

            {tier === "free" && (
              <div className="mt-6">
                <UpgradeButton
                  type="subscription"
                  label="Upgrade to Unlimited"
                />
              </div>
            )}
            {tier === "unlimited" && profile?.paypal_subscriber_id && (
              <div className="mt-6">
                <PayPalPortalButton customerId={profile.paypal_subscriber_id} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Purchase History */}
        <Card>
          <CardHeader>
            <CardTitle>Purchase History</CardTitle>
            <CardDescription>One-time event upgrades and subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            {!purchases || purchases.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No purchases yet.
              </p>
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
