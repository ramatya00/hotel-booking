import { deleteRoom } from "@/lib/action";
import Link from "next/link";
import { IoTrashOutline, IoPencilOutline } from "react-icons/io5";

export function DeleteButton({ id, image }: { id: string, image: string }) {
	const deleteRoomById = deleteRoom.bind(null, id, image)
	return (
		<form action={deleteRoomById}>
			<button type="submit" className="rounded-sm p-1 hover:bg-gray-200 cursor-pointer">
				<IoTrashOutline className="size-5" />
			</button>
		</form>
	)
}

export function EditButton({ id }: { id: string }) {

	return (
		<Link href={`/admin/room/edit/${id}`} className="rounded-sm p-1 hover:bg-gray-200">
			<IoPencilOutline className="size-5" />
		</Link>
	)
}