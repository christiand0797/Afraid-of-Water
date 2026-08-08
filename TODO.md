# TODO — Enhancements v1.8.0

## Objective
Add in-game quality-of-life + volume controls, auto-pause on tab blur, and stat persistence on menu quit, then push to GitHub.

## Steps
- [x] Add in-game volume sliders (Master / SFX / Music) to the PAUSE screen
- [x] Wire volume sliders to existing volume vars + persist via localStorage
- [x] Refresh pause-screen state (shake/haptic/mute labels) each time the pause menu opens
- [x] Auto-pause when the tab/app loses focus (visibilitychange + blur)
- [x] Save lifetime stats when quitting to the main menu (goToMenu)
- [x] Add sound-mute button + "Back to Game" affordance inside pause
- [x] Bump version (package.json + VERSION constant), update README changelog + TODO_enhancements.md
- [x] Run `npm test` to verify no JS errors
- [ ] Push to GitHub on `main`

