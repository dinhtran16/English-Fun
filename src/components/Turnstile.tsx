import { useEffect, useRef } from 'react'

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

const SCRIPT = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
let loading: Promise<TurnstileApi> | null = null

function loadTurnstile(): Promise<TurnstileApi> {
  if (window.turnstile) return Promise.resolve(window.turnstile)
  loading ??= new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = SCRIPT
    s.async = true
    s.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile')))
    s.onerror = () => {
      loading = null
      reject(new Error('turnstile'))
    }
    document.head.appendChild(s)
  })
  return loading
}

/** Cloudflare's "are you human" check. Calls onToken with a token, or '' when it expires. */
export function Turnstile({ siteKey, onToken, resetKey }: { siteKey: string; onToken: (t: string) => void; resetKey: number }) {
  const box = useRef<HTMLDivElement>(null)
  const cb = useRef(onToken)
  useEffect(() => {
    cb.current = onToken
  })

  useEffect(() => {
    let id: string | undefined
    let cancelled = false
    loadTurnstile()
      .then((t) => {
        if (cancelled || !box.current) return
        id = t.render(box.current, {
          sitekey: siteKey,
          language: 'vi',
          callback: (token: string) => cb.current(token),
          'expired-callback': () => cb.current(''),
          'error-callback': () => cb.current(''),
        })
      })
      .catch(() => cb.current(''))
    return () => {
      cancelled = true
      if (id) window.turnstile?.remove(id)
    }
  }, [siteKey, resetKey])

  return <div ref={box} className="turnstile" />
}
