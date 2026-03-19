# Bala Vigness Portfolio

Custom Vite + React portfolio rebuilt around Bala Vigness' front-end and React Native profile.

## Run locally

```bash
npm install
npm run dev
```

The portfolio UI works with `vite`. The `/api/contact` backend is a Vercel serverless function, so for full local form testing use `vercel dev`.

## Contact form setup

Create Vercel environment variables from `.env.example`:

- `RESEND_API_KEY`
- `CONTACT_TO_EMAIL`
- `CONTACT_FROM_EMAIL`

`CONTACT_FROM_EMAIL` should be a sender allowed by your Resend account. For real production usage, use a verified domain.

## Deploy on Vercel

1. Import the repo into Vercel.
2. Framework preset: `Vite`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add the mail env vars above.

The frontend and `/api/contact` function will deploy together on the free tier.
