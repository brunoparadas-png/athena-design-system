import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Throwaway harness: render the real CMS Athena pages against the installed
// design-system deps (the CMS app can't run here — private @buzzfeed deps).
const dir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: dir,
  plugins: [react()],
  resolve: {
    alias: {
      'athena-ds': path.resolve(dir, '../src'),
      '@cms': path.resolve(dir, '../../mono/huffpost_cms_ui/client/athena'),
    },
  },
  server: {
    port: 5180,
    fs: { allow: [path.resolve(dir, '../..')] }, // /Users/brunopontes/coding
  },
})
