export const API_CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbz2w31-5mLnHWUwqZRSF_3CcTX2VuCtVPlxMxhlkPf2h1OvZ8cCWsBaJd5B1cFTLbB3Yw/exec',
  API_KEY: import.meta.env.VITE_API_KEY || 'sk_lrp_prototype_2024_secure_key_12345',
  DEFAULT_SPREADSHEET_ID: import.meta.env.VITE_DEFAULT_SPREADSHEET_ID || '1sZkiUIJuysCMupZEg-hDuS4dt3EGjNHeM9Gqidq8t0k',
  DEFAULT_SHEET_NAME: import.meta.env.VITE_DEFAULT_SHEET_NAME || 'LRP Simulation'
};

export const GOOGLE_SHEETS_CONFIG = {
  spreadsheetId: API_CONFIG.DEFAULT_SPREADSHEET_ID,
  sheetName: API_CONFIG.DEFAULT_SHEET_NAME,
  apiKey: API_CONFIG.API_KEY,
  lastSync: new Date()
};
