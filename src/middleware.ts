import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ProtectedRoutes = ["/myreservation", "/admin", "/checkout"];

export async function middleware(request: NextRequest) {
	const token = await getToken({
		req: request,
		secret: process.env.AUTH_SECRET
	});

	const isLoggedIn = !!token;
	const role = token?.role;
	const { pathname } = request.nextUrl;

	if (!isLoggedIn && ProtectedRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.redirect(new URL("/signin", request.url));
	}

	if (isLoggedIn && role !== "ADMIN" && pathname.startsWith("/admin")) {
		return NextResponse.redirect(new URL("/", request.url));
	}

	if (isLoggedIn && pathname.startsWith("/signin")) {
		return NextResponse.redirect(new URL("/", request.url));
	}
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
}