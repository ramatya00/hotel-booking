import { getSession } from "@/auth.edge";
import { NextResponse, NextRequest } from "next/server";

const ProtectedRoutes = ["/myreservation", "/admin", "/checkout"];

export async function middleware(request: NextRequest) {
	const session = await getSession(request);
	const isLoggedIn = !!session?.user;
	const role = session?.user.role;
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