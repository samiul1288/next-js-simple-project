import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  USER_COOKIE_NAME,
  MOCK_EMAIL,
  MOCK_PASSWORD,
} from "@/lib/auth";

export async function POST(req: Request) {
  // Body parse safe
  let body: any = null;
  try {
    body = await req.json();
  } catch {
    body = null;
  }

  const email = String(body?.email ?? "").trim();
  const password = String(body?.password ?? "").trim();

  // ✅ hardcoded check
  if (email !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 },
    );
  }

  const res = NextResponse.json({ ok: true });

  // ✅ set cookies
  res.cookies.set(AUTH_COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  res.cookies.set(USER_COOKIE_NAME, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
