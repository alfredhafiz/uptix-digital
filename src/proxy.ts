import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    process.env.NODE_ENV === "production" &&
    request.headers.get("x-forwarded-proto") !== "https"
  ) {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = "https:";
    return NextResponse.redirect(httpsUrl);
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const isLoggedIn = !!token;

  const isApiAuthRoute = pathname.startsWith("/api/auth");
  const isAuthRoute = pathname.startsWith("/auth");
  const isClientRoute = pathname.startsWith("/client");
  const isAdminRoute = pathname.startsWith("/admin");

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/client/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (isClientRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    return NextResponse.next();
  }

  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    if (token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/client/dashboard", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/auth/:path*", "/client/:path*", "/admin/:path*"],
};
