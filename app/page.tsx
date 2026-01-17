import Link from "next/link";
import Section from "@/components/Section";

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">
            Browse items. Add items. Simple.
          </h1>
          <p className="text-gray-700 mb-6 max-w-2xl">
            A minimal Next.js 15/16 App Router project with an Express API,
            public item pages, and optional protected item creation using
            cookie-based mock auth.
          </p>
          <div className="flex gap-3">
            <Link
              href="/items"
              className="px-4 py-2 rounded bg-black text-white"
            >
              View Items
            </Link>
            <Link href="/login" className="px-4 py-2 rounded border">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* 7 sections */}
      <Section title="1) Features">
        Public landing + items + item details, mock login, protected add-item
        page, Express API CRUD (create + read).
      </Section>

      <Section title="2) How Authentication Works">
        Login sets cookies. Middleware checks cookies for protected routes and
        redirects unauthenticated users to /login.
      </Section>

      <Section title="3) Item Catalog">
        Items are fetched from the Express server and shown as cards with name,
        description, price, and image.
      </Section>

      <Section title="4) Item Details">
        Click an item to view a dedicated page with full item information.
      </Section>

      <Section title="5) Add Item (Protected)">
        When logged in, you can add a new item via a form which calls the
        Express API and stores data to a JSON file.
      </Section>

      <Section title="6) Tech Stack">
        Next.js App Router, TailwindCSS, Express.js, cookie-based mock auth, and
        react-hot-toast for notifications.
      </Section>

      <Section title="7) Deployment Notes">
        Deploy Next.js to Vercel. Deploy Express separately (Render/Railway/Fly)
        and set NEXT_PUBLIC_API_URL accordingly.
      </Section>
    </div>
  );
}
