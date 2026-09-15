# Background music

The BGM player looks for a file at:

    /assets/audio/theme.mp3

Drop your own licensed track here with that exact filename and it plays on
loop, labelled with whatever `BGM_TRACK` in `src/audio/soundEngine.ts` says.

If no file is present, the player silently falls back to the short original
procedural loop synthesized with the Web Audio API — nothing breaks, the BGM
button just plays the fallback score instead.

No audio file ships with this repository.
