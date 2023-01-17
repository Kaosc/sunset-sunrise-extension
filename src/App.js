import { useCallback, useEffect, useState, useRef } from "react"
import "./styles/App.css"

export default function App() {
	const [city, setCity] = useState({})
	const [times, setTimes] = useState({})
	const [cities, setCities] = useState([])
	const inputRef = useRef(null)

	useEffect(() => {
		if (cities.length > 0) return
		fetch("https://raw.githubusercontent.com/Kaosc/cities-geo-location-api/master/cities.json")
			.then((response) => response.json())
			.then((data) => setCities(data))
	}, [])

	const searchHandler = (e) => {
		if (e.key === "Enter" && e.target.value !== "") {
			const filteredCity = cities.find((city) => {
				return city.name.toLowerCase().includes(e.target.value.toLowerCase())
			})

			if (filteredCity) {
				fetch(
					`https://api.sunrise-sunset.org/json?lat=${filteredCity.lat}&lng=${filteredCity.lng}&date=today`
				)
					.then((response) => response.json())
					.then((data) => {
						setCity(filteredCity)
						setTimes(data.results)
						inputRef.current.value = ""
					})
			}
		}
	}

	const RenderCity = useCallback(() => {
		if (!city.name) return <h1 style={{ paddingLeft: "30px", color: "#b8b8b83d" }}>Zzz</h1>
		return (
			<div style={{ paddingLeft: "20px" }}>
				<h3 style={{ marginBottom: "15px" }}>{city.name}</h3>
				<h4 style={{ marginBottom: "0" }}>Sunrise: {times.sunrise}</h4>
				<h4>Sunset: {times.sunset}</h4>
			</div>
		)
	}, [city])

	return (
		<div className='App'>
			<main className='container'>
				<input
					ref={inputRef}
					autoFocust={true}
					style={{ margin: "20px", width: "300px", height: "50px" }}
					type='search'
					id='search'
					name='search'
					placeholder='Search City'
					onKeyDown={searchHandler}
				/>
				<RenderCity />
			</main>
		</div>
	)
}
