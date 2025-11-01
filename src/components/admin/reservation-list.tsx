import { getReservations } from "@/lib/data";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/lib/utils";
import clsx from "clsx";

export default async function ReservationList() {
	const reservations = await getReservations()
	if (!reservations?.length) return <p className="mt-5">No reservations found</p>
	return (
		<div className="bg-white p-4 mt-5 shadow-sm">
			<table className="w-full divide-y divide-gray-200">
				<thead>
					<tr>
						<th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left ">Image</th>
						<th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left ">Customer Name</th>
						<th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left ">Room</th>
						<th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left ">Price</th>
						<th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left ">Created At</th>
						<th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase ">Status</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200 ">
					{reservations.map((reservation) => (
						<tr className="hover:bg-gray-100" key={reservation.id}>
							<td className="px-6 py-4 ">
								<div className="relative w-32 h-20">
									<Image src={reservation.room.image} alt={reservation.room.name} fill sizes={"20vw"} className="object-cover" />
								</div>
							</td>
							<td className="px-6 py-4 ">{reservation.user.name}</td>
							<td className="px-6 py-4 ">{reservation.room.name}</td>
							<td className="px-6 py-4 ">{formatCurrency(reservation.room.price)}</td>
							<td className="px-6 py-4 ">{formatDate(reservation.createdAt.toString())}</td>
							<td className={clsx("px-6 py-4 font-medium text-center", reservation.Payment && reservation.Payment.status === "PAID" ? "text-green-500" : "text-red-500")}>{reservation.Payment && reservation.Payment.status}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}