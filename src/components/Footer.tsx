import React from "react"

import { SUNSET_SUNRISE_WEB } from "../utils/constants"
import CheckBox from "./CheckBox"

export default function Footer({
	timeZoneMode,
	setTimeZoneMode,
	hour12,
	setHour12,
}: {
	timeZoneMode: string
	setTimeZoneMode: React.Dispatch<React.SetStateAction<string>>
	hour12: boolean
	setHour12: React.Dispatch<React.SetStateAction<boolean>>
}) {
	const toggleTimeZoneMode = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTimeZoneMode(e.target.checked ? "actual" : "local")
	}

	const toggleTimeFormat = () => {
		const value = !hour12
		setHour12(value)
		localStorage.setItem("hour12", JSON.stringify(value))
	}

	return (
		<section className="flex flex-col items-center justify-center text-center text-gray-400 w-full">
			{/* // Toggle between the city's actual time zone and your local time zone */}
			<div className="flex items-center w-[78%] justify-between mb-2.5">
				<CheckBox
					onChange={toggleTimeZoneMode}
					value={timeZoneMode === "actual"}
					text={`${timeZoneMode === "local" ? "Local" : "Actual"} Time`}
				/>

				{/* // Toggle between 12 hour and 24 hour format */}
				<CheckBox
					onChange={toggleTimeFormat}
					value={hour12}
					text="12 Hour Format"
				/>
			</div>

			<a
				className="text-xs text-gray-400 mb-3"
				href={SUNSET_SUNRISE_WEB}
				target="_blank"
				rel="noreferrer"
			>
				Times by <span className="hover:text-zinc-100 font-semibold hover:animate-pulse">Sunset Sunrise</span>
			</a>
		</section>
	)
}
