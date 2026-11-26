/**
 * Builds the public, crawlable pages (home, topic pages, blog, robots.txt, sitemap.xml)
 * as static files. The React app itself lives under /app/.
 * Used by the `site-pages` plugin in vite.config.ts, both for `vite build` and the dev server.
 */
import { BookOpen, Briefcase, Cpu, HeartPulse, House, Library, PenLine, Plane, Sparkles, Tag, type LucideIcon } from 'lucide-react'
import { PASSAGES } from '../src/data/passages.ts'
import { POSTS, type Post } from './content/posts.ts'
import { TOPIC_PAGES, type TopicContent } from './content/topics.ts'
import { breadcrumbs, cta, esc, icon, OG_IMAGE, page, SITE, SITE_NAME, TRY_URL } from './layout.ts'

const TOPIC_ICONS: Record<string, LucideIcon> = {
  work: Briefcase,
  travel: Plane,
  technology: Cpu,
  health: HeartPulse,
  daily: House,
}
const topicIcon = (id: string, size = 20) => icon(TOPIC_ICONS[id] ?? Tag, size)
const topicPath = (t: TopicContent) => `/chu-de/${t.slug}`
const postPath = (p: Post) => `/blog/${p.slug}`
/** Opens the app as a guest with this topic chosen. */
const tryTopic = (t: TopicContent, skill: 'reading' | 'writing' = 'reading') => `${TRY_URL}&topic=${t.id}&skill=${skill}`

const PUBLISHER = { '@type': 'Organization', name: SITE_NAME, url: `${SITE}/` }

const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-')
  return `${Number(d)}/${Number(m)}/${y}`
}

const FAQ: [string, string][] = [
  [
    'English Fun có miễn phí không?',
    'Có. Bạn có thể dùng thử ngay không cần tài khoản với các bài đọc và bài viết có sẵn. Tạo tài khoản để đồng bộ kho từ giữa các thiết bị và dùng AI tạo bài mới, chấm bài viết.',
  ],
  [
    'App phù hợp với trình độ nào?',
    'Từ sơ cấp (A2) đến nâng cao (C1). Bạn chọn trình độ trước mỗi bài, và có thể đổi bất cứ lúc nào.',
  ],
  [
    'Kho từ hoạt động thế nào?',
    'Khi đọc, bạn bấm hoặc kéo một từ sang bảng bên cạnh để xem nghĩa, phiên âm và lưu vào kho. Kho từ có chế độ ôn bằng thẻ và gõ lại từ, ưu tiên những từ bạn chưa nhớ.',
  ],
  [
    'Có cần cài đặt gì không?',
    'Không. English Fun chạy ngay trên trình duyệt, cả trên máy tính và điện thoại.',
  ],
  [
    'Luyện viết trong app là gì?',
    'App đưa cho bạn một đoạn tiếng Việt có chứa các từ trong kho từ của bạn. Bạn dịch sang tiếng Anh, so với bản gốc, và khi đăng nhập thì AI chấm điểm và gợi ý cách sửa.',
  ],
]

function home(): string {
  const features = [
    {
      ic: BookOpen,
      title: 'Đọc hiểu theo chủ đề',
      text: 'Đoạn văn ngắn theo chủ đề và trình độ của bạn. Viết bản dịch của mình, rồi so với bản dịch mẫu. Có nút nghe để luyện phát âm.',
    },
    {
      ic: PenLine,
      title: 'Viết và dịch',
      text: 'Dịch một đoạn tiếng Việt sang tiếng Anh, có chèn sẵn từ trong kho của bạn. AI chấm điểm, chỉ lỗi và gợi ý cách viết tự nhiên hơn.',
    },
    {
      ic: Library,
      title: 'Kho từ của riêng bạn',
      text: 'Bấm vào một từ để xem nghĩa, phiên âm và lưu kèm câu gốc. Ôn bằng thẻ hoặc gõ lại, từ chưa nhớ được ưu tiên ôn trước.',
    },
  ]
  const steps = [
    ['Chọn chủ đề và trình độ', 'Công việc, du lịch, công nghệ, sức khỏe hay đời sống, từ A2 đến C1.'],
    ['Đọc hoặc viết', 'Mỗi bài chỉ vài phút. Gặp từ lạ thì bấm vào để tra nghĩa ngay.'],
    ['Lưu và ôn từ mới', 'Từ mới vào kho từ, rồi quay lại trong bài viết và bài ôn của những ngày sau.'],
  ]
  const schema = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE_NAME,
      url: `${SITE}/`,
      inLanguage: 'vi',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_NAME,
      url: `${SITE}/`,
      image: OG_IMAGE,
      description: 'Ứng dụng luyện đọc, viết tiếng Anh theo chủ đề và xây kho từ vựng cá nhân cho người Việt.',
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'Web',
      inLanguage: 'vi',
      isAccessibleForFree: true,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQ.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a },
      })),
    },
  ]
  const body = `
      <section class="hero">
        <div class="wrap hero-inner">
          <div class="hero-copy">
            <span class="pill">${icon(Sparkles, 14)} Dùng thử ngay, không cần đăng ký</span>
            <h1>Luyện đọc, viết tiếng Anh và xây kho từ vựng của riêng bạn</h1>
            <p class="lead">English Fun giúp người lớn học tiếng Anh mỗi ngày 15 phút: đọc đoạn văn theo chủ đề, dịch sang tiếng Anh và lưu từ mới vào kho để ôn lại.</p>
            <div class="row">
              <a class="btn primary lg" href="${TRY_URL}">Dùng thử miễn phí</a>
              <a class="btn lg" href="/app/">Đăng nhập</a>
            </div>
            <p class="muted small">Chạy trên trình duyệt, máy tính và điện thoại.</p>
          </div>
          <figure class="shot hero-shot">
            <img src="/img/doc-hieu.jpg" width="1280" height="800" alt="Màn hình luyện đọc của English Fun: đoạn văn tiếng Anh bên trái, bảng tra và lưu từ mới bên phải" fetchpriority="high" />
          </figure>
        </div>
      </section>

      <section class="wrap section">
        <h2 class="section-title">Mọi thứ bạn cần để tự học mỗi ngày</h2>
        <div class="grid-3">
          ${features
            .map(
              (f) => `<article class="card feature">
            <span class="feature-icon">${icon(f.ic, 22)}</span>
            <h3>${f.title}</h3>
            <p>${f.text}</p>
          </article>`,
            )
            .join('\n          ')}
        </div>
      </section>

      <section class="wrap section split-media">
        <figure class="shot"><img src="/img/viet-dich.jpg" width="1280" height="800" loading="lazy" alt="Màn hình luyện viết: đoạn tiếng Việt cần dịch, ô viết bài và danh sách từ cần dùng" /></figure>
        <div>
          <h2 class="section-title left">Học thế nào?</h2>
          <ol class="steps">
            ${steps.map(([t, d]) => `<li><strong>${t}</strong><span>${d}</span></li>`).join('\n            ')}
          </ol>
          <a class="btn primary" href="${TRY_URL}">Thử một bài đọc</a>
        </div>
      </section>

      <section class="wrap section">
        <h2 class="section-title">Từ vựng tiếng Anh theo chủ đề</h2>
        <p class="section-lead">Mỗi chủ đề có danh sách từ mẫu kèm phiên âm, câu ví dụ và một đoạn đọc có bản dịch.</p>
        <div class="topic-grid">
          ${TOPIC_PAGES.map(
            (t) => `<a class="card topic-card" href="${topicPath(t)}">
            <span class="topic-icon">${topicIcon(t.id)}</span>
            <span class="topic-name">${t.name}</span>
            <span class="muted small">${t.words.length} từ mẫu</span>
          </a>`,
          ).join('\n          ')}
        </div>
      </section>

      <section class="wrap section">
        <h2 class="section-title">Bài viết mới</h2>
        <div class="grid-2">
          ${POSTS.slice(0, 4).map(postCard).join('\n          ')}
        </div>
      </section>

      <section class="wrap section narrow">
        <h2 class="section-title">Câu hỏi thường gặp</h2>
        <div class="faq">
          ${FAQ.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join('\n          ')}
        </div>
      </section>

      <div class="wrap section">
        ${cta('Bắt đầu bài đọc đầu tiên', 'Không cần tài khoản. Chọn chủ đề, đọc và lưu từ mới chỉ trong vài phút.')}
      </div>`
  return page(
    {
      path: '/',
      title: 'English Fun: Luyện đọc, viết tiếng Anh và học từ vựng theo chủ đề',
      description:
        'Học tiếng Anh cho người lớn: luyện đọc hiểu, luyện viết bằng cách dịch Việt sang Anh, tra nghĩa và lưu từ mới vào kho từ để ôn lại. Dùng thử miễn phí, không cần đăng ký.',
      schema,
    },
    body,
  )
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
            (t) => `<a class="card topic-row" href="${topicPath(t)}">
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

      <section class="wrap section">
        <h2 class="section-title left">Chủ đề khác</h2>
        <div class="topic-grid">
          ${others
            .map(
              (o) => `<a class="card topic-card" href="${topicPath(o)}">
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
  const urls = [
    { path: '/', priority: '1.0' },
    { path: '/chu-de', priority: '0.8' },
    ...TOPIC_PAGES.map((t) => ({ path: topicPath(t), priority: '0.8' })),
    { path: '/blog', priority: '0.6' },
    ...POSTS.map((p) => ({ path: postPath(p), priority: '0.6', lastmod: p.date })),
  ]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${SITE}${u.path}</loc>
    <lastmod>${'lastmod' in u ? u.lastmod : today}</lastmod>
    <priority>${u.priority}</priority>
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
    'index.html': home(),
    'chu-de.html': topicsIndex(),
    'blog.html': blogIndex(),
    '404.html': notFound(),
    'robots.txt': ROBOTS,
    'sitemap.xml': sitemap(today),
  }
  for (const t of TOPIC_PAGES) files[`chu-de/${t.slug}.html`] = topicPage(t)
  for (const p of POSTS) files[`blog/${p.slug}.html`] = postPage(p)
  return files
}
