import type { FormEvent } from 'react'
import './SmallStep.css'
import type { ThoughtItem } from '../flow'
import lightningIcon from '../assets/icons/electric_bolt.svg'
import moonIcon from '../assets/icons/moon.svg'
import BackButton from '../components/BackButton'

export type SmallStepProps = {
  thoughts: ThoughtItem[]
  uncontrollableThoughts: ThoughtItem[]
  steps: Record<string, string>
  onStepChange: (id: string, value: string) => void
  onContinue: () => void
  onBack: () => void
}

export default function SmallStep({ thoughts, uncontrollableThoughts, steps, onStepChange, onContinue, onBack }: SmallStepProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onContinue()
  }

  const onlyOutside = thoughts.length === 0

  return (
    <main className={`small-step ${onlyOutside ? 'small-step--outside' : ''}`} aria-labelledby="small-step-title">
      <form className="small-step__form" onSubmit={handleSubmit}>
        <BackButton onBack={onBack} />
        <header className="small-step__header">
          <h1 id="small-step-title" className="small-step__title">
            {onlyOutside ? 'ถึงเลือกผลไม่ได้ เราพอทำอะไรให้ตัวเองได้บ้าง?' : 'ลองเริ่มจากก้าวเล็ก ๆ อะไรดี?'}
          </h1>
          <p className="small-step__subtitle">
            {onlyOutside ? 'จะลองถาม ขอความช่วยเหลือ หรือพักเรื่องนี้ไว้ก่อนก็ได้นะ' : 'ลองนึกถึงสิ่งเล็ก ๆ ที่พอไหว แต่ละเรื่องไม่จำเป็นต้องมีคำตอบตอนนี้ก็ได้'}
          </p>
        </header>

        {thoughts.length > 0 && (
          <section className="small-step__group" aria-labelledby="actionable-steps-title">
            <h2 id="actionable-steps-title" className="small-step__group-title"><img src={lightningIcon} alt="" />เรื่องที่พอลงมือทำได้</h2>
            <p className="small-step__group-help">เริ่มจากสิ่งเล็ก ๆ ที่พอไหวก็พอ</p>
            <div className="small-step__cards">
              {thoughts.map((thought) => (
                <article key={thought.id} className="small-step__card">
                  <h3 className="small-step__card-thought">{thought.text}</h3>
                  <label htmlFor={`small-step-input-${thought.id}`} className="small-step__card-label">ก้าวเล็ก ๆ ที่อยากลอง (เว้นไว้ก่อนได้)</label>
                  <input id={`small-step-input-${thought.id}`} className="small-step__input" type="text"
                    placeholder="สิ่งที่อยากลองทำ..." value={steps[thought.id] ?? ''}
                    onChange={(e) => onStepChange(thought.id, e.target.value)} />
                </article>
              ))}
            </div>
          </section>
        )}

        {uncontrollableThoughts.length > 0 && (
          <section className="small-step__group small-step__group--outside" aria-labelledby="outside-steps-title">
            <h2 id="outside-steps-title" className="small-step__group-title"><img src={moonIcon} alt="" />เรื่องที่ไม่ได้ขึ้นอยู่กับเราคนเดียว</h2>
            {!onlyOutside && <p className="small-step__group-prompt">ถึงเลือกผลไม่ได้ เราพอทำอะไรให้ตัวเองได้บ้าง?</p>}
            <p className="small-step__group-help">เราเลือกไม่ได้ว่าคนอื่นจะตอบรับยังไง แต่ลองสื่อสาร ขอความช่วยเหลือ หรือดูแลตัวเองได้นะ</p>
            <div className="small-step__cards">
              {uncontrollableThoughts.map((thought) => (
                <article key={thought.id} className="small-step__card">
                  <h3 className="small-step__card-thought">{thought.text}</h3>
                  <label htmlFor={`small-step-input-${thought.id}`} className="small-step__card-label">สิ่งที่อยากลอง หรือทำเพื่อตัวเอง (เว้นไว้ก่อนได้)</label>
                  <textarea id={`small-step-input-${thought.id}`} className="small-step__input small-step__input--outside"
                    rows={2} value={steps[thought.id] ?? ''}
                    aria-describedby="outside-steps-permission"
                    onChange={(e) => onStepChange(thought.id, e.target.value)} />
                </article>
              ))}
            </div>
            <p id="outside-steps-permission" className="small-step__permission">ยังไม่ต้องทำอะไรก็ได้ ถ้าวันนี้อยากพัก กดไปต่อได้เลยนะ</p>
          </section>
        )}

        <div className="small-step__actions">
          <button className="small-step__continue" type="submit">
            ไปต่อ
          </button>
        </div>
      </form>
    </main>
  )
}
