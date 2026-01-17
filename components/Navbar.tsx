import Link from "next/link";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export default async function Navbar() {
  const cookieStore = await cookies();
  const authed = cookieStore.get(AUTH_COOKIE_NAME)?.value === "1";

  return (
    <header className="border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">
          NextItems
        </Link>

        <nav className="flex gap-4 items-center">
          <Link className="hover:underline" href="/">
            Home
          </Link>
          <Link className="hover:underline" href="/items">
            Items
          </Link>
          <Link className="hover:underline" href="/login">
            Login
          </Link>

          {authed && (
            <Link className="hover:underline" href="/add-item">
              Add Item
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
