import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "./lib/auth";

export function middleware(req: NextRequest) {
  const auth = req.cookies.get(AUTH_COOKIE_NAME)?.value;

  // Protect only /add-item routes
  if (auth !== "1") {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", req.nextUrl.pathname); // return to original page
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/add-item/:path*"],
};
