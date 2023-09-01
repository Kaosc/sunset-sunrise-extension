import { useEffect, useState, useRef, useCallback } from "react"
import cityTimezones, { CityData } from "city-timezones"

import {
	CalculatePassedDay,
	getLocalCity,
	getLocalCityName,
	getLocalTimeZoneMode,
	saveCity,
	saveCityName,
} from "./utils/utils"

import CityTimes from "./components/CityTimes"
import Search from "./components/Search"
import Header from "./components/Header"

import FetchTimes from "./api/FetchTimes"
import Footer from "./components/Footer"
import { City } from "./types"

const localCityData: City | undefined = getLocalCity()
const localCityName = getLocalCityName()

export default function App() {
	const [city, setCity] = useState<City | undefined>(localCityData)
	const [timeZoneMode, setTimeZoneMode] = useState(getLocalTimeZoneMode())

	const inputRef = useRef<HTMLInputElement>(null)
	const cityName = useRef(localCityName || "")

	useEffect(() => {
		localStorage.setItem("timeZoneMode", timeZoneMode)
	}, [timeZoneMode])

	useEffect(() => {
		if (localCityData) {
			if (CalculatePassedDay(localCityData.fetchDate) > 1) {
				FetchTimes(localCityData.data.lat, localCityData.data.lng)
					.then((times) => {
						const city: City = {
							...localCityData,
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

	const searchHandler = useCallback(async (e: any, clearInput: Function) => {
		const search = inputRef.current?.value?.toLowerCase().trim()
		const action = e.type === "click" || e.key === "Enter"

		if (action && search) {
			const exactCity = cityTimezones.cityMapping.find((cd) => {
				return cd.city?.toLowerCase() === search || cd.province?.toLowerCase() === search
			})
			const relevantCity: CityData[] = cityTimezones.cityMapping.filter((cd) => {
				return cd.city?.toLowerCase().includes(search) || cd.province?.toLowerCase()?.includes(search)
			})

			const filteredCityData = exactCity || relevantCity[0]

			if (filteredCityData) {
				// Set city name as searched city name or province name
				if (filteredCityData.city?.toLowerCase().includes(search)) {
					cityName.current = filteredCityData.city
				} else {
					cityName.current = filteredCityData.province
				}

				saveCityName(cityName.current)
				clearInput()

				await FetchTimes(filteredCityData.lat, filteredCityData.lng)
					.then((times) => {
						const city: City = {
							data: filteredCityData,
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

	return (
		<main className="min-h-screen bg-gradient-to-r from-zinc-950 to-zinc-900">
			<div className="flex flex-col items-center justify-center bg-gradient-to-r from-zinc-950 to-zinc-900">
				<Header />
				<Search
					inputRef={inputRef}
					searchHandler={searchHandler}
				/>
				<CityTimes
					city={city}
					timeZoneMode={timeZoneMode}
					cityName={cityName.current}
				/>
				<Footer
					setTimeZoneMode={setTimeZoneMode}
					timeZoneMode={timeZoneMode}
				/>
			</div>
		</main>
	)
}
