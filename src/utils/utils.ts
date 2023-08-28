export function CalculatePassedDay(deletedTime: number) {
	const oneDay = 24 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds
	return Math.round(Math.abs((Date.now() - deletedTime) / oneDay))
}

export const saveCity = (city: City) => localStorage.setItem("city", JSON.stringify(city))
export const getLocalCity = () => JSON.parse(localStorage.getItem("city")!)
export const getLocalTimeZoneMode = () => localStorage.getItem("timeZoneMode") || "local"
