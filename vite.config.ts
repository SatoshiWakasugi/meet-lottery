import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/main.tsx'),
      },
      output: {
        entryFileNames: 'js/popup.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            return 'assets/styles/main.css'
          }
          return '[name].[hash][extname]'
        },
      },
    },
  },
  resolve: {
    alias: {
      '@/': `${__dirname}/src/`,
      '~/': `${__dirname}/public/`,
    },
  },
})
