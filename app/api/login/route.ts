import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, MOCK_EMAIL, MOCK_PASSWORD } from "@/lib/auth";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (email !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set(AUTH_COOKIE_NAME, "1", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
  });

  return res;
}
