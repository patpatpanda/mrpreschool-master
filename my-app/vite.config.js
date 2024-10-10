import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Där den byggda appen hamnar (Netlify publicerar denna mapp)
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),  // Så att du kan använda '@/komponent' för att referera till src
    },
  },
  server: {
    fs: {
      strict: false,  // Tillåter att läsa filer utanför projektets rotkatalog (behövs för Netlify functions)
    },
  },
});
