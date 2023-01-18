import "./styles/App.css"
import { useCallback, useEffect, useState, useRef } from "react"
import { GetTimeNow, CalculatePassedDay } from "./utils"

const fetchTimes = (lat, lng) =>
	fetch(`https://api.sunrise-sunset.org/json?lat=${lat}&lng=${lng}&formatted=0`)
		.then((response) => response.json())
		.then((data) => data.results)

const setLocalCity = (city) => localStorage.setItem("city", JSON.stringify(city))
const getLocalCity = () => JSON.parse(localStorage.getItem("city"))

export default function App() {
	const [city, setCity] = useState(null)
	const [cities, setCities] = useState([])
	const inputRef = useRef(null)

	useEffect(() => {
		if (cities.length === 0) {
			fetch("https://raw.githubusercontent.com/Kaosc/cities-geo-location-api/master/cities.json")
				.then((response) => response.json())
				.then((data) => setCities(data))
		}

		const localCity = getLocalCity()
		if (localCity) {
			if (CalculatePassedDay(localCity.fetchDate) > 0) {
				fetchTimes(localCity.city.lat, localCity.city.lng).then((data) => {
					const city = {
						city: localCity.city,
						times: data.results,
						fetchDate: GetTimeNow(),
					}

					setCity(city)
					setLocalCity(city)
				})
			} else {
				setCity(localCity)
			}
		}
	}, [])

	const searchHandler = async (e) => {
		if (e.key === "Enter" && e.target.value !== "") {
			const filteredCity = cities.find((city) => {
				return city.name.toLowerCase().includes(e.target.value.toLowerCase())
			})

			if (filteredCity) {
				await fetchTimes(filteredCity.lat, filteredCity.lng).then((times) => {
					console.log(times)
					const city = {
						city: filteredCity,
						times: times,
						fetchDate: GetTimeNow(),
					}

					setCity(city)
					setLocalCity(city)
					inputRef.current.value = ""
				})
			}
		}
	}

	const RenderCity = useCallback(() => {
		if (!city) return <h1 style={{ color: "#b8b8b83d" }}>Zzz</h1>

		const sunrise = new Date(city.times.sunrise)
		const sunset = new Date(city.times.sunset)

		return (
			<div>
				<h3 style={{ marginBottom: "15px" }}>{city.city.name}</h3>
				<h4 style={{ marginBottom: "0" }}>Sunrise: {sunrise.toLocaleTimeString()}</h4>
				<h4>Sunset: {sunset.toLocaleTimeString()}</h4>
			</div>
		)
	}, [city])

	return (
		<div className='App'>
			<input
				ref={inputRef}
				autoFocust={true}
				type='search'
				id='search'
				name='search'
				placeholder='Search City'
				onKeyDown={searchHandler}
			/>
			<RenderCity />
			<a href='https://sunrise-sunset.org/'>Times by Sunset Sunrise</a>
		</div>
	)
}
