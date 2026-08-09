# TODO — Bug sweep & polish sweep

## Objective
Fix all identified bugs in the shipped game (`index.html`), keep the backend
clean, and sync metadata.

## Bugs found & fixed
- [x] **Infinite recursion**: `save()` → `applyOwnedUpgrades()` → `save()` (stack
      overflow on every save). Fix: stop `applyOwnedUpgrades()` from re-entering
      `save()`.
- [x] **Platform bounce-wall mismatch**: generator uses `bo*540+90` (BSPAN 540),
      collision uses `buildingIdx*460+40`. Fix collision to match the real wall.
- [x] **Stale `package-lock.json`**: root version `1.6.1` vs `1.8.2`. Re-sync.

## Verification
- [x] `npm test` passes (headless harness, no top-level error, no runaway loop).

## Wrap-up
- [x] Update comments/README if wording described the old recursion bug.

