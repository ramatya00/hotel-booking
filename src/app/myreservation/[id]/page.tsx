import { Metadata } from "next"
import ReservationDetail from "@/components/reservation-detail"
import { Suspense } from "react"

export const metadata: Metadata = {
	title: "Reservation Detail",
}

export default async function MyReservationDetail({ params }: { params: Promise<{ id: string }> }) {
	const reservationId = (await params).id
	return (
		<div className="max-w-screen-lg mx-auto mt-10 py-20 px-4">
			{/* Reservation Detail */}
			<Suspense fallback={<div>Loading...</div>}>
				<ReservationDetail reservationId={reservationId} />
			</Suspense>
		</div>
	)
}