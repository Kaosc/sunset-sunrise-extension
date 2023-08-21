export default async function FetchCities(): Promise<FilteredCity[]> {
	const response = await fetch(
		"https://raw.githubusercontent.com/Kaosc/cities-geo-location-api/master/cities.json"
	)
	const data = await response.json()
	return data
}
