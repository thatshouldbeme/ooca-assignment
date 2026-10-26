import type { FormEvent } from 'react'
import './SmallStep.css'
import type { ThoughtItem } from '../flow'
import BackButton from '../components/BackButton'

export type SmallStepProps = {
  thoughts: ThoughtItem[]
  steps: Record<string, string>
  onStepChange: (id: string, value: string) => void
  onContinue: () => void
  onBack: () => void
}

export default function SmallStep({ thoughts, steps, onStepChange, onContinue, onBack }: SmallStepProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onContinue()
  }

  return (
    <main className="small-step" aria-labelledby="small-step-title">
      <form className="small-step__form" onSubmit={handleSubmit}>
        <BackButton onBack={onBack} />
        <header className="small-step__header">
          <h1 id="small-step-title" className="small-step__title">
            ลองเริ่มจากก้าวเล็ก ๆ อะไรดี?
          </h1>
          <p className="small-step__subtitle">
            แต่ละเรื่อง ลองนึกถึงสิ่งเล็ก ๆ ที่พอทำไหว ถ้ายังนึกไม่ออกก็ข้ามได้นะ
          </p>
        </header>

        <section className="small-step__cards" aria-label="เรื่องที่พอลงมือทำได้">
          {thoughts.map((thought) => (
            <article key={thought.id} className="small-step__card">
              <h2 className="small-step__card-thought">{thought.text}</h2>
              <label
                htmlFor={`small-step-input-${thought.id}`}
                className="small-step__card-label"
              >
                ก้าวเล็ก ๆ ที่อยากลอง (เว้นไว้ก่อนได้)
              </label>
              <input
                id={`small-step-input-${thought.id}`}
                className="small-step__input"
                type="text"
                placeholder="ลองพิมพ์สิ่งเล็ก ๆ ที่อยากทำ..."
                value={steps[thought.id] ?? ''}
                onChange={(e) => onStepChange(thought.id, e.target.value)}
              />
            </article>
          ))}
        </section>

        <div className="small-step__actions">
          <button className="small-step__continue" type="submit">
            ไปต่อ
          </button>
        </div>
      </form>
    </main>
  )
}
