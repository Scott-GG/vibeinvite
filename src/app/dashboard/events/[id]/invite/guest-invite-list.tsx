"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Send, Loader2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { sendToGuest } from "./actions";

type GuestWithLink = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  status: string;
  access_token: string;
  inviteUrl: string;
};

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  accepted: "default",
  declined: "destructive",
  pending: "outline",
};

const statusLabels: Record<string, string> = {
  accepted: "Attending",
  declined: "Declined",
  pending: "Awaiting Response",
};

export function GuestInviteList({
  eventId,
  guests,
  theme,
}: {
  eventId: string;
  guests: GuestWithLink[];
  theme: string;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sendingId, setSendingId] = useState<string | null>(null);

  async function copyLink(guest: GuestWithLink) {
    try {
      await navigator.clipboard.writeText(guest.inviteUrl);
      setCopiedId(guest.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  }

  async function handleSend(guest: GuestWithLink) {
    if (!guest.email) {
      toast.error("Guest has no email address");
      return;
    }
    setSendingId(guest.id);
    try {
      await sendToGuest(eventId, guest.id, undefined, theme);
      toast.success(`Invitation sent to ${guest.first_name}`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to send");
    }
    setSendingId(null);
  }

  return (
    <div className="divide-y rounded-lg border">
      {guests.map((guest) => (
        <div
          key={guest.id}
          className="flex flex-wrap items-center justify-between gap-3 p-3"
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {guest.first_name} {guest.last_name}
              </span>
              <Badge variant={statusColors[guest.status] ?? "outline"}>
                {statusLabels[guest.status] ?? guest.status}
              </Badge>
            </div>
            {guest.email && (
              <p className="truncate text-xs text-muted-foreground">
                {guest.email}
              </p>
            )}
            <p className="truncate text-xs text-stone-400">
              {guest.inviteUrl}
            </p>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="xs"
              onClick={() => copyLink(guest)}
            >
              {copiedId === guest.id ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
              <span className="ml-1 text-xs">
                {copiedId === guest.id ? "Copied" : "Copy"}
              </span>
            </Button>
            {guest.email && (
              <Button
                variant="ghost"
                size="xs"
                onClick={() => handleSend(guest)}
                disabled={sendingId === guest.id}
              >
                {sendingId === guest.id ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Send className="h-3.5 w-3.5" />
                )}
              </Button>
            )}
            <a
              href={guest.inviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "xs" }))}
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
