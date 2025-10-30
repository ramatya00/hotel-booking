import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export const getAmenities = async () => {
	const session = await auth()
	if (!session || !session.user) throw new Error("Unauthorized")
	try {
		const result = await prisma.amenities.findMany({})
		return result;
	} catch (error) {
		console.log(error)
	}
}

export const getRooms = async () => {
	try {
		const result = await prisma.room.findMany({
			orderBy: {
				createdAt: "desc"
			}
		})
		return result;
	} catch (error) {
		console.log(error)
	}
}

export const getRoomById = async (id: string) => {
	try {
		const result = await prisma.room.findUnique({
			where: { id },
			include: { RoomAmenities: { select: { amenitiesId: true } } }
		})
		return result;
	} catch (error) {
		console.log(error)
	}
}

export const getRoomDetailsById = async (id: string) => {
	try {
		const result = await prisma.room.findUnique({
			where: {
				id
			},
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
		})
		return result;
	} catch (error) {
		console.log(error)
	}
}

export const getReservationById = async (id: string) => {
	try {
		const result = await prisma.reservation.findUnique({
			where: {
				id
			},
			include: {
				room: {
					select: {
						name: true,
						image: true,
						price: true
					}
				},
				user: {
					select: {
						name: true,
						email: true,
						phone: true,
					}
				},
				Payment: true
			}
		})
		return result;
	} catch (error) {
		console.log(error)
	}
}

export const getDisabledRoomById = async (roomId: string) => {
	try {
		const result = await prisma.reservation.findMany({
			select: {
				startDate: true,
				endDate: true
			},
			where: {
				roomId,
				Payment: {
					status: { not: "FAILED" }
				}
			}
		})
		return result;
	} catch (error) {
		console.log(error)
	}
}

export const getReservationByUserId = async () => {
	const session = await auth();
	if (!session || !session.user || !session.user.id) throw new Error("Unauthorized user")
	try {
		const result = await prisma.reservation.findMany({
			where: {
				userId: session.user.id
			},
			include: {
				room: {
					select: {
						name: true,
						image: true,
						price: true
					}
				},
				user: {
					select: {
						name: true,
						email: true,
						phone: true,
					}
				},
				Payment: true
			},
			orderBy: {
				createdAt: "desc"
			}
		})
		return result;
	} catch (error) {
		console.log(error)
	}
}