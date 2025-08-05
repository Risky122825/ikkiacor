function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
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

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const action = e.parameter.action;
  const data = JSON.parse(e.postData.contents);

  if (action === "create") {
    // CREATE
    if (!data.ID || !data.NAMA || !data.USERNAME || !data.LEVEL) {
      return ContentService.createTextOutput("Semua field wajib diisi.").setMimeType(ContentService.MimeType.TEXT);
    }

    sheet.appendRow([data.ID, data.NAMA, data.USERNAME, data.LEVEL]);
    return ContentService.createTextOutput("Data berhasil ditambahkan.").setMimeType(ContentService.MimeType.TEXT);

  } else if (action === "update") {
    // UPDATE
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

    if (updated) {
      return ContentService.createTextOutput("Data berhasil diperbarui.").setMimeType(ContentService.MimeType.TEXT);
    } else {
      return ContentService.createTextOutput("Data dengan ID tersebut tidak ditemukan.").setMimeType(ContentService.MimeType.TEXT);
    }

  } else if (action === "delete") {
    // DELETE
    const values = sheet.getDataRange().getValues();
    let deleted = false;

    for (let i = 1; i < values.length; i++) {
      if (values[i][0] == data.ID) {
        sheet.deleteRow(i + 1);
        deleted = true;
        break;
      }
    }

    if (deleted) {
      return ContentService.createTextOutput("Data berhasil dihapus.").setMimeType(ContentService.MimeType.TEXT);
    } else {
      return ContentService.createTextOutput("Data dengan ID tersebut tidak ditemukan.").setMimeType(ContentService.MimeType.TEXT);
    }
  } else {
    return ContentService.createTextOutput("Aksi tidak dikenali. Gunakan action=create/update/delete.").setMimeType(ContentService.MimeType.TEXT);
  }
}
