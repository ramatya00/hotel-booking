import { put, del } from "@vercel/blob"
import { NextRequest, NextResponse } from "next/server"

export const PUT = async (request: NextRequest) => {
	const form = await request.formData()
	const file = form.get("file") as File;

	if (file.size === 0 || file.size === undefined) return NextResponse.json({ message: "File is required" }, { status: 400 })
	if (file.size >= 4000000) return NextResponse.json({ message: "File must be less than 4MB" }, { status: 400 })
	if (!file.type.startsWith("image/")) return NextResponse.json({ message: "File must be an image" }, { status: 400 })

	const blob = await put(file.name, file, {
		access: "public",
		multipart: true,
	})

	return NextResponse.json(blob)
}

export const DELETE = async (request: NextRequest) => {
	const { searchParams } = new URL(request.url);
	const imageUrl = searchParams.get("imageUrl") as string;
	await del(imageUrl);
	return NextResponse.json({ message: "Image deleted successfully", status: 200 });
}
