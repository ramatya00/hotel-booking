import { Prisma } from "@prisma/client";

export type ReservationProps = Prisma.ReservationGetPayload<{
	include: {
		room: {
			select: {
				id: true;
				name: true;
				picture: true;
			}
		},
		user: {
			select: {
				name: true;
				email: true;
				phone: true;
			}
		},
		Payment: true
	}
}>
