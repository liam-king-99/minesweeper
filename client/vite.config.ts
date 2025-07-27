import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  build: {
    outDir: 'build'
  },
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: false }),
    react(),
  ],
})