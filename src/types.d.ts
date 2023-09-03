type City = {
	data: CityData
	times: Times
	fetchDate: number
}

interface Times {
	readonly sunrise: string
	readonly sunset: string
	readonly solar_noon: string
	readonly day_length: number
	readonly civil_twilight_begin: string
	readonly civil_twilight_end: string
	readonly nautical_twilight_begin: string
	readonly nautical_twilight_end: string
	readonly astronomical_twilight_begin: string
	readonly astronomical_twilight_end: string
}
