import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Vart den byggda appen hamnar
  },
  resolve: {
    alias: {
      '@': '/src',  // Om du använder '@/App' i imports, detta är inte nödvändigt annars
    },
  },
});
