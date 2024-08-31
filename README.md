# business_card_reader

## GAS > Project Settings > Script Properties

- GEMINI_API_KEY
- BUSINESS_CARD_GOOGLE_DRIVE_FILE_ID

## Clasp

`clasp login` -> `~/.clasprc.json` will be generated

`clasp clone [GAS Script ID]`

Settings > Secrets and Variables > Actions > Repository secrets

- ACCESS_TOKEN
- CLIENT_ID
- CLIENT_SECRET
- ID_TOKEN
- REFRESH_TOKEN

Settings > Secrets and Variables > Actions > Repository variables

- GAS_SCRIPT_ID

Move `appscript.json` to `src` folder

Edit `.clasp.json`

```json
{
  "scriptId": "[GAS Script ID]",
  "rootDir": "./src"
}
```

Copy `expiry_date` from `~/.clasprc.json` and paste it to `.github/workflows/deploy.yaml`
