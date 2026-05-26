"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { addGuest, deleteGuest } from "./actions";

type GuestRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  plus_one_allowed: boolean;
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

export function GuestTable({ eventId, guests, canAddMore = true }: GuestTableProps) {
  const [open, setOpen] = useState(false);

  async function handleAdd(formData: FormData) {
    try {
      await addGuest(eventId, formData);
      setOpen(false);
      toast.success("Guest added");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add guest");
    }
  }

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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={
                <Button size="sm">
                  <Plus className="mr-1 h-4 w-4" />
                  Add Guest
                </Button>
              }
            />
            <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Guest</DialogTitle>
            </DialogHeader>
            <form action={handleAdd} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="first_name">First Name *</Label>
                  <Input id="first_name" name="first_name" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="last_name">Last Name *</Label>
                  <Input id="last_name" name="last_name" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" />
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="plus_one_allowed" name="plus_one_allowed" value="on" />
                <Label htmlFor="plus_one_allowed" className="text-sm">
                  Allow Plus One
                </Label>
              </div>
              <Button type="submit" className="w-full">
                Add Guest
              </Button>
            </form>
          </DialogContent>
        </Dialog>
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
                <TableHead>Plus One</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-16" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {guests.map((guest) => (
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
                    {guest.plus_one_allowed ? "Yes" : "No"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusColors[guest.status] ?? "outline"}>
                      {statusLabels[guest.status] ?? guest.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleDelete(guest.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-stone-400 hover:text-rose-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
