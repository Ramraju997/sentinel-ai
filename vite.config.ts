import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig(({ command }) => {
  const podName = process.env.VITE_POD_NAME || process.env.HOSTNAME || process.env.POD_NAME || '';
  const port = parseInt(process.env.PORT || '5173', 10);

  // Under AMD pod proxy, the base path is /<podName>/proxy/<port>/ in development.
  // For production build, we use './' so assets are relative and can be hosted anywhere.
  const base = command === 'serve'
    ? (podName ? `/${podName}/proxy/${port}/` : '/')
    : './';

  return {
    base,
    plugins: [
      figmaAssetResolver(),
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },

    // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
    assetsInclude: ['**/*.svg', '**/*.csv'],

    server: {
      host: true, // Listen on all network interfaces (0.0.0.0)
      port: port,
      strictPort: true,
      allowedHosts: true, // Bypass host checking behind the proxy
      hmr: podName ? {
        path: `${base}@vite/client`, // Route HMR WebSockets through the Jupyter proxy path
      } : undefined,
    },
  }
})

