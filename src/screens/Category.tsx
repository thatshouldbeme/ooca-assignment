import workIcon from '../assets/icons/business_center.svg'
import relationshipIcon from '../assets/icons/relationship.svg'
import familyIcon from '../assets/icons/home.svg'
import financesIcon from '../assets/icons/wallet.svg'
import myselfIcon from '../assets/icons/mood.svg'
import healthIcon from '../assets/icons/medical-condition-cough .svg'
import somethingElseIcon from '../assets/icons/something_else.svg'
import './Category.css'

const categories = [
  { label: 'Work / Study', icon: workIcon },
  { label: 'Relationship', icon: relationshipIcon },
  { label: 'Family', icon: familyIcon },
  { label: 'Finances', icon: financesIcon },
  { label: 'Myself / Future', icon: myselfIcon },
  { label: 'Health', icon: healthIcon },
  { label: 'Something else', icon: somethingElseIcon },
]

export type CategoryProps = {
  onSelectCategory?: (category: { label: string; icon: string }) => void
}

export default function Category({ onSelectCategory }: CategoryProps) {
  return (
    <main className="category" aria-labelledby="category-title" data-figma-node="20:4025">
      <h1 id="category-title" className="category__title">What’s been on your mind lately?</h1>
      <ul className="category__list" aria-labelledby="category-title">
        {categories.map(({ label, icon }) => (
          <li key={label}>
            <button
              className="category__card"
              type="button"
              onClick={() => onSelectCategory?.({ label, icon })}
            >
              <img className="category__icon" src={icon} width="40" height="40" alt="" />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </main>
  )
}

