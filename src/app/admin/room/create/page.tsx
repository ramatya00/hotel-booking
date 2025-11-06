import CreateRoom from "@/components/admin/room/create-room";
import { auth } from "@/auth";
import { redirect } from "next/navigation";


export default async function RoomCreatePage() {
	const session = await auth();
	if (!session || session.user.role !== "ADMIN") {
		return redirect("/");
	}
	return <div className="max-w-screen-xl px-4 py-16 mt-10 mx-auto">
		<CreateRoom />
	</div>
}