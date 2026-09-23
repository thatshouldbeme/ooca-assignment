import { useState, type DragEvent, type FormEvent } from 'react'
import lightningIcon from '../assets/icons/electric_bolt.svg'
import moonIcon from '../assets/icons/moon.svg'
import mindfullLogo from '../assets/ooca/mindfull-logo.svg'
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

type DraggedItemInfo = {
  text: string
  sourceZone: ZoneId
}

export default function Sort({
  initialThoughts = DEFAULT_THOUGHTS,
  onContinue,
}: SortProps) {
  const [pool, setPool] = useState<string[]>(initialThoughts)
  const [actionable, setActionable] = useState<string[]>([])
  const [nonActionable, setNonActionable] = useState<string[]>([])
  const [draggedItem, setDraggedItem] = useState<DraggedItemInfo | null>(null)
  const [dragOverZone, setDragOverZone] = useState<ZoneId | null>(null)
  const [selectedItem, setSelectedItem] = useState<{ text: string; zone: ZoneId } | null>(null)

  const moveItem = (itemText: string, fromZone: ZoneId, toZone: ZoneId) => {
    if (fromZone === toZone) return

    // Remove from source
    if (fromZone === 'pool') {
      setPool((prev) => prev.filter((item) => item !== itemText))
    } else if (fromZone === 'actionable') {
      setActionable((prev) => prev.filter((item) => item !== itemText))
    } else if (fromZone === 'nonActionable') {
      setNonActionable((prev) => prev.filter((item) => item !== itemText))
    }

    // Add to target
    if (toZone === 'pool') {
      setPool((prev) => [...prev, itemText])
    } else if (toZone === 'actionable') {
      setActionable((prev) => [...prev, itemText])
    } else if (toZone === 'nonActionable') {
      setNonActionable((prev) => [...prev, itemText])
    }

    setSelectedItem(null)
  }

  const handleDragStart = (e: DragEvent<HTMLDivElement>, text: string, sourceZone: ZoneId) => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ text, sourceZone }))
    e.dataTransfer.effectAllowed = 'move'
    setDraggedItem({ text, sourceZone })
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
    try {
      const dataStr = e.dataTransfer.getData('text/plain')
      if (dataStr) {
        const { text, sourceZone } = JSON.parse(dataStr) as DraggedItemInfo
        moveItem(text, sourceZone, targetZone)
      } else if (draggedItem) {
        moveItem(draggedItem.text, draggedItem.sourceZone, targetZone)
      }
    } catch {
      if (draggedItem) {
        moveItem(draggedItem.text, draggedItem.sourceZone, targetZone)
      }
    }
    setDraggedItem(null)
  }

  const handleCardClick = (text: string, zone: ZoneId) => {
    if (selectedItem && selectedItem.text === text) {
      setSelectedItem(null)
    } else {
      setSelectedItem({ text, zone })
    }
  }

  const handleZoneClick = (targetZone: ZoneId) => {
    if (selectedItem && selectedItem.zone !== targetZone) {
      moveItem(selectedItem.text, selectedItem.zone, targetZone)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (pool.length === 0 && onContinue) {
      onContinue({ actionable, nonActionable })
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
            {pool.map((item) => (
              <div
                key={item}
                className={`sort__thought-card ${
                  selectedItem?.text === item ? 'sort__thought-card--selected' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, item, 'pool')}
                onDragEnd={handleDragEnd}
                onClick={() => handleCardClick(item, 'pool')}
                tabIndex={0}
                role="button"
                aria-label={`Unsorted thought: ${item}. Drag to a category or click to select.`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleCardClick(item, 'pool')
                  }
                }}
              >
                {item}
              </div>
            ))}
          </section>
        )}

        <div className="sort__instructions">
          <p>Drag each thought to where it fits best.</p>
          <p>There’s no right or wrong answer.</p>
        </div>

        <section className="sort__drop-zones" aria-label="Drop categories">
          {/* Actionable Zone */}
          <div
            className={`sort__drop-zone ${
              actionable.length === 0
                ? 'sort__drop-zone--empty'
                : 'sort__drop-zone--populated'
            } ${dragOverZone === 'actionable' ? 'sort__drop-zone--drag-over' : ''} ${
              selectedItem && selectedItem.zone !== 'actionable'
                ? 'sort__drop-zone--selectable'
                : ''
            }`}
            onDragOver={(e) => handleDragOver(e, 'actionable')}
            onDragLeave={(e) => handleDragLeave(e, 'actionable')}
            onDrop={(e) => handleDrop(e, 'actionable')}
            onClick={() => handleZoneClick('actionable')}
            role="region"
            aria-label="Category: I can do something about it"
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
                    key={item}
                    className="sort__sorted-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, 'actionable')}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick(item, 'actionable')
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Sorted thought: ${item}. Drag to another category or pool.`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleCardClick(item, 'actionable')
                      }
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>

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
                    key={item}
                    className="sort__sorted-card"
                    draggable
                    onDragStart={(e) => handleDragStart(e, item, 'nonActionable')}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCardClick(item, 'nonActionable')
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Sorted thought: ${item}. Drag to another category or pool.`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleCardClick(item, 'nonActionable')
                      }
                    }}
                  >
                    {item}
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
          <img
            className="sort__logo"
            src={mindfullLogo}
            width="107.852"
            height="21"
            alt="mindfull"
          />
        </div>
      </form>
    </main>
  )
}
