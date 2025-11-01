import { NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";

const protectedRoutes = ["/myreservation", "/admin", "/checkout"];

export async function middleware(req: NextRequest) {
	const session = await auth();
	const isLoggedIn = !!session?.user;
	const role = session?.user?.role;
	const { pathname } = req.nextUrl;

	if (!isLoggedIn && protectedRoutes.some((route) => pathname.startsWith(route))) {
		return NextResponse.redirect(new URL("/signin", req.url));
	}

	if (isLoggedIn && role !== "ADMIN" && pathname.startsWith("/admin")) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	if (isLoggedIn && pathname.startsWith("/signin")) {
		return NextResponse.redirect(new URL("/", req.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
