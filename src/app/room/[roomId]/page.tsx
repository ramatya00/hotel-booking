import RoomDetails from "@/components/room-details"
import { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
	title: "Room Details",
}

export default async function RoomDetailsPage({ params }: { params: Promise<{ roomId: string }> }) {
	const roomId = (await params).roomId
	return (
		<div className="mt-16">
			<Suspense fallback={<div>Loading...</div>}>
				<RoomDetails roomId={roomId} />
			</Suspense>
		</div>
	)
}