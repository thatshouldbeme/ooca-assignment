import { useState, type FormEvent, type KeyboardEvent } from 'react'
import type { ThoughtItem } from '../flow'
import BackButton from '../components/BackButton'
import addIcon from '../assets/icons/add.svg'
import removeIcon from '../assets/icons/remove.svg'
import './Thought.css'

export type ThoughtProps = {
  thoughts: ThoughtItem[]
  currentInput: string
  onThoughtsChange: (thoughts: ThoughtItem[]) => void
  onInputChange: (value: string) => void
  onContinue: () => void
  onBack: () => void
}

const MAX_THOUGHTS = 3

export default function Thought({ thoughts, currentInput, onThoughtsChange, onInputChange, onContinue, onBack }: ThoughtProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const setCurrentInput = onInputChange

  const handleAddThought = () => {
    const trimmed = currentInput.trim()
    if (!trimmed || thoughts.length >= MAX_THOUGHTS) return
    onThoughtsChange([...thoughts, { id: crypto.randomUUID(), text: trimmed }])
    setCurrentInput('')
  }

  const handleRemoveThought = (id: string) => {
    onThoughtsChange(thoughts.filter((item) => item.id !== id))
    if (editingId === id) setEditingId(null)
  }

  const saveEdit = () => {
    if (!editText.trim()) return
    onThoughtsChange(thoughts.map((item) => item.id === editingId ? { ...item, text: editText.trim() } : item))
    setEditingId(null)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault()
      handleAddThought()
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (editingId) { saveEdit(); return }
    if (currentInput.trim() && thoughts.length < MAX_THOUGHTS) handleAddThought()
    if (thoughts.length > 0 || currentInput.trim()) onContinue()
  }

  return (
    <main className="thought" aria-labelledby="thought-title">
      <form className="thought__form" onSubmit={handleSubmit}>
        <BackButton onBack={() => {
          if (editingId && editText.trim()) saveEdit()
          onBack()
        }} />
        <header className="thought__header">
          <h1 id="thought-title" className="thought__title">
            มีเรื่องอะไรอยู่ในใจบ้าง?
          </h1>
          <p className="thought__subtitle">
            ลองเขียนเรื่องที่ทำให้เหนื่อยใจลงมา สัก 1–3 เรื่องก็พอนะ
          </p>
        </header>

        <section className="thought__content" aria-label="เรื่องที่อยู่ในใจ">
          {thoughts.length > 0 && (
            <p className="thought__counter" aria-live="polite">
              เพิ่มแล้ว {thoughts.length}/{MAX_THOUGHTS} เรื่อง
            </p>
          )}

          <div className="thought__list">
            {thoughts.map((item) => (
              <div key={item.id} className="thought__editable-row">
                {editingId === item.id ? (
                  <>
                    <input autoFocus className="thought__input" aria-label="แก้ไขเรื่องที่อยู่ในใจ" value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' && !event.nativeEvent.isComposing) { event.preventDefault(); saveEdit() }
                        if (event.key === 'Escape') setEditingId(null)
                      }} />
                    <div className="thought__edit-actions">
                      <button type="button" className="flow__text-button" disabled={!editText.trim()} onClick={saveEdit}>บันทึก</button>
                      <button type="button" className="flow__text-button" onClick={() => setEditingId(null)}>ยกเลิก</button>
                    </div>
                  </>
                ) : (
                  <div className="thought__row">
                    <button type="button" className="thought__card thought__card--editable" aria-label={`แก้ไขเรื่อง: ${item.text}`}
                      onClick={() => { setEditingId(item.id); setEditText(item.text) }}>
                      <span className="thought__card-text">{item.text}</span>
                    </button>
                    <button type="button" className="thought__action-btn thought__action-btn--remove"
                      onClick={() => handleRemoveThought(item.id)} aria-label={`ลบเรื่องนี้: ${item.text}`}>
                      <img src={removeIcon} width="40" height="40" alt="" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {thoughts.length < MAX_THOUGHTS && (
              <div className="thought__row">
                <input
                  className="thought__input"
                  type="text"
                  placeholder="ลองพิมพ์เรื่องที่อยู่ในใจ..."
                  aria-label="เพิ่มเรื่องที่อยู่ในใจ"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  className="thought__action-btn thought__action-btn--add"
                  onClick={handleAddThought}
                  aria-label="เพิ่มเรื่องนี้"
                  disabled={!currentInput.trim()}
                >
                  <img src={addIcon} width="40" height="40" alt="" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </section>

        <div className="thought__actions">
          <button
            className="thought__continue"
            type="submit"
            disabled={editingId !== null || (thoughts.length === 0 && !currentInput.trim())}
          >
            ไปต่อ
          </button>
        </div>
      </form>
    </main>
  )
}
