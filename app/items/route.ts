import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

const BASE = process.env.NEXT_PUBLIC_API_URL!; // তোমার Render API base

export async function GET() {
  const res = await fetch(`${BASE}/api/items`, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}

export async function POST(req: Request) {
  const authed = (await cookies()).get(AUTH_COOKIE_NAME)?.value === "1";
  if (!authed) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  // ✅ Render API এ পাঠাও, এবং header দিয়ে authed বলো
  const res = await fetch(`${BASE}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-auth": "1",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
