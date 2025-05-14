import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    historyApiFallback: true,
    middleware: [
      (req, res, next) => {
        if (req.url.startsWith("/admin")) {
          req.url = "/index.html";
        }
        next();
      },
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});
