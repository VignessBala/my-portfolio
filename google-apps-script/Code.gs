function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheet_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Responses");

  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Responses");
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Timestamp",
      "Name",
      "Email",
      "Subject",
      "Message",
      "Source",
    ]);
  }

  return sheet;
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || "{}");
    var secret = "CHANGE_ME_SECRET";

    if (body.secret !== secret) {
      return jsonResponse({
        ok: false,
        error: "Unauthorized request.",
      });
    }

    if (!body.name || !body.email || !body.subject || !body.message) {
      return jsonResponse({
        ok: false,
        error: "Missing required fields.",
      });
    }

    var sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      body.name,
      body.email,
      body.subject,
      body.message,
      body.source || "website",
    ]);

    return jsonResponse({
      ok: true,
      message: "Saved to Google Sheets.",
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: error && error.message ? error.message : "Unknown Apps Script error.",
    });
  }
}
