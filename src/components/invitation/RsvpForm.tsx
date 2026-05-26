"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, X, Users, Utensils, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export interface RsvpFormData {
  status: "accepted" | "declined";
  plus_one_name?: string;
  dietary_restrictions?: string;
  custom_responses?: Record<string, string>;
}

interface RsvpFormProps {
  guestName: string;
  plusOneAllowed: boolean;
  dietaryOptions: string[];
  eventTitle: string;
  eventDate: string;
  eventLocation?: string;
  onSubmit: (data: RsvpFormData) => Promise<void>;
}

export function RsvpForm({
  guestName,
  plusOneAllowed,
  dietaryOptions,
  eventTitle,
  eventDate,
  eventLocation,
  onSubmit,
}: RsvpFormProps) {
  const [status, setStatus] = useState<"accepted" | "declined" | null>(null);
  const [plusOneName, setPlusOneName] = useState("");
  const [dietary, setDietary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit() {
    if (!status) return;
    setSubmitting(true);

    await onSubmit({
      status,
      plus_one_name: plusOneName || undefined,
      dietary_restrictions: dietary || undefined,
    });

    setSubmitting(false);
    setSubmitted(true);
    toast.success(
      status === "accepted"
        ? "You're on the list! We can't wait to celebrate with you."
        : "Response recorded. You'll be missed!",
    );
  }

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl bg-white p-8 text-center shadow-xl"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100"
        >
          {status === "accepted" ? (
            <Check className="h-8 w-8 text-emerald-600" />
          ) : (
            <X className="h-8 w-8 text-rose-600" />
          )}
        </motion.div>
        <h2 className="mb-2 font-serif text-2xl text-stone-800">
          {status === "accepted" ? "See you there!" : "Response Received"}
        </h2>
        <p className="text-stone-500">
          {status === "accepted"
            ? `Thank you, ${guestName}. We've saved your spot.`
            : `Thank you for letting us know, ${guestName}.`}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="rounded-xl bg-white p-6 shadow-xl sm:p-8"
    >
      {/* Event header */}
      <div className="mb-8 text-center">
        <p className="mb-1 font-serif text-xs tracking-[0.25em] text-stone-400 uppercase">
          You are invited to
        </p>
        <h1 className="mb-1 font-serif text-2xl text-stone-800 sm:text-3xl">
          {eventTitle}
        </h1>
        <p className="text-sm text-stone-500">{eventDate}</p>
        {eventLocation && (
          <p className="text-sm text-stone-400">{eventLocation}</p>
        )}
      </div>

      <Separator className="mb-8" />

      {/* Guest greeting */}
      <p className="mb-6 text-center font-serif text-lg text-stone-600">
        Dear <span className="text-stone-800">{guestName}</span>,
      </p>

      {/* RSVP buttons */}
      <div className="mb-8">
        <Label className="mb-3 block text-center text-sm text-stone-500">
          Will you be joining us?
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setStatus("accepted")}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
              status === "accepted"
                ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                : "border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50"
            }`}
          >
            <Check className="h-6 w-6" />
            <span className="font-medium text-sm">Accept</span>
            <span className="text-xs opacity-70">with Pleasure</span>
          </button>
          <button
            type="button"
            onClick={() => setStatus("declined")}
            className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
              status === "declined"
                ? "border-rose-600 bg-rose-50 text-rose-700"
                : "border-stone-200 hover:border-rose-300 hover:bg-rose-50/50"
            }`}
          >
            <X className="h-6 w-6" />
            <span className="font-medium text-sm">Decline</span>
            <span className="text-xs opacity-70">with Regret</span>
          </button>
        </div>
      </div>

      {/* Plus One */}
      {status === "accepted" && plusOneAllowed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-stone-500" />
            <Label className="text-sm text-stone-600">Plus One</Label>
          </div>
          <Input
            placeholder="Your guest's full name"
            value={plusOneName}
            onChange={(e) => setPlusOneName(e.target.value)}
          />
        </motion.div>
      )}

      {/* Dietary */}
      {status === "accepted" && dietaryOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Utensils className="h-4 w-4 text-stone-500" />
            <Label className="text-sm text-stone-600">Dietary Preferences</Label>
          </div>
          <Select value={dietary} onValueChange={(v) => setDietary(v ?? "")}>
            <SelectTrigger>
              <SelectValue placeholder="Select your meal preference" />
            </SelectTrigger>
            <SelectContent>
              {dietaryOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      )}

      {/* Dietary free-text (always available) */}
      {status === "accepted" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-3">
            <Heart className="h-4 w-4 text-stone-500" />
            <Label className="text-sm text-stone-600">
              Dietary Restrictions or Notes
            </Label>
          </div>
          <Textarea
            placeholder="Any allergies or special requests..."
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            rows={2}
          />
        </motion.div>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!status || submitting}
        className="w-full"
      >
        {submitting ? "Sending..." : "Send Response"}
      </Button>
    </motion.div>
  );
}
