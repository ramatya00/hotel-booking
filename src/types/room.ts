import { Prisma } from "@prisma/client";

export type RoomProps = Prisma.RoomGetPayload<{
	include: { RoomAmenities: { select: { amenitiesId: true } } }
}>

export type RoomDetailsProps = Prisma.RoomGetPayload<{
	include: {
		RoomAmenities: {
			include: {
				amenities: {
					select: {
						name: true,
					}
				}
			}
		}
	}
}>

export type DisabledDateProps = Prisma.ReservationGetPayload<{
	select: {
		startDate: true,
		endDate: true
	}
}>