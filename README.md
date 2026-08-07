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

## Deploy on Render

1. This repo is connected (or connect it in Render)
2. **New → Static Site**
3. Build Command: *(empty)*
4. Publish Directory: `.`
5. Create → share your public URL

## Stack

Single-file HTML5 Canvas + Web Audio. No build step.
