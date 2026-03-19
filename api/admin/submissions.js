import { getContactCollection, getDb } from "../_firebaseAdmin.js";
import { requireAdminSession } from "../_adminAuth.js";

const json = (payload, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });

const serializeValue = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => [
        key,
        serializeValue(nestedValue),
      ]),
    );
  }

  return value;
};

const getSortTimestamp = (submission) => {
  const createdAt = submission.createdAt;

  if (typeof createdAt === "string") {
    return Date.parse(createdAt) || 0;
  }

  const receivedAt = submission.receivedAt;

  if (typeof receivedAt === "string") {
    return Date.parse(receivedAt) || 0;
  }

  return 0;
};

export async function GET(request) {
  const authResult = requireAdminSession(request);

  if (!authResult.ok) {
    return authResult.response;
  }

  try {
    const snapshot = await getDb().collection(getContactCollection()).get();
    const submissions = snapshot.docs
      .map((doc) => ({
        id: doc.id,
        ...serializeValue(doc.data()),
      }))
      .sort((left, right) => getSortTimestamp(right) - getSortTimestamp(left));

    return json({
      ok: true,
      submissions,
    });
  } catch (error) {
    return json(
      {
        error:
          error?.message ||
          "Could not load contact submissions from Firestore.",
      },
      502,
    );
  }
}
