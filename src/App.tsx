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

import City from "./components/City"
import Search from "./components/Search"
import Header from "./components/Header"

import FetchTimes from "./api/FetchTimes"
import Footer from "./components/Footer"

const localCityData = getLocalCity()
const localCityName = getLocalCityName()

export default function App() {
	const [city, setCity] = useState<City | undefined>(localCityData)
	const [timeZoneMode, setTimeZoneMode] = useState(getLocalTimeZoneMode())

	const inputRef = useRef<HTMLInputElement>(null)
	const cityName = useRef(localCityName || "")

	useEffect(() => {
		if (localCityData) {
			if (CalculatePassedDay(localCityData.fetchDate) > 0) {
				FetchTimes(localCityData.data.lat, localCityData.data.lng)
					.then((times) => {
						const city: City = {
							data: localCityData,
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
			// find exact match
			const exactMatch = cityTimezones.cityMapping.find((cityData) => {
				const cityDataCityName = cityData.city?.toLowerCase()
				const cityDataProvinceName = cityData.province?.toLowerCase()

				if (cityDataCityName === search) {
					return true
				} else if (cityDataProvinceName === search) {
					return true
				} else {
					return false
				}
			})

			// find includes match
			const filteredCityDatas: CityData = cityTimezones.cityMapping.filter((cityData) => {
				const cityDataCityName = cityData.city?.toLowerCase()
				const cityDataProvinceName = cityData.province?.toLowerCase()

				if (cityData.city === search) {
					return true
				} else if (cityDataCityName.includes(search)) {
					return true
				} else if (cityDataProvinceName?.includes(search)) {
					return true
				} else {
					return false
				}
			})[0]

			if (exactMatch || filteredCityDatas) {
				const filteredCityData = exactMatch || filteredCityDatas

				// Set city name
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
				<City city={city} timeZoneMode={timeZoneMode} cityName={cityName.current} />
				<Footer setTimeZoneMode={setTimeZoneMode} timeZoneMode={timeZoneMode} />
			</div>
		</main>
	)
}
