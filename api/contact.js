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

  if (!process.env.GOOGLE_SCRIPT_URL || !process.env.GOOGLE_SCRIPT_SECRET) {
    return json(
      {
        error:
          "Google Sheets form storage is not configured yet. Add the required Vercel env vars first.",
      },
      500,
    );
  }

  try {
    const upstreamResponse = await fetch(process.env.GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret: process.env.GOOGLE_SCRIPT_SECRET,
        name,
        email,
        subject,
        message,
        source: "portfolio-contact-form",
      }),
    });

    const upstreamText = await upstreamResponse.text();
    let upstreamJson = {};

    try {
      upstreamJson = upstreamText ? JSON.parse(upstreamText) : {};
    } catch {
      upstreamJson = {};
    }

    if (!upstreamResponse.ok || !upstreamJson.ok) {
      return json(
        {
          error:
            upstreamJson.error ||
            "Google Sheets storage rejected the submission.",
        },
        502,
      );
    }

    return json({
      ok: true,
      message: "Message stored successfully.",
    });
  } catch {
    return json(
      {
        error:
          "Could not reach the Google Sheets backend. Check the Apps Script deployment URL and access settings.",
      },
      502,
    );
  }
}

export async function GET() {
  return json({ error: "Use POST to submit the contact form." }, 405);
}
