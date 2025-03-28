/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string; // Add your environment variable names here

}
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }