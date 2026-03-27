import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep third-party code in one stable vendor chunk.
          // The previous fine-grained vendor split created circular chunk imports
          // in production builds (for example react-vendor <-> mui-vendor),
          // which caused deployment-only initialization errors.
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
})
