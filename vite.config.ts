import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

import { sentryVitePlugin } from "@sentry/vite-plugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin({
      org: "my-org",
      project: "my-project",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
    })
  ].filter((p): p is any => Boolean(p)),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
      }
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-router') || id.includes('react-dom')) return 'react-vendor';
            if (id.includes('@tanstack/react-query')) return 'react-query';
            if (id.includes('@supabase/supabase-js')) return 'supabase';
            if (id.includes('@radix-ui')) return 'radix';
            if (id.includes('lucide-react')) return 'icons';
          }
        }
      }
    },
    cssCodeSplit: true,
    sourcemap: true, // Needed for Sentry
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
}));
