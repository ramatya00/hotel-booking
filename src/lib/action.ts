"use server"

import { prisma } from "./prisma";
import { contactSchema, roomSchema } from "./zod";
import { redirect } from "next/navigation";

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