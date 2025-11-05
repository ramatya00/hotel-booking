import { NextResponse, NextRequest } from "next/server";

const ProtectedRoutes = ["/myreservation", "/admin", "/checkout"];

export async function middleware(request: NextRequest) {
	const token = request.cookies.get("authjs.session-token")?.value ||
		request.cookies.get("__Secure-authjs.session-token")?.value;

	const isLoggedIn = !!token;

	// Extract role from token without verification (basic decode)
	let role = null;
	if (token) {
		try {
			const payload = token.split('.')[1];
			const decoded = JSON.parse(atob(payload));
			role = decoded.role;
		} catch (error) {
			// Invalid token format
		}
	}

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