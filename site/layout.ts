import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Globe, Link2, Mail, MessageCircle, MoreHorizontal, Send, Share2, type LucideIcon } from 'lucide-react'
import { shareTargets, type ShareTarget } from '../src/share.ts'
import { HOMES, homePath, tryUrl, VI, type HomeCopy } from './content/home.ts'

/**
 * Replaced by the Worker with the site's real address (SITE_URL, or the address the
 * page was requested from), so the pages work before and after a custom domain is added.
 */
export const SITE = '__SITE_URL__'
export const SITE_NAME = 'English Fun'
export const OG_IMAGE = `${SITE}/img/og-image.jpg`
/** Where "try it" buttons go: the app in guest mode, which only uses built-in content (no AI cost). */
export const TRY_URL = '/app/?guest=1&lang=vi'

export const esc = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export const icon = (Icon: LucideIcon, size = 20) =>
  renderToStaticMarkup(createElement(Icon, { size, strokeWidth: 1.8, 'aria-hidden': true }))

const FONTS =
  'https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap'

const FAVICON =
  "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2224%22 fill=%22%234338ca%22/><text x=%2250%22 y=%2270%22 font-size=%2262%22 font-family=%22Arial%22 font-weight=%22800%22 fill=%22white%22 text-anchor=%22middle%22>E</text></svg>"

export interface PageMeta {
  /** Path of the page, starting with "/". */
  path: string
  title: string
  description: string
  ogType?: 'website' | 'article'
  /** Structured data objects, each written as its own JSON-LD block. */
  schema?: object[]
  noindex?: boolean
  /** Language of the page; Vietnamese when left out. */
  home?: HomeCopy
  /** True on the home pages, which exist in every language and link to each other (hreflang). */
  translated?: boolean
}

const glyph = (id: ShareTarget['id']) =>
  id === 'facebook'
    ? '<span class="share-glyph" aria-hidden="true">f</span>'
    : id === 'x'
      ? '<span class="share-glyph" aria-hidden="true">X</span>'
      : icon(id === 'whatsapp' ? MessageCircle : id === 'telegram' ? Send : Mail, 15)

/**
 * Share links for a page. They work without JavaScript; /share.js adds "Copy link" and,
 * where the browser has it, the system share sheet (Zalo, Messenger and the rest on phones).
 */
export function shareLinks(path: string, text = VI.chrome.shareText, c = VI.chrome) {
  const url = `${SITE}${path}`
  const links = shareTargets(url, text)
    .map(
      (s) =>
        `<a class="share-target ${s.id}" href="${esc(s.href)}"${s.id === 'email' ? '' : ' target="_blank" rel="noopener noreferrer"'}><span class="share-badge">${glyph(s.id)}</span>${s.label}</a>`,
    )
    .join('')
  return `<div class="share-targets" data-share data-url="${esc(url)}" data-text="${esc(text)}" data-copied="${esc(c.copied)}">
          <button type="button" class="share-target copy" data-share-copy hidden><span class="share-badge">${icon(Link2, 15)}</span><span data-label>${esc(c.copyLink)}</span></button>
          ${links}
          <button type="button" class="share-target more" data-share-native hidden><span class="share-badge">${icon(MoreHorizontal, 15)}</span>${esc(c.more)}</button>
        </div>`
}

/** A "share this" box, e.g. under a blog post. */
export function shareBox(path: string, title: string, text?: string, c = VI.chrome) {
  return `<section class="share-box">
        <p class="share-box-title">${esc(title)}</p>
        ${shareLinks(path, text ?? c.shareText, c)}
      </section>`
}

/** Nav links: the Vietnamese topic pages and blog, or sections of the home page in other languages. */
function navLinks(h: HomeCopy) {
  const c = h.chrome
  return h.code === 'vi'
    ? [
        { href: '/chu-de', label: c.topics },
        { href: '/blog', label: c.blog },
      ]
    : [
        { href: `${homePath(h)}#topics`, label: c.topics },
        { href: `${homePath(h)}#faq`, label: c.faq },
      ]
}

/**
 * Language menu. Works without JavaScript (<details>); /lang.js remembers the choice and,
 * on a home page, offers the visitor's own language when it differs from the page's.
 */
function languageMenu(h: HomeCopy) {
  return `<details class="lang-menu" data-lang-menu>
            <summary class="btn ghost" title="${esc(h.chrome.language)}" aria-label="${esc(h.chrome.language)}: ${esc(h.label)}">${icon(Globe, 18)}<span class="lang-code">${h.code.toUpperCase()}</span></summary>
            <ul class="lang-list">
              ${HOMES.map(
                (o) =>
                  `<li><a href="${homePath(o)}" hreflang="${o.hreflang}" lang="${o.hreflang}" data-lang="${o.code}" data-suggest="${esc(o.suggest)}"${o.code === h.code ? ' aria-current="true"' : ''}>${esc(o.label)}</a></li>`,
              ).join('\n              ')}
            </ul>
          </details>`
}

export function page(meta: PageMeta, body: string): string {
  const h = meta.home ?? VI
  const c = h.chrome
  const home = homePath(h)
  const tryHref = tryUrl(h)
  const url = `${SITE}${meta.path}`
  const ld = (meta.schema ?? [])
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ')
  const alternates = meta.translated
    ? [
        ...HOMES.map((o) => `<link rel="alternate" hreflang="${o.hreflang}" href="${SITE}${homePath(o)}" />`),
        `<link rel="alternate" hreflang="x-default" href="${SITE}/en/" />`,
        ...HOMES.filter((o) => o.code !== h.code).map((o) => `<meta property="og:locale:alternate" content="${o.ogLocale}" />`),
      ].join('\n    ')
    : ''
  const nav = navLinks(h)
  return `<!doctype html>
<html lang="${h.hreflang}"${meta.translated ? ' data-home' : ''}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(meta.title)}</title>
    <meta name="description" content="${esc(meta.description)}" />
    ${meta.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`}
    ${alternates}
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="${h.ogLocale}" />
    <meta property="og:type" content="${meta.ogType ?? 'website'}" />
    <meta property="og:title" content="${esc(meta.title)}" />
    <meta property="og:description" content="${esc(meta.description)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="theme-color" content="#4338ca" />
    <link rel="icon" href="${FAVICON}" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="${FONTS}" rel="stylesheet" />
    <link rel="stylesheet" href="/site.css" />
    ${ld}
    <script src="/share.js" defer></script>
    <script src="/lang.js" defer></script>
  </head>
  <body>
    <div class="lang-suggest" data-lang-suggest hidden>
      <div class="wrap lang-suggest-inner">
        ${icon(Globe, 16)}<a href="/" data-lang-suggest-link></a>
        <button type="button" class="lang-suggest-close" data-lang-suggest-close aria-label="${esc(c.close)}">&times;</button>
      </div>
    </div>
    <header class="nav">
      <div class="wrap nav-inner">
        <a class="brand" href="${home}"><span class="logo-mark">E</span><span>${SITE_NAME}</span></a>
        <nav class="nav-links" aria-label="${esc(c.mainNav)}">
          ${nav.map((n) => `<a href="${n.href}"${h.code === 'vi' && meta.path.startsWith(n.href) ? ' aria-current="page"' : ''}>${esc(n.label)}</a>`).join('')}
        </nav>
        <div class="nav-cta">
          ${languageMenu(h)}
          <div class="share">
            <button type="button" class="btn ghost share-trigger" data-share-open aria-expanded="false" aria-controls="share-pop" title="${esc(c.shareTitle)}">${icon(Share2, 18)}<span class="hide-sm">${esc(c.share)}</span></button>
            <div class="share-pop" id="share-pop" role="dialog" aria-label="${esc(c.shareTitle)}" hidden>
              <p class="share-box-title">${esc(c.shareTitle)}</p>
              <p class="muted small">${esc(c.shareHint)}</p>
              ${shareLinks(meta.path, c.shareText, c)}
            </div>
          </div>
          <a class="btn ghost hide-sm" href="/app/">${esc(c.signIn)}</a>
          <a class="btn primary" href="${tryHref}">${esc(c.try)}</a>
        </div>
      </div>
    </header>
    <main>
${body}
    </main>
    <footer class="footer">
      <div class="wrap footer-inner">
        <div>
          <a class="brand" href="${home}"><span class="logo-mark">E</span><span>${SITE_NAME}</span></a>
          <p class="muted">${esc(c.tagline)}</p>
        </div>
        <nav class="footer-links" aria-label="${esc(c.footerNav)}">
          ${nav.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join('\n          ')}
          <a href="${tryHref}">${esc(c.try)}</a>
          <a href="/app/">${esc(c.signIn)}</a>
        </nav>
        <nav class="footer-langs" aria-label="${esc(c.language)}">
          ${HOMES.map((o) => `<a href="${homePath(o)}" hreflang="${o.hreflang}" lang="${o.hreflang}" data-lang="${o.code}">${esc(o.label)}</a>`).join('\n          ')}
        </nav>
      </div>
    </footer>
  </body>
</html>
`
}

/** Breadcrumb trail shown on the page, plus its BreadcrumbList schema. */
export function breadcrumbs(items: { name: string; path: string }[]) {
  const html = `<nav class="crumbs" aria-label="Breadcrumb">${items
    .map((it, i) =>
      i === items.length - 1 ? `<span aria-current="page">${esc(it.name)}</span>` : `<a href="${it.path}">${esc(it.name)}</a>`,
    )
    .join('<span class="sep">/</span>')}</nav>`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE}${it.path}`,
    })),
  }
  return { html, schema }
}

export function cta(title: string, text: string, href = TRY_URL, label = VI.tryFree) {
  return `<section class="cta">
        <div>
          <h2>${title}</h2>
          <p>${text}</p>
        </div>
        <a class="btn primary lg" href="${href}">${label}</a>
      </section>`
}
