const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// -------------------- CORS --------------------
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-internal-key"],
  }),
);

app.use(express.json());
app.use(cookieParser());

// -------------------- DB --------------------
const DB_PATH = path.join(__dirname, "data", "items.json");

function ensureDbExists() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
  }
}

function readItems() {
  ensureDbExists();
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeItems(items) {
  ensureDbExists();
  fs.writeFileSync(DB_PATH, JSON.stringify(items, null, 2));
}

// -------------------- ROUTES --------------------
app.get("/", (req, res) =>
  res.json({ message: "NextItems Express API running" }),
);

app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/api/items", (req, res) => {
  res.json(readItems());
});

app.get("/api/items/:id", (req, res) => {
  const item = readItems().find((x) => x.id === req.params.id);
  if (!item) return res.status(404).json({ message: "Item not found" });
  res.json(item);
});

// -------------------- CREATE ITEM (PROTECTED) --------------------
app.post("/api/items", (req, res) => {
  const internalKey = req.headers["x-internal-key"];

  // ✅ ONLY server-to-server auth
  if (internalKey !== process.env.INTERNAL_API_KEY) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { name, description, price, image, category, rating } = req.body || {};
  if (!name || !description || typeof price !== "number") {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const items = readItems();
  const newItem = {
    id: String(Date.now()),
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

// -------------------- ERROR --------------------
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => console.log(`Express API running on port ${PORT}`));
