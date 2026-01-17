import Link from "next/link";

type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
  rating?: number;
};

export default async function ItemsPage() {
  const base = process.env.NEXT_PUBLIC_API_URL!;
  const res = await fetch(`${base}/api/items`, { cache: "no-store" });
  const items: Item[] = await res.json();

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
            <div className="aspect-[4/3] bg-gray-100">
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
                <div className="font-semibold">${it.price.toFixed(2)}</div>
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
    </div>
  );
}
