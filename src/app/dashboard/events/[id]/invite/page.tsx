import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { createClient, requireUser } from "@/lib/supabase/server";
import { GuestInviteList } from "./guest-invite-list";
import { SendAllButton } from "./send-all-button";
import { SendScheduler } from "./send-scheduler";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const user = await requireUser();

  const { data: event } = await supabase
    .from("events")
    .select("title, event_date, location_name, config, scheduled_send_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!event) notFound();

  const { data: guests } = await supabase
    .from("guests")
    .select("id, first_name, last_name, email, status, access_token")
    .eq("event_id", id)
    .order("first_name", { ascending: true });

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const guestsWithLinks =
    guests?.map((g) => ({
      ...g,
      inviteUrl: `${baseUrl}/invitation/${g.access_token}`,
    })) ?? [];

  const themeConfig =
    typeof event?.config === "object" && event.config !== null
      ? (event.config as Record<string, unknown>)
      : {};
  const theme = (themeConfig?.theme as string) ?? "classic";

  const hasResend = !!process.env.RESEND_API_KEY;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6">
        <Link
          href={`/dashboard/events/${id}/guests`}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-2",
          )}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Guests
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          Send Invitations
        </h1>
        <p className="text-muted-foreground">
          Share invitation links with your guests for{" "}
          {event?.title ?? "your event"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Guest Invitation Links</CardTitle>
              <CardDescription>
                Each guest has a unique, secure link. No login required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {guestsWithLinks.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground">
                  No guests to invite. Add guests first.
                </div>
              ) : (
                <GuestInviteList
                  eventId={id}
                  guests={guestsWithLinks}
                  theme={theme}
                />
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Send via Email</CardTitle>
              <CardDescription>
                Guests receive a beautifully formatted email with their
                personal invitation link.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!hasResend ? (
                <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  Add <code className="rounded bg-amber-100 px-1">RESEND_API_KEY</code>{" "}
                  to your <code className="rounded bg-amber-100 px-1">.env.local</code>{" "}
                  to enable email sending via Resend.
                </div>
              ) : (
                <SendAllButton
                  eventId={id}
                  theme={theme}
                  disabled={guestsWithLinks.length === 0}
                  guestCount={guestsWithLinks.length}
                />
              )}

              <SendScheduler
                eventId={id}
                scheduledAt={event?.scheduled_send_at ?? null}
              />

              <div className="my-4 border-t" />

              <p className="text-xs text-muted-foreground">
                You can also copy individual invitation links and share them
                manually via any channel.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
