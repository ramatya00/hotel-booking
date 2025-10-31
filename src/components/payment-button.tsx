"use client"

import { Reservation } from "@prisma/client";
import { useTransition } from "react";

declare global {
	interface Window {
		snap: {
			pay: (token: string) => void
		}
	}
}

export default function PaymentButton({ reservation }: { reservation: Reservation }) {
	const [isPending, startTransition] = useTransition()
	const handlePayment = async () => {
		startTransition(async () => {
			try {
				const response = await fetch(`/api/payment/${reservation.id}`, {
					method: "POST",
					body: JSON.stringify(reservation)
				})
				const { token } = await response.json()
				if (token) {
					window.snap.pay(token)
				}
			} catch (error) {
				console.log(error)
			}
		})
	}
	return (
		<button onClick={handlePayment} disabled={isPending} className="px-10 py-4 mt-2 text-center font-semibold text-white w-full bg-orange-400 rounded-sm hover:bg-orange-500 cursor-pointer">{isPending ? "Processing..." : "Process Payment"}</button>
	)
}