import mooca from '../assets/images/Welcome_Mooca.svg'
import './Welcome.css'

type WelcomeProps = {
  onStart?: () => void
}

export default function Welcome({ onStart }: WelcomeProps) {
  return (
    <main className="welcome" aria-labelledby="welcome-title" data-figma-node="20:3432">
      <img className="welcome__illustration" src={mooca} width="279" height="217" alt="มูก้ากำลังกอดซันนี่" />
      <h1 id="welcome-title" className="welcome__title">ช่วงนี้มีอะไรทำให้เหนื่อยใจบ้าง?</h1>
      <div className="welcome__description">
        <p>เวลามีหลายเรื่องอยู่ในหัว ก็ไม่แปลกที่จะไม่รู้ว่าควรเริ่มตรงไหน</p>
        <p>ลองให้เวลาตัวเองสัก 2 นาที ค่อย ๆ จัดความคิด แล้วดูว่าตอนนี้เราพอทำอะไรได้บ้าง</p>
      </div>
      <button className="welcome__start" type="button" onClick={onStart}>มาค่อย ๆ คิดไปด้วยกัน</button>
    </main>
  )
}
