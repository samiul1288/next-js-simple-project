const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

// ✅ CORS: allow any origin + allow cookies + allow x-auth header
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth"],
  })
);

// ✅ IMPORTANT: Express 5 এ app.options("*") / app.options("/*") দিবে না
// app.options("/*", cors());  ❌ remove

app.use(express.json());
app.use(cookieParser());

// -------------------- DB --------------------
const DB_PATH = path.join(__dirname, "data", "items.json");

function ensureDbExists() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH))
    fs.writeFileSync(DB_PATH, JSON.stringify([], null, 2));
}

function readItems() {
  ensureDbExists();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw || "[]");
}

function writeItems(items) {
  ensureDbExists();
  fs.writeFileSync(DB_PATH, JSON.stringify(items, null, 2));
}

// -------------------- ROUTES --------------------
app.get("/", (req, res) =>
  res.json({ message: "NextItems Express API running" })
);
app.get("/health", (req, res) => res.json({ ok: true }));

app.get("/api/items", (req, res) => {
  const items = readItems();
  res.json(items);
});

app.get("/api/items/:id", (req, res) => {
  const items = readItems();
  const found = items.find((x) => x.id === req.params.id);
  if (!found) return res.status(404).json({ message: "Item not found" });
  res.json(found);
});

app.post("/api/items", (req, res) => {
  // ✅ Render API will trust x-auth from Next.js proxy
  const authed =
    req.cookies?.auth === "1" ||
    req.headers["x-auth"] === "1" ||
    req.headers["authorization"] === "Bearer 1";

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

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

app.listen(PORT, () => console.log(`Express API running on port ${PORT}`));
