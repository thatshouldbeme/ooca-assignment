type BackButtonProps = { onBack: () => void }

export default function BackButton({ onBack }: BackButtonProps) {
  return <button type="button" className="flow__back" onClick={onBack}><span aria-hidden="true">←</span> ย้อนกลับ</button>
}
