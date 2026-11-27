/** Icon of each topic, shared by the app (components/icons.tsx) and the public pages (site/build.ts). */
import {
  Briefcase,
  Clapperboard,
  Cpu,
  GraduationCap,
  HeartPulse,
  House,
  Leaf,
  Plane,
  ShoppingBag,
  Tag,
  Trophy,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from 'lucide-react'
import { TOPICS } from './data/passages.ts'

export const TOPIC_ICONS: Record<string, LucideIcon> = {
  work: Briefcase,
  travel: Plane,
  technology: Cpu,
  health: HeartPulse,
  daily: House,
  education: GraduationCap,
  food: UtensilsCrossed,
  shopping: ShoppingBag,
  family: Users,
  sports: Trophy,
  entertainment: Clapperboard,
  environment: Leaf,
}

export const topicIconFor = (id: string): LucideIcon => TOPIC_ICONS[id] ?? Tag

/** CSS class that sets `--tone` to the topic's accent color (defined in index.css and site.css). */
export const toneClass = (id: string) => `tone-${TOPICS.find((t) => t.id === id)?.tone ?? 'slate'}`
