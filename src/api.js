export async function FetchTimes(lat, lng) {
	const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`)
	const data = await response.json()
	return data.results
}

export async function FetchCities() {
  const response = await fetch("https://raw.githubusercontent.com/Kaosc/cities-geo-location-api/master/cities.json")
  const data = await response.json()
  return data
}