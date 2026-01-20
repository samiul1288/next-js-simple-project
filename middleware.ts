import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "./lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // শুধু /add-item protect
  if (pathname.startsWith("/add-item")) {
    const auth = req.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (auth !== "1") {
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-item/:path*"],
};
