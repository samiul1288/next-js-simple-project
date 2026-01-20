import Link from "next/link";

export const dynamic = "force-dynamic";

type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
};

async function getItems(): Promise<Item[]> {
  const base = process.env.NEXT_PUBLIC_API_URL;

  if (!base) {
    throw new Error(
      "NEXT_PUBLIC_API_URL missing. Set it in Vercel Environment Variables.",
    );
  }

  const url = `${base.replace(/\/$/, "")}/api/items`;

  let res: Response;
  try {
    res = await fetch(url, { cache: "no-store" });
  } catch (e: any) {
    throw new Error(
      `Fetch failed: cannot reach API server. URL=${url}. ${e?.message || e}`,
    );
  }

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `API error: ${res.status} ${res.statusText}. URL=${url}. ${text}`,
    );
  }

  const data = (await res.json()) as Item[];
  return Array.isArray(data) ? data : [];
}

export default async function ItemsPage() {
  try {
    const items = await getItems();

    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-6">Items</h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it) => (
            <Link
              key={it.id}
              href={`/items/${it.id}`}
              className="border rounded overflow-hidden hover:shadow-sm transition"
            >
              <div className="aspect-4/3 bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.image}
                  alt={it.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="font-semibold">{it.name}</h2>
                  <div className="font-semibold">
                    ${Number(it.price).toFixed(2)}
                  </div>
                </div>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                  {it.description}
                </p>
                <div className="text-xs text-gray-500 mt-3">
                  {it.category ? `Category: ${it.category}` : null}
                  {it.rating ? ` • Rating: ${it.rating}` : null}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-gray-600 mt-6">
            No items found. (API returned empty list)
          </p>
        ) : null}
      </div>
    );
  } catch (e: any) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-3">Items</h1>
        <p className="text-red-600">
          Items load হচ্ছে না। Vercel env / Render sleep / API reachability
          issue হতে পারে।
        </p>

        <div className="mt-4 text-sm">
          <div className="font-semibold mb-1">Fix checklist:</div>
          <ul className="list-disc ml-5 space-y-1 text-gray-700">
            <li>
              Vercel → Settings → Environment Variables এ{" "}
              <b>NEXT_PUBLIC_API_URL</b> ={" "}
              <b>https://next-js-simple-project.onrender.com</b> (শেষে / নয়)
            </li>
            <li>Redeploy করো</li>
            <li>Render free tier হলে first request এ delay হতে পারে</li>
          </ul>
        </div>

        <pre className="mt-4 text-xs bg-gray-100 p-3 rounded overflow-auto">
          {String(e?.message || e)}
        </pre>
      </div>
    );
  }
}
