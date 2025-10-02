import { defineConfig } from "vite";

export default defineConfig({
  server: {
    https: {
      key: "./.cert/key.pem",
      cert: "./.cert/cert.pem",
    },
    host: "0.0.0.0",
    port: 5173,
  },
});