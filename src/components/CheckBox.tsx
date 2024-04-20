import React from "react"

export default function CheckBox({
	value,
	onChange,
	text,
}: {
	value: boolean
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	text?: string
}) {
	return (
		<div className="flex items-center justify-center mb-2">
			<label
				className="relative flex items-center rounded-full cursor-pointer"
				htmlFor="checkbox"
			>
				<input
					type="checkbox"
					className="before:content[''] peer relative h-[18px] w-[18px] cursor-pointer appearance-none rounded-full border border-zinc-600 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-gray-900 checked:bg-zinc-600 checked:before:bg-gray-900 hover:before:opacity-10"
					id="checkbox"
					checked={value}
					onChange={onChange}
				/>
				<span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
					<svg
						className="h-3 w-3"
						viewBox="0 0 20 20"
						fill="currentColor"
						stroke="currentColor"
						strokeWidth="1"
					>
						<path
							fill-rule="evenodd"
							d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
							clip-rule="evenodd"
						></path>
					</svg>
				</span>
			</label>
			{text ? <span className="ml-1 text-[13px] font-medium text-gray-400 ">{text}</span> : <></>}
		</div>
	)
}
