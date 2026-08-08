# TODO — Sound & Audio Polish (v1.8.2)

## Objective
Reintroduce glitch-free ambient audio improvements, re-enable splash + happy-meow
SFX, bump the version, finish the pending font-preload optimization, and ship.

## Steps
- [ ] Rewrite `startWaves()` — glitch-free ocean bed using seamless brown-noise buffer + slow LFO
- [ ] Re-enable splash audio (dive/surface) — short filtered noise burst via `sfxSplash()`
- [ ] Add subtle "happy meow" on high-value fish/combo pickups via `sfxMeowHappy()`
- [ ] Bump version to 1.8.2 (GAME_VERSION + VERSION + footer + package.json)
- [ ] Update README changelog
- [ ] Create completed `sound_todo.md`
- [ ] Commit the pending font-preload optimization in index.html
- [ ] Run `npm test` to verify
- [ ] Commit and push to GitHub on `main`
