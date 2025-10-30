import { getRoomDetailsById, getDisabledRoomById } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IoCheckmark, IoPeopleOutline } from "react-icons/io5";
import ReserveForm from "./reserve-form";

export default async function RoomDetails({ roomId }: { roomId: string }) {
	const [room, disabledDate] = await Promise.all([
		getRoomDetailsById(roomId),
		getDisabledRoomById(roomId)
	])

	if (!room || !disabledDate) return notFound()
	return (
		<div className="max-w-screen-xl py-16 px-4 grid lg:grid-cols-12 gap-8 mx-auto">
			<div className="md:col-span-8">
				<Image src={room.image} alt={room.name} width={770} height={430} priority className="w-full rounded-sm mb-8" />
				<h1 className="text-5xl font-semibold text-gray-900 mb-8">{room.name}</h1>
				<p>{room.description}</p>
				<h5 className="text-lg font-bold py-1 mt-1">Amenities:</h5>
				<div className="grid md:grid-cols-3">
					{room.RoomAmenities.map((amenity) => (
						<div key={amenity.id} className="flex items-center gap-2">
							<IoCheckmark className="size-5" />
							<span className="flex gap-1 py-1">{amenity.amenities.name}</span>
						</div>
					))}
				</div>
			</div>
			<div className="md:col-span-4">
				<div className="border-2 border-gray-300 border-dashed px-3 py-5 bg-slate-50 rounded-md">
					<div className="flex items-center justify-between mb-8">
						<div className="flex items-center space-x-2">
							<IoPeopleOutline className="size-4" />
							<span>{room.capacity} {room.capacity > 1 ? 'people' : 'person'}</span>
						</div>
						<div className="flex items-center">
							<span className="text-2xl font-semibold text-gray-600">{formatCurrency(room.price)}</span>
							<span className="text-gray-400 text-sm">/Night</span>
						</div>
					</div>
					{/* Reservation Form */}
					<ReserveForm room={room} disabledDate={disabledDate} />
				</div>
			</div>
		</div>
	)
}