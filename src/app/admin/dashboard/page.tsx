import DashboardCard from "@/components/admin/dashboard-card";
import { Metadata } from "next";
import { Suspense } from "react";
import ReservationList from "@/components/admin/reservation-list";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
	title: "Admin Dashboard",
}

export default async function AdminDashboard() {
	const session = await auth();
	if (!session || session.user.role !== "ADMIN") {
		return redirect("/");
	}
	return <div className="max-w-screen-xl px-4 py-16 mt-10 mx-auto">
		<h1 className="text-4xl font-bold text-gray-800 mb-3">Admin Dashboard</h1>
		<Suspense fallback={<div>Loading...</div>}>
			<DashboardCard />
		</Suspense>
		<Suspense fallback={<div>Loading...</div>}>
			<ReservationList />
		</Suspense>
	</div>
}