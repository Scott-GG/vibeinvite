export interface ThemeConfig {
  id: string;
  name: string;
  // Envelope
  envelopeBg: string;
  envelopeTexture: string;
  envelopeBorder: string;
  envelopeLiner: string;
  envelopeFlap: string;
  envelopeFlapTexture: string;
  // Wax seal
  sealOuter: string;
  sealInner: string;
  sealIcon: string;
  sealHighlight: string;
  // Open state
  openBg: string;
  openBgGradient: string;
  // Card
  cardBg: string;
  cardRing: string;
  cardTitle: string;
  cardSubtitle: string;
  cardBody: string;
  cardDivider: string;
  cardDividerIcon: string;
  // Button accent
  accentColor: string;
  accentHover: string;
  // Particles
  particleColor: string;
  // Hero banner (no cover image)
  heroGradient: string;
  // Typography hint
  fontClass: string;
}

const themes: Record<string, ThemeConfig> = {
  classic: {
    id: "classic",
    name: "Classic Elegance",
    envelopeBg: "#f7f3ed",
    envelopeTexture: "#d4c5b2",
    envelopeBorder: "#d5cdc0",
    envelopeLiner: "from-amber-100/40 via-transparent to-stone-200/30",
    envelopeFlap: "linear-gradient(180deg, #e8dccf 0%, #dfceb8 100%)",
    envelopeFlapTexture: "#c4b393",
    sealOuter: "radial-gradient(circle at 40% 40%, #c9a96e, #8b6914)",
    sealInner: "border-amber-300/40 bg-amber-100/10",
    sealIcon: "text-amber-100",
    sealHighlight: "bg-white/15",
    openBg: "#f5f0eb",
    openBgGradient: "from-stone-100 via-stone-50 to-amber-50/30",
    cardBg: "bg-white",
    cardRing: "ring-stone-200/60",
    cardTitle: "text-stone-800",
    cardSubtitle: "text-stone-400",
    cardBody: "text-stone-600",
    cardDivider: "from-transparent to-stone-200",
    cardDividerIcon: "text-amber-600",
    accentColor: "#8b6914",
    accentHover: "#6b4f0a",
    particleColor: "#c9a96e",
    heroGradient: "from-stone-200 via-stone-100 to-amber-100/50",
    fontClass: "font-serif",
  },
  romantic: {
    id: "romantic",
    name: "Romantic Garden",
    envelopeBg: "#fdf6f0",
    envelopeTexture: "#e8d5d5",
    envelopeBorder: "#e8d0d0",
    envelopeLiner: "from-rose-100/40 via-transparent to-green-100/20",
    envelopeFlap: "linear-gradient(180deg, #f0e0e0 0%, #e8d0d0 100%)",
    envelopeFlapTexture: "#d4b8b8",
    sealOuter: "radial-gradient(circle at 40% 40%, #d4a5a5, #b87070)",
    sealInner: "border-rose-300/40 bg-rose-100/10",
    sealIcon: "text-rose-100",
    sealHighlight: "bg-white/15",
    openBg: "#fdf7f3",
    openBgGradient: "from-rose-50/50 via-stone-50 to-green-50/30",
    cardBg: "bg-white",
    cardRing: "ring-rose-200/40",
    cardTitle: "text-stone-800",
    cardSubtitle: "text-rose-400",
    cardBody: "text-stone-600",
    cardDivider: "from-transparent to-rose-200",
    cardDividerIcon: "text-rose-400",
    accentColor: "#c97b7b",
    accentHover: "#a86060",
    particleColor: "#d4a5a5",
    heroGradient: "from-rose-100 via-stone-50 to-green-100/50",
    fontClass: "font-serif",
  },
  modern: {
    id: "modern",
    name: "Modern Minimal",
    envelopeBg: "#fafafa",
    envelopeTexture: "#e0e0e0",
    envelopeBorder: "#e8e8e8",
    envelopeLiner: "from-stone-200/30 via-transparent to-stone-100/20",
    envelopeFlap: "linear-gradient(180deg, #f0f0f0 0%, #e8e8e8 100%)",
    envelopeFlapTexture: "#d0d0d0",
    sealOuter: "radial-gradient(circle at 40% 40%, #555, #222)",
    sealInner: "border-stone-400/40 bg-stone-200/10",
    sealIcon: "text-stone-200",
    sealHighlight: "bg-white/10",
    openBg: "#f5f5f5",
    openBgGradient: "from-stone-100 via-white to-stone-50",
    cardBg: "bg-white",
    cardRing: "ring-stone-300/40",
    cardTitle: "text-stone-900",
    cardSubtitle: "text-stone-500",
    cardBody: "text-stone-600",
    cardDivider: "from-transparent to-stone-300",
    cardDividerIcon: "text-stone-500",
    accentColor: "#2d2d2d",
    accentHover: "#1a1a1a",
    particleColor: "#999",
    heroGradient: "from-stone-300 via-stone-100 to-white",
    fontClass: "font-sans",
  },
  midnight: {
    id: "midnight",
    name: "Midnight Noir",
    envelopeBg: "#1a1510",
    envelopeTexture: "#2a2520",
    envelopeBorder: "#3a3530",
    envelopeLiner: "from-amber-100/10 via-transparent to-stone-900/30",
    envelopeFlap: "linear-gradient(180deg, #2a2520 0%, #1a1510 100%)",
    envelopeFlapTexture: "#3a3530",
    sealOuter: "radial-gradient(circle at 40% 40%, #e0c97e, #a6843c)",
    sealInner: "border-amber-400/30 bg-amber-200/10",
    sealIcon: "text-amber-100",
    sealHighlight: "bg-white/10",
    openBg: "#0d0d0d",
    openBgGradient: "from-stone-950 via-stone-900 to-amber-950/30",
    cardBg: "bg-stone-900",
    cardRing: "ring-stone-700/40",
    cardTitle: "text-stone-100",
    cardSubtitle: "text-stone-400",
    cardBody: "text-stone-300",
    cardDivider: "from-transparent to-amber-800/50",
    cardDividerIcon: "text-amber-500",
    accentColor: "#c9a96e",
    accentHover: "#a6843c",
    particleColor: "#c9a96e",
    heroGradient: "from-stone-900 via-amber-950/30 to-stone-950",
    fontClass: "font-serif",
  },
  botanical: {
    id: "botanical",
    name: "Botanical",
    envelopeBg: "#f7f3ec",
    envelopeTexture: "#c5b8a0",
    envelopeBorder: "#d5ccbc",
    envelopeLiner: "from-green-100/30 via-transparent to-stone-200/20",
    envelopeFlap: "linear-gradient(180deg, #e8e0d0 0%, #ddd4c0 100%)",
    envelopeFlapTexture: "#c5b8a0",
    sealOuter: "radial-gradient(circle at 40% 40%, #6d8a6d, #3a5a40)",
    sealInner: "border-green-400/30 bg-green-200/10",
    sealIcon: "text-green-100",
    sealHighlight: "bg-white/15",
    openBg: "#f5f0e8",
    openBgGradient: "from-green-50/30 via-stone-50 to-stone-100",
    cardBg: "bg-white",
    cardRing: "ring-green-200/40",
    cardTitle: "text-stone-800",
    cardSubtitle: "text-stone-400",
    cardBody: "text-stone-600",
    cardDivider: "from-transparent to-green-300/50",
    cardDividerIcon: "text-green-600",
    accentColor: "#3a5a40",
    accentHover: "#2a4a30",
    particleColor: "#a3b18a",
    heroGradient: "from-green-100 via-stone-50 to-stone-100",
    fontClass: "font-serif",
  },
  coastal: {
    id: "coastal",
    name: "Coastal",
    envelopeBg: "#faf9f5",
    envelopeTexture: "#c5d5e0",
    envelopeBorder: "#d5e0e8",
    envelopeLiner: "from-blue-100/30 via-transparent to-amber-100/20",
    envelopeFlap: "linear-gradient(180deg, #e8f0f5 0%, #d8e4f0 100%)",
    envelopeFlapTexture: "#c0d4e4",
    sealOuter: "radial-gradient(circle at 40% 40%, #68a0c0, #457b9d)",
    sealInner: "border-blue-300/40 bg-blue-100/10",
    sealIcon: "text-blue-100",
    sealHighlight: "bg-white/15",
    openBg: "#fefaec",
    openBgGradient: "from-blue-50/30 via-stone-50 to-amber-50/30",
    cardBg: "bg-white",
    cardRing: "ring-blue-200/40",
    cardTitle: "text-stone-800",
    cardSubtitle: "text-stone-400",
    cardBody: "text-stone-600",
    cardDivider: "from-transparent to-blue-200",
    cardDividerIcon: "text-blue-500",
    accentColor: "#457b9d",
    accentHover: "#356a8a",
    particleColor: "#a8dadc",
    heroGradient: "from-blue-100 via-stone-50 to-amber-50/30",
    fontClass: "font-serif",
  },
};

export function getTheme(themeId?: string): ThemeConfig {
  return themes[themeId ?? "classic"] ?? themes.classic;
}

export function getAllThemes(): ThemeConfig[] {
  return Object.values(themes);
}
