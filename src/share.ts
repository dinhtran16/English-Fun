/**
 * Where a page can be shared to, used by the app's Share button and by the public pages
 * (site/layout.ts). Each target is a plain link that opens the network's own share dialog.
 * On phones the system share sheet (navigator.share) is offered first, which also covers
 * Zalo, Messenger, LINE, KakaoTalk and the rest.
 */
export interface ShareTarget {
  id: 'facebook' | 'x' | 'whatsapp' | 'telegram' | 'email'
  label: string
  href: string
}

export function shareTargets(url: string, text: string, emailLabel = 'Email'): ShareTarget[] {
  const u = encodeURIComponent(url)
  const tx = encodeURIComponent(text)
  return [
    { id: 'facebook', label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}` },
    { id: 'x', label: 'X', href: `https://x.com/intent/post?text=${tx}&url=${u}` },
    { id: 'whatsapp', label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}` },
    { id: 'telegram', label: 'Telegram', href: `https://t.me/share/url?url=${u}&text=${tx}` },
    { id: 'email', label: emailLabel, href: `mailto:?subject=${encodeURIComponent('English Fun')}&body=${encodeURIComponent(`${text}\n\n${url}`)}` },
  ]
}
