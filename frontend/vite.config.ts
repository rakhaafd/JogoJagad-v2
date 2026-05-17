import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  if (!env.VITE_URL_API) {
    throw new Error("VITE_URL_API is required in frontend/.env");
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        "/api": {
          target: env.VITE_URL_API,
          changeOrigin: true,
        },
      },
    },
  };
});
