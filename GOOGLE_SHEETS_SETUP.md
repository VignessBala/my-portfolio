# Google Sheets Form Setup

## 1. Create the sheet

1. Open Google Sheets.
2. Create a new blank spreadsheet.
3. Name it `Portfolio Contact Responses`.

## 2. Add the Apps Script

1. Inside the sheet, open `Extensions -> Apps Script`.
2. Delete the default code in `Code.gs`.
3. Copy the full contents of `google-apps-script/Code.gs` into it.
4. Replace `CHANGE_ME_SECRET` with a long random secret string.
Example:
`bala-portfolio-2026-7vP4mL9Qx2Zr8Ns`
5. Save the script.

## 3. Deploy the script

1. Click `Deploy -> New deployment`.
2. Choose `Web app`.
3. Description: `Portfolio Form Backend`
4. Execute as: `Me`
5. Who has access: `Anyone`
6. Click `Deploy`.
7. Authorize the script if Google prompts you.
8. Copy the web app URL.

## 4. Add Vercel env vars

In your Vercel project add:

- `GOOGLE_SCRIPT_URL` = your copied web app URL
- `GOOGLE_SCRIPT_SECRET` = the same secret you placed in `Code.gs`

Then redeploy the project.

## 5. Test

1. Open the live portfolio.
2. Submit the contact form.
3. Open the Google Sheet.
4. Confirm a new row appears in the `Responses` sheet.

## 6. Export to Excel

In Google Sheets:
`File -> Download -> Microsoft Excel (.xlsx)`
