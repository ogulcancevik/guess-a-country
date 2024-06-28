import { GeoLocation } from '../types/geolocation.types'

export const fetchGeolocation = async (
  lng: number,
  lat: number,
  token: string,
) => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${token}`,
  )
  const data = await response.json()
  return data as GeoLocation
}
