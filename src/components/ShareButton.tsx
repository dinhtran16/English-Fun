import { useEffect, useRef, useState } from 'react'
import { Check, Link2, Mail, MessageCircle, MoreHorizontal, Send, Share2 } from 'lucide-react'
import { useI18n } from '../i18n'
import { shareTargets, type ShareTarget } from '../share'

/** Phones and tablets: the system share sheet is what people expect there. */
const prefersNativeShare = () =>
  typeof navigator.share === 'function' && window.matchMedia('(pointer: coarse)').matches

export function ShareGlyph({ id }: { id: ShareTarget['id'] }) {
  if (id === 'facebook') return <span className="share-glyph" aria-hidden>f</span>
  if (id === 'x') return <span className="share-glyph" aria-hidden>X</span>
  const Icon = id === 'whatsapp' ? MessageCircle : id === 'telegram' ? Send : Mail
  return <Icon size={15} aria-hidden />
}

/** Top-bar button that shares the English Fun home page. */
export function ShareButton() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const url = `${window.location.origin}/`
  const text = t.share.text

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const nativeShare = () => navigator.share({ title: 'English Fun', text, url }).catch(() => {})

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      window.prompt(t.share.copy, url)
      return
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="share" ref={box}>
      <button
        className="small share-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        title={t.share.title}
        onClick={() => (prefersNativeShare() ? nativeShare() : setOpen((o) => !o))}
      >
        <Share2 size={15} /> <span className="share-label">{t.share.button}</span>
      </button>
      {open && (
        <div className="share-pop card" role="dialog" aria-label={t.share.title}>
          <p className="share-title">{t.share.title}</p>
          <p className="muted small">{t.share.hint}</p>
          <div className="share-link">
            <input readOnly value={url} aria-label={t.share.link} onFocus={(e) => e.target.select()} />
            <button className={copied ? 'primary small' : 'small'} onClick={copy}>
              {copied ? <Check size={15} /> : <Link2 size={15} />} {copied ? t.share.copied : t.share.copy}
            </button>
          </div>
          <div className="share-targets">
            {shareTargets(url, text, t.share.email).map((s) => (
              <a key={s.id} className={`share-target ${s.id}`} href={s.href} target={s.id === 'email' ? undefined : '_blank'} rel="noopener noreferrer" onClick={() => setOpen(false)}>
                <span className="share-badge"><ShareGlyph id={s.id} /></span>
                {s.label}
              </a>
            ))}
            {typeof navigator.share === 'function' && (
              <button className="share-target more" onClick={nativeShare}>
                <span className="share-badge"><MoreHorizontal size={15} aria-hidden /></span>
                {t.share.more}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
