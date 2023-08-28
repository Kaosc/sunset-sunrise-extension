import { useMemo } from "react"

import { FiSunrise, FiSunset } from "react-icons/fi"
import moment from "moment-timezone"
import cityTimezones from "city-timezones"

export default function City({
	city,
	cityName,
	timeZoneMode,
}: {
	city: City | undefined
	cityName: string
	timeZoneMode: string
}) {
	const times = useMemo(() => {
		// Get sunrise and sunset times from the API response
		const sunriseUtc = moment.utc(city?.times.sunrise)
		const sunsetUtc = moment.utc(city?.times.sunset)

		// Get the time zone for the location (e.g., 'America/New_York', 'Europe/Paris')
		let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone

		// If the time zone mode is 'actual', try to find the time zone by city name
		if (timeZoneMode === "actual" && city?.city?.city) {
			let tz = []

			// Try to find the time zone by city name
			tz = cityTimezones.lookupViaCity(city?.city?.city)

			/* 
				If the city name is not found, try to find the time zone by state 
				and get the first relevant result
			*/
			if (tz?.length === 0) {
				tz = cityTimezones.findFromCityStateProvince(city?.city?.city)
			}

			timeZone = tz[0]?.timezone || timeZone
		}

		// Convert to the specified time zone
		return {
			sunrise: sunriseUtc.tz(timeZone).format("HH:mm"),
			sunset: sunsetUtc.tz(timeZone).format("HH:mm"),
		}
	}, [city, timeZoneMode])

	return (
		<div className="items-center justify-center flex flex-col text-center mb-5">
			{!city ? (
				<img
					src="/assets/kitty-dark.png"
					alt="kitty"
					width={136}
					height={136}
					className="animate-pulse"
				/>
			) : (
				<>
					<h3 className="mb-3 p-1 text-3xl font-bold text-transparent bg-clip-text bg-slate-200">
						{cityName}
					</h3>
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
				</>
			)}
		</div>
	)
}
