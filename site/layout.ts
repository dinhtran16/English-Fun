import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { LucideIcon } from 'lucide-react'

/**
 * Replaced by the Worker with the site's real address (SITE_URL, or the address the
 * page was requested from), so the pages work before and after a custom domain is added.
 */
export const SITE = '__SITE_URL__'
export const SITE_NAME = 'English Fun'
export const OG_IMAGE = `${SITE}/img/og-image.jpg`
/** Where "try it" buttons go: the app in guest mode, which only uses built-in content (no AI cost). */
export const TRY_URL = '/app/?guest=1'

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
}

const NAV = [
  { href: '/chu-de', label: 'Chủ đề từ vựng' },
  { href: '/blog', label: 'Blog' },
]

export function page(meta: PageMeta, body: string): string {
  const url = `${SITE}${meta.path === '/' ? '/' : meta.path}`
  const ld = (meta.schema ?? [])
    .map((s) => `<script type="application/ld+json">${JSON.stringify(s).replace(/</g, '\\u003c')}</script>`)
    .join('\n    ')
  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(meta.title)}</title>
    <meta name="description" content="${esc(meta.description)}" />
    ${meta.noindex ? '<meta name="robots" content="noindex" />' : `<link rel="canonical" href="${url}" />`}
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta property="og:locale" content="vi_VN" />
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
  </head>
  <body>
    <header class="nav">
      <div class="wrap nav-inner">
        <a class="brand" href="/"><span class="logo-mark">E</span><span>${SITE_NAME}</span></a>
        <nav class="nav-links" aria-label="Điều hướng chính">
          ${NAV.map((n) => `<a href="${n.href}"${meta.path.startsWith(n.href) ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}
        </nav>
        <div class="nav-cta">
          <a class="btn ghost hide-sm" href="/app/">Đăng nhập</a>
          <a class="btn primary" href="${TRY_URL}">Dùng thử</a>
        </div>
      </div>
    </header>
    <main>
${body}
    </main>
    <footer class="footer">
      <div class="wrap footer-inner">
        <div>
          <a class="brand" href="/"><span class="logo-mark">E</span><span>${SITE_NAME}</span></a>
          <p class="muted">Luyện đọc, viết tiếng Anh và xây kho từ vựng của riêng bạn.</p>
        </div>
        <nav class="footer-links" aria-label="Liên kết cuối trang">
          <a href="/chu-de">Chủ đề từ vựng</a>
          <a href="/blog">Blog</a>
          <a href="${TRY_URL}">Dùng thử</a>
          <a href="/app/">Đăng nhập</a>
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

export function cta(title: string, text: string, href = TRY_URL, label = 'Dùng thử miễn phí') {
  return `<section class="cta">
        <div>
          <h2>${title}</h2>
          <p>${text}</p>
        </div>
        <a class="btn primary lg" href="${href}">${label}</a>
      </section>`
}
