// Share buttons on the public pages (markup from site/layout.ts). The share links work
// without this script; it adds "Copy link", the phone's share sheet and the nav popover.
;(function () {
  var canNative = typeof navigator.share === 'function'
  var coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches

  function nativeShare(box) {
    return navigator.share({ title: document.title, text: box.dataset.text, url: box.dataset.url }).catch(function () {})
  }

  function copy(btn, url) {
    var label = btn.querySelector('[data-label]')
    var done = function () {
      var old = label.textContent
      label.textContent = 'Đã sao chép'
      btn.classList.add('done')
      setTimeout(function () {
        label.textContent = old
        btn.classList.remove('done')
      }, 2000)
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function () {
        window.prompt('Sao chép link', url)
      })
    } else {
      window.prompt('Sao chép link', url)
    }
  }

  document.querySelectorAll('[data-share]').forEach(function (box) {
    var c = box.querySelector('[data-share-copy]')
    var n = box.querySelector('[data-share-native]')
    c.hidden = false
    c.addEventListener('click', function () {
      copy(c, box.dataset.url)
    })
    if (canNative) {
      n.hidden = false
      n.addEventListener('click', function () {
        nativeShare(box)
      })
    }
  })

  var open = document.querySelector('[data-share-open]')
  var pop = document.getElementById('share-pop')
  if (!open || !pop) return
  var setOpen = function (v) {
    pop.hidden = !v
    open.setAttribute('aria-expanded', String(v))
  }
  open.addEventListener('click', function () {
    var box = pop.querySelector('[data-share]')
    if (canNative && coarse) return void nativeShare(box)
    setOpen(pop.hidden)
  })
  document.addEventListener('pointerdown', function (e) {
    if (!pop.hidden && !pop.parentNode.contains(e.target)) setOpen(false)
  })
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false)
  })
})()
