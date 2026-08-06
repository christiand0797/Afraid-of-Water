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
const os = require("os");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 10000;
const MAX_ENTRIES = 200;

// --- Persistence -----------------------------------------------------------
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const FILE = path.join(DATA_DIR, "leaderboard.json");

function loadScores() {
  try {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([]));
    const raw = fs.readFileSync(FILE, "utf8");
    const arr = JSON.parse(raw);
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
  return String(name || "Anonymous")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, 16) || "Anonymous";
}

function sanitizeScore(score) {
  const n = Math.floor(Number(score));
  return Number.isFinite(n) && n > 0 ? n : 0;
}

// --- API -------------------------------------------------------------------
app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

app.get("/api/leaderboard", (req, res) => {
  const list = loadScores().sort((a, b) => b.score - a.score).slice(0, 100);
  res.set("Cache-Control", "no-store");
  res.json({ entries: list, count: list.length });
});

app.post("/api/score", (req, res) => {
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

// Static game files (index.html etc.)
app.use(express.static(path.join(__dirname, "."), {
  index: "index.html",
  maxAge: "5m",
}));

// SPA fallback
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Afraid of Water server listening on :${PORT}`);
});

