import { useEffect, useState, useRef, useCallback } from "react"

import { CalculatePassedDay, getLocalCity, saveCity } from "./utils/utils"

import City from "./components/City"
import Search from "./components/Search"
import Header from "./components/Header"

import FetchCities from "./api/FetchCities"
import FetchTimes from "./api/FetchTimes"
import Attribution from "./components/Attribution"

export default function App() {
	const [city, setCity] = useState<City | null>(null)
	const cities = useRef<FilteredCity[]>([])
	const inputRef = useRef<HTMLInputElement>(null)

	// Fetch cities only once at start
	useEffect(() => {
		FetchCities()
			.then((data) => (cities.current = data))
			.catch((e) => console.debug(e))
	}, [])

	// Fetch local storage city
	useEffect(() => {
		const localStorageCity = getLocalCity()

		if (localStorageCity && !city) {
			// If passed day is more than 1 day, fetch new times
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
			} else {
				setCity(localStorageCity)
			}
		}
	}, [city])

	const searchHandler = useCallback(async (e: any, clearInput: Function) => {
		// check is onClick or onKeyDown
		const search = inputRef.current?.value?.toLocaleLowerCase()
		const action = e.type === "click" || e.key === "Enter"

		if (action && search?.trim()) {
			// Find city
			const filteredCity: FilteredCity = cities.current.filter((city: FilteredCity) => {
				return city.name.toLowerCase().includes(search)
			})[0]

			// Fetch times
			if (filteredCity) {
				clearInput()

				await FetchTimes(filteredCity.lat, filteredCity.lng)
					.then((times) => {
						const city: City = {
							city: filteredCity,
							times: times,
							fetchDate: Date.now(),
						}

						// Set city & save to local storage
						setCity(city)
						saveCity(city)

						// Clear input
						if (inputRef.current) {
							inputRef.current.value = ""
						}
					})
					.catch((e) => console.debug(e))
			}
		}
	}, [])

	return (
		<main className="min-h-screen bg-gradient-to-r from-zinc-950 to-zinc-900">
			<div className="flex flex-col min-w-[300px] min-h-[250px] items-center justify-center bg-gradient-to-r from-zinc-950 to-zinc-900">
				<Header />
				<Search
					inputRef={inputRef}
					searchHandler={searchHandler}
				/>
				<City city={city} />
				<Attribution />
			</div>
		</main>
	)
}
