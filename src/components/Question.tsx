import { AnimatePresence, motion } from 'framer-motion'
import { useEffect } from 'react'
import { RandomCountry } from '../types/country.types'

interface QuestionProps {
  randomCountry: RandomCountry
  reGenerateRandomCountry: () => void
  isGameOver: boolean
}
const Question = (props: QuestionProps) => {
  const { randomCountry, reGenerateRandomCountry, isGameOver } = props
  const flag = randomCountry?.flags?.svg
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'r' && isGameOver) {
      reGenerateRandomCountry()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', (e) => handleKeyDown(e))
    return () => {
      window.removeEventListener('keydown', (e) => handleKeyDown(e))
    }
  }, [])

  return (
    <div className="absolute top-0 left-0 px-5 py-4 text-white bg-black bg-opacity-50">
      <div className="flex flex-col items-center gap-3">
        <AnimatePresence>
          {flag ? (
            <div className="relative h-32 w-52">
              <motion.img
                key={flag}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute object-cover h-32 w-52"
                src={flag}
                alt={randomCountry.name.common}
              />
            </div>
          ) : (
            <div className="h-32 bg-gray-300 w-52 animate-pulse" />
          )}
        </AnimatePresence>
        <span> What is the name of this country?</span>
        <span className="text-xs"> you can guess by clicking on the map</span>
        <span className="text-xs">You can also press "r" to skip</span>
        <button
          className="px-2 py-1 mt-2 text-white transition-all bg-blue-500 rounded-md hover:bg-blue-600"
          onClick={reGenerateRandomCountry}
        >
          Skip
        </button>
      </div>
    </div>
  )
}

export default Question
