import { useState, type FormEvent, type KeyboardEvent } from 'react'
import addIcon from '../assets/icons/add.svg'
import removeIcon from '../assets/icons/remove.svg'
import './Thought.css'

export type ThoughtProps = {
  initialThoughts?: string[]
  onContinue?: (thoughts: string[]) => void
}

const MAX_THOUGHTS = 3

export default function Thought({
  initialThoughts = [],
  onContinue,
}: ThoughtProps) {
  const [thoughts, setThoughts] = useState<string[]>(initialThoughts)
  const [currentInput, setCurrentInput] = useState('')

  const handleAddThought = () => {
    const trimmed = currentInput.trim()
    if (!trimmed || thoughts.length >= MAX_THOUGHTS) return

    setThoughts((prev) => [...prev, trimmed])
    setCurrentInput('')
  }

  const handleRemoveThought = (indexToRemove: number) => {
    setThoughts((prev) => prev.filter((_, idx) => idx !== indexToRemove))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.nativeEvent.isComposing) {
      event.preventDefault()
      handleAddThought()
    }
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const pending = currentInput.trim()
    const completedThoughts = pending && thoughts.length < MAX_THOUGHTS
      ? [...thoughts, pending]
      : thoughts
    if (completedThoughts.length > 0) {
      onContinue?.(completedThoughts)
    }
  }

  return (
    <main className="thought" aria-labelledby="thought-title">
      <form className="thought__form" onSubmit={handleSubmit}>
        <header className="thought__header">
          <h1 id="thought-title" className="thought__title">
            What’s been on your mind?
          </h1>
          <p className="thought__subtitle">
            Write down the thoughts that have been taking your energy.
          </p>
        </header>

        <section className="thought__content" aria-label="Your thoughts">
          {thoughts.length > 0 && (
            <p className="thought__counter" aria-live="polite">
              {thoughts.length}/{MAX_THOUGHTS} added
            </p>
          )}

          <div className="thought__list">
            {thoughts.map((item, index) => (
              <div key={`${item}-${index}`} className="thought__row">
                <div className="thought__card">
                  <span className="thought__card-text">{item}</span>
                </div>
                <button
                  type="button"
                  className="thought__action-btn thought__action-btn--remove"
                  onClick={() => handleRemoveThought(index)}
                  aria-label={`Remove thought: ${item}`}
                >
                  <img src={removeIcon} width="40" height="40" alt="" aria-hidden="true" />
                </button>
              </div>
            ))}

            {thoughts.length < MAX_THOUGHTS && (
              <div className="thought__row">
                <input
                  className="thought__input"
                  type="text"
                  placeholder="Type what’s on your mind..."
                  aria-label="Add a thought"
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  className="thought__action-btn thought__action-btn--add"
                  onClick={handleAddThought}
                  aria-label="Add thought"
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
            disabled={thoughts.length === 0 && !currentInput.trim()}
          >
            Continue
          </button>
        </div>
      </form>
    </main>
  )
}
