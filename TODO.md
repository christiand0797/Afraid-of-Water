# TODO — Lifetime Stats Feature

## Objective
Wire up the Lifetime Stats screen so counters are actually incremented during gameplay (currently they always show 0).

## Steps
- [x] Fix `show()` navigation so `statsScreen` is properly hidden when switching screens
- [x] Increment `statRuns`, `statDistance`, `statBestStreak` on game over (`loseLife`)
- [x] Increment `statCoins` on coin-earning events (run coins, height bounty, gold fish, fish, daily bonus)
- [x] Increment `statDives` when diving (`tryDive`)
- [x] Increment `statFish` when collecting fish (gold + regular)
- [x] Increment `statPowerups` when using jetpack/cape/armor/time-stop
- [x] Persist via `saveStats()` on game over

## Follow-up
- Verify game runs without JS errors (stats screen + navigation)
