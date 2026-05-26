"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { ConfettiEffect } from "./ConfettiEffect";

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
  const [showConfetti, setShowConfetti] = useState(false);

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

    if (status === "accepted") {
      setShowConfetti(true);
      toast.success("You're on the list! We can't wait to celebrate with you.");
    } else {
      toast("Response recorded. You'll be missed!", {
        description: "Thank you for letting us know.",
      });
    }
  }

  // First name for greeting
  const firstName = guestName.split(" ")[0];

  return (
    <>
      <ConfettiEffect active={showConfetti} />

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-stone-200/60"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-stone-100"
            >
              {status === "accepted" ? (
                <Check className="h-10 w-10 text-emerald-600" />
              ) : (
                <X className="h-10 w-10 text-rose-500" />
              )}
            </motion.div>
            <h2 className="mb-2 font-serif text-2xl text-stone-800 sm:text-3xl">
              {status === "accepted" ? "See you there!" : "Response Received"}
            </h2>
            <p className="mx-auto max-w-sm text-stone-500 leading-relaxed">
              {status === "accepted"
                ? `Thank you, ${firstName}. We've saved your spot at ${eventTitle}.`
                : `Thank you for letting us know, ${firstName}. You'll be missed at ${eventTitle}.`}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-stone-200/60 sm:p-8"
          >
            {/* Event header */}
            <div className="mb-8 text-center">
              <p className="mb-1 font-serif text-xs tracking-[0.25em] text-stone-400 uppercase">
                You are cordially invited to
              </p>
              <h1 className="mb-1 font-serif text-3xl text-stone-800">
                {eventTitle}
              </h1>
              <p className="text-sm text-stone-500">{eventDate}</p>
              {eventLocation && (
                <p className="text-sm text-stone-400">{eventLocation}</p>
              )}
            </div>

            {/* Gold divider */}
            <div className="mb-8 flex items-center justify-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200" />
              <span className="text-amber-600 text-xs">&#9670;</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-200" />
            </div>

            {/* Guest greeting */}
            <p className="mb-8 text-center font-serif text-lg text-stone-600">
              Dear{" "}
              <span className="font-semibold text-stone-800">{guestName}</span>,
            </p>

            {/* RSVP buttons */}
            <div className="mb-8">
              <Label className="mb-3 block text-center text-sm text-stone-500">
                Will you be joining us?
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  whileHover={status !== "accepted" ? { scale: 1.02 } : {}}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStatus("accepted")}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
                    status === "accepted"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.15)]"
                      : "border-stone-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                  }`}
                >
                  <Check
                    className={`h-6 w-6 transition-colors ${
                      status === "accepted"
                        ? "text-emerald-600"
                        : "text-stone-400"
                    }`}
                  />
                  <span className="font-medium text-sm">Accept</span>
                  <span className="text-xs opacity-70">with Pleasure</span>
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={status !== "declined" ? { scale: 1.02 } : {}}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStatus("declined")}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all ${
                    status === "declined"
                      ? "border-rose-400 bg-rose-50 text-rose-700"
                      : "border-stone-200 hover:border-rose-300 hover:bg-rose-50/50"
                  }`}
                >
                  <X
                    className={`h-6 w-6 transition-colors ${
                      status === "declined"
                        ? "text-rose-500"
                        : "text-stone-400"
                    }`}
                  />
                  <span className="font-medium text-sm">Decline</span>
                  <span className="text-xs opacity-70">with Regret</span>
                </motion.button>
              </div>
            </div>

            <AnimatePresence>
              {/* Plus One */}
              {status === "accepted" && plusOneAllowed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="h-4 w-4 text-stone-400" />
                    <Label className="text-sm text-stone-600">Plus One</Label>
                  </div>
                  <Input
                    placeholder="Your guest's full name"
                    value={plusOneName}
                    onChange={(e) => setPlusOneName(e.target.value)}
                  />
                </motion.div>
              )}

              {/* Dietary dropdown */}
              {status === "accepted" && dietaryOptions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils className="h-4 w-4 text-stone-400" />
                    <Label className="text-sm text-stone-600">
                      Dietary Preferences
                    </Label>
                  </div>
                  <Select
                    value={dietary}
                    onValueChange={(v) => setDietary(v ?? "")}
                  >
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

              {/* Dietary notes */}
              {status === "accepted" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="h-4 w-4 text-stone-400" />
                    <Label className="text-sm text-stone-600">
                      Allergies or Special Requests
                    </Label>
                  </div>
                  <Textarea
                    placeholder="Any dietary restrictions or notes for the host..."
                    value={dietary}
                    onChange={(e) => setDietary(e.target.value)}
                    rows={2}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={!status || submitting}
              size="lg"
              className="h-12 w-full text-base shadow-sm transition-all hover:shadow-md"
            >
              {submitting ? "Sending..." : "Send Response"}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
