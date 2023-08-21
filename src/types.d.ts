type City = {
	city: FilteredCity
	times: {
		sunrise: string
		sunset: string
	}
	fetchDate: number
}

type FilteredCity = {
	id: number
	name: string
	lat: number
	lng: number
}
