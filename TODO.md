# Sound Replacement TODO

## Task
Replace all synthesized Web Audio sounds with real, bundled sound files (with synth fallback).

## Files downloaded (assets/sounds/)
- meow1.ogg, meow2.ogg, meow3.ogg (real cat meows)
- thunder.ogg, rain.ogg (real storm)
- splash.ogg (real water splash)
- music.ogg (real music loop)
- coin.ogg (real coin drop)

## Steps
- [ ] 1. Add SOUNDS map + loadSounds() + playBuf() audio-loading layer
- [ ] 2. Modify initAudio() to trigger loadSounds()
- [ ] 3. Rewrite sfx* functions to play real buffers (fallback to synth)
- [ ] 4. Replace procedural rain (setRainGain) with real rain loop
- [ ] 5. Replace procedural music (startMusic/stopMusic) with real music loop
- [ ] 6. Verify game boots, sounds play, mute/volume/underwater-muffling still work
