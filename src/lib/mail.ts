interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

const FROM =
  process.env.EMAIL_FROM || "MSSN UI Library <onboarding@resend.dev>";

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.warn(
      `[mail] RESEND_API_KEY not set. Email "${subject}" to ${to} was NOT sent.`
    );
    return { sent: false };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to, subject, html }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(`[mail] Resend error (${res.status}): ${body}`);
    return { sent: false };
  }

  return { sent: true };
}

export function passwordResetEmail(name: string, resetUrl: string) {
  return {
    subject: "Reset your password — MSSN UI Library",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #065f46;">Assalamu alaikum, ${name}</h2>
        <p>We received a request to reset your MSSN UI Library password.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}"
             style="background-color: #047857; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">
            Reset your password
          </a>
        </p>
        <p>This link expires in <strong>1 hour</strong> and can only be used once.</p>
        <p style="color: #6b7280; font-size: 13px;">
          If you didn't request this, you can safely ignore this email — your
          password will remain unchanged.
        </p>
      </div>
    `,
  };
}
