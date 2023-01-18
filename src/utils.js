export function GetTimeNow() {
	var dateObj = new Date()

	const year = dateObj.getFullYear()
	const month = dateObj.getMonth()
	const day = dateObj.getDate()

	return new Date(year, month, day)
}

export function CalculatePassedDay(deletedTime) {
	const oneDay = 24 * 60 * 60 * 1000 // hours * minutes * seconds * milliseconds

	const diffInDays = Math.round(
		Math.abs((GetTimeNow().getTime() - Date.parse(deletedTime)) / oneDay)
	)

	return diffInDays
}