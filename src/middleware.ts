import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

const ProtectedRoutes = ["/myreservation", "/admin", "/checkout"];

export async function middleware(request: NextRequest) {
	const token = request.cookies.get("authjs.session-token")?.value ||
		request.cookies.get("__Secure-authjs.session-token")?.value;

	let session = null;

	if (token) {
		try {
			const secret = new TextEncoder().encode(process.env.AUTH_SECRET);
			const { payload } = await jwtVerify(token, secret);
			session = payload;
		} catch (error) {
			// Invalid token
			session = null;
		}
	}

	const isLoggedIn = !!session;
	const role = session?.role;
	const { pathname } = request.nextUrl;

	if (!isLoggedIn && ProtectedRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.redirect(new URL("/login", request.url));
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