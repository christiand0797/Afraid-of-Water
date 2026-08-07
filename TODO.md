# Graphics Enhancement TODO

## Task
Enhance all graphics in `index.html` (the `draw()` render pipeline).

## Steps
- [x] 1. Water & ocean — layered wave bands, animated foam crests, underwater light rays/caustics, depth-scatter gradient
- [x] 2. Sky & atmosphere — moving aurora/nebula, detailed far skyline, twinkling distant city lights, moon-light cold tint
- [x] 3. Buildings & rooftops — tiered roof setbacks, rooftop water towers & AC units, blinking antenna lights, animated window variety
- [x] 4. Character animation — run-cycle paw swing, squash & stretch on jump/land, wind-buffeting effects
- [x] 5. Platforms & props — edge highlights, weathering/moss, animated fire-escape, brick details
- [x] 6. Particles & effects — arcing splash droplets, underwater bubbles with light, more particle color variety
- [x] 7. Rain & weather — platform-top splash ripples, depth-of-field foreground streaks, colored lightning palette

## Round 2 — Additive polish pass
- [ ] A. Water: animated white foam sparkle along wave troughs + surface foam line
- [ ] B. Sky: foreground cloud bank parallax layer + horizon glow that swells with lightning
- [ ] C. Buildings: blinking red antenna hazard lights + near-roof setbacks
- [ ] D. Character: squash & stretch on jump/land (persistent lerp)
- [ ] E. Platforms: under-shadow, top edge highlight, moss/weathering
- [ ] F. Particles: arcing splash droplets, brighter underwater bubble highlights
- [ ] G. Rain: ripple rings on platform tops + colored (blue/violet) lightning palette

## Notes
- All edits are to the `draw()` function in `index.html`
- Keep performance in mind (mobile target) — avoid heavy per-frame allocations
- Must commit & push to GitHub after completing changes
