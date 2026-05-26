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
<body style="margin:0;padding:0;font-family:Georgia,serif;background-color:${isDark ? "#1a1a1a" : "#f5f0eb"};">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
          <!-- Header -->
          <tr>
            <td style="text-align:center;padding-bottom:32px;">
              <p style="font-size:11px;letter-spacing:0.3em;text-transform:uppercase;color:${isDark ? "#888" : "#a09080"};margin:0;">
                ${hostName ? `${hostName} invites you to` : "You are cordially invited to"}
              </p>
            </td>
          </tr>
          <!-- Card -->
          <tr>
            <td style="background:${isDark ? "#2d2d2d" : "#ffffff"};border-radius:16px;padding:48px 32px;text-align:center;">
              <h1 style="font-family:Georgia,serif;font-size:28px;color:${isDark ? "#f0f0f0" : "#2d2d2d"};margin:0 0 8px;font-weight:normal;">
                ${eventTitle}
              </h1>
              <p style="font-family:Georgia,serif;font-size:16px;color:${isDark ? "#aaa" : "#8c7868"};margin:0 0 4px;">
                ${eventDate}
              </p>
              ${eventLocation ? `<p style="font-family:Georgia,serif;font-size:14px;color:${isDark ? "#888" : "#b0a090"};margin:0 0 24px;">${eventLocation}</p>` : ""}
              <p style="font-family:Georgia,serif;font-size:16px;color:${isDark ? "#ccc" : "#5c4c3c"};margin:24px 0;">
                Dear ${guestName},
              </p>
              <p style="font-family:Georgia,serif;font-size:15px;color:${isDark ? "#aaa" : "#6c5c4c"};line-height:1.6;margin:0 0 32px;">
                Please open your personalized invitation to view the details and RSVP at your earliest convenience.
              </p>
              <a href="${inviteUrl}" style="display:inline-block;background:${isDark ? "#e0cda7" : "#8b6914"};color:${isDark ? "#1a1a1a" : "#ffffff"};text-decoration:none;padding:14px 40px;border-radius:8px;font-family:Arial,sans-serif;font-size:15px;font-weight:600;">
                Open Your Invitation
              </a>
              <p style="font-family:Arial,sans-serif;font-size:12px;color:${isDark ? "#666" : "#b0a090"};margin:32px 0 0;line-height:1.5;">
                Or copy this link into your browser:<br>
                <a href="${inviteUrl}" style="color:${isDark ? "#e0cda7" : "#8b6914"};">${inviteUrl}</a>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="text-align:center;padding-top:24px;">
              <p style="font-family:Arial,sans-serif;font-size:12px;color:${isDark ? "#555" : "#c0b0a0"};margin:0;">
                Powered by VibeInvite — Premium Digital Invitations
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
    subject: `You are invited to ${eventTitle}`,
    html,
  });

  if (error) throw new Error(error.message);
  return data;
}
