import { useEffect, useState, useRef, useCallback } from "react"

import { CalculatePassedDay, getLocalCity, saveCity } from "./utils/utils"
import { LOGO_URL } from "./utils/constants"
import FetchCities from "./api/FetchCities"
import FetchTimes from "./api/FetchTimes"
import City from "./components/City"
import Search from "./components/Search"

export default function App() {
	const [city, setCity] = useState<City | null>(null)
	const cities = useRef<FilteredCity[]>([])
	const inputRef = useRef<HTMLInputElement>(null)

	// Fetch cities only once at start
	useEffect(() => {
		FetchCities()
			.then((data) => (cities.current = data))
			.catch((e) => console.log(e))
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
					.catch((e) => console.log(e))
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
					.catch((e) => console.warn(e))
			}
		}
	}, [])

	return (
		<div className="flex flex-col items-center justify-center bg-gradient-to-r from-zinc-950 to-zinc-900">
			<div className="flex flex-row items-center justify-center my-5">
				<img
					src={LOGO_URL}
					alt="logo"
					width={23}
					height={23}
					className="mr-2"
				/>
				<h4 className="text-base font-bold bg-gradient-to-r from-zinc-400 to-zinc-500 text-transparent bg-clip-text">
					Sunset Sunrise
				</h4>
			</div>

			<Search
				inputRef={inputRef}
				searchHandler={searchHandler}
			/>

			<City city={city} />

			<a
				className="text-sm text-gray-400 mb-3"
				href="https://sunrise-sunset.org/"
			>
				Times by Sunset Sunrise
			</a>
		</div>
	)
}

// #0d0e14
// #252136