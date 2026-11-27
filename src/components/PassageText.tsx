import { useI18n } from '../i18n'
import { normalizeWord } from '../storage'

interface Props {
  text: string
  isKnown: (word: string) => boolean
  isTarget?: (word: string) => boolean
  onPick: (word: string) => void
}

/** Renders a passage where each word can be dragged to the word panel, or tapped to add it. */
export function PassageText({ text, isKnown, isTarget, onPick }: Props) {
  const { t } = useI18n()
  const tokens = text.split(/(\s+)/)
  return (
    <p className="passage">
      {tokens.map((tok, i) => {
        const word = normalizeWord(tok)
        if (!word) return <span key={i}>{tok}</span>
        const cls = ['word']
        if (isTarget?.(word)) cls.push('target')
        else if (isKnown(word)) cls.push('known')
        return (
          <span
            key={i}
            className={cls.join(' ')}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', word)
              e.dataTransfer.effectAllowed = 'copy'
            }}
            onClick={() => onPick(word)}
            title={t.panel.dragTitle}
          >
            {tok}
          </span>
        )
      })}
    </p>
  )
}
