import "./styles/App.css"
import { useCallback, useEffect, useState, useRef } from "react"
import { GetTimeNow, CalculatePassedDay, getLocalCity, saveCity } from "./utils"
import { FetchCities, FetchTimes } from "./api"

const timeOptions = { hour12: false, hour: "2-digit", minute: "2-digit" }

export default function App() {
	const [city, setCity] = useState(null)
	const [cities, setCities] = useState([])
	const inputRef = useRef(null)

	// Fetch cities only once at start
	useEffect(() => {
		if (cities.length > 0) return

		FetchCities().then((cities) => {
			setCities(cities)
		}).catch((e) => console.log(e))
	}, [])

	// Fetch city only once at start
	useEffect(() => {
		if (city) return

		const localCity = getLocalCity()

		if (localCity) {
			if (CalculatePassedDay(localCity.fetchDate) > 0) {
				FetchTimes(localCity.city.lat, localCity.city.lng).then((times) => {
					const city = {
						city: localCity.city,
						times: times,
						fetchDate: GetTimeNow(),
					}

					saveCity(city)
					setCity(city)
				}).catch((e) => console.log(e))
			} else {
				setCity(localCity)
			}
		}
	}, [])

	const searchHandler = useCallback(async (e) => {
		if (e.key === "Enter" && e.target.value !== "") {

			const filteredCity = cities.find((city) => {
				return city.name.toLowerCase().includes(e.target.value.toLowerCase())
			})

			if (filteredCity) {
				FetchTimes(filteredCity.lat, filteredCity.lng).then((times) => {

					const city = {
						city: filteredCity,
						times: times,
						fetchDate: GetTimeNow(),
					}

					setCity(city)
					saveCity(city)
					inputRef.current.value = ""
				}).catch((e) => console.log(e))
			}
		}
	}, [])

	const RenderCity = useCallback(() => {
		if (!city) return <h1 style={{ color: "#b8b8b83d" }}>Zzz</h1>

		const sunrise = new Date(city.times.sunrise)
		const sunset = new Date(city.times.sunset)

		return (
			<div>
				<h3 style={{ marginBottom: "15px" }}>{city.city.name}</h3>
				<h4 style={{ marginBottom: "0" }}>Sunrise: {sunrise.toLocaleTimeString([], timeOptions)}</h4>
				<h4>Sunset: {sunset.toLocaleTimeString([], timeOptions)}</h4>
			</div>
		)
	}, [city])

	return (
		<div className='App'>
			<input
				ref={inputRef}
				autoFocus={city}
				type='search'
				id='search'
				name='search'
				placeholder='Search city'
				onKeyDown={searchHandler}
			/>
			<RenderCity />
			<a href='https://sunrise-sunset.org/'>Times by Sunset Sunrise</a>
		</div>
	)
}
