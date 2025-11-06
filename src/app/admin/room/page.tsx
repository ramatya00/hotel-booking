import RoomTable from "@/components/admin/room/room-table";
import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function RoomPage() {
	const session = await auth();
	if (!session || session.user.role !== "ADMIN") {
		return redirect("/");
	}
	return <div className="max-w-screen-xl px-4 py-16 mt-10 mx-auto">
		<div className="flex items-center justify-between">
			<h1 className="text-4xl font-bold text-gray-800">Room List</h1>
			<Link href={"/admin/room/create"} className="bg-orange-400 px-6 py-2.5 hover:bg-orange-500 text-white font-bold">Create Room</Link>
		</div>
		<div className="h-[1px] bg-gray-300 my-5"></div>
		<Suspense fallback={<div>Loading...</div>}>
			<RoomTable />
		</Suspense>
	</div>
}