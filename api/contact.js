import { FieldValue } from "firebase-admin/firestore";
import { getContactCollection, getDb } from "./_firebaseAdmin.js";

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
  const receivedAt = new Date().toISOString();

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

  try {
    const db = getDb();
    const forwardedFor = request.headers.get("x-forwarded-for") || "";
    const ipAddress = sanitize(forwardedFor.split(",")[0], 120);
    const userAgent = sanitize(request.headers.get("user-agent"), 300);

    await db.collection(getContactCollection()).add({
      name,
      email,
      subject,
      message,
      source: "portfolio-contact-form",
      createdAt: FieldValue.serverTimestamp(),
      receivedAt,
      ipAddress,
      userAgent,
    });

    return json({
      ok: true,
      message: "Message stored successfully.",
    });
  } catch (error) {
    return json(
      {
        error:
          error?.message ||
          "Could not store the message in Firestore. Check the Firebase Admin credentials and collection settings.",
      },
      502,
    );
  }
}

export async function GET() {
  return json({ error: "Use POST to submit the contact form." }, 405);
}
