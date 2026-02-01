import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "xlsx-js-style": "xlsx-js-style/dist/xlsx.bundle.js",
      },
    },

    build: {
      chunkSizeWarningLimit: 1000,
      outDir: "dist",
      sourcemap: false,
    },

    server: {
      port: 5173,
      open: true,
      proxy: {
        "/api": {
          target: env.VITE_API_URL,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    optimizeDeps: {
      include: ["xlsx-js-style"],
    },
  };
});
