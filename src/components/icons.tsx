import { Tag } from 'lucide-react'
import { TOPIC_ICONS, toneClass } from '../topicIcons'

/** The topic's icon. With `tinted`, it is drawn in the topic's own accent color. */
export function TopicIcon({ id, size = 20, tinted = false }: { id: string; size?: number; tinted?: boolean }) {
  const Icon = TOPIC_ICONS[id] ?? Tag
  return <Icon size={size} strokeWidth={1.8} className={tinted ? `topic-glyph ${toneClass(id)}` : undefined} />
}

export function LogoMark() {
  return <span className="logo-mark">E</span>
}
