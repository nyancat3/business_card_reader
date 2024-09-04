function extractTextFromImage(imageFile) {
  const base64Data = Utilities.base64Encode(imageFile.getBlob().getBytes());
  const geminiApiKey = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
  const payload = {
    'contents': [
      {
        'parts': [
          {
            'text': 'Please analyze the attached image of a business card / business cards and extract all relevant information.\n' +
              'Output the extracted details in a structured JSON format, including fields such as ' +
              'name, company, department, postcode, address, phone, and email.\n' +
              'The image may contain multiple business cards, so please extract the details for each card separately.\n' +
              'The example below shows the expected JSON output format. Do not include "\\n" or "+" in the JSON output.\n' +
              '```json\n' +
              '[\n' +
              '  {\n' +
              '    "name": "山田 太郎",\n' +
              '    "company": "Google",\n' +
              '    "department": "Engineering",\n' +
              '    "postcode": "〒513-1234",\n' +
              '    "address": "三重県鈴鹿市一ノ瀬町1111-2ファーストビル1F 1A",\n' +
              '    "phone": "650-253-0000",\n' +
              '    "email": "example@gmail.com"\n' +
              '  },\n' +
              '  {\n' +
              '    "name": "高橋 花子",\n' +
              '    "company": "Apple",\n' +
              '    "department": "Design",\n' +
              '    "postcode": "〒111-1111",\n' +
              '    "address": "東京都文京区11-11-11",\n' +
              '    "phone": "408-996-1010",\n' +
              '    "email": "example@gmail.com"\n' +
              '  }\n' +
              ']\n' +
              '```\n'
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

  let text = resJson.candidates[0].content.parts[0].text;
  console.log('Raw text:', text);

  // Clean the text
  text = text.replace(/\s*\+\s*/g, ''); // Remove + and surrounding spaces
  text = text.replace(/```json|```|\s*\+\s*|\\n|""/g, '').trim(); // Remove ```json, ```, \n, and ""
  console.log('Cleaned text:', text);

  const textJson = JSON.parse(text);
  console.log(textJson);
  return textJson;
}
