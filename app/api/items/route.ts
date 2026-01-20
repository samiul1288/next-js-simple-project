import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

const BASE = process.env.NEXT_PUBLIC_API_URL!;

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const authed = cookieStore.get(AUTH_COOKIE_NAME)?.value === "1";

  if (!authed) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const res = await fetch(`${BASE}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // ✅ (optional) internal secret header, নিচে Fix 3 এ বলেছি
      "x-internal-key": process.env.INTERNAL_API_KEY || "",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
