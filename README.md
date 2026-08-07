# Afraid of Water 🐱💧

**My first game project** — climb, don't get wet.

You're a cat escaping a rising flood. Jump platforms, dodge birds and broom-wielding neighbors, collect fish, unlock skins, and dive with a scuba mask.

## Play

After Render deploy: `https://afraid-of-water.onrender.com` (or your Render URL)

Or open `index.html` locally in any browser.

## Controls

| Input | Action |
|--------|--------|
| ← → / buttons | Move |
| ▲ / Space / swipe up | Jump (double jump) |
| 🤿 / ↓ / swipe down | Dive (with Scuba upgrade) |

## Features

- Procedural NYC-style climb + 6 themed levels
- Weather (rain, lightning, wind)
- Breakable ledges, stairs, falling bricks, pigeons, steam vents
- Scuba diving with oxygen + sea creatures
- Skin, upgrades, coins, local leaderboard
- Mobile touch controls
- Pause (P / ESC), sound on-off toggle, mint-ambient background music
- Mobile vibration feedback (haptic) on jump, hits, and collecting
- Combo multiplier system for chained fish pickups (bigger coins + score)
- Water-danger red vignette warning + in-game how-to-play guide
- Layered realism: drifting cloud banks, atmospheric haze, glinting water, mist hugging the flood, dynamic rain drop shadows, wind-gust streaks and an immersive screen vignette
- Underwater audio muffling when you dive, wind-blown litter tumbling by, floating flood debris you can hop across, and dawn light breaking through as you climb above the storm
- 🏁 milestone checkpoint banners every 100 m
- 🦍 swinging crane hooks (level 4+) and 📰 newspaper swarm hazards (level 5+)
- 🎁 daily welcome bonus of +50 coins
- 🌍 global leaderboard via the Node API (device + worldwide)
- 🎖️ achievements (trophies) screen with unread badge + reset-progress
- ☂️ & v1.6.1 this session added: neon skyline theme + tuxedo/robot skins, high-altitude starfield & god-rays, wagging-tail/blinking cat, personal-best confetti + board-rank toast, combo-tier banner, combo-drain timer bar, "TIME STOP" power-up that freezes the flood, periodic flood SURGE events, low-life heartbeat warning, and a game-over SHARE button
- 🐾 & v1.5.0 version/trophy footer
- ❄️ Arctic-theme snowfall, music bass layer, and menu selection tap sounds
- 🎮 Forgiveness & feedback: jump coyote-time + input buffering, floating score/combo popups, combo-driven magnet that reels in fish, and best-streak shown at game over

## Deploy on Render

The app is a Node Express web service — it serves the game **and** the persistent
global leaderboard API. Use a **Web service**, not a Static Site (a Static Site
cannot run the API, so the global board would be empty).

1. This repo is connected (or connect it in Render)
2. **New → Blueprint** (uses `render.yaml`) — or manually **New → Web Service**
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Health Check Path: `/api/health`
6. Create → share your public URL (`https://afraid-of-water.onrender.com`)

> Free-tier note: Render's free disk is ephemeral and resets on redeploy/sleep,
> so the leaderboard JSON may reset. Scores still work within a deploy.

If you must serve the game from a static host (no API), set `window.AOW_API`
to the API origin before the game boots, e.g. in the console:
`window.AOW_API = "https://afraid-of-water.onrender.com";`

## Stack

Single-file HTML5 Canvas + Web Audio. No build step.
