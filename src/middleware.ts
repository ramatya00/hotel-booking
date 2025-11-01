import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/myreservation", "/admin", "/checkout"];

export async function middleware(req: NextRequest) {
	const token = req.cookies.get("authjs.session-token") || req.cookies.get("__Secure-authjs.session-token");
	const isLoggedIn = !!token;
	const { pathname } = req.nextUrl;

	// Basic auth check
	if (!isLoggedIn && protectedRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.redirect(new URL("/signin", req.url));
	}

	if (isLoggedIn && pathname.startsWith("/signin")) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	// For admin routes, let the page component handle role verification
	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
};