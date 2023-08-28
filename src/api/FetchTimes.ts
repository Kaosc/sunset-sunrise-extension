import { SUNSET_SUNRISE_API } from "../utils/constants"

export default async function FetchTimes(lat: number, lng: number) {
	const response = await fetch(`${SUNSET_SUNRISE_API}?lat=${lat}&lng=${lng}&formatted=0`)
	const data = await response.json()
	return data.results
}
