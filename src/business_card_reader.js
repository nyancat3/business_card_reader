function myFunction() {
  const geminiApiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const businessCardGoogleDriveFileId = PropertiesService.getScriptProperties().getProperty('BUSINESS_CARD_GOOGLE_DRIVE_FILE_ID');
  const businessCardFile = DriveApp.getFileById(businessCardGoogleDriveFileId);
  const base64Data = Utilities.base64Encode(businessCardFile.getBlob().getBytes());
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
  const payload = {
    'contents': [
      {
        'parts': [
          {
            'text': 'Please analyze the attached image of a business card and extract all relevant information. Output the extracted details in a structured JSON format, including fields such as name, company, department, address, phone number, and email.'
          },
          {
            'inlineData': {
              'mimeType': businessCardFile.getMimeType(),
              'data': base64Data
            }
          }
        ]
      }
    ]
  };
  const options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  const res = UrlFetchApp.fetch(url, options);
  const resJson = JSON.parse(res.getContentText());

  if (resJson && resJson.candidates && resJson.candidates.length > 0) {
    console.log(resJson.candidates[0].content.parts[0].text);
  } else {
    console.log('No candidates found in the response.');
  }
}
