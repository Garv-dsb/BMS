import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  ],
  server: {
    proxy: {
      // Proxy requests starting with '/api' to a target backend server
      "/api": {
        target: "https://book-management-delta-five.vercel.app",
        changeOrigin: true, // needed for most virtual hosted sites
        rewrite: (path) => path.replace(/^\/api/, ""), // removes the '/api' prefix when forwarding
      },
    },
  },
});
