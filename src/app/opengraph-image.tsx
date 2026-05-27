import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "VibeInvite — Premium Digital Invitations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #f7f3ed 0%, #f5efe8 40%, #faf6f0 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Paper texture dots */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(#d4c5b2 1px, transparent 1px)",
            backgroundSize: "24px 24px",
            opacity: 0.15,
          }}
        />

        {/* Wax seal */}
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "radial-gradient(circle at 40% 40%, #c9a96e, #8b6914)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 32,
            boxShadow: "0 8px 32px rgba(139, 105, 20, 0.3)",
          }}
        >
          <span style={{ fontSize: 42, color: "#faf8f3" }}>V</span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 58,
            fontWeight: 700,
            color: "#2c1f14",
            letterSpacing: "-0.02em",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          VibeInvite
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#8c7868",
            marginTop: 12,
            textAlign: "center",
            maxWidth: 700,
          }}
        >
          Premium Digital Invitations — Wax-sealed envelopes. AI copywriting. Effortless RSVPs.
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            width: 80,
            height: 2,
            background: "linear-gradient(90deg, transparent, #c9a96e, transparent)",
            marginTop: 36,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
