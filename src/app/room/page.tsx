import { Metadata } from "next";
import HeaderSection from "@/components/header-section";
import Main from "@/components/main";
import { Suspense } from "react";
import RoomSkeleton from "@/components/skeletons/room-skeleton";

export const metadata: Metadata = {
	title: "Room",
	description: "Choose your best room today",
}

export default function Room() {
	return (
		<div>
			<HeaderSection title="Rooms & Rates" subTitle="Lorem ipsum dolor sit amet." />
			<div className="mt-10 px-4 ">
				<Suspense fallback={<RoomSkeleton />}>
					<Main />
				</Suspense>
			</div>
		</div>
	)
}