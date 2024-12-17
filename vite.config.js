import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'flixmate.js',
        assetFileNames: 'flixmate.css',
        manualChunks: undefined,
      },
    },
  },
})

export async function generateNonReactProject() {
  return defineConfig({
    plugins: [],
    build: {
      rollupOptions: {
        input: 'flixMateConnect.js',
        output: {
          dir: 'dist',
          entryFileNames: 'flixMateConnect.js',
        },
      },
    },
  })
}
