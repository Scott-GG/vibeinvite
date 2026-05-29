"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Mail, Phone, Utensils } from "lucide-react";
import { toast } from "sonner";
import { deleteGuest } from "./actions";
import { GuestImporter } from "./guest-importer";

type GuestRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  plus_one_allowed: boolean;
  plus_one_count: number;
  dietary_restrictions: string | null;
  custom_responses: Record<string, unknown> | null;
  access_token: string;
};

interface GuestTableProps {
  eventId: string;
  guests: GuestRow[];
  canAddMore?: boolean;
}

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  attending: "default",
  accepted: "default",
  declined: "destructive",
  pending: "outline",
};

const statusLabels: Record<string, string> = {
  attending: "Attending",
  accepted: "Attending",
  declined: "Declined",
  pending: "Pending",
};

function getDietaryLabel(value: string | null): string {
  if (!value) return "—";
  const labels: Record<string, string> = {
    vegetarian: "Vegetarian",
    vegan: "Vegan",
    halal: "Halal",
    "no_restriction": "No restriction",
    none: "No restriction",
  };
  return labels[value.toLowerCase()] ?? value;
}

export function GuestTable({ eventId, guests, canAddMore = true }: GuestTableProps) {
  async function handleDelete(guestId: string) {
    try {
      await deleteGuest(eventId, guestId);
      toast.success("Guest removed");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove guest");
    }
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {guests.length} guest{guests.length !== 1 ? "s" : ""}
        </p>

        {canAddMore ? (
          <GuestImporter eventId={eventId} />
        ) : (
          <a
            href="/dashboard/billing"
            className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-800 transition-colors hover:bg-amber-100"
          >
            Free plan: 15 guests max. Upgrade to add more &rarr;
          </a>
        )}
      </div>

      {guests.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">
            No guests yet. Add your first guest to get started.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>+1</TableHead>
                <TableHead>Dietary</TableHead>
                <TableHead>Table</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => {
                const plusOneName =
                  guest.custom_responses &&
                  typeof guest.custom_responses === "object" &&
                  "plus_one_name" in guest.custom_responses
                    ? String(guest.custom_responses.plus_one_name)
                    : null;

                const tableNumber =
                  guest.custom_responses &&
                  typeof guest.custom_responses === "object" &&
                  "table_number" in guest.custom_responses
                    ? guest.custom_responses.table_number
                    : null;

                return (
                <TableRow key={guest.id}>
                  <TableCell className="font-medium">
                    {guest.first_name} {guest.last_name}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      {guest.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {guest.email}
                        </span>
                      )}
                      {guest.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {guest.phone}
                        </span>
                      )}
                      {!guest.email && !guest.phone && "—"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[guest.status] ?? "outline"}>
                      {statusLabels[guest.status] ?? guest.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {guest.plus_one_count > 0 && plusOneName ? (
                      <span className="text-xs">{plusOneName}</span>
                    ) : guest.plus_one_allowed ? (
                      <span className="text-xs text-stone-400">Open</span>
                    ) : (
                      <span className="text-xs text-stone-300">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {guest.dietary_restrictions ? (
                      <span className="inline-flex items-center gap-1 text-xs">
                        <Utensils className="h-3 w-3 text-stone-400" />
                        {getDietaryLabel(guest.dietary_restrictions)}
                      </span>
                    ) : (
                      <span className="text-xs text-stone-300">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {tableNumber ? (
                      <span className="inline-flex items-center justify-center rounded bg-stone-100 px-1.5 py-0.5 text-xs font-medium text-stone-600">
                        {String(tableNumber)}
                      </span>
                    ) : (
                      <span className="text-xs text-stone-300">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDelete(guest.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-stone-400 transition-colors hover:text-rose-600" />
                    </Button>
                  </TableCell>
                </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
