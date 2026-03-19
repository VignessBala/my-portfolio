# Bala Vigness Portfolio

Custom Vite + React portfolio rebuilt around Bala Vigness' front-end and React Native profile.

## Run locally

```bash
npm install
npm run dev
```

The portfolio UI works with `vite`. The contact form uses a Vercel serverless function at `/api/contact`, so for full local form testing use `vercel dev`.

## Contact form setup with Firebase Firestore

1. Create a Firebase project.
2. Enable `Cloud Firestore` in production mode.
3. In `Project settings -> Service accounts`, generate a new private key JSON.
4. Copy these values into your local `.env` or your Vercel env settings:

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`
- `FIREBASE_COLLECTION` (optional, defaults to `contact_submissions`)

The Vercel backend validates the form and writes each submission to Firestore using the Firebase Admin SDK.

## Deploy on Vercel

1. Import the repo into Vercel.
2. Framework preset: `Vite`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add the Firebase env vars above.
6. Redeploy after saving the env vars.

Responses will appear in your Firestore collection.

## Admin dashboard

The portfolio also supports a protected `/admin` route that lets you sign in and view contact form submissions.

Add these additional env vars locally and in Vercel:

- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

The admin APIs use an `HttpOnly` signed session cookie, so the Firestore submissions endpoint is protected server-side.

## Export contact submissions

Use the same Firebase env vars from your `.env` to export the `contact_submissions` collection locally:

```bash
npm run export:contacts
```

The script writes timestamped files to `exports/`:

- `contact-submissions-*.json`
- `contact-submissions-*.csv`
