"use client";

import { useState, useCallback } from "react";
import { Upload, Trash2, Check, Wand2, ClipboardPaste } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { importGuests, addGuest } from "./actions";

interface ParsedGuest {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
}

function parseSmartPaste(text: string): ParsedGuest[] {
  const lines = text.split(/\n/).filter((l) => l.trim());
  const guests: ParsedGuest[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let firstName = "";
    let lastName = "";
    let email = "";
    let phone = "";

    // Pattern: "Name Name <email>" (email header / contact card format)
    const bracketEmail = trimmed.match(/^(.+?)\s*[<\(]([^>)]+@[^>)]+)[>\)]/);
    if (bracketEmail) {
      const namePart = bracketEmail[1].replace(/["']/g, "").trim();
      email = bracketEmail[2].trim();
      const names = namePart.split(/\s+/);
      firstName = names[0] || "";
      lastName = names.slice(1).join(" ") || "";
      phone = extractPhone(trimmed);
      guests.push({ first_name: firstName, last_name: lastName, email: email || undefined, phone: phone || undefined });
      continue;
    }

    // Split by common delimiters: tab, comma, |, -, or 2+ spaces
    const parts = trimmed
      .split(/\t|,(?![^<]*>)|(?<!\s)\|(?!\s)|(?<!\w)\s{2,}(?!\s)/)
      .map((p) => p.replace(/["']/g, "").trim())
      .filter(Boolean);

    // If only one part, it's a name
    if (parts.length === 1) {
      // Could be "Name Surname" or just "Name"
      const names = parts[0].split(/\s+/);
      firstName = names[0] || "";
      lastName = names.slice(1).join(" ") || "";
      guests.push({ first_name: firstName, last_name: lastName });
      continue;
    }

    // Find what each part looks like
    let namePart = "";
    for (const part of parts) {
      if (part.includes("@") && !email) {
        email = part.replace(/^[<(]+|[>)>]+$/g, "").trim();
      } else if (/^[\+]?[\d\s\-()]{7,}$/.test(part) && !phone) {
        phone = part;
      } else if (!namePart) {
        namePart = part;
      } else if (!email && !phone) {
        namePart += " " + part;
      }
    }

    const names = namePart.split(/\s+/);
    firstName = names[0] || "";
    lastName = names.slice(1).join(" ") || "";

    // If we still don't have email/phone, check remaining parts
    for (const part of parts) {
      if (part !== namePart) {
        if (part.includes("@") && !email) email = part.replace(/^[<(]+|[>)>]+$/g, "").trim();
        else if (/^[\+]?[\d\s\-()]{7,}$/.test(part) && !phone) phone = part;
      }
    }

    guests.push({
      first_name: firstName,
      last_name: lastName,
      email: email || undefined,
      phone: phone || undefined,
    });
  }

  return guests.filter((g) => g.first_name);
}

function extractPhone(text: string): string {
  const match = text.match(/[\+]?[\d\s\-()]{7,}/);
  return match ? match[0].trim() : "";
}

function parseCSV(text: string): ParsedGuest[] {
  const lines = text.split(/\n/).filter((l) => l.trim());
  if (lines.length < 2) return parseSmartPaste(text); // fallback

  // Detect header row
  const header = lines[0].toLowerCase();
  const hasHeader =
    header.includes("name") || header.includes("first") ||
    header.includes("email") || header.includes("phone") ||
    header.includes("guest");

  const dataLines = hasHeader ? lines.slice(1) : lines;
  return parseSmartPaste(dataLines.join("\n"));
}

export function GuestImporter({
  eventId,
  onImported,
}: {
  eventId: string;
  onImported?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"smart" | "file" | "manual">("smart");
  const [pasteText, setPasteText] = useState("");
  const [parsed, setParsed] = useState<ParsedGuest[]>([]);
  const [importing, setImporting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // Manual form
  const [mFirstName, setMFirstName] = useState("");
  const [mLastName, setMLastName] = useState("");
  const [mEmail, setMEmail] = useState("");
  const [mPhone, setMPhone] = useState("");
  const [mPlusOne, setMPlusOne] = useState(false);
  const [manualAdding, setManualAdding] = useState(false);

  const handlePaste = useCallback(() => {
    if (!pasteText.trim()) {
      toast.error("Paste some names and emails first");
      return;
    }
    const result = parseSmartPaste(pasteText);
    if (result.length === 0) {
      toast.error("Couldn't find any names. Try a different format.");
      return;
    }
    setParsed(result);
    toast.success(`Found ${result.length} guest${result.length !== 1 ? "s" : ""}`);
  }, [pasteText]);

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const result = file.name.endsWith(".csv") ? parseCSV(text) : parseSmartPaste(text);
      if (result.length === 0) {
        toast.error("Couldn't parse this file. Try pasting the content instead.");
        return;
      }
      setParsed(result);
      toast.success(`Parsed ${result.length} guest${result.length !== 1 ? "s" : ""}`);
    };
    reader.readAsText(file);
  }, []);

  const removeParsed = (index: number) => {
    setParsed((prev) => prev.filter((_, i) => i !== index));
  };

  const handleBulkImport = async () => {
    if (parsed.length === 0) return;
    setImporting(true);
    try {
      await importGuests(eventId, parsed);
      toast.success(`${parsed.length} guests imported`);
      setParsed([]);
      setPasteText("");
      setOpen(false);
      onImported?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    }
    setImporting(false);
  };

  const handleManualAdd = async () => {
    if (!mFirstName.trim() || !mLastName.trim()) {
      toast.error("First and last name are required");
      return;
    }
    setManualAdding(true);
    try {
      const formData = new FormData();
      formData.set("first_name", mFirstName.trim());
      formData.set("last_name", mLastName.trim());
      if (mEmail.trim()) formData.set("email", mEmail.trim());
      if (mPhone.trim()) formData.set("phone", mPhone.trim());
      if (mPlusOne) formData.set("plus_one_allowed", "on");
      await addGuest(eventId, formData);
      toast.success("Guest added");
      setMFirstName(""); setMLastName(""); setMEmail(""); setMPhone(""); setMPlusOne(false);
      onImported?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add guest");
    }
    setManualAdding(false);
  };

  const canImport = parsed.length > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setParsed([]); setPasteText(""); } }}>
      <DialogTrigger render={<Button size="sm" />}>
        <Wand2 className="mr-1 h-4 w-4" />
        Add Guests
      </DialogTrigger>

      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Add Guests</DialogTitle>
        </DialogHeader>

        {/* Mode tabs */}
        <div className="flex gap-1 rounded-lg bg-stone-100 p-1">
          {([
            { id: "smart", label: "Smart Paste", icon: ClipboardPaste },
            { id: "file", label: "Upload File", icon: Upload },
            { id: "manual", label: "Single", icon: Check },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                mode === tab.id
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-500 hover:text-stone-700"
              }`}
            >
              <tab.icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Smart Paste mode */}
        {mode === "smart" && (
          <div className="space-y-3">
            <p className="text-xs text-stone-500">
              Paste names, emails, and phone numbers in any format — from Excel, a contact list, an email CC line, or WhatsApp. We&rsquo;ll figure it out.
            </p>
            <textarea
              placeholder={`Alice Smith  alice@email.com  +1 555-0100\nBob Jones  bob@email.com\nCarol <carol@example.com>\nDavid - david@email.com`}
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-stone-200 p-3 text-sm font-mono resize-y focus:outline-none focus:ring-2 focus:ring-amber-300"
            />
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePaste}
                className="flex-1"
              >
                <Wand2 className="mr-1 h-3.5 w-3.5" />
                Parse Names
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={async () => {
                  try {
                    const clipText = await navigator.clipboard.readText();
                    setPasteText(clipText);
                    // Auto-parse after pasting
                    const result = parseSmartPaste(clipText);
                    if (result.length > 0) {
                      setParsed(result);
                      toast.success(`Found ${result.length} guest${result.length !== 1 ? "s" : ""}`);
                    }
                  } catch {
                    toast.error("Couldn't access clipboard");
                  }
                }}
                className="flex-1"
              >
                <ClipboardPaste className="mr-1 h-3.5 w-3.5" />
                Paste from Clipboard
              </Button>
            </div>
          </div>
        )}

        {/* File upload mode */}
        {mode === "file" && (
          <div className="space-y-3">
            <p className="text-xs text-stone-500">
              Drop a CSV, Excel (.xlsx), or text file. We&rsquo;ll find the names and emails.
            </p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault(); setDragOver(false);
                const file = e.dataTransfer.files[0];
                if (file) handleFile(file);
              }}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-10 transition-colors ${
                dragOver
                  ? "border-amber-400 bg-amber-50"
                  : "border-stone-200 hover:border-stone-300"
              }`}
            >
              <Upload className={`mb-2 h-6 w-6 ${dragOver ? "text-amber-600" : "text-stone-400"}`} />
              <p className="text-sm text-stone-500">Drop a file here</p>
              <p className="mt-1 text-xs text-stone-400">CSV, Excel, or TXT</p>
              <label className="mt-3 cursor-pointer rounded-lg bg-stone-100 px-4 py-2 text-xs font-medium text-stone-600 hover:bg-stone-200 transition-colors">
                Browse Files
                <input
                  type="file"
                  accept=".csv,.txt,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                />
              </label>
            </div>
          </div>
        )}

        {/* Manual mode */}
        {mode === "manual" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="m-first">First Name *</Label>
                <Input id="m-first" value={mFirstName} onChange={(e) => setMFirstName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-last">Last Name *</Label>
                <Input id="m-last" value={mLastName} onChange={(e) => setMLastName(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-email">Email</Label>
              <Input id="m-email" type="email" value={mEmail} onChange={(e) => setMEmail(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-phone">Phone</Label>
              <Input id="m-phone" type="tel" value={mPhone} onChange={(e) => setMPhone(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="m-plusone"
                checked={mPlusOne}
                onCheckedChange={(v) => setMPlusOne(v === true)}
              />
              <Label htmlFor="m-plusone" className="text-sm">Allow Plus One</Label>
            </div>
            <Button type="button" onClick={handleManualAdd} disabled={manualAdding} className="w-full">
              {manualAdding ? "Adding..." : "Add Guest"}
            </Button>
          </div>
        )}

        {/* Parsed preview */}
        {canImport && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-stone-700">
                {parsed.length} guest{parsed.length !== 1 ? "s" : ""} ready
              </p>
              <button
                type="button"
                onClick={() => setParsed([])}
                className="text-xs text-stone-400 hover:text-stone-600"
              >
                Clear all
              </button>
            </div>
            <div className="max-h-48 overflow-auto rounded-lg border">
              <table className="w-full text-xs">
                <thead className="bg-stone-50 sticky top-0">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-stone-500">Name</th>
                    <th className="px-3 py-2 text-left font-medium text-stone-500">Email</th>
                    <th className="px-3 py-2 text-left font-medium text-stone-500">Phone</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {parsed.map((g, i) => (
                    <tr key={i}>
                      <td className="px-3 py-1.5 text-stone-800">
                        {g.first_name} {g.last_name}
                      </td>
                      <td className="px-3 py-1.5 text-stone-500">{g.email || "—"}</td>
                      <td className="px-3 py-1.5 text-stone-500">{g.phone || "—"}</td>
                      <td className="px-1 py-1.5">
                        <button
                          type="button"
                          onClick={() => removeParsed(i)}
                          className="text-stone-300 hover:text-rose-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button
              type="button"
              onClick={handleBulkImport}
              disabled={importing}
              className="w-full"
            >
              <Check className="mr-1 h-4 w-4" />
              {importing ? "Importing..." : `Import ${parsed.length} Guest${parsed.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
