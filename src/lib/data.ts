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