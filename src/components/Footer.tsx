import React from "react"

import { SUNSET_SUNRISE_WEB } from "../utils/constants"

export default function Footer({
	timeZoneMode,
	setTimeZoneMode,
}: {
	timeZoneMode: string
	setTimeZoneMode: React.Dispatch<React.SetStateAction<string>>
}) {
	return (
		<section className="flex flex-col items-center justify-center text-center text-gray-400">
			<label className="relative inline-flex items-center mb-5 cursor-pointer">
				<input
					type="checkbox"
					value={timeZoneMode}
					checked={timeZoneMode === "actual"}
					className="sr-only peer"
					onChange={(e) => setTimeZoneMode(e.target.checked ? "actual" : "local")}
				/>
				<div
					className="w-8 h-4 bg-[#2b2b2b] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px]
				 after:bg-white after:border after:rounded-full after:h-[16px] after:w-[16px] after:transition-all peer-checked:bg-[#575757]"
				></div>
				<span className="ml-3 text-sm font-medium text-gray-400">
					{timeZoneMode === "local" ? "Local" : "Actual"} Time{" "}
				</span>
			</label>
			<a
				className="text-xs text-gray-400 mb-3"
				href={SUNSET_SUNRISE_WEB}
				target="_blank"
				rel="noreferrer"
			>
				Times by <span className="hover:text-gray-100 font-semibold hover:animate-pulse">Sunset Sunrise</span>
			</a>
		</section>
	)
}
