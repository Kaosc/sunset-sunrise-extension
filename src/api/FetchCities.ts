import { CITIES_GEO_LOCATION_API } from "../utils/constants"

export default async function FetchCities(): Promise<FilteredCity[]> {
	const response = await fetch(CITIES_GEO_LOCATION_API)
	const data = await response.json()
	return data
}
