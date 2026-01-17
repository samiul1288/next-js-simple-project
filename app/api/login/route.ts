import { NextResponse } from "next/server";
import {
  MOCK_EMAIL,
  MOCK_PASSWORD,
  AUTH_COOKIE_NAME,
  USER_COOKIE_NAME,
} from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });

  // Basic cookies (demo)
  res.cookies.set(AUTH_COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  res.cookies.set(USER_COOKIE_NAME, email, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return res;
}
