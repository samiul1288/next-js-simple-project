const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 4000;

/**
 * ✅ CORS configuration
 * - Local: http://localhost:3000
 * - Production: your Vercel domain (set via env or hardcode)
 *
 * Recommended:
 * Set RENDER env: FRONTEND_URL = https://next-js-simple-project-cr7a.vercel.app
 */
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL, // e.g. https://next-js-simple-project-cr7a.vercel.app
].filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      // allow server-to-server requests (no origin), health checks, etc.
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error(`CORS blocked for origin: ${origin}`), false);
    },
    credentials: true,
  })
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
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw || "[]");
}

function writeItems(items) {
  ensureDbExists();
  fs.writeFileSync(DB_PATH, JSON.stringify(items, null, 2));
}

// -------------------- ROUTES --------------------

// Health check
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

// Optional: simple root message
app.get("/", (req, res) => {
  res.json({ message: "NextItems Express API is running" });
});

// Global error handler (nice for CORS errors)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || "Server error" });
});

// -------------------- START --------------------
app.listen(PORT, () => {
  console.log(`Express API running on port ${PORT}`);
  console.log("Allowed origins:", allowedOrigins);
});
