import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/mmsp-land-hl/",
  server: {
    open: true,
  },
  build: {
    outDir: "dist",
  },
});
