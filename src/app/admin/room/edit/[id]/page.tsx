import EditRoom from "@/components/admin/room/edit-room"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { auth } from "@/auth"
import { redirect } from "next/navigation"


export default async function EditRoomPage({ params }: { params: Promise<{ id: string }> }) {
	const session = await auth();
	const role = session?.user?.role;
	if (role !== "ADMIN") redirect("/");
	const roomId = (await params).id
	if (!roomId) return notFound()

	return (
		<div className="max-w-screen-xl px-4 py-16 mt-10 mx-auto">
			<Suspense fallback={<p>Loading...</p>}>
				<EditRoom roomId={roomId} />
			</Suspense>
		</div>
	)
}