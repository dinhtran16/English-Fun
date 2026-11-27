/**
 * Builds the public, crawlable pages (home, topic pages, blog, robots.txt, sitemap.xml)
 * as static files. The React app itself lives under /app/.
 * Used by the `site-pages` plugin in vite.config.ts, both for `vite build` and the dev server.
 */
import { BookOpen, Library, PenLine, Sparkles } from 'lucide-react'
import { PASSAGES, TOPICS } from '../src/data/passages.ts'
import type { Messages } from '../src/i18n/locales/en.ts'
import de from '../src/i18n/locales/de.ts'
import en from '../src/i18n/locales/en.ts'
import es from '../src/i18n/locales/es.ts'
import fr from '../src/i18n/locales/fr.ts'
import hi from '../src/i18n/locales/hi.ts'
import id from '../src/i18n/locales/id.ts'
import ja from '../src/i18n/locales/ja.ts'
import ko from '../src/i18n/locales/ko.ts'
import pt from '../src/i18n/locales/pt.ts'
import vi from '../src/i18n/locales/vi.ts'
import zh from '../src/i18n/locales/zh.ts'
import { HOMES, homePath, tryUrl, type HomeCopy } from './content/home.ts'
import { toneClass, topicIconFor } from '../src/topicIcons.ts'
import { POSTS, type Post } from './content/posts.ts'
import { TOPIC_PAGES, type TopicContent } from './content/topics.ts'
import { breadcrumbs, cta, esc, shareBox, icon, OG_IMAGE, page, SITE, SITE_NAME, TRY_URL } from './layout.ts'

const topicIcon = (id: string, size = 20) => icon(topicIconFor(id), size)
const topicPath = (t: TopicContent) => `/chu-de/${t.slug}`
const postPath = (p: Post) => `/blog/${p.slug}`
/** Opens the app as a guest with this topic chosen. */
const tryTopic = (t: TopicContent, skill: 'reading' | 'writing' = 'reading') => `${TRY_URL}&topic=${t.id}&skill=${skill}`

const PUBLISHER = { '@type': 'Organization', name: SITE_NAME, url: `${SITE}/` }

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return `${Number(d)}/${Number(m)}/${y}`
}

const LOCALES: Record<string, Messages> = { vi, en, es, pt, fr, de, id, ja, ko, zh, hi }

/** The home page in one language. Vietnamese links to the topic pages and blog; the others link into the app. */
function home(h: HomeCopy): string {
  const isVi = h.code === 'vi'
  const tryHref = tryUrl(h)
  const path = homePath(h)
  /** Screenshots of the app in the page's language (English has no app language, so it shows Spanish). */
  const shot = isVi ? '' : `-${h.code === 'en' ? 'es' : h.code}`
  const features = [BookOpen, PenLine, Library].map((ic, i) => ({ ic, title: h.features[i][0], text: h.features[i][1] }))
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE}${path}`,
      inLanguage: h.hreflang,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: `${SITE}${path}`,
      image: OG_IMAGE,
      description: h.appDescription,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      inLanguage: h.hreflang,
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: isVi ? 'VND' : 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: h.faq.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ]
  const names = LOCALES[h.code].topics
  const topicCards = isVi
    ? TOPIC_PAGES.map(
        (t) => `<a class="card topic-card ${toneClass(t.id)}" href="${topicPath(t)}">
            <span class="topic-icon">${topicIcon(t.id)}</span>
            <span class="topic-name">${t.name}</span>
            <span class="muted small">${t.words.length} từ mẫu</span>
          </a>`,
      )
    : TOPICS.map(
        (t) => `<a class="card topic-card ${toneClass(t.id)}" href="${tryHref}&amp;topic=${t.id}&amp;skill=reading">
            <span class="topic-icon">${topicIcon(t.id)}</span>
            <span class="topic-name">${esc(names[t.id] ?? t.name)}</span>
          </a>`,
      )
  const body = `
      <section class="hero">
        <div class="wrap hero-inner">
          <div class="hero-copy">
            <span class="pill">${icon(Sparkles, 14)} ${esc(h.pill)}</span>
            <h1>${esc(h.h1)}</h1>
            <p class="lead">${esc(h.lead)}</p>
            <div class="row">
              <a class="btn primary lg" href="${tryHref}">${esc(h.tryFree)}</a>
              <a class="btn lg" href="/app/">${esc(h.chrome.signIn)}</a>
            </div>
            <p class="muted small">${esc(h.runs)}</p>
          </div>
          <figure class="shot hero-shot">
            <img src="/img/doc-hieu${shot}.jpg" width="1280" height="800" alt="${esc(h.heroAlt)}" fetchpriority="high" />
          </figure>
        </div>
      </section>

      <section class="wrap section">
        <h2 class="section-title">${esc(h.featuresTitle)}</h2>
        <div class="grid-3">
          ${features
            .map(
              (f) => `<article class="card feature">
            <span class="feature-icon">${icon(f.ic, 22)}</span>
            <h3>${esc(f.title)}</h3>
            <p>${esc(f.text)}</p>
          </article>`,
            )
            .join('\n          ')}
        </div>
      </section>

      <section class="wrap section split-media">
        <figure class="shot"><img src="/img/viet-dich${shot}.jpg" width="1280" height="800" loading="lazy" alt="${esc(h.writeAlt)}" /></figure>
        <div>
          <h2 class="section-title left">${esc(h.stepsTitle)}</h2>
          <ol class="steps">
            ${h.steps.map(([t, d]) => `<li><strong>${esc(t)}</strong><span>${esc(d)}</span></li>`).join('\n            ')}
          </ol>
          <a class="btn primary" href="${tryHref}">${esc(h.tryReading)}</a>
        </div>
      </section>

      <section class="wrap section" id="topics">
        <h2 class="section-title">${esc(h.topicsTitle)}</h2>
        <p class="section-lead">${esc(h.topicsLead)}</p>
        <div class="topic-grid">
          ${topicCards.join('\n          ')}
        </div>
      </section>
${
  isVi
    ? `
      <section class="wrap section">
        <h2 class="section-title">Bài viết mới</h2>
        <div class="grid-2">
          ${POSTS.slice(0, 4).map(postCard).join('\n          ')}
        </div>
      </section>
`
    : ''
}
      <section class="wrap section narrow" id="faq">
        <h2 class="section-title">${esc(h.faqTitle)}</h2>
        <div class="faq">
          ${h.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n          ')}
        </div>
      </section>

      <div class="wrap section">
        ${cta(esc(h.ctaTitle), esc(h.ctaText), tryHref, esc(h.tryFree))}
      </div>`
  return page({ path, title: h.title, description: h.description, schema, home: h, translated: true }, body)
}

function postCard(p: Post) {
  return `<a class="card post-card" href="${postPath(p)}">
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.description)}</p>
            <span class="muted small">${p.readMinutes} phút đọc</span>
          </a>`
}

function topicsIndex(): string {
  const crumbs = breadcrumbs([
    { name: 'Trang chủ', path: '/' },
    { name: 'Chủ đề từ vựng', path: '/chu-de' },
  ])
  const body = `
      <div class="wrap section narrow-head">
        ${crumbs.html}
        <h1>Từ vựng tiếng Anh theo chủ đề</h1>
        <p class="lead">Chọn một chủ đề để xem từ vựng thông dụng kèm phiên âm, nghĩa tiếng Việt, câu ví dụ, cụm từ hay dùng và một đoạn đọc mẫu có bản dịch.</p>
      </div>
      <div class="wrap section">
        <div class="topic-list">
          ${TOPIC_PAGES.map(
            (t) => `<a class="card topic-row ${toneClass(t.id)}" href="${topicPath(t)}">
            <span class="topic-icon">${topicIcon(t.id)}</span>
            <span>
              <strong>${t.h1}</strong>
              <span class="muted small">${t.words
                .slice(0, 5)
                .map((w) => w.word)
                .join(', ')}...</span>
            </span>
          </a>`,
          ).join('\n          ')}
        </div>
      </div>
      <div class="wrap section">
        ${cta('Học từ ngay trong bài đọc', 'Đọc đoạn văn theo chủ đề, bấm vào từ lạ để xem nghĩa và lưu vào kho từ của bạn.')}
      </div>`
  return page(
    {
      path: '/chu-de',
      title: 'Từ vựng tiếng Anh theo chủ đề (có phiên âm, ví dụ, bài đọc mẫu)',
      description:
        'Danh sách từ vựng tiếng Anh theo chủ đề: công việc, du lịch, công nghệ, sức khỏe, đời sống. Mỗi từ có phiên âm, nghĩa tiếng Việt và câu ví dụ.',
      schema: [crumbs.schema],
    },
    body,
  )
}

/** Escapes the passage and highlights the topic's words (and simple inflections) in it. */
function highlight(text: string, words: string[]) {
  const forms = words
    .sort((a, b) => b.length - a.length)
    .map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const re = new RegExp(`\\b(${forms.join('|')})(s|es|d|ed|ing)?\\b`, 'gi')
  return esc(text).replace(re, '<mark>$&</mark>')
}

function topicPage(t: TopicContent): string {
  const crumbs = breadcrumbs([
    { name: 'Trang chủ', path: '/' },
    { name: 'Chủ đề từ vựng', path: '/chu-de' },
    { name: t.name, path: topicPath(t) },
  ])
  const sample = PASSAGES.find((p) => p.topicId === t.id)
  const others = TOPIC_PAGES.filter((o) => o.id !== t.id)
  const schema = [
    crumbs.schema,
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTermSet',
      name: t.h1,
      description: t.description,
      url: `${SITE}${topicPath(t)}`,
      inLanguage: ['en', 'vi'],
      hasDefinedTerm: t.words.map((w) => ({
        '@type': 'DefinedTerm',
        name: w.word,
        description: w.vi,
        inLanguage: 'en',
      })),
    },
  ]
  const body = `
      <div class="wrap section narrow-head">
        ${crumbs.html}
        <h1>${t.h1}</h1>
        <p class="lead">${t.intro}</p>
        <div class="row">
          <a class="btn primary" href="${tryTopic(t)}">Luyện đọc chủ đề ${t.name.toLowerCase()}</a>
          <a class="btn" href="${tryTopic(t, 'writing')}">Luyện viết</a>
        </div>
      </div>

      <section class="wrap section">
        <h2 class="section-title left">${t.words.length} từ vựng thông dụng</h2>
        <div class="table-wrap card">
          <table class="vocab">
            <thead><tr><th>Từ</th><th>Nghĩa</th><th>Ví dụ</th></tr></thead>
            <tbody>
              ${t.words
                .map(
                  (w) => `<tr>
                <td><strong lang="en">${esc(w.word)}</strong> <span class="pos">${w.pos}</span><br /><span class="ipa">${esc(w.ipa)}</span></td>
                <td>${esc(w.vi)}</td>
                <td lang="en" class="example">${esc(w.example)}</td>
              </tr>`,
                )
                .join('\n              ')}
            </tbody>
          </table>
        </div>
      </section>

      <section class="wrap section">
        <h2 class="section-title left">Cụm từ hay dùng</h2>
        <ul class="phrases">
          ${t.phrases.map(([en, vi]) => `<li class="card"><strong lang="en">${esc(en)}</strong><span>${esc(vi)}</span></li>`).join('\n          ')}
        </ul>
      </section>

      ${
        sample
          ? `<section class="wrap section">
        <h2 class="section-title left">Đoạn đọc mẫu: ${esc(sample.title)}</h2>
        <p class="muted">Các từ trong danh sách trên được tô sáng. Thử tự dịch trước khi mở bản dịch.</p>
        <article class="card passage" lang="en">
          <p>${highlight(sample.en, t.words.map((w) => w.word))}</p>
        </article>
        <details class="translation">
          <summary>Xem bản dịch tiếng Việt</summary>
          <p>${esc(sample.vi)}</p>
        </details>
        <div class="row" style="margin-top:16px">
          <a class="btn primary" href="${tryTopic(t)}">Đọc bài này trong app, tra và lưu từ</a>
        </div>
      </section>`
          : ''
      }

      <section class="wrap section">
        <h2 class="section-title left">Mẹo học nhóm từ này</h2>
        <ul class="tips">
          ${t.tips.map((tip) => `<li>${tip}</li>`).join('\n          ')}
        </ul>
        <p>Muốn hiểu sâu hơn về cách học? Đọc thêm <a href="/blog/${POSTS[0].slug}">${esc(POSTS[0].title)}</a>.</p>
      </section>

      <div class="wrap section">
        ${shareBox(topicPath(t), 'Chia sẻ bộ từ vựng này', t.title)}
      </div>

      <section class="wrap section">
        <h2 class="section-title left">Chủ đề khác</h2>
        <div class="topic-grid">
          ${others
            .map(
              (o) => `<a class="card topic-card ${toneClass(o.id)}" href="${topicPath(o)}">
            <span class="topic-icon">${topicIcon(o.id)}</span>
            <span class="topic-name">${o.name}</span>
          </a>`,
            )
            .join('\n          ')}
        </div>
      </section>

      <div class="wrap section">
        ${cta(`Luyện từ vựng ${t.name.toLowerCase()} trong bài đọc`, 'Mỗi lần bấm "Đoạn khác" là một bài mới. Từ bạn lưu sẽ quay lại trong bài viết và bài ôn.', tryTopic(t))}
      </div>`
  return page({ path: topicPath(t), title: t.title, description: t.description, schema }, body)
}

function blogIndex(): string {
  const crumbs = breadcrumbs([
    { name: 'Trang chủ', path: '/' },
    { name: 'Blog', path: '/blog' },
  ])
  const body = `
      <div class="wrap section narrow-head">
        ${crumbs.html}
        <h1>Blog học tiếng Anh</h1>
        <p class="lead">Phương pháp tự học từ vựng, luyện đọc và luyện viết tiếng Anh cho người đi làm.</p>
      </div>
      <div class="wrap section">
        <div class="grid-2">
          ${POSTS.map(postCard).join('\n          ')}
        </div>
      </div>`
  return page(
    {
      path: '/blog',
      title: 'Blog học tiếng Anh: từ vựng, đọc hiểu, luyện viết | English Fun',
      description:
        'Bài viết hướng dẫn tự học tiếng Anh cho người lớn: cách học từ vựng nhớ lâu, luyện đọc hiểu mỗi ngày, luyện viết bằng cách dịch và lộ trình cho người bận rộn.',
      schema: [crumbs.schema],
    },
    body,
  )
}

function postPage(p: Post): string {
  const crumbs = breadcrumbs([
    { name: 'Trang chủ', path: '/' },
    { name: 'Blog', path: '/blog' },
    { name: p.title, path: postPath(p) },
  ])
  const more = POSTS.filter((o) => o.slug !== p.slug).slice(0, 3)
  const schema = [
    crumbs.schema,
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.date,
      inLanguage: 'vi',
      image: OG_IMAGE,
      author: PUBLISHER,
      publisher: PUBLISHER,
      mainEntityOfPage: `${SITE}${postPath(p)}`,
    },
  ]
  const body = `
      <article class="wrap section article">
        ${crumbs.html}
        <h1>${esc(p.title)}</h1>
        <p class="muted small">${formatDate(p.date)} · ${p.readMinutes} phút đọc</p>
        <div class="prose">${p.body}</div>
        ${shareBox(postPath(p), 'Thấy bài viết hữu ích? Chia sẻ cho bạn bè', p.title)}
      </article>
      <div class="wrap section narrow">
        ${cta('Áp dụng ngay với một bài đọc', 'Chọn chủ đề, đọc đoạn văn ngắn và lưu từ mới vào kho. Không cần tài khoản.')}
      </div>
      <section class="wrap section narrow">
        <h2 class="section-title left">Đọc tiếp</h2>
        <ul class="link-list">
          ${more.map((o) => `<li><a href="${postPath(o)}">${esc(o.title)}</a></li>`).join('\n          ')}
          <li><a href="/chu-de">Từ vựng tiếng Anh theo chủ đề</a></li>
        </ul>
      </section>`
  return page({ path: postPath(p), title: p.title, description: p.description, ogType: 'article', schema }, body)
}

function notFound(): string {
  return page(
    { path: '/404', title: 'Không tìm thấy trang | English Fun', description: 'Trang bạn tìm không tồn tại.', noindex: true },
    `
      <div class="wrap section narrow-head center">
        <h1>Không tìm thấy trang này</h1>
        <p class="lead">Có thể đường dẫn đã thay đổi. Bạn thử quay về trang chủ hoặc xem các chủ đề từ vựng nhé.</p>
        <div class="row center">
          <a class="btn primary" href="/">Về trang chủ</a>
          <a class="btn" href="/chu-de">Chủ đề từ vựng</a>
        </div>
      </div>`,
  )
}

function sitemap(today: string): string {
  const alternates = [
    ...HOMES.map((h) => `    <xhtml:link rel="alternate" hreflang="${h.hreflang}" href="${SITE}${homePath(h)}" />`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/en/" />`,
  ].join('\n')
  const urls: { path: string; priority: string; lastmod?: string; alt?: boolean }[] = [
    ...HOMES.map((h) => ({ path: homePath(h), priority: '1.0', alt: true })),
    { path: '/chu-de', priority: '0.8' },
    ...TOPIC_PAGES.map((t) => ({ path: topicPath(t), priority: '0.8' })),
    { path: '/blog', priority: '0.6' },
    ...POSTS.map((p) => ({ path: postPath(p), priority: '0.6', lastmod: p.date })),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u.path}</loc>
    <lastmod>${u.lastmod ?? today}</lastmod>
    <priority>${u.priority}</priority>${u.alt ? `\n${alternates}` : ''}
  </url>`,
  )
  .join('\n')}
</urlset>
`
}

const ROBOTS = `User-agent: *
Allow: /
Disallow: /api/

Sitemap: ${SITE}/sitemap.xml
`

/**
 * Every public file, keyed by its path in dist/. Pages are written as `name.html` so they
 * are served without a trailing slash (/chu-de/abc rather than /chu-de/abc/).
 */
export function buildSite(today = new Date().toISOString().slice(0, 10)): Record<string, string> {
  const files: Record<string, string> = {
    'index.html': home(HOMES[0]),
    'chu-de.html': topicsIndex(),
    'blog.html': blogIndex(),
    '404.html': notFound(),
    'robots.txt': ROBOTS,
    'sitemap.xml': sitemap(today),
  }
  // Other languages are folders (/en/ → en/index.html), so their address ends with "/".
  for (const h of HOMES.slice(1)) files[`${h.code}/index.html`] = home(h)
  for (const t of TOPIC_PAGES) files[`chu-de/${t.slug}.html`] = topicPage(t)
  for (const p of POSTS) files[`blog/${p.slug}.html`] = postPage(p)
  return files
}
