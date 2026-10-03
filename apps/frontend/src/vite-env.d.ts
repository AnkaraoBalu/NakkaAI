/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Backend address without /api, e.g. https://api.example.com. Defaults to http://localhost:8080.
  readonly VITE_API_URL?: string;
  // Clerk publishable key (pk_...). Enables Google/GitHub sign-in when set.
  readonly VITE_CLERK_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
