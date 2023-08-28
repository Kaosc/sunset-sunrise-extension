import { useEffect, useState, useRef, useCallback } from "react"

import { CalculatePassedDay, getLocalCity, getLocalTimeZoneMode, saveCity } from "./utils/utils"

import City from "./components/City"
import Search from "./components/Search"
import Header from "./components/Header"

import FetchCities from "./api/FetchCities"
import FetchTimes from "./api/FetchTimes"
import Footer from "./components/Footer"

export default function App() {
	const [city, setCity] = useState<City | undefined>(getLocalCity())
	const [timeZoneMode, setTimeZoneMode] = useState(getLocalTimeZoneMode())
	const cities = useRef<FilteredCity[]>([])
	const inputRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (cities.current.length > 0) return
		FetchCities()
			.then((data) => (cities.current = data))
			.catch((e) => console.debug(e))
	}, [])

	useEffect(() => {
		const localStorageCity = getLocalCity()
		if (localStorageCity) {
			if (CalculatePassedDay(localStorageCity.fetchDate) > 0) {
				FetchTimes(localStorageCity.city.lat, localStorageCity.city.lng)
					.then((times) => {
						const city: City = {
							city: localStorageCity.city,
							times: times,
							fetchDate: Date.now(),
						}
						saveCity(city)
						setCity(city)
					})
					.catch((e) => console.debug(e))
			}
		}
	}, [])

	useEffect(() => {
		localStorage.setItem("timeZoneMode", timeZoneMode)
	}, [timeZoneMode])

	const searchHandler = useCallback(async (e: any, clearInput: Function) => {
		const search = inputRef.current?.value?.toLowerCase().trim()
		const action = e.type === "click" || e.key === "Enter"

		if (action && search?.trim()) {
			const filteredCity: FilteredCity = cities.current.filter((city: FilteredCity) => {
				return city.name.toLowerCase().includes(search)
			})[0]

			if (filteredCity) {
				clearInput()

				await FetchTimes(filteredCity.lat, filteredCity.lng)
					.then((times) => {
						const city: City = {
							city: filteredCity,
							times: times,
							fetchDate: Date.now(),
						}

						setCity(city)
						saveCity(city)

						if (inputRef.current) {
							inputRef.current.value = ""
						}
					})
					.catch((e) => console.debug(e))
			}
		}
	}, [])

	// prettier-ignore
	return (
		<main className="min-h-screen bg-gradient-to-r from-zinc-950 to-zinc-900">
			<div className="flex flex-col items-center justify-center bg-gradient-to-r from-zinc-950 to-zinc-900">
				<Header />
				<Search inputRef={inputRef} searchHandler={searchHandler} />
				<City city={city} timeZoneMode={timeZoneMode} />
				<Footer setTimeZoneMode={setTimeZoneMode} timeZoneMode={timeZoneMode} />
			</div>
		</main>
	)
}
