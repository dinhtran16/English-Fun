import { handleAi } from './ai'
import { handleAuth } from './auth'
import { json, type Env } from './http'
import { handleVocab } from './vocab'

/** Serves the accounts and vocabulary APIs from D1; every other path is the built app in dist/ (static assets). */
export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url)
    const { pathname } = url
    // Requests that change data must come from this site's own pages (blocks cross-site forms and scripts).
    if (pathname.startsWith('/api/') && request.method !== 'GET' && request.method !== 'HEAD') {
      const origin = request.headers.get('origin')
      if (origin && origin !== url.origin) return json({ error: 'bad_origin' }, 403)
    }
    if (pathname === '/api/vocab') return handleVocab(request, env)
    if (pathname.startsWith('/api/ai/')) return handleAi(request, env, pathname.slice('/api/ai/'.length))
    if (pathname.startsWith('/api/auth/')) return handleAuth(request, env, pathname.slice('/api/auth/'.length))
    if (pathname.startsWith('/api/')) {
      return json({ error: 'not_found' }, 404)
    }
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
