// Custom global type shims for the frontend tests and runtime
interface ImportMetaEnv {
  VITE_GOOGLE_CLIENT_ID?: string;
  VITE_API_URL?: string;
  [key: string]: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface Global {
    importMetaEnv?: ImportMetaEnv;
  }
}

declare var importMeta: { env: ImportMetaEnv };

export {};
