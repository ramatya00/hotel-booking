import DashboardCard from "@/components/admin/dashboard-card";
import { Metadata } from "next";
import { Suspense } from "react";
import ReservationList from "@/components/admin/reservation-list";

export const metadata: Metadata = {
	title: "Admin Dashboard",
}

export default function AdminDashboard() {
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