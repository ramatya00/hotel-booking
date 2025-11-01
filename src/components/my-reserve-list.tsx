import { getReservationByUserId } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { differenceInCalendarDays } from "date-fns";
import Image from "next/image";
import Link from "next/link";

export default async function MyReserveList() {
	const reservation = await getReservationByUserId()
	if (!reservation) return <p className="text-gray-500">No reservation has been found</p>
	return (
		<div>
			<p className="text-gray-500">Here's your book history :</p>
			{reservation.map((item) => (
				<div className="bg-white shadow pb-4 mb-4 md:pb-0 relative" key={item.id}>
					<div className="flex items-center justify-between bg-gray-100 px-2 py-1 rouded-t-sm">
						<h1 className="text-sm font-medium text-gray-900 truncate">Reservation ID: {item.id}</h1>
						<div className="flex gap-1 px-3 py-1 text-sm font-normal">
							<span>Status:</span>
							<span className="font-bold uppercase">{item.Payment?.status}</span>
						</div>
					</div>
					<div className="items-start flex flex-col mb-4 bg-white rounded-sm md:flex-row md:w-full">
						<Image src={item.room.image} width={500} height={300} alt="image room" className="object-cover w-full rounded-t-sm h-60 md:h-auto md:w-1/3 md:rounded-none md:rounded-s-sm " />
						<div className="flex items-center gap-1 mb-3 font-normal text-gray-300 w-full">
							<div className="w-full px-5 py-2">
								<div className="flex items-center justify-between text-sm font-medium text-gray-900 truncate">
									<span>Price:</span>
									<span>{formatCurrency(item.room.price)}</span>
								</div>
								<div className="flex items-center justify-between text-sm font-medium text-gray-900 truncate">
									<span>Arrival:</span>
									<span>{formatDate(item.startDate.toISOString())}</span>
								</div>
								<div className="flex items-center justify-between text-sm font-medium text-gray-900 truncate">
									<span>Departure:</span>
									<span>{formatDate(item.endDate.toISOString())}</span>
								</div>
								<div className="flex items-center justify-between text-sm font-medium text-gray-900 truncate">
									<span>Duration:</span>
									<span>{differenceInCalendarDays(item.endDate, item.startDate)} <span className="ml-1">Night</span></span>
								</div>
								<div className="flex items-center justify-between text-sm font-medium text-gray-900 truncate">
									<span>Sub Total:</span>
									<span>{item.Payment && formatCurrency(item.Payment?.amount)}</span>
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-end justify-end absolute inset-4">
						{item.Payment?.status === "UNPAID" ? (
							<Link href={`/checkout/${item.id}`} className="px-6 py-1 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors">Pay Now</Link>
						) : (
							<Link href={`/myreservation/${item.id}`} className="px-5 py-1 bg-orange-400 text-white rounded-md hover:bg-orange-500 transition-colors">View Detail</Link>
						)}
					</div>
				</div>
			))}
		</div>
	)
}