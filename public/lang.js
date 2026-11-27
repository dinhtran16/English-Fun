// Language menu on the public pages (markup from site/layout.ts). The menu works without this
// script; it closes the menu on outside clicks, remembers the language a visitor picks, and on a
// home page offers the visitor's own language (from the browser) when the page is in another one.
// It never redirects, so search engines and people who chose a language see the page they asked for.
;(function () {
  var KEY = 'english-fun:site-lang'
  var get = function () {
    try {
      return localStorage.getItem(KEY)
    } catch {
      return null
    }
  }
  var set = function (v) {
    try {
      localStorage.setItem(KEY, v)
    } catch {
      // ignore
    }
  }

  var menu = document.querySelector('[data-lang-menu]')
  if (!menu) return
  var links = Array.prototype.slice.call(menu.querySelectorAll('a[data-lang]'))
  var current = (menu.querySelector('a[aria-current]') || {}).dataset
  current = current ? current.lang : null

  document.querySelectorAll('a[data-lang]').forEach(function (a) {
    a.addEventListener('click', function () {
      set(a.dataset.lang)
    })
  })
  document.addEventListener('pointerdown', function (e) {
    if (menu.open && !menu.contains(e.target)) menu.open = false
  })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') menu.open = false
  })

  if (!document.documentElement.hasAttribute('data-home')) return
  // Someone who already picked a language (here or by dismissing the bar) is not asked again.
  if (get()) return
  var codes = links.map(function (a) {
    return a.dataset.lang
  })
  var wanted = null
  var prefs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']
  for (var i = 0; i < prefs.length && !wanted; i++) {
    var base = String(prefs[i]).toLowerCase().split('-')[0]
    if (codes.indexOf(base) !== -1) wanted = base
  }
  if (!wanted || wanted === current) return
  var target = links[codes.indexOf(wanted)]
  var bar = document.querySelector('[data-lang-suggest]')
  var link = bar && bar.querySelector('[data-lang-suggest-link]')
  if (!bar || !link) return
  link.href = target.getAttribute('href')
  link.textContent = target.dataset.suggest
  link.lang = target.lang
  link.addEventListener('click', function () {
    set(wanted)
  })
  bar.querySelector('[data-lang-suggest-close]').addEventListener('click', function () {
    set(current || 'vi')
    bar.hidden = true
  })
  bar.hidden = false
})()
