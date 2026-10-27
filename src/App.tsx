import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import Welcome from './screens/Welcome'
import Thought from './screens/Thought'
import Sort from './screens/Sort'
import SmallStep from './screens/SmallStep'
import Summary from './screens/Summary'
import { reconcileGroups, type ThoughtGroups, type ThoughtItem } from './flow'
import './App.css'

export type FlowScreen =
  | 'welcome'
  | 'thought'
  | 'sort'
  | 'smallStep'
  | 'outsideStep'
  | 'summary'

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<FlowScreen>('welcome')
  const [thoughts, setThoughts] = useState<ThoughtItem[]>([])
  const [currentInput, setCurrentInput] = useState('')
  const [groups, setGroups] = useState<ThoughtGroups>({ pool: [], actionable: [], nonActionable: [] })
  const [steps, setSteps] = useState<Record<string, string>>({})

  const handleThoughtsChange = (updated: ThoughtItem[]) => {
    setThoughts(updated)
    setGroups((previous) => reconcileGroups(updated, previous))
    setSteps((previous) => Object.fromEntries(updated.map(({ id }) => [id, previous[id] ?? ''])))
  }

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

  const handleSortContinue = () => {
    setCurrentScreen(groups.actionable.length > 0 ? 'smallStep' : 'outsideStep')
  }

  const handleDone = () => {
    setThoughts([])
    setCurrentInput('')
    setGroups({ pool: [], actionable: [], nonActionable: [] })
    setSteps({})
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
                thoughts={thoughts}
                currentInput={currentInput}
                onThoughtsChange={handleThoughtsChange}
                onInputChange={setCurrentInput}
                onContinue={() => setCurrentScreen('sort')}
                onBack={() => setCurrentScreen('welcome')}
              />
            )}

            {currentScreen === 'sort' && (
              <Sort
                groups={groups}
                onChange={setGroups}
                onBack={() => setCurrentScreen('thought')}
                onContinue={handleSortContinue}
              />
            )}

            {(currentScreen === 'smallStep' || currentScreen === 'outsideStep') && (
              <SmallStep
                thoughts={currentScreen === 'smallStep' ? groups.actionable : []}
                uncontrollableThoughts={currentScreen === 'outsideStep' ? groups.nonActionable : []}
                steps={steps}
                onStepChange={(id, value) => setSteps((previous) => ({ ...previous, [id]: value }))}
                onContinue={() => setCurrentScreen(currentScreen === 'smallStep' && groups.nonActionable.length > 0 ? 'outsideStep' : 'summary')}
                onBack={() => setCurrentScreen(currentScreen === 'outsideStep' && groups.actionable.length > 0 ? 'smallStep' : 'sort')}
              />
            )}

            {currentScreen === 'summary' && (
              <Summary
                actionableThoughts={groups.actionable.map(({ id, text }) => ({ thought: text, step: steps[id] ?? '' }))}
                uncontrollableThoughts={groups.nonActionable.map(({ id, text }) => ({ thought: text, step: steps[id] ?? '' }))}
                onDone={handleDone}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
