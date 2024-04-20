import { useEffect, useState, useRef, useCallback } from "react"
import { CityData } from "city-timezones"

import CityDB from "./data/CityDB.json"

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
import ActivityIndicator from "./components/ActivityIndicator"

const localCityData: City | undefined = getLocalCity()
const localCityName = getLocalCityName()

export default function App() {
	const [city, setCity] = useState<City | undefined>(localCityData)
	const [hour12, setHour12] = useState(JSON.parse(localStorage.getItem("hour12") || "true"))
	const [timeZoneMode, setTimeZoneMode] = useState(getLocalTimeZoneMode())
	const [searchBarVisible, setSearchBarVisible] = useState(false)
	const [refreshing, setRefreshing] = useState(false)
	const [notFound, setNotFound] = useState("")
	const [searcing, setSearcing] = useState(false)

	const inputRef = useRef<HTMLInputElement>(null)
	const cityName = useRef(localCityName || "")

	useEffect(() => {
		localStorage.setItem("timeZoneMode", timeZoneMode)
	}, [timeZoneMode])

	useEffect(() => {
		if (localCityData) {
			if (CalculatePassedDay(localCityData.fetchDate) >= 1 || refreshing) {
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
					.catch((e) => console.error(e))
					.finally(() => setRefreshing(false))
			}
		}
	}, [refreshing])

	const searchHandler = useCallback(async (e: any, clearInput: Function) => {
		setSearcing(true)

		const search = inputRef.current?.value?.toLowerCase().trim()
		const action = e.type === "click" || e.key === "Enter"

		if (action && search) {
			const exactCity = CityDB.find((cd: CityData) => {
				return cd.city?.toLowerCase() === search || cd.province?.toLowerCase() === search
			})
			const relevantCity: CityData[] = CityDB.filter((cd: CityData) => {
				return cd.city?.toLowerCase().includes(search) || cd.province?.toLowerCase()?.includes(search)
			})

			const filteredCityData = exactCity || relevantCity[0]

			if (!filteredCityData) {
				setNotFound(search)
			} else {
				setNotFound("")
			}

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
					.catch((e) => console.error(e))
			}
		}

		setSearcing(false)
	}, [])

	const openSearchBar = () => {
		setSearchBarVisible(true)
		inputRef.current?.focus()
	}

	const closeSearchBar = () => {
		setSearchBarVisible(false)
	}

	return (
		<main
			className="bg-gradient-to-r from-zinc-950 to-zinc-900 px-3"
			onMouseEnter={openSearchBar}
			onMouseLeave={closeSearchBar}
		>
			<div className="flex flex-col items-center justify-center bg-gradient-to-r from-zinc-950 to-zinc-900">
				<Header />
				{searcing ? (
					<ActivityIndicator />
				) : (
					<>
						<div
							className={`transition-all ease-in-out ${
								searchBarVisible || !city
									? "animate-in fade-in-0 zoom-in-75 mb-8"
									: "animate-out zoom-out-75 fade-out-0 duration-500 mb-5"
							} `}
						>
							<div className={`${searchBarVisible || !city ? "" : "opacity-0 delay-500"}`}>
								<Search
									inputRef={inputRef}
									searchHandler={searchHandler}
									notFound={notFound}
									setNotFound={setNotFound}
								/>
							</div>
						</div>
						<div
							className={`transition-all ease-in-out 
						${
							searchBarVisible || !city
								? `animate-in slide-in-from-top-0 duration-300`
								: `animate-out slide-out-to-top-0 -mt-28 duration-700`
						} 
						${searchBarVisible && notFound ? "" : "-mt-16"}
					`}
						>
							<CityTimes
								city={city}
								timeZoneMode={timeZoneMode}
								cityName={cityName.current}
								refreshing={refreshing}
								setRefreshing={setRefreshing}
								hour12={hour12}
							/>
						</div>
						<Footer
							setTimeZoneMode={setTimeZoneMode}
							timeZoneMode={timeZoneMode}
							hour12={hour12}
							setHour12={setHour12}
						/>
					</>
				)}
			</div>
		</main>
	)
}
