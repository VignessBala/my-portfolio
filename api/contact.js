const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const sanitize = (value, maxLength) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export async function POST(request) {
  let payload;

  try {
    payload = await request.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const name = sanitize(payload?.name, 80);
  const email = sanitize(payload?.email, 160);
  const subject = sanitize(payload?.subject, 140);
  const message = sanitize(payload?.message, 4000);
  const company = sanitize(payload?.company, 120);

  if (company) {
    return json({ ok: true });
  }

  if (!name || !email || !subject || !message) {
    return json({ error: "Please fill in every required field." }, 400);
  }

  if (!isValidEmail(email)) {
    return json({ error: "Please enter a valid email address." }, 400);
  }

  if (
    !process.env.RESEND_API_KEY ||
    !process.env.CONTACT_TO_EMAIL ||
    !process.env.CONTACT_FROM_EMAIL
  ) {
    return json(
      {
        error:
          "Mail delivery is not configured yet. Add the Vercel env vars before using the form.",
      },
      500,
    );
  }

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL],
      replyTo: email,
      subject: `[Portfolio] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.7; color: #1d2630;">
          <h2 style="margin-bottom: 16px;">New portfolio inquiry</h2>
          <p><strong>Name:</strong> ${escapeHtml(name)}</p>
          <p><strong>Email:</strong> ${escapeHtml(email)}</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <p><strong>Message:</strong></p>
          <p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>
        </div>
      `,
      text: `New portfolio inquiry

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`,
    }),
  });

  if (!resendResponse.ok) {
    const errorPayload = await resendResponse.json().catch(() => ({}));

    return json(
      {
        error:
          errorPayload?.message ||
          "The mail provider rejected the request. Check the configured sender and API key.",
      },
      502,
    );
  }

  return json({ ok: true, message: "Message delivered successfully." });
}

export async function GET() {
  return json({ error: "Use POST to submit the contact form." }, 405);
}
