import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Disable Sonner toasts globally by aliasing to a local no-op module
      "sonner": path.resolve(__dirname, "./src/lib/sonner-noop.ts"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200, // relax a bit; main reduction comes from code-splitting
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-router')) return 'react-vendor';
            if (id.includes('@tanstack/react-query')) return 'react-query';
            if (id.includes('@supabase/supabase-js')) return 'supabase';
            if (id.includes('@radix-ui')) return 'radix';
            if (id.includes('lucide-react')) return 'icons';
          }
        }
      }
    }
  }
}));
