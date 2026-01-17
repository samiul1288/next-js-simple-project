"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddItemPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [rating, setRating] = useState<number>(4.5);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // same-origin => cookie automatically handled
        body: JSON.stringify({
          name,
          description,
          price: Number(price),
          image,
          category,
          rating: Number(rating),
        }),
      });

      setLoading(false);

      if (res.status === 401) {
        toast.error("Please login first");
        router.push("/login?next=/add-item");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        toast.error(data?.message || "Failed to create item");
        return;
      }

      toast.success("Item created successfully!");
      router.push("/items");
      router.refresh();
    } catch (err) {
      setLoading(false);
      toast.error("Network error");
    }
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
