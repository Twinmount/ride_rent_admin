/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL_UAE: string
  readonly VITE_API_URL_INDIA: string
  readonly VITE_ASSETS_URL: string
  readonly VITE_GOOGLE_MAPS_API_KEY: string
  readonly VITE_BASE_DOMAIN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
