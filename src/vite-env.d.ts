/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL for the API. Empty string -> relative `/api` (dev proxy). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
