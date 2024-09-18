function extractTextFromImageWithOpenAi(imageFile) {
  const base64Data = Utilities.base64Encode(imageFile.getBlob().getBytes());
  const chatGptApiKey = PropertiesService.getScriptProperties().getProperty("CHAT_GPT_API_KEY");
  const chatGptApiUrl = 'https://api.openai.com/v1/chat/completions';
  const prompt = 'Please analyze the attached image of a business card / business cards and extract all relevant information.\n' +
    'Output the extracted details in a structured JSON format, including fields such as ' +
    'name, company, department, postcode, address, phone, and email.\n' +
    'The image may contain multiple business cards, so please extract the details for each card separately.\n' +
    'The example below shows the expected JSON output format. Do not include "\\n" or "+" in the JSON output.\n' +
    '```json\n' +
    '{\n' +
    '  "business_cards": [\n' +
    '    {\n' +
    '      "name": "山田 太郎",\n' +
    '      "company": "Google",\n' +
    '      "department": "Engineering",\n' +
    '      "postcode": "〒513-1234",\n' +
    '      "address": "三重県鈴鹿市一ノ瀬町1111-2ファーストビル1F 1A",\n' +
    '      "phone": "650-253-0000",\n' +
    '      "email": "example@gmail.com"\n' +
    '    },\n' +
    '    {\n' +
    '      "name": "高橋 花子",\n' +
    '      "company": "Apple",\n' +
    '      "department": "Design",\n' +
    '      "postcode": "〒111-1111",\n' +
    '      "address": "東京都文京区11-11-11",\n' +
    '      "phone": "408-996-1010",\n' +
    '      "email": "example@gmail.com"\n' +
    '    }\n' +
    '  ]\n' +
    '}\n' +
    '```\n';
  const requestBody = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt
          },
          {
            type: "image_url",
            image_url: {
              url: "data:image/jpeg;base64," + base64Data
            }
          }
        ]
      }
    ],
    max_tokens: 300,
    response_format: { "type": "json_object" }
  };
  const request = {
    method: "POST",
    muteHttpExceptions: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + chatGptApiKey,
    },
    payload: JSON.stringify(requestBody),
  };
  const response = requestApi(chatGptApiUrl, request);
  if (!response) {
    console.log('No JSON data extracted from the image.');
    return;
  }
  console.log('Raw text:', response);

  const textJson = JSON.parse(response);
  console.log(textJson);
  return textJson;
}

function requestApi(chatGptApiUrl, request) {
  const response = JSON.parse(UrlFetchApp.fetch(chatGptApiUrl, request).getContentText());
  if (response.choices) {
    return response.choices[0].message.content;
  } else {
    console.log(response);
    return null;
  }
}
