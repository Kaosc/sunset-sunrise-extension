export function CalculatePassedDay(fetchDate: number) {
	const oneDay = 24 * 60 * 60 * 1000 // h * min * sec * ms
	return Math.round(Math.abs((Date.now() - fetchDate) / oneDay))
}

export const saveCity = (city: City) => localStorage.setItem("city", JSON.stringify(city))
export const getLocalCity = () => JSON.parse(localStorage.getItem("city")!)
export const getLocalTimeZoneMode = () => localStorage.getItem("timeZoneMode") || "local"
