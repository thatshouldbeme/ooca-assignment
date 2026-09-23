import { useState } from 'react'
import './SomethingElse.css'

export type SomethingElseProps = {
  onContinue?: (customCategory: string) => void
}

export default function SomethingElse({ onContinue }: SomethingElseProps) {
  const [thought, setThought] = useState('')

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (thought.trim() && onContinue) {
      onContinue(thought.trim())
    }
  }

  return (
    <main className="something-else" aria-labelledby="something-else-title">
      <form className="something-else__form" onSubmit={handleSubmit}>
        <h1 id="something-else-title" className="something-else__title">
          What’s been on your mind lately?
        </h1>
        <input
          className="something-else__input"
          type="text"
          aria-labelledby="something-else-title"
          placeholder="Type what’s on your mind..."
          value={thought}
          onChange={(event) => setThought(event.target.value)}
        />
        <div className="something-else__actions">
          <button className="something-else__continue" type="submit" disabled={!thought.trim()}>
            Continue
          </button>
        </div>
      </form>
    </main>
  )
}

