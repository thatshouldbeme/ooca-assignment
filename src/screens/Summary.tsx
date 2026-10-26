import lightningIcon from '../assets/icons/electric_bolt.svg'
import moonIcon from '../assets/icons/moon.svg'
import moocaIllustration from '../assets/images/Mooca.svg'
import './Summary.css'

export type ActionableItem = {
  thought: string
  step: string
}

export type SummaryProps = {
  actionableThoughts?: ActionableItem[]
  uncontrollableThoughts?: string[]
  previewState?: 'mixed' | 'actionable' | 'uncontrollable'
  onDone?: () => void
}

const DEFAULT_MIXED_ACTIONABLE: ActionableItem[] = [
  { thought: 'ไม่แน่ใจว่างานที่ทำดีพอหรือยัง', step: 'ลองขอความเห็นจากใครสักคน' },
  { thought: 'ยังมีงานค้างอีกเยอะเลย', step: 'ลองทำให้เสร็จทีละส่วน' },
]

const DEFAULT_MIXED_UNCONTROLLABLE: string[] = [
  'กลัวว่าแฟนจะไม่รักเราแล้ว',
]

const DEFAULT_ALL_ACTIONABLE: ActionableItem[] = [
  { thought: 'ไม่แน่ใจว่างานที่ทำดีพอหรือยัง', step: 'ลองขอความเห็นจากใครสักคน' },
  { thought: 'ยังมีงานค้างอีกเยอะเลย', step: 'ลองทำให้เสร็จทีละส่วน' },
  { thought: 'กลัวว่าจะตกงาน', step: 'ลองฝึกทักษะเพิ่มทีละนิด' },
]

const DEFAULT_ALL_UNCONTROLLABLE: string[] = [
  'กลัวว่าแฟนจะไม่รักเราแล้ว',
  'รู้สึกว่าหัวหน้าไม่ค่อยใส่ใจ',
  'คนอื่นจะมองเรายังไงนะ',
]

export default function Summary({
  actionableThoughts,
  uncontrollableThoughts,
  previewState = 'mixed',
  onDone,
}: SummaryProps) {
  let actionable: ActionableItem[] = []
  let uncontrollable: string[] = []

  if (actionableThoughts !== undefined || uncontrollableThoughts !== undefined) {
    actionable = actionableThoughts ?? []
    uncontrollable = uncontrollableThoughts ?? []
  } else {
    switch (previewState) {
      case 'actionable':
        actionable = DEFAULT_ALL_ACTIONABLE
        uncontrollable = []
        break
      case 'uncontrollable':
        actionable = []
        uncontrollable = DEFAULT_ALL_UNCONTROLLABLE
        break
      case 'mixed':
      default:
        actionable = DEFAULT_MIXED_ACTIONABLE
        uncontrollable = DEFAULT_MIXED_UNCONTROLLABLE
        break
    }
  }

  const hasSteps = actionable.some(({ step }) => step.trim().length > 0)

  const isMixed = actionable.length > 0 && uncontrollable.length > 0
  const isAllActionable = actionable.length > 0 && uncontrollable.length === 0
  const isAllUncontrollable = actionable.length === 0 && uncontrollable.length > 0

  return (
    <main className="summary" aria-labelledby="summary-title">
      <div className="summary__content">
        <header className="summary__header">
          {isMixed && (
            <h1 id="summary-title" className="summary__title">
              ไม่ต้องแก้ทุกเรื่องให้ได้ในวันนี้ก็ได้นะ
              <br />
              ตอนนี้ลองเริ่มจากเรื่องที่พอไหวก่อน
            </h1>
          )}

          {isAllActionable && (
            <>
              <h1 id="summary-title" className="summary__title">
                {hasSteps ? 'เจอก้าวเล็ก ๆ ที่อยากลองแล้วนะ' : 'ได้ค่อย ๆ มองเห็นเรื่องในใจชัดขึ้นแล้วนะ'}
              </h1>
              <p className="summary__subtitle">
                {hasSteps
                  ? 'ไม่ต้องทำให้ได้ทั้งหมด ค่อย ๆ ไปทีละก้าวก็พอ'
                  : 'ยังไม่ต้องรู้ว่าจะทำอะไรต่อในตอนนี้ก็ได้นะ'}
              </p>
            </>
          )}

          {isAllUncontrollable && (
            <>
              <h1 id="summary-title" className="summary__title">
                ไม่ใช่ทุกเรื่องที่เราต้องแก้เองนะ
              </h1>
              <div className="summary__subtitle">
                <p>บางเรื่องสำคัญกับเรามาก แม้จะยังเปลี่ยนอะไรไม่ได้</p>
                <p>ตอนนี้วางไว้ก่อน แล้วให้ตัวเองได้พักบ้างก็ได้นะ</p>
              </div>
            </>
          )}
        </header>

        <div className="summary__sections">
          {/* Actionable Section */}
          {actionable.length > 0 && (
            <section className="summary__card" aria-label="เรื่องที่พอลงมือทำได้">
              <div className="summary__card-header">
                <img
                  className="summary__card-icon"
                  src={lightningIcon}
                  width="24"
                  height="24"
                  alt=""
                  aria-hidden="true"
                />
                <h2 className="summary__card-heading">เรื่องที่พอลงมือทำได้</h2>
              </div>

              <div className="summary__actionable-list">
                {actionable.map(({ thought, step }, index) => (
                  <div key={`${thought}-${index}`} className="summary__actionable-item">
                    <p className="summary__actionable-thought">{thought}</p>
                    {step.trim() && (
                      <div className="summary__actionable-step">
                        <svg
                          className="summary__arrow-icon"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <line x1="5" y1="12" x2="19" y2="12"></line>
                          <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                        <span className="summary__step-text">{step}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Uncontrollable / Rest Section */}
          {uncontrollable.length > 0 && (
            <section className="summary__card" aria-label="เรื่องที่วางไว้ก่อนได้">
              <div className="summary__card-header">
                <img
                  className="summary__card-icon"
                  src={moonIcon}
                  width="24"
                  height="24"
                  alt=""
                  aria-hidden="true"
                />
                <h2 className="summary__card-heading">เรื่องที่วางไว้ก่อนได้</h2>
              </div>

              <div className="summary__rest-list">
                {uncontrollable.map((item, index) => (
                  <p key={`${item}-${index}`} className="summary__rest-thought">
                    {item}
                  </p>
                ))}
              </div>

              <p className="summary__rest-message">
                {isMixed
                  ? 'ลองเริ่มจากสิ่งที่พอทำได้ ส่วนเรื่องที่ยังเปลี่ยนไม่ได้ ก็ยังสำคัญกับเราได้เหมือนเดิม'
                  : 'ให้ตัวเองวางเรื่องเหล่านี้ไว้ก่อนก็ได้นะ ถ้าอยากกลับมาคิดอีกเมื่อไหร่ก็ค่อยว่ากัน'}
              </p>
            </section>
          )}
        </div>

        <footer className="summary__footer">
          <img
            className="summary__illustration"
            src={moocaIllustration}
            width="170"
            height="154"
            alt="มูก้าอยู่กับซันนี่"
          />
          <button
            className="summary__done-button"
            type="button"
            onClick={onDone}
          >
            วันนี้พอแค่นี้ก่อน
          </button>
        </footer>
      </div>
    </main>
  )
}
