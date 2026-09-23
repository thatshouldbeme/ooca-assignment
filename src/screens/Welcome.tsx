import mooca from '../assets/ooca/mooca-hugging-sunny.png'
import mindfullLogo from '../assets/ooca/mindfull-logo.svg'
import './Welcome.css'

type WelcomeProps = {
  onStart?: () => void
}

export default function Welcome({ onStart }: WelcomeProps) {
  return (
    <main className="welcome" aria-labelledby="welcome-title" data-figma-node="20:3432">
      <img className="welcome__illustration" src={mooca} width="279" height="217" alt="Mooca hugging Sunny" />
      <h1 id="welcome-title" className="welcome__title">What’s taking your energy?</h1>
      <div className="welcome__description">
        <p>When there’s a lot on your mind, it can be hard to know what to focus on.</p>
        <p>Take 2 minutes to sort through your thoughts and see what’s in your hands right now.</p>
      </div>
      <button className="welcome__start" type="button" onClick={onStart}>Let’s sort it out</button>
      <img className="welcome__logo" src={mindfullLogo} width="107.852" height="21" alt="mindfull" />
    </main>
  )
}
