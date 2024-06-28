import { motion } from 'framer-motion'
import { useEffect, useMemo } from 'react'
import { RandomCountry } from '../types/country.types'

interface AnswerModalProps {
  selectedCountry: string
  randomCountry: RandomCountry
  restartGame: () => void
  setIsGameOver: (value: boolean) => void
}

const AnswerModal = (props: AnswerModalProps) => {
  const { selectedCountry, randomCountry, restartGame, setIsGameOver } = props
  const isCorrect = useMemo(
    () => selectedCountry === randomCountry.name.common,
    [selectedCountry],
  )
  useEffect(() => {
    setIsGameOver(true)
  }, [])
  const handleClick = () => {
    restartGame()
    setIsGameOver(false)
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-25"
    >
      <div className="bg-white p-4 w-96 mx-auto">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-xl">Your Answer is</h1>
          <div className="flex flex-col items-center gap-3">
            <span
              className={`text-xl ${isCorrect ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-1 rounded-md`}
            >
              {isCorrect ? 'Correct' : 'Wrong'}
            </span>
            <div className="text-sm text-center flex flex-col">
              <span>{`
                You guessed it ${isCorrect ? 'right' : 'wrong'}, the answer is
              `}</span>
              <span className="font-bold">{randomCountry.name.common}</span>
            </div>
          </div>
          <button
            className="bg-blue-500 text-white px-2 py-1 rounded-md mt-2 hover:bg-blue-600 transition-all"
            onClick={handleClick}
          >
            Play Again
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default AnswerModal
