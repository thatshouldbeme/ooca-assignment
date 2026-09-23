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
  { thought: 'I’m not sure my work is good enough', step: 'Ask some one for feed back' },
  { thought: 'I still have a lot to finish', step: 'Finish one section first' },
]

const DEFAULT_MIXED_UNCONTROLLABLE: string[] = [
  'My partner doesn’t like me',
]

const DEFAULT_ALL_ACTIONABLE: ActionableItem[] = [
  { thought: 'I’m not sure my work is good enough', step: 'Ask some one for feed back' },
  { thought: 'I still have a lot to finish', step: 'Finish one section first' },
  { thought: 'I’m of for losing my job', step: 'Improve my skill' },
]

const DEFAULT_ALL_UNCONTROLLABLE: string[] = [
  'My partner doesn’t like me',
  'My supervisor doesn’t care about me',
  'How everyone think about  me',
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
              You don’t have to solve everything at once.
              <br />
              Here’s where your energy can go for now.
            </h1>
          )}

          {isAllActionable && (
            <>
              <h1 id="summary-title" className="summary__title">
                {hasSteps ? 'You’ve found a small step you can take.' : 'You’ve made space to see what’s on your mind.'}
              </h1>
              <p className="summary__subtitle">
                {hasSteps
                  ? 'You don’t have to do it all at once. Take it one small step at a time.'
                  : 'You don’t need to decide on a next step right now.'}
              </p>
            </>
          )}

          {isAllUncontrollable && (
            <>
              <h1 id="summary-title" className="summary__title">
                Not everything is yours to solve.
              </h1>
              <div className="summary__subtitle">
                <p>Some things matter deeply, even when they’re outside your control.</p>
                <p>For now, it’s okay to let them rest.</p>
              </div>
            </>
          )}
        </header>

        <div className="summary__sections">
          {/* Actionable Section */}
          {actionable.length > 0 && (
            <section className="summary__card" aria-label="What you can act on">
              <div className="summary__card-header">
                <img
                  className="summary__card-icon"
                  src={lightningIcon}
                  width="24"
                  height="24"
                  alt=""
                  aria-hidden="true"
                />
                <h2 className="summary__card-heading">What you can act on</h2>
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
            <section className="summary__card" aria-label="What you can rest now">
              <div className="summary__card-header">
                <img
                  className="summary__card-icon"
                  src={moonIcon}
                  width="24"
                  height="24"
                  alt=""
                  aria-hidden="true"
                />
                <h2 className="summary__card-heading">What you can rest now</h2>
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
                  ? 'Focus on what you can do now. What’s outside your control still matters.'
                  : 'Give yourself permission to set these down for now. You can come back to them when you need to.'}
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
            alt="Mooca with Sunny"
          />
          <button
            className="summary__done-button"
            type="button"
            onClick={onDone}
          >
            I’m done for now
          </button>
        </footer>
      </div>
    </main>
  )
}
