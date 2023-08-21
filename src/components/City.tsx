import { timeOptions } from "../utils/constants"
import { FiSunrise, FiSunset } from "react-icons/fi"

export default function City({ city }: { city: City | null }) {
	if (!city) return <h3 style={{ marginBottom: "15px" }}>Zzz</h3>

	const sunrise = new Date(city.times.sunrise)
	const sunset = new Date(city.times.sunset)
	return (
		<div className="items-center justify-center flex flex-col text-center mb-5">
			<h3 className="mb-2 text-3xl font-bold text-transparent bg-clip-text bg-slate-200">{city.city.name}</h3>

			<div className="flex items-center mb-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-[#caa23c] to-[#c9520d]">
				<h4 className="mr-3">Sunrise</h4>
				<FiSunrise
					size={25}
					className="text-[#df8a3a] mr-2"
				/>
				<h4>{sunrise.toLocaleTimeString([], timeOptions)}</h4>
			</div>
			<div className="flex items-center mb-2 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-l from-[#757ab9] to-[#375cc2]">
				<h4 className="mr-3">Sunset</h4>
				<FiSunset
					size={25}
					className="text-[#757ab9] mr-2"
				/>
				<h4>{sunset.toLocaleTimeString([], timeOptions)}</h4>
			</div>
		</div>
	)
}
