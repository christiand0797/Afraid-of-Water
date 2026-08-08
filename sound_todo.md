# Sound & Audio Polish — v1.8.2 (COMPLETED)

## Objective
Reintroduce glitch-free ambient audio improvements, re-enable splash + happy-meow
SFX, bump the version, finish the pending font-preload optimization, and ship.

## Steps
- [x] Rewrite `startWaves()` — glitch-free ocean bed using seamless brown-noise buffer + slow LFO
- [x] Re-enable splash audio (dive/surface) — short filtered noise burst via `sfxSplash()`
- [x] Add subtle "happy meow" on high-value fish/combo pickups via `sfxMeowHappy()`
- [x] Bump version to 1.8.2 (GAME_VERSION + VERSION + footer + package.json)
- [x] Update README changelog
- [x] Commit the pending font-preload optimization in index.html
- [x] Run `npm test` to verify
- [x] Commit and push to GitHub on `main`
