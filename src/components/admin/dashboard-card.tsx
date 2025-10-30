import { LuChartArea, LuShoppingCart, LuUsers } from "react-icons/lu";
import { getRevenueAndReservation, getTotalCustomer } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function DashboardCard() {
	const [revenueAndReservation, totalCustomer] = await Promise.all([
		getRevenueAndReservation(),
		getTotalCustomer()
	])

	if (!revenueAndReservation || !totalCustomer) return notFound()

	return (
		<div className="grid md:grid-cols-3 gap-5 pb-10">
			<div className="flex items-center bg-white border rounded-md overflow-hidden shadow-sm">
				<div className="p-4 bg-green-400">
					<LuChartArea className="size-12 text-white" />
				</div>
				<div className="px-4 text-gray-700">
					<h3 className="text-sm tracking-wider">Total Revenue</h3>
					<p className="text-3xl">{formatCurrency(revenueAndReservation.revenue)}</p>
				</div>
			</div>
			<div className="flex items-center bg-white border rounded-md overflow-hidden shadow-sm">
				<div className="p-4 bg-red-400">
					<LuShoppingCart className="size-12 text-white" />
				</div>
				<div className="px-4 text-gray-700">
					<h3 className="text-sm tracking-wider">Total Reservation</h3>
					<p className="text-3xl">{revenueAndReservation?.reservation || 0}</p>
				</div>
			</div>
			<div className="flex items-center bg-white border rounded-md overflow-hidden shadow-sm">
				<div className="p-4 bg-blue-400">
					<LuUsers className="size-12 text-white" />
				</div>
				<div className="px-4 text-gray-700">
					<h3 className="text-sm tracking-wider">Total Customer</h3>
					<p className="text-3xl">{totalCustomer.length}</p>
				</div>
			</div>
		</div>
	)
}