import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const repoRoot = path.resolve(currentDir, "..");
const dotEnvPath = path.join(repoRoot, ".env");

const parseDotEnv = (source) =>
  source.split(/\r?\n/).reduce((env, line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return env;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      return env;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    let value = trimmedLine.slice(separatorIndex + 1).trim();

    if (
      (value.startsWith("\"") && value.endsWith("\"")) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
    return env;
  }, {});

try {
  const dotEnvContents = await readFile(dotEnvPath, "utf8");
  const dotEnvValues = parseDotEnv(dotEnvContents);

  Object.entries(dotEnvValues).forEach(([key, value]) => {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  });
} catch (error) {
  if (error?.code !== "ENOENT") {
    throw error;
  }
}

const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_CLIENT_EMAIL",
  "FIREBASE_PRIVATE_KEY",
];

const missingEnvVars = requiredEnvVars.filter(
  (key) => !process.env[key]?.trim(),
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing Firebase environment variables: ${missingEnvVars.join(", ")}.`,
  );
}

const collectionName =
  process.env.FIREBASE_COLLECTION?.trim() || "contact_submissions";

const app =
  getApps()[0] ||
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });

const db = getFirestore(app);

const normalizeValue = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value?.toDate === "function") {
    return value.toDate().toISOString();
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value);
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const escapeCsv = (value) => {
  const normalized = normalizeValue(value);
  return `"${normalized.replace(/"/g, "\"\"")}"`;
};

const snapshot = await db.collection(collectionName).get();

const rows = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...doc.data(),
}));

const allColumns = Array.from(
  rows.reduce((columns, row) => {
    Object.keys(row).forEach((key) => columns.add(key));
    return columns;
  }, new Set(["id"])),
);

const csv = [
  allColumns.join(","),
  ...rows.map((row) => allColumns.map((column) => escapeCsv(row[column])).join(",")),
].join("\n");

const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
const exportDir = path.join(repoRoot, "exports");

await mkdir(exportDir, { recursive: true });

const jsonPath = path.join(
  exportDir,
  `contact-submissions-${timestamp}.json`,
);
const csvPath = path.join(
  exportDir,
  `contact-submissions-${timestamp}.csv`,
);

await writeFile(jsonPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
await writeFile(csvPath, `${csv}\n`, "utf8");

console.log(`Exported ${rows.length} submission(s) from "${collectionName}".`);
console.log(`JSON: ${jsonPath}`);
console.log(`CSV: ${csvPath}`);
