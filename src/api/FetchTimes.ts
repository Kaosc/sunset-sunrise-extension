export default async function FetchTimes(lat: number, lng:number) {
	const response = await fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`)
	const data = await response.json()
	return data.results
}