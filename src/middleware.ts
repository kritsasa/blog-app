import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Uint8Array for jose
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret"
);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);

    if (!payload) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname.startsWith("/admin")) {
      if (payload.role === "ADMIN") {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/dashborad", req.url));
    }

    if (pathname.startsWith("/dashboard")) {
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (e) {
    console.error(e);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
