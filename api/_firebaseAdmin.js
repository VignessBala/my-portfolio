import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

const getMissingEnvVars = () =>
  requiredEnvVars.filter((key) => !process.env[key]?.trim());

const getFirebaseApp = () => {
  const missingEnvVars = getMissingEnvVars();

  if (missingEnvVars.length > 0) {
    throw new Error(
      `Missing Firebase environment variables: ${missingEnvVars.join(", ")}.`,
    );
  }

  if (getApps().length > 0) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
};

export const getDb = () => getFirestore(getFirebaseApp());

export const getContactCollection = () =>
  process.env.FIREBASE_COLLECTION?.trim() || "contact_submissions";
