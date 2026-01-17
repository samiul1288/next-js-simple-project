import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, USER_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  res.cookies.set(USER_COOKIE_NAME, "", { path: "/", maxAge: 0 });
  return res;
}
