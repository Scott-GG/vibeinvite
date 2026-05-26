"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Copy,
  Check,
  Loader2,
  RefreshCw,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { generateInvitationCopy } from "@/lib/ai";
import { saveInvitationMessage } from "@/app/dashboard/events/[id]/actions";

const tones = [
  { value: "formal", label: "Formal", description: "Traditional & elegant" },
  { value: "romantic", label: "Romantic", description: "Warm & poetic" },
  { value: "funny", label: "Funny", description: "Witty & charming" },
  { value: "classic", label: "Classic", description: "Timeless & graceful" },
  { value: "modern", label: "Modern", description: "Clean & fresh" },
];

interface AiCopywriterProps {
  eventId: string;
  eventTitle: string;
  eventType: string;
  eventDate: string;
  eventLocation?: string;
}

export function AiCopywriter({
  eventId,
  eventTitle,
  eventType,
  eventDate,
  eventLocation,
}: AiCopywriterProps) {
  const [tone, setTone] = useState("formal");
  const [variants, setVariants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [appliedIdx, setAppliedIdx] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleGenerate() {
    setLoading(true);
    setVariants([]);
    setAppliedIdx(null);

    try {
      const results = await generateInvitationCopy(
        tone as "formal" | "romantic" | "funny" | "classic" | "modern",
        {
          eventTitle,
          eventType,
          eventDate,
          eventLocation,
        },
      );
      setVariants(results);
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to generate copy",
      );
    }

    setLoading(false);
  }

  async function copyVariant(text: string, idx: number) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  }

  async function applyToInvitation(text: string, idx: number) {
    setSaving(true);
    try {
      await saveInvitationMessage(eventId, text);
      setAppliedIdx(idx);
      toast.success("Applied to invitation! Guests will see this message.");
    } catch (e) {
      toast.error(
        e instanceof Error ? e.message : "Failed to save invitation message",
      );
    }
    setSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-600" />
          AI Invitation Copywriter
        </CardTitle>
        <CardDescription>
          Generate elegant invitation text and apply it directly to your guest invitations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-1.5">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v ?? "formal")}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <span className="font-medium">{t.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      — {t.description}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>

        <Separator />

        <AnimatePresence mode="wait">
          {variants.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {variants.map((text, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`group relative rounded-lg border p-4 transition-colors ${
                    appliedIdx === i
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-stone-200 bg-stone-50"
                  }`}
                >
                  <p className="pr-20 font-serif text-sm leading-relaxed text-stone-700 italic">
                    {text}
                  </p>
                  <div className="absolute top-3 right-3 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => applyToInvitation(text, i)}
                      disabled={saving}
                      title="Apply to invitation"
                    >
                      {appliedIdx === i ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Send className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => copyVariant(text, i)}
                      title="Copy to clipboard"
                    >
                      {copiedIdx === i ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                  </div>
                </motion.div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleGenerate}
              >
                <RefreshCw className="mr-2 h-3.5 w-3.5" />
                Regenerate
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
