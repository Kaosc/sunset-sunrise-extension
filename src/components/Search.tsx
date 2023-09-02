"use client"

import React from "react"
import { BiSearchAlt2 } from "react-icons/bi"
import { IoIosClose } from "react-icons/io"

export default function Search({
	inputRef,
	searchHandler,
}: {
	inputRef: React.MutableRefObject<HTMLInputElement | null>
	searchHandler: (e: any, clearInput: Function) => void
}) {
	const [visible, setVisible] = React.useState(false)

	const onTextChange = () => {
		if (inputRef.current?.value) setVisible(true)
		else setVisible(false)
	}

	const clearInput = () => {
		if (inputRef.current) {
			inputRef.current.blur()
			inputRef.current.value = ""
			setVisible(false)
		}
	}

	const handler = (e: any) => {
		searchHandler(e, clearInput)
	}

	return (
		<div className="animate-in fade-in-0 duration-500 relative flex flex-row w-60 h-10 mb-5 items-center justify-center rounded-full transition-all ease-in-out bg-zinc-800  focus:ring-2 focus:ring-slate-500 focus:ring-opacity-50 hover:bg-zinc-700">
			<button
				className="absolute left-3 bottom-[8px] hover:scale-110 transition-all ease-in-out"
				onClick={handler}
			>
				<BiSearchAlt2
					size={24}
					className="text-gray-400  hover:text-white"
				/>
			</button>
			<input
				className="ml-[41px] mr-9 overflow-hidden text-gray-300 text-center text-xl outline-none bg-transparent"
				ref={inputRef}
				required
				autoFocus={true}
				onChange={onTextChange}
				name="search"
				placeholder="Search city"
				onKeyDown={handler}
			/>
			{visible && (
				<button
					className="absolute right-1 bottom-[4px] hover:scale-110 transition-all ease-in-out"
					onClick={clearInput}
				>
					<IoIosClose
						size={30}
						className="text-gray-400 hover:text-white"
					/>
				</button>
			)}
		</div>
	)
}
