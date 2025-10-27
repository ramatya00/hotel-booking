"use client"

import { IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5"
import { useRef, useState, useTransition, useActionState } from "react"
import { PutBlobResult } from "@vercel/blob"
import Image from "next/image"
import { BarLoader } from "react-spinners"
import { Amenities } from "@prisma/client"
import { type RoomProps } from "@/types/room"
import { updateRoom } from "@/lib/action"
import clsx from "clsx"

export default function EditForm({ amenities, room }: { amenities: Amenities[], room: RoomProps }) {
	const inputFileRef = useRef<HTMLInputElement>(null)
	const [image, setImage] = useState(room.image)
	const [message, setMessage] = useState("")
	const [pending, startTransition] = useTransition()

	const handleUpload = async () => {
		if (!inputFileRef.current?.files) return null;
		const file = inputFileRef.current.files[0];
		const formData = new FormData();
		formData.set("file", file);
		startTransition(async () => {
			try {
				const response = await fetch("/api/upload", {
					method: "PUT",
					body: formData,
				})
				const result = await response.json()
				if (response.status !== 200) setMessage(result.message)
				const img = result as PutBlobResult;
				setImage(img.url)
			} catch (error) {
				console.log(error)
			}
		})
	}

	const deleteImage = (imageUrl: string) => {
		startTransition(async () => {
			try {
				const response = await fetch(`/api/upload?imageUrl=${imageUrl}`, {
					method: "DELETE",
				})
				setImage("")
			} catch (error) {
				console.log(error)
			}
		})
	}

	const [state, formAction, isPending] = useActionState(updateRoom.bind(null, room.id, image), null)

	const checkedAmenities = room.RoomAmenities.map((roomAmenity) => roomAmenity.amenitiesId)

	return (
		<form action={formAction}>
			<div className="grid md:grid-cols-12 gap-5">
				<div className="col-span-12 md:col-span-8 bg-white p-4">
					<div className="mb-4">
						<input type="text" name="name" placeholder="Room name..." defaultValue={room.name} className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
						<div className="" aria-live="polite" aria-atomic="true">
							<span className="text-sm text-red-500 mt-2">{state?.error?.name}</span>
						</div>
					</div>
					<div className="mb-4">
						<textarea name="description" rows={8} placeholder="Description" defaultValue={room.description} className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
						<div className="" aria-live="polite" aria-atomic="true">
							<span className="text-sm text-red-500 mt-2">{state?.error?.description}</span>
						</div>
					</div>
					<div className="mb-4">
						<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
							{amenities.map((amenity) => (
								<div className="flex items-center mb-4" key={amenity.id}>
									<input type="checkbox" name="amenities" defaultValue={amenity.id} defaultChecked={checkedAmenities.includes(amenity.id)} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded" />
									<label className="ms-2 text-sm font-medium text-gray-900 capitalize">{amenity.name}</label>
								</div>
							))}
						</div>
						<div className="" aria-live="polite" aria-atomic="true">
							<span className="text-sm text-red-500 mt-2">{state?.error?.amenities}</span>
						</div>
					</div>
				</div>
				<div className="col-span-12 md:col-span-4 bg-white p-4">
					<label htmlFor="input-file" className="flex flex-col mb-4 items-center justify-center aspect-video border-2 border-gray-300 border-dashed rounded-md bg-gray-50 relative cursor-pointer">
						<div className="flex flex-col items-center justify-center text-gray-500 pt-5 pb-6 z-10">
							{pending ? <BarLoader /> : null}
							{image ? <button type="button" onClick={() => deleteImage(image)} className="flex items-center justify-center size-6 rounded-sm absolute right-1 top-1 text-white bg-red-400">
								<IoTrashOutline className="size-4" />
							</button> : <div className="flex flex-col items-center justify-center">
								<IoCloudUploadOutline className="size-8" />
								<p className="mb-1 text-sm font-bold">Select Image</p>
								{message ? <p className="text-xs text-red-500">{message}</p> : <p className="text-xs">SVG, PNG, JPG, GIF, or Others (Max: 4MB)</p>}
							</div>}
						</div>
						{!image ? <input type="file" id="input-file" className="hidden" ref={inputFileRef} onChange={handleUpload} /> : <Image src={image} alt="room" width={640} height={360} className="rounded-md absolute aspect-video object-cover" />}
					</label>
					<div className="mb-4">
						<input type="text" name="price" placeholder="Price..." defaultValue={room.price} className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
						<div className="" aria-live="polite" aria-atomic="true">
							<span className="text-sm text-red-500 mt-2">{state?.error?.price}</span>
						</div>
					</div>
					<div className="mb-4">
						<input type="text" name="capacity" placeholder="Capacity..." defaultValue={room.capacity} className="py-2 px-4 rounded-sm border border-gray-400 w-full" />
						<div className="" aria-live="polite" aria-atomic="true">
							<span className="text-sm text-red-500 mt-2">{state?.error?.capacity}</span>
						</div>
					</div>
					{/* General Message */}
					{state?.message ? <div className="mb-4 bg-red-200 p-2"><span className="text-sm text-gray-700 mt-2">{state?.message}</span></div> : null}
					<button disabled={isPending} className={clsx("bg-orange-400 text-white w-full hover:bg-orange-500 py-2.5 px-6 md:px-10 text-lg font-semibold cursor-pointer", isPending && "opacity-50 cursor-progress")} type="submit">{isPending ? "Updating..." : "Update Room"}</button>
				</div>
			</div>
		</form>
	)
}