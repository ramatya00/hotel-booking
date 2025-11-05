import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function getSession(request: NextRequest) {
	const token = await getToken({
		req: request,
		secret: process.env.AUTH_SECRET
	});

	return token ? {
		user: {
			id: token.sub,
			role: token.role,
			email: token.email,
			name: token.name,
			image: token.picture
		}
	} : null;
}