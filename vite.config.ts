import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig({
  // 👇 AÑADE ESTA LÍNEA AQUÍ
  base: '/Web_SportPyramid/', 
  // 👆 ASEGÚRATE DE USAR EL NOMBRE EXACTO DEL REPOSITORIO
  
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  // Nota: Veo que outDir apunta a 'dist/public'.
  // Si renombraste 'dist' a 'docs', tu comando de compilación debe generar
  // la carpeta 'docs/public'
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"), 
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});