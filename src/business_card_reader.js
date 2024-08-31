function main() {
  // Please set a Google Drive file ID to BUSINESS_CARD_GOOGLE_DRIVE_FILE_ID in the Script Properties.
  // https://drive.google.com/file/d/[Google Drive file ID]/view
  const businessCardGoogleDriveFileId = PropertiesService.getScriptProperties().getProperty('BUSINESS_CARD_GOOGLE_DRIVE_FILE_ID');

  const businessCardFile = DriveApp.getFileById(businessCardGoogleDriveFileId);
  json = extractTextFromImage(businessCardFile);
  if (!json) {
    console.log('No JSON data extracted from the image.');
    return;
  }

  appendDataToSheet(json);
}
