import { handleAi } from './ai'
import { handleAuth } from './auth'
import type { Env } from './http'
import { handleVocab } from './vocab'

/** Serves the accounts and vocabulary APIs from D1; every other path is the built app in dist/ (static assets). */
export default {
  async fetch(request, env): Promise<Response> {
    const { pathname } = new URL(request.url)
    if (pathname === '/api/vocab') return handleVocab(request, env)
    if (pathname.startsWith('/api/ai/')) return handleAi(request, env, pathname.slice('/api/ai/'.length))
    if (pathname.startsWith('/api/auth/')) return handleAuth(request, env, pathname.slice('/api/auth/'.length))
    if (pathname.startsWith('/api/')) {
      return new Response(JSON.stringify({ error: 'not_found' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      })
    }
    return env.ASSETS.fetch(request)
  },
} satisfies ExportedHandler<Env>
