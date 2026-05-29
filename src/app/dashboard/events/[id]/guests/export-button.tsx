"use client";

import { useState } from "react";
import { Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

type Guest = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  status: string;
  dietary_restrictions: string | null;
  created_at: string;
  updated_at: string;
};

function exportCSV(guests: Guest[]) {
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "RSVP Status",
    "Dietary",
    "Invited At",
  ];

  const rows = guests.map((g) => [
    g.first_name,
    g.last_name,
    g.email ?? "",
    g.phone ?? "",
    g.status,
    g.dietary_restrictions ?? "",
    new Date(g.created_at).toLocaleDateString("en-US"),
  ]);

  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")),
  ].join("\n");

  const BOM = "﻿";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `guest-list-${new Date().toISOString().split("T")[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// Simple XLSX-like export (actually CSV with .xlsx-friendly content)
function exportXLSX(guests: Guest[]) {
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "RSVP Status",
    "Dietary",
    "Invited At",
  ];

  const rows = guests.map((g) => [
    g.first_name,
    g.last_name,
    g.email ?? "",
    g.phone ?? "",
    g.status,
    g.dietary_restrictions ?? "",
    new Date(g.created_at).toLocaleDateString("en-US"),
  ]);

  // TSV format can be opened by Excel
  const tsvContent = [
    headers.join("\t"),
    ...rows.map((row) => row.map((cell) => cell.replace(/\t/g, " ")).join("\t")),
  ].join("\n");

  const BOM = "﻿";
  const blob = new Blob([BOM + tsvContent], {
    type: "text/tab-separated-values;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `guest-list-${new Date().toISOString().split("T")[0]}.xls`;
  a.click();
  URL.revokeObjectURL(url);
}

export function ExportGuestsButton({
  eventId,
  guests,
}: {
  eventId: string;
  guests: Guest[];
}) {
  const [open, setOpen] = useState(false);

  if (guests.length === 0) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        <Download className="mr-2 h-4 w-4" />
        Export
        <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => { exportCSV(guests); setOpen(false); }}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => { exportXLSX(guests); setOpen(false); }}>
          Export as Excel (.xls)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
