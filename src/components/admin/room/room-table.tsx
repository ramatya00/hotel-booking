import { getRooms } from "@/lib/data";
import Image from "next/image";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DeleteButton, EditButton } from "./button";

export default async function RoomTable() {
	const rooms = await getRooms()
	if (!rooms?.length) return <p className="mt-5">No rooms found</p>
	return (
		<div className="bg-white p-4 mt-5 shadow-sm">
			<table className="w-full divide-y divide-gray-200">
				<thead>
					<tr>
						<th className="px-6 py-3 w-32 text-sm font-bold text-gray-700 uppercase text-left ">Image</th>
						<th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left ">Room Name</th>
						<th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left ">Price</th>
						<th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase text-left ">Created At</th>
						<th className="px-6 py-3 text-sm font-bold text-gray-700 uppercase ">Actions</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200 ">
					{rooms.map((room) => (
						<tr className="hover:bg-gray-100" key={room.id}>
							<td className="px-6 py-4 ">
								<div className="relative w-32 h-20">
									<Image src={room.image} alt={room.name} fill sizes={"20vw"} className="object-cover" />
								</div>
							</td>
							<td className="px-6 py-4 ">{room.name}</td>
							<td className="px-6 py-4 ">{formatCurrency(room.price)}</td>
							<td className="px-6 py-4 ">{formatDate(room.createdAt.toString())}</td>
							<td className="px-6 py-4 text-right">
								<div className="flex items-center justify-center gap-2">
									<EditButton id={room.id} />
									<DeleteButton id={room.id} image={room.image} />
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}