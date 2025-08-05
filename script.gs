function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");

  if (e.parameter.read === "true") {
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const result = [];

    for (let i = 1; i < data.length; i++) {
      let row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j];
      }
      result.push(row);
    }

    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } else {
    return HtmlService.createHtmlOutputFromFile("Index");
  }
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const action = e.parameter.action;
  const data = JSON.parse(e.postData.contents);

  if (action === "create") {
    if (!data.ID || !data.NAMA || !data.USERNAME || !data.LEVEL) {
      return ContentService.createTextOutput("Semua field wajib diisi.");
    }
    sheet.appendRow([data.ID, data.NAMA, data.USERNAME, data.LEVEL]);
    return ContentService.createTextOutput("Data berhasil ditambahkan.");
  }

  if (action === "update") {
    const values = sheet.getDataRange().getValues();
    let updated = false;

    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == data.ID) {
        sheet.getRange(i + 1, 2).setValue(data.NAMA);
        sheet.getRange(i + 1, 3).setValue(data.USERNAME);
        sheet.getRange(i + 1, 4).setValue(data.LEVEL);
        updated = true;
        break;
      }
    }

    return ContentService.createTextOutput(
      updated ? "Data berhasil diperbarui." : "Data tidak ditemukan."
    );
  }

  if (action === "delete") {
    const values = sheet.getDataRange().getValues();
    let deleted = false;

    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == data.ID) {
        sheet.deleteRow(i + 1);
        deleted = true;
        break;
      }
    }

    return ContentService.createTextOutput(
      deleted ? "Data berhasil dihapus." : "Data tidak ditemukan."
    );
  }

  return ContentService.createTextOutput("Aksi tidak dikenali.");
}
