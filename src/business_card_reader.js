function main() {
  // Please set a Google Drive folder ID to BUSINESS_CARD_GOOGLE_DRIVE_FOLDER_ID and DONE_GOOGLE_DRIVE_FOLDER_ID in the Script Properties.
  // https://drive.google.com/drive/folders/[Google Drive folder ID]
  const businessCardGoogleDriveFolderId = PropertiesService.getScriptProperties().getProperty('BUSINESS_CARD_GOOGLE_DRIVE_FOLDER_ID');
  const doneGoogleDriveFolderId = PropertiesService.getScriptProperties().getProperty('DONE_GOOGLE_DRIVE_FOLDER_ID');

  // Get files in businessCardGoogleDriveFolderId
  const files = DriveApp.getFolderById(businessCardGoogleDriveFolderId).getFiles();
  while (files.hasNext()) {
    const businessCardFile = files.next();
    console.log('businessCardFileName:', businessCardFile.getName());
    if (!businessCardFile.getMimeType().startsWith('image/')) {
      console.log('Skipping non-image file.', businessCardFile.getMimeType());
      continue;
    }

    // Extract text from the image
    const json = extractTextFromImage(businessCardFile);
    if (!json) {
      console.log('No JSON data extracted from the image.');
      continue;
    }

    // Append the extracted data to the Google Sheets
    for (let i = 0; i < json.length; i++) {
      appendDataToSheet(json[i]);
    }

    // Move the processed file to the done folder
    businessCardFile.moveTo(DriveApp.getFolderById(doneGoogleDriveFolderId));
  }
}
