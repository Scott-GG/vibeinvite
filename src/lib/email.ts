import { Resend } from "resend";
import { getTheme, type ThemeConfig } from "./themes";

const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ?? "VibeInvite <onboarding@resend.dev>";

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function invitationEmailHtml({
  guestName,
  eventTitle,
  eventDate,
  eventLocation,
  inviteUrl,
  hostName,
  theme = "classic",
}: {
  guestName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation?: string;
  inviteUrl: string;
  hostName?: string;
  theme?: string;
}) {
  const t: ThemeConfig = getTheme(theme);
  const isDark = theme === "midnight" || theme === "modern";
  const bg = isDark ? "#1a1a1a" : t.envelopeBg;
  const tex = t.envelopeTexture.replace("#", "");
  const heading = isDark ? "#f0e8d8" : "#2c1f14";
  const subtitle = isDark ? "#b0a090" : "#6b5744";
  const body = isDark ? "#c0b0a0" : "#5c4c3c";
  const muted = isDark ? "#777" : "#a09080";
  const accent = t.accentColor;
  const accentDk = t.accentHover;
  const btnText = isDark ? "#1a1a1a" : "#ffffff";
  const cardBg = isDark ? "#242424" : "#ffffff";
  const cardBorder = isDark ? "#333" : "#e0d5c5";
  const line = isDark ? "#3a3530" : "#e0d5c5";

  const eventInitial = initials(eventTitle);
  const sealGradient = t.sealOuter;
  const firstName = guestName.split(" ")[0];

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;background-color:${bg};background-image:url('data:image/svg+xml,%3Csvg width=%2240%22 height=%2240%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%220.5%22 fill=%22%23${tex}33%22/%3E%3C/svg%3E');">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;">

  <!-- Top spacing -->
  <tr><td style="height:40px;"></td></tr>

  <!-- ── Outer wrapper: envelope liner texture ── -->
  <tr>
    <td style="padding:0 20px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-radius:4px;background:${cardBg};box-shadow:0 2px 24px rgba(0,0,0,0.08),0 0 0 1px ${cardBorder};">

        <!-- ── Top ornament band ── -->
        <tr>
          <td style="padding:40px 32px 0;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="width:40px;height:1px;background:linear-gradient(90deg,transparent,${accent});"></td>
                <td style="padding:0 12px;color:${accent};font-size:12px;">&#10086;</td>
                <td style="width:40px;height:1px;background:linear-gradient(90deg,${accent},transparent);"></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Wax Seal / Crest ── -->
        <tr>
          <td style="padding:28px 32px 8px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="width:72px;height:72px;border-radius:50%;background:${sealGradient};text-align:center;vertical-align:middle;box-shadow:0 6px 20px rgba(0,0,0,0.18),inset 0 1px 0 rgba(255,255,255,0.15);">
                  <span style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#faf8f3;letter-spacing:0.04em;font-weight:bold;">${eventInitial}</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Host line ── -->
        <tr>
          <td style="padding:16px 32px 0;text-align:center;">
            <p style="font-family:Georgia,'Times New Roman',serif;font-size:12px;letter-spacing:0.28em;text-transform:uppercase;color:${muted};margin:0;">
              ${hostName ? `${hostName} requests the pleasure of your company at` : "The honour of your presence is requested at"}
            </p>
          </td>
        </tr>

        <!-- ── Event Title ── -->
        <tr>
          <td style="padding:14px 32px 0;text-align:center;">
            <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:30px;font-weight:normal;color:${heading};margin:0;line-height:1.25;letter-spacing:0.01em;">
              ${eventTitle}
            </h1>
          </td>
        </tr>

        <!-- ── Date + Location in a bordered card ── -->
        <tr>
          <td style="padding:24px 32px 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${line};border-left:none;border-right:none;">
              <tr>
                <td style="padding:16px 0;text-align:center;">
                  <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:${isDark ? "#e0d5c0" : "#5c4c3c"};margin:0 0 4px;line-height:1.5;">
                    <span style="display:inline-block;vertical-align:middle;margin-right:6px;color:${accent};font-size:11px;">&#9728;</span>
                    ${eventDate}
                  </p>
                  ${
                    eventLocation
                      ? `<p style="font-family:Georgia,'Times New Roman',serif;font-size:13px;color:${muted};margin:0;line-height:1.5;">
                    <span style="display:inline-block;vertical-align:middle;margin-right:6px;color:${accent};font-size:10px;">&#9906;</span>
                    ${eventLocation}
                  </p>`
                      : ""
                  }
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Ornamental divider ── -->
        <tr>
          <td style="padding:28px 32px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="width:60px;height:1px;background:linear-gradient(90deg,transparent,${accent}66);"></td>
                <td style="padding:0 10px;color:${accent};font-size:10px;">&#10087;</td>
                <td style="width:60px;height:1px;background:linear-gradient(90deg,${accent}66,transparent);"></td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Personal address ── -->
        <tr>
          <td style="padding:0 32px;">
            <p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${body};margin:0;line-height:1.8;">
              Dear <span style="color:${heading};font-weight:600;">${firstName}</span>,
            </p>
          </td>
        </tr>

        <!-- ── Message body ── -->
        <tr>
          <td style="padding:12px 32px 0;">
            <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:${body};margin:0;line-height:1.85;">
              ${
                hostName
                  ? `${hostName} has the distinct pleasure of inviting you to <strong style="color:${heading};font-weight:600;">${eventTitle}</strong>. Your presence would make this occasion all the more memorable, and we do hope you will be able to join us for what promises to be an unforgettable celebration.`
                  : `You are warmly invited to <strong style="color:${heading};font-weight:600;">${eventTitle}</strong>. We would be honoured by your presence and hope you can join us for this special occasion.`
              }
            </p>
            <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:${body};margin:16px 0 0;line-height:1.85;">
              Please open your personal invitation below to find the full details and kindly respond at your earliest convenience.
            </p>
          </td>
        </tr>

        <!-- ── CTA Button ── -->
        <tr>
          <td style="padding:32px 32px 0;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="border-radius:6px;background:linear-gradient(160deg,${accent},${accentDk});box-shadow:0 6px 18px ${accent}44,0 2px 4px rgba(0,0,0,0.12);">
                  <a href="${inviteUrl}" style="display:inline-block;padding:18px 52px;font-family:Georgia,'Times New Roman',serif;font-size:17px;font-weight:600;color:${btnText};text-decoration:none;letter-spacing:0.03em;white-space:nowrap;line-height:1;">
                    Open Your Invitation
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Gentle hint ── -->
        <tr>
          <td style="padding:20px 32px 0;text-align:center;">
            <p style="font-family:Georgia,'Times New Roman',serif;font-size:13px;color:${muted};margin:0;font-style:italic;line-height:1.6;">
               The enclosed invitation has been prepared especially for you.
            </p>
          </td>
        </tr>

        <!-- ── Fallback link ── -->
        <tr>
          <td style="padding:8px 32px 0;text-align:center;">
            <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${isDark ? "#555" : "#c0b0a0"};margin:0;line-height:1.6;">
              If the button does not appear, copy this link:<br>
              <a href="${inviteUrl}" style="color:${accent};text-decoration:underline;word-break:break-all;">${inviteUrl}</a>
            </p>
          </td>
        </tr>

        <!-- ── Bottom ornament ── -->
        <tr>
          <td style="padding:32px 32px 40px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="width:50px;height:1px;background:linear-gradient(90deg,transparent,${accent}55);"></td>
                <td style="padding:0 10px;color:${accent}88;font-size:8px;">&#9670;</td>
                <td style="width:50px;height:1px;background:linear-gradient(90deg,${accent}55,transparent);"></td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
    </td>
  </tr>

  <!-- ── Footer ── -->
  <tr>
    <td style="padding:28px 32px 32px;text-align:center;">
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:13px;color:${isDark ? "#777" : "#b0a090"};margin:0;">
        With anticipation &nbsp;&#10022;&nbsp; <strong style="color:${isDark ? "#999" : "#8c7868"};font-weight:600;">VibeInvite</strong>
      </p>
      <p style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${isDark ? "#555" : "#c0b0a0"};margin:6px 0 0;line-height:1.6;">
        Premium Digital Invitations &mdash; Crafted for moments that matter.
      </p>
    </td>
  </tr>

</table>
</body>
</html>`;
}

export async function sendInvitationEmail({
  to,
  guestName,
  eventTitle,
  eventDate,
  eventLocation,
  inviteUrl,
  hostName,
  theme,
}: {
  to: string;
  guestName: string;
  eventTitle: string;
  eventDate: string;
  eventLocation?: string;
  inviteUrl: string;
  hostName?: string;
  theme?: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const html = invitationEmailHtml({
    guestName,
    eventTitle,
    eventDate,
    eventLocation,
    inviteUrl,
    hostName,
    theme,
  });

  const { data, error } = await resend.emails.send({
    from: FROM_ADDRESS,
    to,
    subject: hostName
      ? `${hostName} requests the pleasure of your company — ${eventTitle}`
      : `The honour of your presence is requested — ${eventTitle}`,
    html,
  });

  if (error) {
    console.error("[email] Resend error:", JSON.stringify(error));
    // Check for common domain verification issues
    const msg =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message: string }).message
        : "Unknown email error";
    if (msg.includes("domain") || msg.includes("verified")) {
      throw new Error(
        `Email domain not verified. Verify your domain in Resend: https://resend.com/domains (${msg})`,
      );
    }
    if (msg.includes("rate_limit")) {
      throw new Error(
        `Sending too fast — please wait a moment between emails. (${msg})`,
      );
    }
    throw new Error(msg);
  }
  return data;
}
