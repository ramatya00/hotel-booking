"use server"

import { prisma } from "./prisma";
import { contactSchema, reserveSchema, roomSchema } from "./zod";
import { redirect } from "next/navigation";
import { del } from "@vercel/blob"
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { differenceInCalendarDays } from "date-fns";

type FormState = {
	message?: string
	error?: {
		name?: string
		email?: string
		subject?: string
		message?: string
	}
} | null

export const ContactMessage = async (
	previousState: FormState,
	formData: FormData
): Promise<FormState> => {
	const validatedFields = contactSchema.safeParse(Object.fromEntries(formData.entries()));

	if (!validatedFields.success) {
		const errors = validatedFields.error.flatten().fieldErrors
		return {
			error: {
				name: errors.name?.[0],
				email: errors.email?.[0],
				subject: errors.subject?.[0],
				message: errors.message?.[0],
			}
		}
	}

	const { name, email, subject, message } = validatedFields.data;

	try {
		await prisma.contact.create({
			data: {
				name,
				email,
				subject,
				message,
			}
		})
		return { message: "Thanks for your message! We will get back to you soon." }
	} catch (error) {
		return { error: { message: "Something went wrong. Please try again later." } }
	}
}

export const saveRoom = async (image: string, prevState: unknown, formData: FormData) => {
	if (!image) return { message: "Image is required" }

	const rawData = {
		name: formData.get("name"),
		description: formData.get("description"),
		capacity: formData.get("capacity"),
		price: formData.get("price"),
		amenities: formData.getAll("amenities"),
	}

	const validatedFields = roomSchema.safeParse(rawData);

	if (!validatedFields.success) {
		return { error: validatedFields.error.flatten().fieldErrors }
	}

	const { name, description, capacity, price, amenities } = validatedFields.data;

	try {
		await prisma.room.create({
			data: {
				name,
				description,
				image,
				capacity,
				price,
				RoomAmenities: {
					createMany: {
						data: amenities.map((amenity) => ({
							amenitiesId: amenity,
						}))
					}
				}
			}
		})
	} catch (error) {
		console.log(error)
	}

	redirect("/admin/room");
}

export const deleteRoom = async (id: string, image: string) => {
	try {
		await del(image)
		await prisma.room.delete({
			where: {
				id,
			}
		})
	} catch (error) {
		console.log(error)
	}
	revalidatePath("/admin/room")
}

export const updateRoom = async (id: string, image: string, prevState: unknown, formData: FormData) => {
	if (!image) return { message: "Image is required" }

	const rawData = {
		name: formData.get("name"),
		description: formData.get("description"),
		capacity: formData.get("capacity"),
		price: formData.get("price"),
		amenities: formData.getAll("amenities"),
	}

	const validatedFields = roomSchema.safeParse(rawData);

	if (!validatedFields.success) {
		return { error: validatedFields.error.flatten().fieldErrors }
	}

	const { name, description, capacity, price, amenities } = validatedFields.data;

	try {
		await prisma.$transaction([
			prisma.room.update({
				where: {
					id,
				},
				data: {
					name,
					description,
					image,
					capacity,
					price,
					RoomAmenities: {
						deleteMany: {}
					}
				}
			}),
			prisma.roomAmenities.createMany({
				data: amenities.map((amenity) => ({
					amenitiesId: amenity,
					roomId: id,
				}))
			})
		])
	} catch (error) {
		console.log(error)
	}

	revalidatePath("/admin/room")
	redirect("/admin/room");
}

export const createReserve = async (id: string, price: number, startDate: Date, endDate: Date, prevState: unknown, formData: FormData) => {
	const session = await auth();

	if (!session || !session.user || !session.user.id) redirect(`/signin?redirect_url=room/${id}`);

	const rawData = {
		name: formData.get("name"),
		phone: formData.get("phone"),
	}

	const validatedFields = reserveSchema.safeParse(rawData);

	if (!validatedFields.success) {
		return { error: validatedFields.error.flatten().fieldErrors }
	}

	const { name, phone } = validatedFields.data;
	const night = differenceInCalendarDays(endDate, startDate)
	if (night <= 0) return { messageDate: "Date must be at least 1 night" }
	const total = night * price

	let reservationId
	try {
		await prisma.$transaction(async (tx) => {
			await tx.user.update({
				where: {
					id: session.user.id,
				},
				data: {
					name,
					phone,
				}
			});
			const reservation = await tx.reservation.create({
				data: {
					startDate,
					endDate,
					price,
					roomId: id,
					userId: session.user.id as string,
					Payment: {
						create: {
							amount: total,
						}
					}
				}
			})
			reservationId = reservation.id
		})
	} catch (error) {
		console.log(error)
	}

	redirect(`/checkout/${reservationId}`)
}