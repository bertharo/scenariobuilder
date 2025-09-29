/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_APPS_SCRIPT_URL: string
  readonly VITE_API_KEY: string
  readonly VITE_DEFAULT_SPREADSHEET_ID: string
  readonly VITE_DEFAULT_SHEET_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
