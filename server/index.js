const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 4000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(cookieParser());

const DB_PATH = path.join(__dirname, "data", "items.json");

function readItems() {
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}
function writeItems(items) {
  fs.writeFileSync(DB_PATH, JSON.stringify(items, null, 2));
}

// Health
app.get("/health", (req, res) => res.json({ ok: true }));

// List items
app.get("/api/items", (req, res) => {
  const items = readItems();
  res.json(items);
});

// Single item
app.get("/api/items/:id", (req, res) => {
  const items = readItems();
  const found = items.find((x) => x.id === req.params.id);
  if (!found) return res.status(404).json({ message: "Item not found" });
  res.json(found);
});

// Create item (protected via cookie)
app.post("/api/items", (req, res) => {
  const authed = req.cookies?.auth === "1";
  if (!authed) return res.status(401).json({ message: "Unauthorized" });

  const { name, description, price, image, category, rating } = req.body || {};
  if (!name || !description || typeof price !== "number") {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const items = readItems();
  const id = String(Date.now());

  const newItem = {
    id,
    name,
    description,
    price,
    image:
      image ||
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    category: category || "General",
    rating: typeof rating === "number" ? rating : 4.2,
  };

  items.unshift(newItem);
  writeItems(items);

  res.status(201).json(newItem);
});

app.listen(PORT, () => {
  console.log(`Express API running on http://localhost:${PORT}`);
});
