function extractTextFromImage(imageFile) {
  const base64Data = Utilities.base64Encode(imageFile.getBlob().getBytes());
  const geminiApiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
  const payload = {
    'contents': [
      {
        'parts': [
          {
            'text': 'Please analyze the attached image of a business card and extract all relevant information. ' +
              'Output the extracted details in a structured JSON format, including fields such as ' +
              'name, company, department, address, phone, and email.'
          },
          {
            'inlineData': {
              'mimeType': imageFile.getMimeType(),
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
  if (resJson?.candidates?.length === 0) {
    console.log('No candidates found in the response.');
    return;
  }

  const text = resJson.candidates[0].content.parts[0].text;
  const textJson = JSON.parse(text.replace(/```json|```/g, '').trim());
  console.log(textJson);
  return textJson;
}
