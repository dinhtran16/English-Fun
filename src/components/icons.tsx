import { Briefcase, Cpu, HeartPulse, House, Plane, Tag, type LucideIcon } from 'lucide-react'

const TOPIC_ICONS: Record<string, LucideIcon> = {
  work: Briefcase,
  travel: Plane,
  technology: Cpu,
  health: HeartPulse,
  daily: House,
}

export function TopicIcon({ id, size = 20 }: { id: string; size?: number }) {
  const Icon = TOPIC_ICONS[id] ?? Tag
  return <Icon size={size} strokeWidth={1.8} />
}

export function LogoMark() {
  return <span className="logo-mark">E</span>
}
