"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  PartyPopper,
  Heart,
  GlassWater,
  Moon,
  Flower2,
  Waves,
  Check,
  Lock,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { UpgradeButton } from "@/app/dashboard/billing/upgrade-button";

const steps = ["Event Details", "Location", "Theme"];

const themes = [
  {
    id: "classic",
    name: "Classic Elegance",
    description: "Timeless black and white with gold accents",
    icon: Heart,
    colors: ["#1a1a1a", "#f5f5f0", "#c9a96e"],
    pro: false,
  },
  {
    id: "romantic",
    name: "Romantic Garden",
    description: "Soft blush, sage green, and cream tones",
    icon: Sparkles,
    colors: ["#d4a5a5", "#b8c5b0", "#faf8f5"],
    pro: true,
  },
  {
    id: "modern",
    name: "Modern Minimal",
    description: "Clean lines with bold typography",
    icon: GlassWater,
    colors: ["#2d2d2d", "#ffffff", "#e8e8e8"],
    pro: true,
  },
  {
    id: "midnight",
    name: "Midnight Noir",
    description: "Dramatic black with gold — for galas and black-tie events",
    icon: Moon,
    colors: ["#0d0d0d", "#f0e8d8", "#c9a96e"],
    pro: true,
  },
  {
    id: "botanical",
    name: "Botanical",
    description: "Earthy greens and warm neutrals inspired by nature",
    icon: Flower2,
    colors: ["#3a5a40", "#f5f0e8", "#a3b18a"],
    pro: true,
  },
  {
    id: "coastal",
    name: "Coastal",
    description: "Ocean blues and sandy beiges for destination celebrations",
    icon: Waves,
    colors: ["#457b9d", "#fefaec", "#a8dadc"],
    pro: true,
  },
];

export default function NewEventPage() {
  const router = useRouter();
  const supabase = createClient();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [tier, setTier] = useState<string>("free");

  // Fetch user's subscription tier
  useState(() => {
    supabase
      .from("profiles")
      .select("subscription_tier")
      .single()
      .then(({ data }) => {
        if (data) setTier(data.subscription_tier);
      });
  });

  const isFree = tier === "free";

  const [form, setForm] = useState({
    title: "",
    event_type: "",
    event_date: "",
    event_time: "",
    location_name: "",
    location_address: "",
    theme: "classic",
  });

  function update(field: string, value: string | null) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function canProceed() {
    if (step === 0) return form.title && form.event_type && form.event_date;
    if (step === 1) return form.location_name;
    return true;
  }

  async function handleSubmit() {
    setSaving(true);

    const eventDate = form.event_time
      ? new Date(`${form.event_date}T${form.event_time}`).toISOString()
      : new Date(`${form.event_date}T00:00:00`).toISOString();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("events")
      .insert({
        user_id: user!.id,
        title: form.title,
        event_type: form.event_type,
        event_date: eventDate,
        location_name: form.location_name,
        location_address: form.location_address || null,
        config: { theme: form.theme },
      })
      .select("id")
      .single();

    setSaving(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Event created successfully");
    router.push(`/dashboard/events/${data.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl p-6 lg:p-8">
      {/* Back + title */}
      <div className="mb-6">
        <a
          href="/dashboard"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "mb-2",
          )}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back
        </a>
        <h1 className="text-2xl font-semibold tracking-tight">
          Create New Event
        </h1>
        <p className="text-muted-foreground">
          Set up your event and choose a design theme
        </p>
      </div>

      {/* Step indicators */}
      <div className="mb-8 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i < step
                  ? "bg-stone-900 text-white"
                  : i === step
                    ? "border-2 border-stone-900 text-stone-900"
                    : "border-2 border-stone-200 text-stone-400"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`text-sm font-medium ${
                i <= step ? "text-stone-900" : "text-stone-400"
              }`}
            >
              {label}
            </span>
            {i < steps.length - 1 && (
              <Separator className="mx-1 w-8" orientation="horizontal" />
            )}
          </div>
        ))}
      </div>

      <Card>
        {/* Step 0: Event Details */}
        {step === 0 && (
          <>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>
                What are you celebrating?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Sarah & John's Wedding"
                  value={form.title}
                  onChange={(e) => update("title", e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type">Event Type</Label>
                <Select
                  value={form.event_type}
                  onValueChange={(v) => update("event_type", v)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="gala">Gala</SelectItem>
                    <SelectItem value="party">Party</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="date">Event Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={form.event_date}
                    onChange={(e) => update("event_date", e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="time">Event Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={form.event_time}
                    onChange={(e) => update("event_time", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </>
        )}

        {/* Step 1: Location */}
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Location</CardTitle>
              <CardDescription>
                Where will the event take place?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="venue">Venue Name</Label>
                <Input
                  id="venue"
                  placeholder="e.g. The Grand Ballroom"
                  value={form.location_name}
                  onChange={(e) => update("location_name", e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="e.g. 123 Main Street, New York, NY"
                  value={form.location_address}
                  onChange={(e) => update("location_address", e.target.value)}
                />
              </div>
            </CardContent>
          </>
        )}

        {/* Step 2: Theme */}
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Choose a Theme</CardTitle>
              <CardDescription>
                Pick a design theme for your invitation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isFree && (
                <div className="mb-4 flex items-center justify-between rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                  <span>
                    Upgrade to unlock <strong>Romantic Garden</strong>,{" "}
                    <strong>Modern Minimal</strong>,{" "}
                    <strong>Midnight Noir</strong>,{" "}
                    <strong>Botanical</strong>, and{" "}
                    <strong>Coastal</strong> themes.
                  </span>
                  <UpgradeButton
                    type="subscription"
                    label="Upgrade"
                  />
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-3">
                {themes.map((theme) => {
                  const Icon = theme.icon;
                  const selected = form.theme === theme.id;
                  const locked = isFree && theme.pro;

                  return (
                    <button
                      key={theme.id}
                      type="button"
                      disabled={locked}
                      onClick={() => update("theme", theme.id)}
                      className={`rounded-xl border-2 p-4 text-left transition-all ${
                        locked
                          ? "cursor-not-allowed border-stone-200 bg-stone-50 opacity-60"
                          : selected
                            ? "border-stone-900 bg-stone-50"
                            : "border-transparent bg-stone-100 hover:bg-stone-50"
                      }`}
                    >
                      {locked ? (
                        <Lock className="mb-3 h-8 w-8 text-stone-300" />
                      ) : (
                        <Icon className="mb-3 h-8 w-8 text-stone-700" />
                      )}
                      <h3 className="mb-1 font-medium text-sm">
                        {theme.name}
                        {locked && (
                          <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                            PRO
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {theme.description}
                      </p>
                      <div className="mt-3 flex gap-1.5">
                        {theme.colors.map((c) => (
                          <div
                            key={c}
                            className="h-4 w-4 rounded-full border"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </>
        )}
      </Card>

      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        <Button
          variant="outline"
          disabled={step === 0}
          onClick={() => setStep((s) => s - 1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        {step < 2 ? (
          <Button disabled={!canProceed()} onClick={() => setStep((s) => s + 1)}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={saving}>
            <PartyPopper className="mr-2 h-4 w-4" />
            {saving ? "Creating..." : "Create Event"}
          </Button>
        )}
      </div>
    </div>
  );
}
