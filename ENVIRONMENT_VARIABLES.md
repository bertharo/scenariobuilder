# Environment Variables for Vercel Deployment

## Required Environment Variables

Set these in your Vercel project settings:

### Google Apps Script Configuration
```bash
VITE_GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbwmvxvqF84_ekrQD6rbQsMiSYrPSn_tRUBT9x-YcjdmEA07br6ohfKcGL4iLQKgMBdx/exec
VITE_API_KEY=sk_lrp_prototype_2024_secure_key_12345
VITE_DEFAULT_SPREADSHEET_ID=your-actual-spreadsheet-id-here
VITE_DEFAULT_SHEET_NAME=Scenarios
```

### App Configuration
```bash
NODE_ENV=production
```

## How to Set in Vercel

### Method 1: Vercel Dashboard
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with the values above

### Method 2: Vercel CLI
```bash
vercel env add VITE_GOOGLE_APPS_SCRIPT_URL
vercel env add VITE_API_KEY
vercel env add VITE_DEFAULT_SPREADSHEET_ID
vercel env add VITE_DEFAULT_SHEET_NAME
```

## Important Notes

- **VITE_ prefix**: Required for Vite to expose these variables to the client-side code
- **Spreadsheet ID**: Get this from your Google Sheets URL
- **API Key**: Your Apps Script API key for authentication
- **Security**: These variables are exposed to the client, so don't put sensitive data here

## Getting Your Spreadsheet ID

1. Open your Google Spreadsheet
2. Look at the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
3. Copy the `SPREADSHEET_ID` part
4. Use it as your `VITE_DEFAULT_SPREADSHEET_ID` value
