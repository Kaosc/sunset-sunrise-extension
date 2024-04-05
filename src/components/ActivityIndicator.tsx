export default function ActivityIndicator() {
	return (
		<div
			role="status"
			className="flex w-[300px] h-[215px] justify-center items-center"
		>
			<div
				className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-current border-e-transparent   text-orange-500"
				role="status"
			></div>
		</div>
	)
}
