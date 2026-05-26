"use server";

import Anthropic from "@anthropic-ai/sdk";

type InvitationTone = "formal" | "romantic" | "funny" | "classic" | "modern";

interface InvitationContext {
  eventType: string;
  hostNames?: string;
  guestNames?: string;
  eventTitle: string;
  eventDate: string;
  eventLocation?: string;
}

export async function generateInvitationCopy(
  tone: InvitationTone,
  context: InvitationContext,
): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const anthropic = new Anthropic({ apiKey });

  const toneGuidance: Record<InvitationTone, string> = {
    formal:
      "Use traditional formal language. Include phrases like 'request the honor of your presence', 'cordially invite you', 'on the occasion of'. Elegant and proper.",
    romantic:
      "Use warm, poetic, and heartfelt language. Include romantic imagery, soft metaphors about love and union. Tender and emotional.",
    funny:
      "Use witty, humorous, and lighthearted language. Include playful jokes about marriage/love. Keep it tasteful and charming, not crude.",
    classic:
      "Use timeless, graceful language. Balanced between formal and warm. Traditional wedding invitation wording with a modern touch. Dignified and welcoming.",
    modern:
      "Use clean, contemporary language. Short sentences, modern phrasing. Minimalist but stylish. Direct and fresh.",
  };

  const locationLine = context.eventLocation
    ? `Location: ${context.eventLocation}`
    : "";

  const userMessage = `Write 3 different invitation text variants for the following event:

Event: ${context.eventTitle}
Type: ${context.eventType}
Date: ${context.eventDate}
${locationLine}
${context.hostNames ? `Hosted by: ${context.hostNames}` : ""}
${context.guestNames ? `Guest(s): ${context.guestNames}` : ""}

Tone: ${tone}
Guidance: ${toneGuidance[tone]}

Requirements:
- Each variant should be 3-5 sentences
- Address the guest(s) by name if provided, otherwise use "Dear Guest"
- Match the specified tone exactly
- Use western social etiquette conventions
- Format each variant as a complete, ready-to-use invitation paragraph

Output exactly 3 variants separated by "---". No numbering, no labels.`;

  const msg = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 800,
    temperature: 0.9,
    system:
      "You are a professional invitation copywriter specializing in western social etiquette for weddings, galas, and formal parties. You write elegant, polished invitation text.",
    messages: [
      {
        role: "user",
        content: userMessage,
      },
    ],
  });

  const text = msg.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  // Split by separator and clean
  return text
    .split("---")
    .map((v) => v.trim())
    .filter((v) => v.length > 0)
    .slice(0, 3);
}
