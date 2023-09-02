import { useMemo, useState } from "react"
import moment from "moment-timezone"
import cityTimezones from "city-timezones"
import { FiSunrise, FiSunset } from "react-icons/fi"
import { IoMdRefresh } from "react-icons/io"

export default function CityTimes({
	city,
	cityName,
	timeZoneMode,
	refreshing,
	setRefreshing,
}: {
	city: City | undefined
	cityName: string
	timeZoneMode: string
	refreshing: boolean
	setRefreshing: React.Dispatch<React.SetStateAction<boolean>>
}) {
	console.log("CityTimes")
	const [visible, setVisible] = useState(false)

	const times = useMemo(() => {
		setVisible(false)

		// Get sunrise and sunset times from the API response
		const sunriseUtc = moment.utc(city?.times.sunrise)
		const sunsetUtc = moment.utc(city?.times.sunset)

		// Get the time zone for the location (e.g., 'America/New_York', 'Europe/Paris')
		let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

		// If the time zone mode is 'actual', try to find the time zone by city name
		if (timeZoneMode === "actual" && cityName) {
			let tz = []

			// Try to find the time zone by city name
			tz = cityTimezones.lookupViaCity(cityName)

			/* 
				If the city name is not found, try to find the time zone by state 
				and get the first relevant result
			*/
			if (tz?.length === 0) {
				tz = cityTimezones.findFromCityStateProvince(cityName)
			}

			timeZone = tz[0]?.timezone || timeZone
		}

		// Convert to the specified time zone
		return {
			sunrise: sunriseUtc.tz(timeZone).format("HH:mm"), // 12:00
			sunset: sunsetUtc.tz(timeZone).format("HH:mm"), // 23:00
		}
	}, [city, cityName, timeZoneMode])

	return (
		<div className="items-center justify-center flex flex-col text-center mb-4 transition-all ease-in-out">
			{!city ? (
				<img
					src="/assets/kitty-dark.png"
					alt="kitty"
					width={140}
					height={140}
					className="animate-pulse"
				/>
			) : (
				<>
					<div
						className="flex flex-col items-center justify-center transition-all ease-in-out"
						onMouseEnter={() => setVisible(true)}
						onMouseLeave={() => setVisible(false)}
					>
						<h3
							className={`p-1 text-4xl font-bold text-transparent bg-clip-text bg-slate-200 transition-all ease-in-out ${
								visible
									? "animate-in slide-in-from-bottom-0 duration-500"
									: "-mb-8 animate-out slide-out-to-bottom-0 duration-500"
							} `}
						>
							{cityName}
						</h3>
						<div
							className={`${visible ? "visible" : "invisible"} ${
								refreshing ? "animate-spin" : "animate-pulse"
							}`}
							title="Refresh"
						>
							<IoMdRefresh
								size={23}
								className={`text-[#ffffff] first-line:cursor-pointer animate-in m-3 slide-in-from-left-0 duration-300 transition-all ease-in-out 
								${visible ? "opacity-100 delay-0" : "opacity-0 delay-75"}`}
								onClick={() => setRefreshing(true)}
							/>
						</div>
					</div>
					<div
						className={`flex flex-col items-center justify-center transition-all ease-in-out ${
							refreshing ? "animate-out fade-out-0 duration-500 -mb-20" : `animate-in fade-in-0 duration-300`
						}`}
					>
						<div className={`${refreshing ? "opacity-0 delay-500" : "opacity-100 delay-0"}`}>
							<div className="flex items-center mb-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-[#caa23c] to-[#c9520d]">
								<h4 className="mr-3">Sunrise</h4>
								<FiSunrise
									size={25}
									className="text-[#df8a3a] mr-2"
								/>
								<h4>{times.sunrise}</h4>
							</div>
							<div className="flex items-center mb-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-[#757ab9] to-[#375cc2]">
								<h4 className="mr-3">Sunset</h4>
								<FiSunset
									size={25}
									className="text-[#757ab9] mr-2"
								/>
								<h4>{times.sunset}</h4>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}
