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

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function ItemDetailsPage({ params }: PageProps) {
  const { id } = await params; // ✅ unwrap the Promise (Next.js 15/16)
  const base = process.env.NEXT_PUBLIC_API_URL!;
  const res = await fetch(`${base}/api/items/${id}`, { cache: "no-store" });

  if (!res.ok) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">Item not found</h1>
        <Link href="/items" className="underline">
          Back to items
        </Link>
      </div>
    );
  }

  const item: Item = await res.json();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link href="/items" className="underline text-sm">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold mt-4">{item.name}</h1>
      <div className="text-gray-600 mt-1">
        {item.category ? item.category : "General"}{" "}
        {item.rating ? `• ${item.rating} ★` : ""}
      </div>

      <div className="mt-6 border rounded overflow-hidden">
        <div className="aspect-video bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-5">
          <div className="text-2xl font-semibold mb-3">
            ${item.price.toFixed(2)}
          </div>
          <p className="text-gray-700 leading-relaxed">{item.description}</p>
        </div>
      </div>
    </div>
  );
}
