/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GOOGLE_CLIENT_ID?: string;
  readonly VITE_BYPASS_AUTH?: string;
  readonly VITE_ADMIN_EMAILS?: string; // comma-separated allowlist
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
