import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// In development, the VS Code extension can use http://localhost:3000 as its
// base URL: its API paths are forwarded to the backend, and /auth is our page.
const backend = process.env.BACKEND_URL ?? "http://localhost:8080";
const extensionApi = {
  "/v1": backend,
  "/account": backend,
  "/auth/revoke": backend,
};

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost",
    port: 3000,
    strictPort: true,
    open: true,
    proxy: extensionApi,
  },
  preview: {
    host: "localhost",
    port: 3000,
    strictPort: true,
    open: true,
    proxy: extensionApi,
  },
  build: {
    rollupOptions: { input: { main: "index.html", code: "code.html" } },
  },
});
