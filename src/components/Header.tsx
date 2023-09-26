import { FiGithub } from "react-icons/fi"
import { FiStar } from "react-icons/fi"

import { GITHUB_REPO, WEB_STORE_URL } from "../utils/constants"

export default function Header() {
	return (
		<div className="flex flex-row items-center justify-center my-5">
			<img
				src="/assets/logo.png"
				alt="logo"
				width={22}
				height={22}
				className="mr-3"
			/>
			<h4 className="text-sm font-bold bg-gradient-to-r from-zinc-400 to-zinc-500 text-transparent bg-clip-text">
				Sunset Sunrise
			</h4>
			<a
				href={GITHUB_REPO}
				target="_blank"
				rel="noreferrer"
				className="ml-3 hover:text-gray-300 hover:animate-pulse"
			>
				<FiGithub
					size={16}
					className="text-gray-400 hover:text-white"
				/>
			</a>
			<a
				href={WEB_STORE_URL}
				target="_blank"
				rel="noreferrer"
				className="ml-3 hover:text-gray-300 hover:animate-pulse"
			>
				<FiStar
					size={16}
					className="text-gray-400 hover:text-white"
				/>
			</a>
		</div>
	)
}
