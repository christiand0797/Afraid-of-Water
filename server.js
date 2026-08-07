/**
 * Afraid of Water — Node server
 * Serves the static game AND provides a persistent global leaderboard API.
 *
 * Endpoints:
 *   GET  /api/leaderboard       -> { entries: [ {name, score, date} ], count }
 *   POST /api/score             -> body: { name, score }  -> { entry, rank }
 *   GET  /api/health            -> { ok: true }
 *
 * Scores persist to ./data/leaderboard.json (created on first run).
 */
const path = require("path");
const fs = require("fs");
const express = require("express");

const app = express();
// Render (and most PaaS hosts) sit behind a reverse proxy — without this, every
// request looks like it comes from the proxy's internal IP, which breaks
// per-IP rate limiting below.
app.set("trust proxy", 1);

const PORT = process.env.PORT || 10000;
const MAX_ENTRIES = 200;
const MAX_SCORE = 1000000; // sanity cap — blocks obviously-bogus/garbage submissions

// --- Persistence -----------------------------------------------------------
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const FILE = path.join(DATA_DIR, "leaderboard.json");

function loadScores() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(FILE)) {
      // Seed a friendly starter board so the global list never feels empty.
      const now = Date.now(), day = 86400000;
      const seed = [
        { name: "Whiskers", score: 760, date: now - 2 * day },
        { name: "Boots",    score: 590, date: now - 4 * day },
        { name: "Mochi",    score: 470, date: now - 6 * day },
        { name: "Oreo",     score: 340, date: now - 8 * day },
        { name: "Toast",    score: 260, date: now - 10 * day },
        { name: "Mittens",  score: 150, date: now - 12 * day },
      ];
      fs.writeFileSync(FILE, JSON.stringify(seed));
    }
    const raw = fs.readFileSync(FILE, "utf8");
    const arr = JSON.parse(raw);
    if (Array.isArray(arr) && arr.length === 0) {
      const day = 86400000, now = Date.now();
      const seed = [
        { name: "Whiskers", score: 760, date: now - 2 * day },
        { name: "Boots",    score: 590, date: now - 4 * day },
        { name: "Mochi",    score: 470, date: now - 6 * day },
        { name: "Oreo",     score: 340, date: now - 8 * day },
        { name: "Toast",    score: 260, date: now - 10 * day },
        { name: "Mittens",  score: 150, date: now - 12 * day },
      ];
      fs.writeFileSync(FILE, JSON.stringify(seed));
      return seed;
    }
    return Array.isArray(arr) ? arr : [];
  } catch (e) {
    console.error("loadScores error", e);
    return [];
  }
}

function persistScores(list) {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    // atomic-ish write
    const tmp = FILE + ".tmp";
    fs.writeFileSync(tmp, JSON.stringify(list));
    fs.renameSync(tmp, FILE);
  } catch (e) {
    console.error("persistScores error", e);
  }
}

function sanitizeName(name) {
  // Strip every '<' and '>' outright rather than trying to match/remove whole
  // tags — a regex like /<[^>]*>/g only removes well-formed "<...>" chunks, so
  // an unterminated fragment (e.g. "<img src=x onerror=...") or nested tags
  // (e.g. "<<script>script>") can slip through and get reflected into other
  // players' pages via the leaderboard. Dropping the bracket characters
  // entirely closes that off regardless of how they're arranged.
  return String(name == null ? "" : name)
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "") // strip control chars
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 16) || "Anonymous";
}

function sanitizeScore(score) {
  const n = Math.floor(Number(score));
  return Number.isFinite(n) && n > 0 && n <= MAX_SCORE ? n : 0;
}

// --- Lightweight in-memory rate limiting for score submission --------------
// Not meant as an anti-cheat system (the client fully controls what score it
// reports), just a guard against a single client hammering the write path.
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 12; // submissions per IP per window
const rateBuckets = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);
  if (!bucket || now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(ip, { start: now, count: 1 });
    return false;
  }
  bucket.count++;
  return bucket.count > RATE_LIMIT_MAX;
}
// Periodically forget stale IPs so this map can't grow without bound.
setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of rateBuckets) {
    if (now - bucket.start > RATE_LIMIT_WINDOW_MS) rateBuckets.delete(ip);
  }
}, RATE_LIMIT_WINDOW_MS).unref();

// --- API -------------------------------------------------------------------
app.use(express.json({ limit: "10kb" }));
// A malformed JSON body would otherwise fall through to Express's default
// error handler and return an HTML error page from a JSON API.
app.use((err, req, res, next) => {
  if (err && err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Invalid JSON body" });
  }
  next(err);
});

// A couple of cheap, dependency-free security headers.
app.use((req, res, next) => {
  res.set("X-Content-Type-Options", "nosniff");
  res.set("X-Frame-Options", "SAMEORIGIN");
  res.set("Referrer-Policy", "no-referrer-when-downgrade");
  next();
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

app.get("/api/leaderboard", (req, res) => {
  const list = loadScores().sort((a, b) => b.score - a.score).slice(0, 100);
  res.set("Cache-Control", "no-store");
  res.json({ entries: list, count: list.length });
});

app.post("/api/score", (req, res) => {
  if (rateLimited(req.ip)) {
    return res.status(429).json({ error: "Too many submissions, try again shortly" });
  }
  const body = req.body || {};
  const name = sanitizeName(body.name);
  const score = sanitizeScore(body.score);
  if (!score) {
    return res.status(400).json({ error: "Invalid score" });
  }
  const list = loadScores();
  const entry = { name, score, date: Date.now() };
  list.push(entry);
  list.sort((a, b) => b.score - a.score);
  const trimmed = list.slice(0, MAX_ENTRIES);
  persistScores(trimmed);
  const rank = trimmed.findIndex((e) => e === entry) + 1;
  res.set("Cache-Control", "no-store");
  res.json({ entry, rank: rank > 0 ? rank : null });
});

// Static game files. The game is a single self-contained index.html with no
// separate JS/CSS/image assets, so rather than serving the whole project
// directory (which used to also expose server.js, package*.json, and the raw
// data/leaderboard.json backing file to any visitor) we only ever hand out
// index.html itself.
const INDEX_FILE = path.join(__dirname, "index.html");
app.get(["/", "/index.html"], (req, res) => {
  res.set("Cache-Control", "public, max-age=300");
  res.sendFile(INDEX_FILE);
});

// Anything else (unknown API route or client-side path) falls back to the
// game shell rather than a 404, matching the old catch-all behavior.
app.get("*", (req, res) => {
  res.sendFile(INDEX_FILE);
});

app.listen(PORT, () => {
  console.log(`Afraid of Water server listening on :${PORT}`);
});

