import { useState, type FormEvent } from 'react'
import mindfullLogo from '../assets/ooca/mindfull-logo.svg'
import './SmallStep.css'

export type SmallStepProps = {
  thoughts?: string[]
  onContinue?: (steps: { thought: string; step: string }[]) => void
}

const DEFAULT_THOUGHTS = [
  'I’m not sure my work is good enough',
  'I still have a lot to do',
]

export default function SmallStep({
  thoughts = DEFAULT_THOUGHTS,
  onContinue,
}: SmallStepProps) {
  const [steps, setSteps] = useState<Record<number, string>>({})

  const handleStepChange = (index: number, value: string) => {
    setSteps((prev) => ({
      ...prev,
      [index]: value,
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (onContinue) {
      const results = thoughts.map((thought, idx) => ({
        thought,
        step: steps[idx] ?? '',
      }))
      onContinue(results)
    }
  }

  return (
    <main className="small-step" aria-labelledby="small-step-title">
      <form className="small-step__form" onSubmit={handleSubmit}>
        <header className="small-step__header">
          <h1 id="small-step-title" className="small-step__title">
            What’s one small step you can take?
          </h1>
          <p className="small-step__subtitle">
            Think of one small step for each thought. Keep it simple and manageable.
          </p>
        </header>

        <section className="small-step__cards" aria-label="Actionable thoughts">
          {thoughts.map((thought, index) => (
            <article key={`${thought}-${index}`} className="small-step__card">
              <h2 className="small-step__card-thought">{thought}</h2>
              <label
                htmlFor={`small-step-input-${index}`}
                className="small-step__card-label"
              >
                My small step
              </label>
              <input
                id={`small-step-input-${index}`}
                className="small-step__input"
                type="text"
                placeholder="Type one small step..."
                value={steps[index] ?? ''}
                onChange={(e) => handleStepChange(index, e.target.value)}
              />
            </article>
          ))}
        </section>

        <div className="small-step__actions">
          <button className="small-step__continue" type="submit">
            Continue
          </button>
          <img
            className="small-step__logo"
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
