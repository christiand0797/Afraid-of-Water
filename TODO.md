# Afraid of Water — Enhancement Checklist

## A. Gameplay & Systems
- [x] 0. Grace period (~2.5s) before the flood starts rising at the start of a run
- [x] 1. Checkpoint milestone markers every 100m (visual "banner" + announce)
- [x] 2. New hazard: dropping crane hook (level 4+)
- [x] 3. New hazard: flying newspaper swarm (level 5+)
- [x] 4. Daily welcome bonus: +50 coins first play of the day

## B. Progress & Persistence
- [x] 5. Achievements/trophy system + ACHIEVEMENTS screen with unread badge
- [x] 6. Reset progress button (with confirm)

## C. Visual & Audio
- [x] 7. Foreground parallax clouds layer; snow effect in Arctic theme
- [x] 8. Credit/version footer; unread-achievements badge indicator
- [x] 9. Music: add bass drone + main-menu selection sound

## D. Quality-of-life
- [x] 10. Fix duplicate continueBtn tap() binding
- [x] 12. Bump game version string (1.5.0, version + trophy footer)

## E. Docs & Deploy
- [x] 13. Update README with features/changelog
- [x] 14. Test locally (node _debug.js passes), ready to commit & push

## F. v1.7.2 — Bug fixes & hardening
- [x] 15. **Critical:** fixed an infinite retry loop between `renderLB()` and
      `fetchGlobalBoard()` — used to recurse forever any time the global
      board was empty or unreachable (verified by running `node _debug.js`,
      which previously hung indefinitely). Now tracks real load state
      (idle/loading/loaded/error) and caps retries at 3 with backoff.
- [x] 16. **Security:** server-side `sanitizeName` used a bypassable
      tag-stripping regex — confirmed a crafted name like
      `<img src=x onerror=...` could survive and get injected via
      `innerHTML` on the leaderboard. Rewrote to strip all bracket
      characters outright; also added client-side `escapeHtml()` as
      defense in depth on both the global and local leaderboard renders.
- [x] 17. **Security:** `server.js` was serving the entire project directory
      statically, exposing `server.js` source, `package*.json`, and the raw
      `data/leaderboard.json` file to any visitor. Narrowed static serving
      to `index.html` only.
- [x] 18. Added lightweight in-memory rate limiting on `POST /api/score`
      (12/min/IP), a sane max-score bound, JSON parse-error handling, and
      basic security headers.
- [x] 19. Removed unused `os` import in `server.js`.
- [x] 20. Wired `_debug.js` into `npm test`; hardened the harness itself so
      a hang becomes a loud, fast failure instead of running forever, and
      it now flags (rather than silently absorbs) a runaway retry pattern.
- [x] 21. Difficulty tiers previously only affected water speed and
      knockback force — hazard *spawn rate* (sharks, tentacles, birds,
      crane hooks, falling bricks, newspaper swarms) ignored the selected
      difficulty entirely and only scaled with altitude. Wired `hazardMul`
      into every hazard spawn check, widened the difficulty spread
      (BABY 0.32x–INSANE 2.4x water speed, similarly wide hazard-frequency
      spread), and gave each difficulty its own ramp-up curve so INSANE
      reaches full intensity fast and BABY stays gentle for a long climb.
- [x] 22. Confirmed the per-run theme (picked in the levels menu) never
      gets reassigned mid-run — the altitude-based sky/atmosphere shift is
      a separate, intentional overlay on top of the fixed theme, not a
      theme swap. No change needed there.

