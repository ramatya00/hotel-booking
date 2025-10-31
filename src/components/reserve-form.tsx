"use client"

import DatePicker from "react-datepicker";
import { addDays } from "date-fns"
import { useActionState, useState } from "react";
import "react-datepicker/dist/react-datepicker.css"
import { createReserve } from "@/lib/action";
import { RoomDetailsProps, DisabledDateProps } from "@/types/room";
import clsx from "clsx";

export default function ReserveForm({ room, disabledDate }: { room: RoomDetailsProps, disabledDate: DisabledDateProps[] }) {
	const StateDate = new Date()
	const EndDate = addDays(StateDate, 1)

	const [startDate, setStartDate] = useState(StateDate)
	const [endDate, setEndDate] = useState(EndDate)

	const handleDateChange = (dates: [Date | null, Date | null]) => {
		const [startDate, endDate] = dates
		setStartDate(startDate || StateDate)
		setEndDate(endDate || EndDate)
	}

	const [state, formAction, isPending] = useActionState(createReserve.bind(null, room.id, room.price, startDate, endDate), null)

	const excludeDate = disabledDate.map((date) => {
		return {
			start: date.startDate,
			end: date.endDate
		}
	})

	return (
		<div>
			<form action={formAction}>
				<div className="mb-4">
					<label className="block mb-2 text-sm font-medium text-gray-900">Arrival - Departure</label>
					<DatePicker
						selected={startDate}
						startDate={startDate}
						endDate={endDate}
						minDate={new Date()}
						selectsRange={true}
						onChange={handleDateChange}
						excludeDateIntervals={excludeDate}

						dateFormat="dd-MM-yyyy"
						wrapperClassName="w-full"
						className="py-2 px-4 rounded-md border border-gray-300 w-full"
					/>
					<div aria-live="polite" aria-atomic="true">
						<p className="text-sm text-red-500 mt-2">{state?.messageDate}</p>
					</div>
				</div>

				<div className="mb-4">
					<label className="block mb-2 text-sm font-medium text-gray-900">Your Name</label>
					<input type="text" name="name" className="py-2 px-4 rounded-md border border-gray-300 w-full" placeholder="Full Name" />
					<div aria-live="polite" aria-atomic="true">
						<p className="text-sm text-red-500 mt-2">{state?.error?.name}</p>
					</div>
				</div>

				<div className="mb-4">
					<label className="block mb-2 text-sm font-medium text-gray-900">Phone Number</label>
					<input type="text" name="phone" className="py-2 px-4 rounded-md border border-gray-300 w-full" placeholder="Phone Number" />
					<div aria-live="polite" aria-atomic="true">
						<p className="text-sm text-red-500 mt-2">{state?.error?.phone}</p>
					</div>
				</div>

				<button disabled={isPending} className={clsx("px-10 py-3 text-center font-semibold text-white w-full bg-orange-400 rounded-sm cursor-pointer hover:bg-orange-500 ", isPending && "opacity-50 cursor-progress")} type="submit">{isPending ? "Loading" : "Reserve"}</button>
			</form>
		</div>
	)
}