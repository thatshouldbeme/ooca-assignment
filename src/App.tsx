import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Welcome from './screens/Welcome'
import Thought from './screens/Thought'
import Sort from './screens/Sort'
import SmallStep from './screens/SmallStep'
import Summary, { type ActionableItem } from './screens/Summary'
import mindfullLogo from './assets/ooca/mindfull-logo.svg'
import './App.css'

export type FlowScreen =
  | 'welcome'
  | 'thought'
  | 'sort'
  | 'smallStep'
  | 'summary'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<FlowScreen>('welcome')
  const [thoughts, setThoughts] = useState<string[]>([])
  const [actionableThoughts, setActionableThoughts] = useState<string[]>([])
  const [uncontrollableThoughts, setUncontrollableThoughts] = useState<string[]>([])
  const [actionableWithSteps, setActionableWithSteps] = useState<ActionableItem[]>([])

  const pagesRef = useRef<HTMLDivElement>(null)

  const shouldReduceMotion = useReducedMotion()

  const pageVariants = {
    initial: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : 8,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: 'easeOut' as const,
      },
    },
    exit: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : -4,
      transition: {
        duration: 0.15,
        ease: 'easeIn' as const,
      },
    },
  }

  // 1. Welcome -> Thought
  const handleStart = () => {
    setCurrentScreen('thought')
  }

  // 2. Thought -> Sort
  const handleThoughtsContinue = (enteredThoughts: string[]) => {
    setThoughts(enteredThoughts)
    setCurrentScreen('sort')
  }

  // 3. Sort -> SmallStep (or directly to Summary if 0 actionable)
  const handleSortContinue = ({
    actionable,
    nonActionable,
  }: {
    actionable: string[]
    nonActionable: string[]
  }) => {
    setActionableThoughts(actionable)
    setUncontrollableThoughts(nonActionable)

    if (actionable.length === 0) {
      // Skip SmallStep when there are no actionable thoughts
      setActionableWithSteps([])
      setCurrentScreen('summary')
    } else {
      setCurrentScreen('smallStep')
    }
  }

  // 4. SmallStep -> Summary
  const handleSmallStepContinue = (steps: ActionableItem[]) => {
    setActionableWithSteps(steps)
    setCurrentScreen('summary')
  }

  // 5. Summary "I'm done for now" -> Reset to Welcome
  const handleDone = () => {
    setThoughts([])
    setActionableThoughts([])
    setUncontrollableThoughts([])
    setActionableWithSteps([])
    setCurrentScreen('welcome')
  }

  useEffect(() => {
    pagesRef.current?.scrollTo(0, 0)
  }, [currentScreen])

  return (
    <div className="flow">
      <div className="flow__pages" ref={pagesRef}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {currentScreen === 'welcome' && (
              <Welcome onStart={handleStart} />
            )}

            {currentScreen === 'thought' && (
              <Thought
                onContinue={handleThoughtsContinue}
              />
            )}

            {currentScreen === 'sort' && (
              <Sort
                initialThoughts={thoughts}
                onContinue={handleSortContinue}
              />
            )}

            {currentScreen === 'smallStep' && (
              <SmallStep
                thoughts={actionableThoughts}
                onContinue={handleSmallStepContinue}
              />
            )}

            {currentScreen === 'summary' && (
              <Summary
                actionableThoughts={actionableWithSteps}
                uncontrollableThoughts={uncontrollableThoughts}
                onDone={handleDone}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <footer className="flow__footer">
        <img src={mindfullLogo} width="107.852" height="21" alt="mindfull" />
      </footer>
    </div>
  )
}
