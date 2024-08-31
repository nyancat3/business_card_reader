function appendDataToSheet(json) {
  const googleSheetsFileId = PropertiesService.getScriptProperties().getProperty('GOOGLE_SHEETS_FILE_ID');
  const sheet = SpreadsheetApp.openById(googleSheetsFileId).getActiveSheet();

  // Convert JSON data to a 2D array with headers and values
  const headers = Object.keys(json);
  const values = Object.values(json);

  const existingData = sheet.getDataRange().getValues();
  if (existingData.length <= 1) {
    // If the sheet is empty or only has headers, append headers and values
    const rows = [headers, values];
    sheet.getRange(1, 1, rows.length, headers.length).setValues(rows);
  } else {
    // If the sheet is not empty, append values to the corresponding keys
    const existingHeaders = existingData[0];
    const newRow = new Array(existingHeaders.length).fill('');
    headers.forEach((header, index) => {
      const colIndex = existingHeaders.indexOf(header);
      if (colIndex !== -1) {
        newRow[colIndex] = values[index];
      }
    });
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, newRow.length).setValues([newRow]);
  }
}
