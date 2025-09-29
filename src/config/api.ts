export const API_CONFIG = {
  GOOGLE_APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbwmvxvqF84_ekrQD6rbQsMiSYrPSn_tRUBT9x-YcjdmEA07br6ohfKcGL4iLQKgMBdx/exec',
  API_KEY: 'sk_lrp_prototype_2024_secure_key_12345',
  DEFAULT_SPREADSHEET_ID: '', // You'll need to provide this
  DEFAULT_SHEET_NAME: 'Scenarios'
};

export const GOOGLE_SHEETS_CONFIG = {
  spreadsheetId: API_CONFIG.DEFAULT_SPREADSHEET_ID,
  sheetName: API_CONFIG.DEFAULT_SHEET_NAME,
  apiKey: API_CONFIG.API_KEY,
  lastSync: new Date()
};
