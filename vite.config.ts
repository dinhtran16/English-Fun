import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { buildSite } from './site/build.ts'

/**
 * Writes the public pages from site/ (home, topics, blog, robots.txt, sitemap.xml) into dist/,
 * and serves them in `npm run dev` too. The app itself is app/index.html, served at /app/.
 */
function sitePages(): Plugin {
  return {
    name: 'site-pages',
    generateBundle() {
      for (const [fileName, source] of Object.entries(buildSite())) {
        this.emitFile({ type: 'asset', fileName, source })
      }
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url ?? '/').split('?')[0]
        if (path.startsWith('/app') || path.startsWith('/@') || path.startsWith('/src/') || path.startsWith('/node_modules/')) {
          return next()
        }
        // Reload site/ on every request so edits show up without restarting.
        const mod = (await server.ssrLoadModule('/site/build.ts')) as typeof import('./site/build.ts')
        const files = mod.buildSite()
        const name = path.endsWith('/') ? `${path.slice(1)}index.html` : path.slice(1)
        const file = files[name] !== undefined ? name : files[`${name}.html`] !== undefined ? `${name}.html` : null
        if (!file) return next()
        const type = file.endsWith('.xml') ? 'application/xml' : file.endsWith('.txt') ? 'text/plain' : 'text/html'
        res.setHeader('content-type', `${type}; charset=utf-8`)
        res.end(files[file].replaceAll('__SITE_URL__', `http://${req.headers.host}`))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitePages()],
  build: {
    rollupOptions: {
      input: { app: 'app/index.html' },
    },
  },
})
