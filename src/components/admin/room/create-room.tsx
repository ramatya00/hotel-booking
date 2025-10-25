import CreateForm from "./create-form"
import { getAmenities } from "@/lib/data"

export default async function CreateRoom() {
	const amenities = await getAmenities();

	if (!amenities) return null;
	return (
		<div>
			<h1 className="text-3xl font-bold text-gray-800 mb-4">Create New Room</h1>
			<CreateForm amenities={amenities} />
		</div>
	)
}