import { getAmenities, getRoomById } from "@/lib/data"
import EditForm from "./edit-form";
import { notFound } from "next/navigation";

export default async function EditRoom({ roomId }: { roomId: string }) {
	const [amenities, room] = await Promise.all([getAmenities(), getRoomById(roomId)])
	if (!amenities || !room) return notFound();
	return (
		<div>
			<h1 className="text-3xl font-bold text-gray-800 mb-4">Edit a Room</h1>
			<EditForm amenities={amenities} room={room} />
		</div>
	)
}