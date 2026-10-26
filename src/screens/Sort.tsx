import { useState, type DragEvent, type FormEvent, type KeyboardEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { ThoughtGroups } from '../flow'
import BackButton from '../components/BackButton'
import lightningIcon from '../assets/icons/electric_bolt.svg'
import moonIcon from '../assets/icons/moon.svg'
import './Sort.css'

export type SortProps = {
  groups: ThoughtGroups
  onChange: (groups: ThoughtGroups) => void
  onContinue: () => void
  onBack: () => void
}

type ZoneId = 'pool' | 'actionable' | 'nonActionable'


type DraggedItemInfo = {
  id: string
  sourceZone: ZoneId
}

export default function Sort({ groups, onChange, onContinue, onBack }: SortProps) {
  const { pool, actionable, nonActionable } = groups
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

    onChange({
      ...groups,
      [fromZone]: groups[fromZone].filter((item) => item.id !== itemId),
      [toZone]: [...groups[toZone], movingItem],
    })

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
      onContinue()
    }
  }

  const isAllSorted = pool.length === 0

  return (
    <main className="sort" aria-labelledby="sort-title">
      <form className="sort__form" onSubmit={handleSubmit}>
        <BackButton onBack={onBack} />
        <header className="sort__header">
          <h1 id="sort-title" className="sort__title">
            ค่อย ๆ แยกทีละเรื่องกันนะ
          </h1>
        </header>

        {pool.length > 0 && (
          <section className="sort__pool" aria-label="เรื่องที่ยังไม่ได้แยกหมวด">
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
                aria-label={`เรื่องที่ยังไม่ได้แยกหมวด: ${item.text} ลากไปที่หมวด หรือแตะเพื่อเลือก`}
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
          <p>ลากแต่ละเรื่องไปที่หมวดที่รู้สึกว่าใช่ หรือแตะเลือกเรื่อง แล้วแตะหมวดก็ได้นะ</p>
        </div>

        <p id="sort-keyboard-help" className="sort__sr-only">
          กด Enter หรือ Space เพื่อเลือกเรื่อง กด Tab ไปที่หมวด แล้วกด Enter หรือ Space อีกครั้งเพื่อย้าย
        </p>
        <section className="sort__drop-zones" aria-label="หมวดสำหรับแยกเรื่องในใจ">
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
            aria-label="หมวด: เรื่องนี้เราพอทำอะไรได้"
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
                <h2 className="sort__zone-title">เรื่องนี้เราพอทำอะไรได้</h2>
              </div>
              <p className="sort__zone-subtitle">
                มีบางอย่างที่เราลองทำ เพื่อให้เรื่องนี้ดีขึ้นได้
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
                    aria-label={`เรื่องที่แยกหมวดแล้ว: ${item.text} ลากไปหมวดอื่น หรือแตะเพื่อย้าย`}
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
            aria-label="หมวด: เรื่องนี้ยังอยู่นอกมือเรา"
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
                <h2 className="sort__zone-title">เรื่องนี้ยังอยู่นอกมือเรา</h2>
              </div>
              <p className="sort__zone-subtitle">
                อาจขึ้นอยู่กับคนอื่น เป็นเรื่องที่ผ่านมาแล้ว หรือยังเปลี่ยนไม่ได้ในตอนนี้
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
                    aria-label={`เรื่องที่แยกหมวดแล้ว: ${item.text} ลากไปหมวดอื่น หรือแตะเพื่อย้าย`}
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
            ไปต่อ
          </button>
        </div>
      </form>
    </main>
  )
}
