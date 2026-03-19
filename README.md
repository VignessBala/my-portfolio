# Bala Vigness Portfolio

Custom Vite + React portfolio rebuilt around Bala Vigness' front-end and React Native profile.

## Run locally

```bash
npm install
npm run dev
```

The portfolio UI works with `vite`. The contact form uses a Vercel serverless function at `/api/contact`, so for full local form testing use `vercel dev`.

## Contact form setup with Google Sheets

1. Create a Google Sheet to collect responses.
2. Open `Extensions -> Apps Script` inside that sheet.
3. Paste the code from `google-apps-script/Code.gs`.
4. Replace `CHANGE_ME_SECRET` in the script with your own long random secret.
5. Deploy the script as a web app:
   - `Execute as`: `Me`
   - `Who has access`: `Anyone`
6. Copy the deployed web app URL.
7. Create Vercel environment variables from `.env.example`:

- `GOOGLE_SCRIPT_URL`
- `GOOGLE_SCRIPT_SECRET`

The Vercel backend forwards validated form submissions to your Apps Script, and the Apps Script appends them to your Google Sheet.

## Deploy on Vercel

1. Import the repo into Vercel.
2. Framework preset: `Vite`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add the Google Sheets env vars above.
6. Redeploy after saving the env vars.

Responses will appear in your Google Sheet and can be exported as Excel anytime.
