"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  ChevronUp,
  Eye,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { UpgradeButton } from "@/app/dashboard/billing/upgrade-button";
import { getAllThemes } from "@/lib/themes";

const steps = ["Event Details", "Location", "Theme"];

const eventTypes = [
  { id: "wedding", label: "Wedding", icon: "💒" },
  { id: "party", label: "Party", icon: "🎉" },
  { id: "birthday", label: "Birthday", icon: "🎂" },
  { id: "meeting", label: "Meeting", icon: "📅" },
  { id: "graduation", label: "Graduation", icon: "🎓" },
  { id: "dinner", label: "Dinner", icon: "🍽️" },
];

const themes = getAllThemes().map((t) => ({
  id: t.id,
  name: t.name,
  description: "", // handled inline
  icon: [Heart, Sparkles, GlassWater, Moon, Flower2, Waves][
    ["classic", "romantic", "modern", "midnight", "botanical", "coastal"].indexOf(t.id)
  ] ?? Heart,
  colors: [t.accentColor, t.cardTitle === "text-stone-100" ? "#3a3530" : "#f5f0eb", t.sealOuter],
  pro: t.id !== "classic",
}));

export default function NewEventPage() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [tier, setTier] = useState<string>("free");
  const [previewOpen, setPreviewOpen] = useState(false);
  const supabase = useRef(createClient());

  useEffect(() => {
    supabase.current
      .from("profiles")
      .select("subscription_tier")
      .single()
      .then(({ data }) => {
        if (data) setTier(data.subscription_tier);
      });
  }, []);

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
    } = await supabase.current.auth.getUser();

    const { data, error } = await supabase.current
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

  const selectedType = eventTypes.find((t) => t.id === form.event_type);
  const selectedTheme = themes.find((t) => t.id === form.theme);
  const previewTheme = selectedTheme?.id ?? "classic";
  const isDarkPreview = previewTheme === "midnight";

  // Preview panel component
  const PreviewPanel = () => (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl p-6",
        isDarkPreview
          ? "bg-stone-900 text-stone-100"
          : "bg-stone-50 text-stone-800"
      )}
    >
      <p
        className={cn(
          "mb-2 text-xs font-medium tracking-widest uppercase",
          isDarkPreview ? "text-stone-500" : "text-stone-400"
        )}
      >
        Live Preview
      </p>

      {/* Envelope preview card */}
      <div
        className={cn(
          "relative w-full max-w-[260px] overflow-hidden rounded-xl shadow-lg",
          isDarkPreview ? "bg-stone-800" : "bg-white"
        )}
        style={{ aspectRatio: "4/3" }}
      >
        {/* Background */}
        <div
          className={cn(
            "absolute inset-0",
            isDarkPreview
              ? "bg-gradient-to-br from-stone-800 via-stone-850 to-amber-950/30"
              : "bg-gradient-to-br from-stone-100 via-amber-50 to-stone-200"
          )}
        />
        <div
          className={cn(
            "absolute inset-0 bg-[radial-gradient(#d4c5b2_1px,transparent_1px)] bg-[length:16px_16px]",
            isDarkPreview ? "opacity-5" : "opacity-20"
          )}
        />
        <div
          className={cn(
            "absolute inset-3 rounded-lg border",
            isDarkPreview ? "border-stone-700/40" : "border-stone-300/40"
          )}
        />
        <div
          className={cn(
            "absolute inset-6 rounded",
            isDarkPreview
              ? "bg-gradient-to-br from-amber-100/5 via-transparent to-stone-700/20"
              : "bg-gradient-to-br from-amber-100/40 via-transparent to-stone-200/30"
          )}
        />

        {/* Wax seal */}
        <div className="absolute bottom-1/3 left-1/2 z-10 flex h-12 w-12 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full shadow-lg"
          style={{
            background: selectedTheme?.colors[2]
              ? `radial-gradient(circle at 40% 40%, ${selectedTheme.colors[0]}, ${selectedTheme.colors[2]})`
              : "radial-gradient(circle at 40% 40%, #c9a96e, #8b6914)",
          }}
        >
          <span
            className={cn(
              "font-serif text-base drop-shadow",
              isDarkPreview ? "text-amber-100" : "text-amber-100"
            )}
          >
            ✦
          </span>
        </div>

        {/* Envelope flap */}
        <div
          className="absolute top-0 left-0 right-0 z-10 origin-top"
          style={{
            height: "50%",
            background: isDarkPreview
              ? "linear-gradient(180deg, #3a3530 0%, #2a2520 100%)"
              : "linear-gradient(180deg, #e8dccf 0%, #dfceb8 100%)",
            clipPath: "polygon(0 0, 50% 100%, 100% 0)",
          }}
        />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
          <p
            className={cn(
              "font-serif text-[10px] tracking-[0.2em] uppercase",
              isDarkPreview ? "text-stone-500 opacity-70" : "text-stone-500 opacity-60"
            )}
          >
            You are invited
          </p>
          <p
            className={cn(
              "mt-1 text-center font-serif text-sm italic",
              isDarkPreview ? "text-stone-300" : "text-stone-600"
            )}
          >
            {form.title || "Sarah & John's Wedding"}
          </p>
          {selectedType && (
            <p
              className={cn(
                "mt-1 text-xs capitalize",
                isDarkPreview ? "text-stone-500" : "text-stone-400"
              )}
            >
              {selectedType.label}
            </p>
          )}
          {form.event_date && (
            <p
              className={cn(
                "mt-0.5 text-xs",
                isDarkPreview ? "text-stone-500" : "text-stone-400"
              )}
            >
              {new Date(form.event_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {form.event_time && ` · ${form.event_time}`}
            </p>
          )}
        </div>
      </div>

      {/* Theme name */}
      <p
        className={cn(
          "mt-3 text-xs font-medium",
          isDarkPreview ? "text-stone-400" : "text-stone-500"
        )}
      >
        Theme: {selectedTheme?.name ?? "Classic Elegance"}
      </p>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl p-6 lg:p-8">
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

      {/* Main layout: left form + right preview */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: Form */}
        <div>
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
                <CardContent className="space-y-5">
                  <div className="space-y-1.5">
                    <Label htmlFor="title">Event Title</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Sarah & John's Wedding"
                      value={form.title}
                      onChange={(e) => update("title", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Event Type</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {eventTypes.map((type) => {
                        const selected = form.event_type === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => update("event_type", type.id)}
                            className={cn(
                              "flex flex-col items-center gap-1 rounded-xl border-2 px-3 py-3 text-center transition-all",
                              selected
                                ? "border-stone-900 bg-stone-50 shadow-sm"
                                : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50/50"
                            )}
                          >
                            <span className="text-2xl">{type.icon}</span>
                            <span
                              className={cn(
                                "text-xs font-medium",
                                selected ? "text-stone-900" : "text-stone-600"
                              )}
                            >
                              {type.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
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
                        Upgrade to unlock{" "}
                        <strong>Romantic Garden</strong>,{" "}
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
                      const IconComponent = theme.icon;
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
                            <IconComponent className="mb-3 h-8 w-8 text-stone-700" />
                          )}
                          <h3 className="mb-1 font-medium text-sm">
                            {theme.name}
                            {locked && (
                              <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] text-amber-800">
                                PRO
                              </span>
                            )}
                          </h3>
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

        {/* Right: Preview — desktop always visible */}
        <div className="hidden lg:block">
          <div className="sticky top-24">
            <PreviewPanel />
          </div>
        </div>
      </div>

      {/* Mobile: preview as collapsible bottom drawer */}
      <div className="mt-6 lg:hidden">
        <button
          type="button"
          onClick={() => setPreviewOpen(!previewOpen)}
          className={cn(
            "flex w-full items-center justify-between rounded-xl border bg-stone-50 p-4 text-left transition-colors hover:bg-stone-100"
          )}
        >
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-stone-500" />
            <span className="text-sm font-medium text-stone-700">
              Invitation Preview
            </span>
          </div>
          <ChevronUp
            className={cn(
              "h-4 w-4 text-stone-400 transition-transform",
              previewOpen && "rotate-180"
            )}
          />
        </button>
        {previewOpen && (
          <div className="mt-3">
            <PreviewPanel />
          </div>
        )}
      </div>
    </div>
  );
}
