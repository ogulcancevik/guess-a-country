import { useEffect, useRef, useState } from 'react'
import { fetchGeolocation } from '../services/geolocation.service'
import mapboxgl from 'mapbox-gl'
import { RandomCountry } from '../types/country.types'

const MAPBOX_STYLE =
  'mapbox://styles/ogulcancevik/clsrryz06003a01p996lp9qtu' ||
  import.meta.env.VITE_MAPBOX_STYLE

interface MapProps {
  setSelectedCountry: (country: string) => void
  randomCountry: RandomCountry
  isGameOver: boolean
}

const Map = (props: MapProps) => {
  const { setSelectedCountry, randomCountry, isGameOver } = props
  const [mapInstance, setMapInstance] = useState<mapboxgl.Map | null>(null)
  const map = useRef(null)
  const handleClick = async (e: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = e.lngLat
    const geoLocationData = await fetchGeolocation(
      lng,
      lat,
      mapboxgl.accessToken,
    )
    const { features } = geoLocationData
    const countryData = features.find((f) => f.place_type[0] === 'country')
    if (countryData) {
      setSelectedCountry(countryData.text)
    }
  }

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: map.current || '',
      style: MAPBOX_STYLE,
      center: [50, 0],
      zoom: 1.5,
      maxZoom: 4.5,
    })
    setMapInstance(mapInstance)
    mapInstance.addControl(new mapboxgl.NavigationControl())
    mapInstance.on('click', async (e) => handleClick(e))
    return () => {
      mapInstance.remove()
    }
  }, [])
  const zoomToRandomCountry = async () => {
    const response = await fetchGeolocation(
      randomCountry.latlng[1],
      randomCountry.latlng[0],
      mapboxgl.accessToken,
    )
    const { features } = response
    // zoom to the random country
    const countryData = features.find((f) => f.place_type[0] === 'country')
    if (countryData) {
      mapInstance?.flyTo({
        center: countryData.center as [number, number],
        zoom: 5,
        speed: 1,
        curve: 1,
      })
      mapInstance?.addLayer({
        id: 'country',
        type: 'circle',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: countryData.center,
            },
          },
        },
        paint: {
          'circle-radius': 10,
          'circle-color': '#f00',
        },
      })
    }
  }
  // un zoom when the game is over
  const unZoom = () => {
    mapInstance?.flyTo({
      center: [50, 0],
      zoom: 1.5,
      speed: 1,
      curve: 1,
    })
    if (mapInstance?.getLayer('country')) {
      mapInstance?.removeLayer('country')
      mapInstance?.removeSource('country')
    }
  }

  useEffect(() => {
    if (mapInstance) {
      if (!isGameOver) {
        unZoom()
      } else {
        zoomToRandomCountry()
      }
    }
  }, [randomCountry, isGameOver])
  return <div ref={map} className="w-screen h-screen" />
}

export default Map
