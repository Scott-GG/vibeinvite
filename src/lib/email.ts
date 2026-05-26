import { Resend } from "resend";

const FROM_ADDRESS =
  process.env.RESEND_FROM_ADDRESS ?? "VibeInvite <onboarding@resend.dev>";

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
  const isDark = theme === "modern";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;font-family:Georgia,'Times New Roman',serif;background-color:${isDark ? "#1a1a1a" : "#f7f3ed"};background-image:url('data:image/svg+xml,%3Csvg width=\\"20\\" height=\\"20\\" xmlns=\\"http://www.w3.org/2000/svg\\"%3E%3Ccircle cx=\\"10\\" cy=\\"10\\" r=\\"0.6\\" fill=\\"%23${isDark ? "444" : "d4c5b2"}22\\"/%3E%3C/svg%3E');">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;">
    <tr>
      <td style="padding:48px 24px 32px;text-align:center;">
        <!-- Envelope icon -->
        <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
          <tr>
            <td style="width:56px;height:56px;border-radius:16px;background:${isDark ? "linear-gradient(135deg, #c9a96e, #8b6914)" : "linear-gradient(135deg, #8b6914, #5a3e0a)"};text-align:center;box-shadow:0 8px 24px rgba(139,105,20,0.25);">
              <span style="font-size:24px;line-height:56px;">&#9993;</span>
            </td>
          </tr>
        </table>

        <!-- Host line -->
        <p style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:${isDark ? "#999" : "#a09080"};margin:0 0 24px;">
          ${hostName ? `${hostName} invites you to` : "You are cordially invited to"}
        </p>

        <!-- Title -->
        <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:32px;color:${isDark ? "#f0e8d8" : "#3a2a1a"};margin:0 0 8px;font-weight:normal;line-height:1.3;">
          ${eventTitle}
        </h1>

        <!-- Date & Location -->
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:${isDark ? "#b0a090" : "#8c7868"};margin:0 0 4px;">
          ${eventDate}
        </p>
        ${eventLocation ? `<p style="font-family:Georgia,'Times New Roman',serif;font-size:14px;color:${isDark ? "#888" : "#b0a090"};margin:0 0 0;">${eventLocation}</p>` : ""}

        <!-- Gold divider -->
        <table cellpadding="0" cellspacing="0" style="margin:32px auto;width:80px;">
          <tr>
            <td style="height:1px;background:${isDark ? "linear-gradient(90deg, transparent, #c9a96e, transparent)" : "linear-gradient(90deg, transparent, #8b6914, transparent)"};"></td>
          </tr>
          <tr>
            <td style="text-align:center;padding:6px 0;">
              <span style="color:${isDark ? "#c9a96e" : "#8b6914"};font-size:8px;">&#9670;</span>
            </td>
          </tr>
        </table>

        <!-- Greeting -->
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:17px;color:${isDark ? "#ccc" : "#5c4c3c"};margin:0 0 20px;line-height:1.7;">
          Dear ${guestName},
        </p>
        <p style="font-family:Georgia,'Times New Roman',serif;font-size:15px;color:${isDark ? "#aaa" : "#6c5c4c"};margin:0 0 36px;line-height:1.8;">
          ${hostName ? `${hostName} has the pleasure of inviting you to ${eventTitle}.` : `You are warmly invited to ${eventTitle}.`} Please open your personalized invitation to view the details and kindly respond at your earliest convenience.
        </p>

        <!-- CTA Button -->
        <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
          <tr>
            <td style="border-radius:10px;background:${isDark ? "linear-gradient(135deg, #c9a96e, #a6843c)" : "linear-gradient(135deg, #8b6914, #6b4f0a)"};box-shadow:0 4px 14px rgba(139,105,20,0.35);">
              <a href="${inviteUrl}" style="display:inline-block;padding:16px 48px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:600;color:${isDark ? "#1a1a1a" : "#ffffff"};text-decoration:none;letter-spacing:0.02em;white-space:nowrap;">
                Open Your Invitation &rarr;
              </a>
            </td>
          </tr>
        </table>

        <!-- Fallback link -->
        <p style="font-family:Arial,sans-serif;font-size:12px;color:${isDark ? "#666" : "#b0a090"};margin:28px 0 0;line-height:1.6;">
          If the button doesn&rsquo;t work, copy this link into your browser:<br>
          <a href="${inviteUrl}" style="color:${isDark ? "#c9a96e" : "#8b6914"};text-decoration:underline;">${inviteUrl}</a>
        </p>

        <!-- Signature -->
        <table cellpadding="0" cellspacing="0" style="margin:40px auto 0;text-align:center;">
          <tr>
            <td style="padding-top:24px;border-top:1px solid ${isDark ? "#333" : "#e0d5c5"};">
              <p style="font-family:Georgia,'Times New Roman',serif;font-size:13px;color:${isDark ? "#777" : "#b0a090"};margin:0;">
                With love &amp; anticipation
              </p>
              <p style="font-family:Georgia,'Times New Roman',serif;font-size:12px;color:${isDark ? "#555" : "#c0b0a0"};margin:8px 0 0;">
                Sent via <strong style="color:${isDark ? "#999" : "#8c7868"};">VibeInvite</strong> &mdash; Premium Digital Invitations
              </p>
            </td>
          </tr>
        </table>
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
      ? `An Invitation from ${hostName} Awaits — ${eventTitle}`
      : `You are Invited to ${eventTitle}`,
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
    throw new Error(msg);
  }
  return data;
}
