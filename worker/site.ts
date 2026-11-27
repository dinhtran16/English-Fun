import { COOKIE, readCookie } from './auth'
import type { Env } from './http'
import { LANGUAGES } from '../src/i18n/languages'

/** Same policy as public/_headers, applied here because these responses pass through the Worker. */
const PAGE_HEADERS: Record<string, string> = {
  'content-security-policy':
    "default-src 'self'; script-src 'self' https://challenges.cloudflare.com; frame-src https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self' https://api.dictionaryapi.dev https://api.mymemory.translated.net; img-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'",
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  'strict-transport-security': 'max-age=31536000',
}

const PLACEHOLDER = '__SITE_URL__'

/** Home pages: "/" (Vietnamese) and "/en/", "/ja/"... (see site/content/home.ts). */
const HOME_PATH = new RegExp(`^/(?:(?:en|${LANGUAGES.map((l) => l.code).join('|')})/?)?$`)

/** The site's public address: SITE_URL when set (e.g. https://hoctienganh.app), otherwise the address in use. */
function siteOrigin(env: Env, url: URL): string {
  const configured = env.SITE_URL?.trim().replace(/\/+$/, '')
  return configured || url.origin
}

/**
 * Serves the built site from dist/. Public pages, robots.txt and sitemap.xml contain a
 * placeholder for the site address, filled in here so they are correct on any domain.
 */
export async function serveSite(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)

  // Signed-in visitors go straight to the app; everyone else (and search engines) sees the home page.
  const isHome = HOME_PATH.test(url.pathname)
  if (isHome && readCookie(request, COOKIE)) {
    return new Response(null, { status: 302, headers: { location: '/app/', 'cache-control': 'no-store' } })
  }

  const res = await env.ASSETS.fetch(request)
  const type = res.headers.get('content-type') ?? ''
  if (!/text\/html|xml|text\/plain/.test(type)) return res

  const origin = siteOrigin(env, url)
  const body = request.method === 'HEAD' ? null : (await res.text()).replaceAll(PLACEHOLDER, origin)
  const headers = new Headers(res.headers)
  headers.delete('content-length')
  for (const [k, v] of Object.entries(PAGE_HEADERS)) if (!headers.has(k)) headers.set(k, v)
  // Keep search engines on the main address only (e.g. not the *.workers.dev copy).
  if (new URL(origin).host !== url.host) headers.set('x-robots-tag', 'noindex')
  if (isHome) headers.set('vary', 'cookie')
  return new Response(body, { status: res.status, statusText: res.statusText, headers })
}
