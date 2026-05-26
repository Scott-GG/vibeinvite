"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Users, Utensils, MapPin, CalendarDays, Gift, ChevronDown } from "lucide-react";
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
import { getTheme, type ThemeConfig } from "@/lib/themes";

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
  eventTime?: string;
  message?: string;
  coverImage?: string;
  registryUrl?: string;
  dressCode?: string;
  theme?: string;
  onSubmit: (data: RsvpFormData) => Promise<void>;
}

export function RsvpForm({
  guestName,
  plusOneAllowed,
  dietaryOptions,
  eventTitle,
  eventDate,
  eventLocation,
  eventTime,
  message,
  coverImage,
  registryUrl,
  dressCode,
  theme: themeId = "classic",
  onSubmit,
}: RsvpFormProps) {
  const [status, setStatus] = useState<"accepted" | "declined" | null>(null);
  const [plusOneName, setPlusOneName] = useState("");
  const [dietary, setDietary] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const t: ThemeConfig = getTheme(themeId);
  const isDark = themeId === "midnight";
  const firstName = guestName.split(" ")[0];

  async function handleSubmit() {
    if (!status) return;
    setSubmitting(true);

    try {
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
    } catch (e) {
      setSubmitting(false);
      toast.error(
        e instanceof Error ? e.message : "Failed to submit RSVP. Please try again.",
      );
    }
  }

  const dressCodeDisplay = dressCode ?? (
    themeId === "midnight" ? "Black Tie" :
    themeId === "romantic" ? "Garden Party Attire" :
    themeId === "coastal" ? "Beach Formal" :
    "Cocktail Attire"
  );

  const accentStyle = { backgroundColor: t.accentColor };
  const accentHoverStyle = { backgroundColor: t.accentHover };

  return (
    <>
      <ConfettiEffect active={showConfetti} />

      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            key="submitted"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className={`rounded-2xl p-8 text-center shadow-xl ring-1 ${t.cardBg} ${t.cardRing}`}
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
            <h2
              className={`mb-2 text-2xl sm:text-3xl ${t.cardTitle}`}
              style={{ fontFamily: t.fontClass === "font-sans" ? undefined : "serif" }}
            >
              {status === "accepted" ? "See you there!" : "Response Received"}
            </h2>
            <p className={`mx-auto max-w-sm leading-relaxed ${t.cardBody}`}>
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
            className={`rounded-2xl p-6 shadow-xl ring-1 sm:p-8 ${t.cardBg} ${t.cardRing}`}
          >
            {/* Event header */}
            <div className="mb-8 text-center">
              <p
                className={`mb-1 text-xs tracking-[0.25em] uppercase ${t.cardSubtitle}`}
              >
                You are cordially invited to
              </p>
              <h1
                className={`mb-1 text-3xl ${t.cardTitle}`}
                style={{ fontFamily: t.fontClass === "font-sans" ? undefined : "serif" }}
              >
                {eventTitle}
              </h1>
              <p className={`text-sm ${t.cardSubtitle}`}>
                {eventDate}{eventTime ? ` at ${eventTime}` : ""}
              </p>
              {eventLocation && (
                <p className={`text-sm ${t.cardSubtitle}`}>{eventLocation}</p>
              )}
            </div>

            {/* Invitation message */}
            {message && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <div
                  className={`mx-auto max-w-md rounded-lg px-6 py-5 text-center ${
                    isDark ? "bg-stone-800/50" : "bg-stone-50"
                  }`}
                >
                  <p
                    className={`leading-relaxed italic ${t.cardBody}`}
                    style={{ fontFamily: t.fontClass === "font-sans" ? undefined : "serif" }}
                  >
                    {message}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Divider */}
            <div className="mb-8 flex items-center justify-center gap-3">
              <div
                className={`h-px flex-1 bg-gradient-to-r ${t.cardDivider}`}
              />
              <span className={`text-xs ${t.cardDividerIcon}`}>&#9670;</span>
              <div
                className={`h-px flex-1 bg-gradient-to-l ${t.cardDivider}`}
              />
            </div>

            {/* Guest greeting */}
            <p
              className={`mb-8 text-center text-lg ${t.cardBody}`}
              style={{ fontFamily: t.fontClass === "font-sans" ? undefined : "serif" }}
            >
              Dear{" "}
              <span className={`font-semibold ${t.cardTitle}`}>{guestName}</span>,
            </p>

            {/* RSVP buttons */}
            <div className="mb-8">
              <Label
                className={`mb-3 block text-center text-sm ${t.cardSubtitle}`}
              >
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
                    <Label className={`text-sm ${t.cardBody}`}>Plus One</Label>
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
                    <Label className={`text-sm ${t.cardBody}`}>
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

              {/* Allergies / Special Requests */}
              {status === "accepted" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Utensils className="h-4 w-4 text-stone-400" />
                    <Label className={`text-sm ${t.cardBody}`}>
                      Allergies or Special Requests
                    </Label>
                  </div>
                  <Textarea
                    placeholder="Any food allergies or special requests for the host..."
                    rows={2}
                    onChange={(e) => setDietary(e.target.value)}
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
              style={{ ...accentStyle, color: isDark ? "#0d0d0d" : "#fff" }}
            >
              {submitting ? "Sending..." : "Send Response"}
            </Button>

            {/* Event Details (collapsible) */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setDetailsOpen(!detailsOpen)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm transition-colors ${
                  isDark ? "hover:bg-stone-800 text-stone-400" : "hover:bg-stone-100 text-stone-500"
                }`}
              >
                <span className="font-medium">Event Details</span>
                <motion.span
                  animate={{ rotate: detailsOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.span>
              </button>

              <AnimatePresence>
                {detailsOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className={`space-y-3 px-4 pb-4 ${t.cardBody}`}>
                      {eventDate && (
                        <div className="flex items-center gap-3">
                          <CalendarDays className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">
                            {eventDate}{eventTime ? ` at ${eventTime}` : ""}
                          </span>
                        </div>
                      )}
                      {eventLocation && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm">{eventLocation}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-3">
                        <span className="flex-shrink-0 text-sm">🎩</span>
                        <span className="text-sm">Dress Code: {dressCodeDisplay}</span>
                      </div>
                      {registryUrl && (
                        <div className="flex items-center gap-3">
                          <Gift className="h-4 w-4 flex-shrink-0" />
                          <a
                            href={registryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm underline underline-offset-2 hover:opacity-80"
                            style={{ color: t.accentColor }}
                          >
                            View Gift Registry
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
