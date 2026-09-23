import { useState } from 'react'
import mindfullLogo from '../assets/ooca/mindfull-logo.svg'
import './SomethingElse.css'

export default function SomethingElse() {
  const [thought, setThought] = useState('')

  return (
    <main className="something-else" aria-labelledby="something-else-title">
      <form className="something-else__form" onSubmit={(event) => event.preventDefault()}>
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
          <img className="something-else__logo" src={mindfullLogo} width="107.852" height="21" alt="mindfull" />
        </div>
      </form>
    </main>
  )
}
