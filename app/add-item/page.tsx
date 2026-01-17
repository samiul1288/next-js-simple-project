"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function hasAuthCookie() {
  if (typeof document === "undefined") return false;
  // auth=1 থাকলে true
  return document.cookie.split(";").some((c) => c.trim().startsWith("auth=1"));
}

export default function AddItemPage() {
  const router = useRouter();
  const base = process.env.NEXT_PUBLIC_API_URL!;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState<number>(4.5);
  const [loading, setLoading] = useState(false);

  // optional: page load এ cookie না থাকলে login এ পাঠিয়ে দেবে
  useEffect(() => {
    const authed = hasAuthCookie();
    if (!authed) {
      router.replace("/login?next=/add-item");
    }
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const authed = hasAuthCookie();

    const res = await fetch(`${base}/api/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // ✅ Cross-domain fix: cookie না গেলেও header যাবে
        "x-auth": authed ? "1" : "0",
      },
      // credentials include রাখলাম—local dev এ একই domain হলে cookie যাবে
      credentials: "include",
      body: JSON.stringify({
        name,
        description,
        price,
        image,
        category,
        rating,
      }),
    });

    setLoading(false);

    if (res.status === 401) {
      toast.error("Login required");
      router.push("/login?next=/add-item");
      return;
    }

    if (!res.ok) {
      const msg = await res.text().catch(() => "");
      toast.error(msg || "Failed to create item");
      return;
    }

    toast.success("Item created successfully!");
    router.push("/items");
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Add Item</h1>

      <form onSubmit={onSubmit} className="space-y-4 border rounded p-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Price</label>
          <input
            type="number"
            step="0.01"
            className="w-full border rounded px-3 py-2"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>

        <div>
          <label className="text-sm font-medium">Image URL (optional)</label>
          <input
            className="w-full border rounded px-3 py-2"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Category</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Rating</label>
            <input
              type="number"
              step="0.1"
              className="w-full border rounded px-3 py-2"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full rounded bg-black text-white py-2 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Item"}
        </button>
      </form>
    </div>
  );
}
