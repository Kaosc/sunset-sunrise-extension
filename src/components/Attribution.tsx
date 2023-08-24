import { SUNSET_SUNRISE_WEB } from "../utils/constants"

export default function Attribution() {
	return (
		<a
			className="text-sm text-gray-400 mb-3"
			href={SUNSET_SUNRISE_WEB}
			target="_blank"
			rel="noreferrer"
		>
			Times by <span className="hover:text-gray-100 font-semibold hover:animate-pulse">Sunset Sunrise</span>
		</a>
	)
}
