import { useState, type DragEvent, type FormEvent, type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import lightningIcon from '../assets/icons/electric_bolt.svg'
import moonIcon from '../assets/icons/moon.svg'
import './Sort.css'

export type SortProps = {
  initialThoughts?: string[]
  onContinue?: (sorted: { actionable: string[]; nonActionable: string[] }) => void
}

const DEFAULT_THOUGHTS = [
  'I’m not sure my work is good enough',
  'I still have a lot to finish',
  'My partner doesn’t like me',
]

type ZoneId = 'pool' | 'actionable' | 'nonActionable'

type SortItem = { id: string; text: string }

type DraggedItemInfo = {
  id: string
  sourceZone: ZoneId
}

export default function Sort({
  initialThoughts = DEFAULT_THOUGHTS,
  onContinue,
}: SortProps) {
  const [pool, setPool] = useState<SortItem[]>(() => initialThoughts.map((text, index) => ({ id: `thought-${index}`, text })))
  const [actionable, setActionable] = useState<SortItem[]>([])
  const [nonActionable, setNonActionable] = useState<SortItem[]>([])
  const [draggedItem, setDraggedItem] = useState<DraggedItemInfo | null>(null)
  const [dragOverZone, setDragOverZone] = useState<ZoneId | null>(null)
  const [selectedItem, setSelectedItem] = useState<{ id: string; zone: ZoneId } | null>(null)
  const [hasInteracted, setHasInteracted] = useState(false)

  const shouldReduceMotion = useReducedMotion()

  const moveItem = (itemId: string, fromZone: ZoneId, toZone: ZoneId) => {
    setHasInteracted(true)
    if (fromZone === toZone) return
    const source = { pool, actionable, nonActionable }[fromZone]
    const movingItem = source?.find((item) => item.id === itemId)
    if (!movingItem) return

    // Remove from source
    if (fromZone === 'pool') {
      setPool((prev) => prev.filter((item) => item.id !== itemId))
    } else if (fromZone === 'actionable') {
      setActionable((prev) => prev.filter((item) => item.id !== itemId))
    } else if (fromZone === 'nonActionable') {
      setNonActionable((prev) => prev.filter((item) => item.id !== itemId))
    }

    // Add to target
    if (toZone === 'pool') {
      setPool((prev) => [...prev, movingItem])
    } else if (toZone === 'actionable') {
      setActionable((prev) => [...prev, movingItem])
    } else if (toZone === 'nonActionable') {
      setNonActionable((prev) => [...prev, movingItem])
    }

    setSelectedItem(null)
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>, id: string, sourceZone: ZoneId) => {
    setHasInteracted(true)
    e.dataTransfer.setData('text/plain', JSON.stringify({ id, sourceZone }))
    e.dataTransfer.effectAllowed = 'move'
    setDraggedItem({ id, sourceZone })
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverZone(null)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>, targetZone: ZoneId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragOverZone !== targetZone) {
      setDragOverZone(targetZone)
    }
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>, targetZone: ZoneId) => {
    e.preventDefault()
    if (dragOverZone === targetZone) {
      setDragOverZone(null)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>, targetZone: ZoneId) => {
    e.preventDefault()
    setDragOverZone(null)
    // Only move a card that originated in this sorter.
    if (draggedItem) {
      moveItem(draggedItem.id, draggedItem.sourceZone, targetZone)
    }
    setDraggedItem(null)
  }

  const handleCardClick = (id: string, zone: ZoneId) => {
    setHasInteracted(true)
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem(null)
    } else {
      setSelectedItem({ id, zone })
    }
  }

  const handleZoneClick = (targetZone: ZoneId) => {
    setHasInteracted(true)
    if (selectedItem && selectedItem.zone !== targetZone) {
      moveItem(selectedItem.id, selectedItem.zone, targetZone)
    }
  }

  const handleZoneKeyDown = (event: KeyboardEvent<HTMLDivElement>, zone: ZoneId) => {
    // Ignore bubbled keystrokes from cards inside a zone.
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleZoneClick(zone)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (pool.length === 0 && onContinue) {
      onContinue({ actionable: actionable.map((item) => item.text), nonActionable: nonActionable.map((item) => item.text) })
    }
  }

  const isAllSorted = pool.length === 0

  return (
    <main className="sort" aria-labelledby="sort-title">
      <form className="sort__form" onSubmit={handleSubmit}>
        <header className="sort__header">
          <h1 id="sort-title" className="sort__title">
            Let’s sort through it
          </h1>
        </header>

        {pool.length > 0 && (
          <section className="sort__pool" aria-label="Unsorted thoughts">
            {pool.map((item, index) => (
              <motion.div
                key={item.id}
                className={`sort__thought-card ${
                  selectedItem?.id === item.id ? 'sort__thought-card--selected' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e as unknown as DragEvent<HTMLDivElement>, item.id, 'pool')}
                onDragEnd={handleDragEnd}
                onClick={() => handleCardClick(item.id, 'pool')}
                tabIndex={0}
                role="button"
                aria-pressed={selectedItem?.id === item.id}
                aria-describedby="sort-keyboard-help"
                aria-label={`Unsorted thought: ${item.text}. Drag to a category or click to select.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCardClick(item.id, 'pool')
                  }
                }}
                animate={
                  !hasInteracted && !shouldReduceMotion && index === 0
                    ? { y: [0, 11, 0] }
                    : { y: 0 }
                }
                transition={
                  !hasInteracted && !shouldReduceMotion && index === 0
                    ? { delay: 0.4, duration: 0.5, ease: 'easeInOut' }
                    : undefined
                }
              >
                {item.text}
              </motion.div>
            ))}
          </section>
        )}

        <div className="sort__instructions">
          <p>Drag each thought to the option that feels right.</p>
        </div>

        <p id="sort-keyboard-help" className="sort__sr-only">
          Use Enter or Space to select a thought. Tab to a category and press Enter or Space to move it.
        </p>
        <section className="sort__drop-zones" aria-label="Drop categories">
          {/* Actionable Zone */}
          <motion.div
            className={`sort__drop-zone ${
              actionable.length === 0
                ? 'sort__drop-zone--empty'
                : 'sort__drop-zone--populated'
            } ${dragOverZone === 'actionable' ? 'sort__drop-zone--drag-over' : ''} ${
              selectedItem && selectedItem.zone !== 'actionable'
                ? 'sort__drop-zone--selectable'
                : ''
            }`}
            onDragOver={(e) => handleDragOver(e as unknown as DragEvent<HTMLDivElement>, 'actionable')}
            onDragLeave={(e) => handleDragLeave(e as unknown as DragEvent<HTMLDivElement>, 'actionable')}
            onDrop={(e) => handleDrop(e as unknown as DragEvent<HTMLDivElement>, 'actionable')}
            onClick={() => handleZoneClick('actionable')}
            tabIndex={0}
            aria-describedby="sort-keyboard-help"
            onKeyDown={(event) => handleZoneKeyDown(event, 'actionable')}
            role="region"
            aria-label="Category: I can do something about it"
            animate={
              !hasInteracted && !shouldReduceMotion && pool.length > 0
                ? {
                    boxShadow: [
                      '0 0 0 0px rgba(0, 196, 179, 0)',
                      '0 0 0 6px rgba(0, 196, 179, 0.25)',
                      '0 0 0 0px rgba(0, 196, 179, 0)',
                    ],
                  }
                : undefined
            }
            transition={
              !hasInteracted && !shouldReduceMotion && pool.length > 0
                ? { delay: 0.4, duration: 0.5, ease: 'easeInOut' }
                : undefined
            }
          >
            <div className="sort__zone-header">
              <div className="sort__zone-title-row">
                <img
                  className="sort__zone-icon"
                  src={lightningIcon}
                  width="24"
                  height="24"
                  alt=""
                  aria-hidden="true"
                />
                <h2 className="sort__zone-title">I can do something about it</h2>
              </div>
              <p className="sort__zone-subtitle">
                My actions can help change or improve this.
              </p>
            </div>

            {actionable.length > 0 && (
              <div className="sort__sorted-list">
                {actionable.map((item) => (
                  <div
                    key={item.id}
                    className={`sort__sorted-card ${selectedItem?.id === item.id ? 'sort__thought-card--selected' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id, 'actionable')}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick(item.id, 'actionable')
                    }}
                    role="button"
                    aria-pressed={selectedItem?.id === item.id}
                    aria-describedby="sort-keyboard-help"
                    tabIndex={0}
                    aria-label={`Sorted thought: ${item.text}. Drag to another category or select to move.`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleCardClick(item.id, 'actionable')
                      }
                    }}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Non-Actionable Zone */}
          <div
            className={`sort__drop-zone ${
              nonActionable.length === 0
                ? 'sort__drop-zone--empty'
                : 'sort__drop-zone--populated'
            } ${dragOverZone === 'nonActionable' ? 'sort__drop-zone--drag-over' : ''} ${
              selectedItem && selectedItem.zone !== 'nonActionable'
                ? 'sort__drop-zone--selectable'
                : ''
            }`}
            onDragOver={(e) => handleDragOver(e, 'nonActionable')}
            onDragLeave={(e) => handleDragLeave(e, 'nonActionable')}
            onDrop={(e) => handleDrop(e, 'nonActionable')}
            onClick={() => handleZoneClick('nonActionable')}
            tabIndex={0}
            aria-describedby="sort-keyboard-help"
            onKeyDown={(event) => handleZoneKeyDown(event, 'nonActionable')}
            role="region"
            aria-label="Category: I can’t change this right now"
          >
            <div className="sort__zone-header">
              <div className="sort__zone-title-row">
                <img
                  className="sort__zone-icon"
                  src={moonIcon}
                  width="24"
                  height="24"
                  alt=""
                  aria-hidden="true"
                />
                <h2 className="sort__zone-title">I can’t change this right now</h2>
              </div>
              <p className="sort__zone-subtitle">
                It depends on other people, the past, or things I can’t change.
              </p>
            </div>

            {nonActionable.length > 0 && (
              <div className="sort__sorted-list">
                {nonActionable.map((item) => (
                  <div
                    key={item.id}
                    className={`sort__sorted-card ${selectedItem?.id === item.id ? 'sort__thought-card--selected' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item.id, 'nonActionable')}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick(item.id, 'nonActionable')
                    }}
                    role="button"
                    aria-pressed={selectedItem?.id === item.id}
                    aria-describedby="sort-keyboard-help"
                    tabIndex={0}
                    aria-label={`Sorted thought: ${item.text}. Drag to another category or select to move.`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleCardClick(item.id, 'nonActionable')
                      }
                    }}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <div className="sort__actions">
          <button
            className="sort__continue"
            type="submit"
            disabled={!isAllSorted}
          >
            Continue
          </button>
        </div>
      </form>
    </main>
  )
}
