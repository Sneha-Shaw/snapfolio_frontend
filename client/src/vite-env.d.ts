/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  /** Origin serving share links (/s/<username>); defaults to the API's origin. */
  readonly VITE_SHARE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
