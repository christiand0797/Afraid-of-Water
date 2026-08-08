# Fix + Push Plan (v1.8.1)

## Bugs to fix in `index.html`
- [x] Restore corrupted `<!DOCTYPE html>` (currently `i jus`)
- [x] Restore deleted `water={...}` initialization in `startGame` (fresh runs
      were silently no-oping because `gameLoopFrame` guards on `!water`)

## Keep (intentional tuning from working tree)
- [x] SFX quieter coin collect/buy tweaks
- [x] Faster per-level water-spawn ramp

## Wrap-up
- [x] Bump version to 1.8.1 (VERSION const + package.json)
- [x] Update README changelog
- [x] Run `npm test` to verify
- [x] Commit and push to GitHub on `main`
