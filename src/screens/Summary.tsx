import lightningIcon from '../assets/icons/electric_bolt.svg'
import moonIcon from '../assets/icons/moon.svg'
import moocaIllustration from '../assets/images/Mooca.svg'
import BackButton from '../components/BackButton'
import './Summary.css'

export type ActionableItem = {
  thought: string
  step: string
}

export type SummaryProps = {
  actionableThoughts?: ActionableItem[]
  uncontrollableThoughts?: ActionableItem[]
  previewState?: 'mixed' | 'actionable' | 'uncontrollable'
  onDone?: () => void
  onBack?: () => void
}

const DEFAULT_MIXED_ACTIONABLE: ActionableItem[] = [
  { thought: 'ไม่แน่ใจว่างานที่ทำดีพอหรือยัง', step: 'ลองขอความเห็นจากใครสักคน' },
  { thought: 'ยังมีงานค้างอีกเยอะเลย', step: 'ลองทำให้เสร็จทีละส่วน' },
]

const DEFAULT_MIXED_UNCONTROLLABLE: ActionableItem[] = [
  { thought: 'กลัวว่าแฟนจะไม่รักเราแล้ว', step: '' },
]

const DEFAULT_ALL_ACTIONABLE: ActionableItem[] = [
  { thought: 'ไม่แน่ใจว่างานที่ทำดีพอหรือยัง', step: 'ลองขอความเห็นจากใครสักคน' },
  { thought: 'ยังมีงานค้างอีกเยอะเลย', step: 'ลองทำให้เสร็จทีละส่วน' },
  { thought: 'กลัวว่าจะตกงาน', step: 'ลองฝึกทักษะเพิ่มทีละนิด' },
]

const DEFAULT_ALL_UNCONTROLLABLE: ActionableItem[] = [
  { thought: 'กลัวว่าแฟนจะไม่รักเราแล้ว', step: '' },
  { thought: 'รู้สึกว่าหัวหน้าไม่ค่อยใส่ใจ', step: 'ลองขอเวลาคุยสั้น ๆ' },
  { thought: 'คนอื่นจะมองเรายังไงนะ', step: '' },
]

export default function Summary({
  actionableThoughts,
  uncontrollableThoughts,
  previewState = 'mixed',
  onDone,
  onBack,
}: SummaryProps) {
  let actionable: ActionableItem[] = []
  let uncontrollable: ActionableItem[] = []

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

  const hasOutsideSteps = uncontrollable.some(({ step }) => step.trim().length > 0)

  const isMixed = actionable.length > 0 && uncontrollable.length > 0
  const isAllActionable = actionable.length > 0 && uncontrollable.length === 0
  const isAllUncontrollable = actionable.length === 0 && uncontrollable.length > 0

  return (
    <main className="summary" aria-labelledby="summary-title">
      <div className="summary__content">
        {onBack && <BackButton onBack={onBack} />}
        <header className="summary__header">
          {isMixed && (
            <h1 id="summary-title" className="summary__title">
              วันนี้ไม่จำเป็นต้องแก้ให้ได้ทุกเรื่อง
              <br />
              ตอนนี้ลองเริ่มจากเรื่องที่พอไหวก่อน
            </h1>
          )}

          {isAllActionable && (
            <>
              <h1 id="summary-title" className="summary__title">
                {hasSteps ? 'เจอก้าวเล็ก ๆ ที่อยากลองแล้ว' : 'เริ่มมองเห็นเรื่องในใจชัดขึ้นแล้ว'}
              </h1>
              <p className="summary__subtitle">
                {hasSteps
                  ? 'ไม่ต้องทำให้ได้ทั้งหมด ค่อย ๆ ไปทีละก้าวก็พอ'
                  : 'ให้เวลาตัวเองค่อย ๆ คิดว่าจะทำอะไรต่อ'}
              </p>
            </>
          )}

          {isAllUncontrollable && (
            <>
              <h1 id="summary-title" className="summary__title">
                เราไม่จำเป็นต้องแก้ทุกเรื่องด้วยตัวเอง
              </h1>
              <div className="summary__subtitle">
                <p>บางเรื่องสำคัญกับเรามาก แม้จะยังเปลี่ยนอะไรไม่ได้</p>
                <p>{hasOutsideSteps ? 'เริ่มจากสิ่งเล็ก ๆ ที่พอไหว โดยไม่ต้องกดดันให้ได้ผลอย่างที่หวัง' : 'ตอนนี้ลองวางเรื่องเหล่านี้ลง แล้วให้เวลาตัวเองได้พัก'}</p>
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
            <section className="summary__card summary__card--outside" aria-label="เรื่องที่ไม่ได้ขึ้นอยู่กับเราคนเดียว">
              <div className="summary__card-header">
                <img
                  className="summary__card-icon"
                  src={moonIcon}
                  width="24"
                  height="24"
                  alt=""
                  aria-hidden="true"
                />
                <h2 className="summary__card-heading">เรื่องที่ไม่ได้ขึ้นอยู่กับเราคนเดียว</h2>
              </div>

              <div className="summary__rest-list">
                {uncontrollable.map(({ thought, step }, index) => (
                  <div key={`${thought}-${index}`}>
                    <p className="summary__rest-thought">{thought}</p>
                    {step.trim() && (
                      <div className="summary__outside-step">
                        <span className="summary__outside-step-label">สิ่งที่อยากลองเพื่อตัวเอง</span>
                        <p className="summary__step-text">{step}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <p className="summary__rest-message">
                {hasOutsideSteps
                  ? 'ทำในส่วนที่เราไหว โดยไม่ต้องรับผิดชอบผลทั้งหมด และพักเมื่อรู้สึกว่าต้องการ'
                  : 'พักเรื่องเหล่านี้ไว้ก่อน แล้วค่อยกลับมาทบทวนเมื่อพร้อม'}
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
          <a
            className="summary__feedback"
            href="https://docs.google.com/forms/d/e/1FAIpQLSd3TJGP7cA6NjdLzit43eHHLdPnXVYjiI7zVeorFQqGDDm_rQ/viewform?usp=dialog"
            target="_blank"
            rel="noopener noreferrer"
          >
            ช่วยบอกเราสักนิด เพื่อให้เราปรับปรุงประสบการณ์นี้ให้ดีขึ้น
          </a>
        </footer>
      </div>
    </main>
  )
}
