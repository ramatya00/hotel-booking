import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/myreservation", "/admin", "/checkout"];

export async function middleware(req: NextRequest) {
	const { pathname } = req.nextUrl;

	// Check session cookie manually
	const token =
		req.cookies.get("next-auth.session-token") ||
		req.cookies.get("__Secure-next-auth.session-token");

	const isLoggedIn = !!token;

	if (!isLoggedIn && protectedRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.redirect(new URL("/signin", req.url));
	}

	// Optional: restrict admin
	if (isLoggedIn && pathname.startsWith("/admin")) {
		// ❗You can't check roles here without decoding the JWT, so handle role restriction in the /admin page or API route.
	}

	if (isLoggedIn && pathname.startsWith("/signin")) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
