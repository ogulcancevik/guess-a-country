import mapboxgl from 'mapbox-gl'
import Map from './components/Map'
import { useEffect, useMemo, useState } from 'react'
import { fetchAllCountries } from './services/country.service'
import Question from './components/Question'
import AnswerModal from './components/AnswerModal'
import LoadingOverlay from './components/LoadingOverlay'
const App = () => {
  const mapBoxAccessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''
  mapboxgl.accessToken = mapBoxAccessToken
  const [allCountries, setAllCountries] = useState<any[]>([])
  const [randomCountry, setRandomCountry] = useState<any>({})
  const [selectedCountry, setSelectedCountry] = useState<any>(null)
  const [isGameOver, setIsGameOver] = useState(false)
  const getCountryData = async () => {
    const response = await fetchAllCountries()
    // I used any because i don't need to type the whole object
    setAllCountries(response)
  }
  const generateRandomCountry = () => {
    const allCountriesLength = allCountries.length
    const getRandomCountry = Math.floor(Math.random() * allCountriesLength)
    const randomCountry = allCountries[getRandomCountry]
    return randomCountry
  }
  useEffect(() => {
    getCountryData()
  }, [])
  useEffect(() => {
    setRandomCountry(generateRandomCountry())
  }, [allCountries])
  const reGenerateRandomCountry = () => {
    setRandomCountry(generateRandomCountry())
  }
  const isAllCountries = useMemo(() => allCountries.length > 0, [allCountries])

  const restartGame = () => {
    setRandomCountry(generateRandomCountry())
    setSelectedCountry(null)
  }
  if (!mapBoxAccessToken) {
    return (
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-500">
          Please provide a mapbox access token!
        </h1>
      </div>
    )
  }
  if (isAllCountries) {
    return (
      <>
        <Map
          setSelectedCountry={setSelectedCountry}
          randomCountry={randomCountry}
          isGameOver={isGameOver}
        />
        <Question
          randomCountry={randomCountry}
          reGenerateRandomCountry={reGenerateRandomCountry}
          isGameOver={isGameOver}
        />
        {selectedCountry && (
          <AnswerModal
            selectedCountry={selectedCountry}
            randomCountry={randomCountry}
            restartGame={restartGame}
            setIsGameOver={setIsGameOver}
          />
        )}
      </>
    )
  } else return <LoadingOverlay />
}

export default App
