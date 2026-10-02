import { sound } from '../audio/soundEngine';

// The portfolio's engine defaults to muted and only unlocks after a user
// gesture, so most first-time visitors get a silent cinematic — by design.
// Cues fire only when sound is already enabled (the engine's SFX don't check
// the mute flag themselves, so the guard lives here).

export type Cue = 'sense' | 'whoosh' | 'thwip' | 'catch' | 'impact';

export function playCue(cue: Cue): void {
  try {
    if (sound.getState().isMuted) return;
    switch (cue) {
      case 'sense': sound.playSenseTingle(); break;
      case 'whoosh': sound.playWhoosh(); break;
      case 'thwip': sound.playThwip(); break;
      case 'catch': sound.playWebSnap(); break;
      case 'impact': sound.playImpact(); break;
    }
  } catch {
    /* audio must never be able to break the loader */
  }
}
