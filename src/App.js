import { useEffect, useState } from "react"
import "./styles/App.css"

export default function App() {
	const [city] = useState({
		id: 37517,
		name: "Ottawa",
		lat: 38.6,
		lng: -95.2642,
	})

	const [response, setResponse] = useState({})
	useEffect(() => {
		fetch(`https://api.sunrise-sunset.org/json?lat=${city.lat}&lng=${city.lng}&date=today`)
			.then((response) => response.json())
			.then((data) => setResponse(data.results))
	}, [city])

	return (
		<div className='App'>
			<h1>{city.name}</h1>
			<h2>Sunrise: {response.sunrise}</h2>
			<h2>Sunset: {response.sunset}</h2>
		</div>
	)
}
