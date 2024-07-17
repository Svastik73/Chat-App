"use client";

import { useTheme } from "next-themes";
import RightPanel from "@/components/home/right-panel";
import LeftPanel from "@/components/home/left-panel";
export default function Home() {
	const { setTheme } = useTheme();

	return (
		<main className='m-5'>
	<div className='flex overflow-y-hidden h-[calc(100vh-50px)] max-w-[1700px] mx-auto bg-left-panel'>
		{/* Green background decorator for Light Mode */}
		<div className='fixed top-0 left-0 w-full h-36 bg-green-primary dark:bg-transparent -z-30' />
		<LeftPanel /> {/*This color bg-green-primary is in global.css   */}
		<RightPanel />
	</div>
</main>
	);
}