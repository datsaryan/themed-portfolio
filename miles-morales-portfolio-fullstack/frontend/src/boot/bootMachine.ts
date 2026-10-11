// Framework-free state machine for the boot cinematic. It knows nothing about
// React, the DOM or the network: it is advanced by tick(dt) and told the real
// load result via resolve(). Keeping every ordering rule here (animation vs.
// result, fast-forward, quick path, retry) makes the race conditions testable.
//
//   scene ──success──▶ catch ──▶ reveal ──▶ done
//     │  (or quick load: scene ──▶ reveal)
//     └───failure──▶ impact ──▶ error ──retry──▶ scene
//                                  └─enter anyway─▶ reveal ──▶ done

import { BRANCH, SMART, T as TL } from './bootConfig';
import type { LoadFailure } from '../data/useResumeData';

export type Outcome = 'success' | 'failure';
export type BootPhase = 'scene' | 'catch' | 'impact' | 'reveal' | 'error' | 'done';
export type RevealKind = 'catch' | 'quick' | 'anyway' | 'reduced';
export type SfxCue = 'whoosh' | 'webShot' | 'impact' | 'catch' | 'reveal';

/** Per-frame values, read by the renderer every animation frame (no React). */
export interface BootFrame {
  phase: BootPhase;
  T: number; //           scene time, 0..CLIMAX
  branchT: number; //     seconds into the catch / impact branch
  freeze: boolean; //     impact freeze-frame active
  reveal: number; //      0..1 progress of the reveal transition
  revealKind: RevealKind | null;
  outcome: Outcome | null;
}

/** Coarse values, the only ones React re-renders for. */
export interface BootCoarse {
  phase: BootPhase;
  outcome: Outcome | null;
  revealKind: RevealKind | null;
  failure: LoadFailure | null;
  attempt: number;
}

export interface BootOptions {
  reducedMotion: boolean;
  /** Returning visitor this session: never replay the full story. */
  skipIntro: boolean;
  onCue?: (cue: SfxCue) => void;
}

const SCENE_CUES: Array<{ at: number; cue: SfxCue }> = [
  { at: TL.NOTICE, cue: 'whoosh' },
  { at: TL.WEB_SHOT, cue: 'webShot' }
];

const REVEAL_SECONDS: Record<RevealKind, number> = {
  catch: BRANCH.REVEAL,
  quick: BRANCH.REVEAL_COMPACT,
  anyway: BRANCH.REVEAL_COMPACT,
  reduced: BRANCH.REVEAL_REDUCED
};

export class BootMachine {
  private f: BootFrame = BootMachine.initialFrame();
  private coarse: BootCoarse;
  private elapsed = 0; //    seconds since this attempt began
  private ffRate = 1; //     playback rate once the result is known
  private quick = false;
  private freezeLeft = 0;
  private impactFired = false;
  private failure: LoadFailure | null = null;
  private attempt = 1;
  private listeners = new Set<() => void>();

  constructor(private opts: BootOptions) {
    this.coarse = this.buildCoarse();
  }

  private static initialFrame(): BootFrame {
    return { phase: 'scene', T: 0, branchT: 0, freeze: false, reveal: 0, revealKind: null, outcome: null };
  }

  get frame(): BootFrame {
    return this.f;
  }
  getCoarse = (): BootCoarse => this.coarse;

  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private buildCoarse(): BootCoarse {
    return {
      phase: this.f.phase,
      outcome: this.f.outcome,
      revealKind: this.f.revealKind,
      failure: this.failure,
      attempt: this.attempt
    };
  }

  private publish() {
    const next = this.buildCoarse();
    const c = this.coarse;
    if (
      next.phase === c.phase &&
      next.outcome === c.outcome &&
      next.revealKind === c.revealKind &&
      next.failure === c.failure &&
      next.attempt === c.attempt
    ) {
      return;
    }
    this.coarse = next;
    this.listeners.forEach((l) => l());
  }

  private cue(c: SfxCue) {
    this.opts.onCue?.(c);
  }

  private startReveal(kind: RevealKind) {
    this.f.phase = 'reveal';
    this.f.reveal = 0;
    this.f.revealKind = kind;
    if (kind !== 'reduced') this.cue('reveal');
  }

  /** Returning visitor with data already settled: no overlay at all. */
  skipToDone() {
    this.f.phase = 'done';
    this.f.outcome = 'success';
    this.f.reveal = 1;
    this.publish();
  }

  /** Called with the REAL load result. Late/duplicate results are ignored. */
  resolve(outcome: Outcome, failure: LoadFailure | null = null) {
    if (this.f.phase !== 'scene' || this.f.outcome) return;
    this.f.outcome = outcome;
    this.failure = failure;

    if (this.opts.reducedMotion) {
      if (outcome === 'success') this.startReveal('reduced');
      else this.f.phase = 'error';
    } else if (outcome === 'success' && (this.opts.skipIntro || this.elapsed < SMART.QUICK_LOAD_S)) {
      this.quick = true; // loaded fast: skip the story, reveal after a short beat
    } else {
      const span = outcome === 'success' ? SMART.FAST_FORWARD_SUCCESS_S : SMART.FAST_FORWARD_FAILURE_S;
      this.ffRate = Math.max(1, (TL.CLIMAX - this.f.T) / span);
    }
    this.publish();
  }

  retry() {
    if (this.f.phase !== 'error') return;
    this.attempt += 1;
    this.f = BootMachine.initialFrame();
    this.failure = null;
    this.elapsed = 0;
    this.ffRate = 1;
    this.quick = false;
    this.freezeLeft = 0;
    this.impactFired = false;
    this.publish();
  }

  enterAnyway() {
    if (this.f.phase !== 'error') return;
    this.startReveal('anyway');
    this.publish();
  }

  /** Advance by dt seconds. Returns true while more frames are needed. */
  tick(dtRaw: number): boolean {
    const dt = Math.min(Math.max(dtRaw, 0), SMART.MAX_DT_S);
    const f = this.f;

    switch (f.phase) {
      case 'scene': {
        this.elapsed += dt;
        const prev = f.T;
        const rate = f.outcome && !this.quick ? this.ffRate : 1;
        f.T = Math.min(f.T + dt * rate, TL.CLIMAX); // holds at the climax while pending
        if (rate <= 1.5) {
          for (const { at, cue } of SCENE_CUES) if (prev < at && f.T >= at) this.cue(cue);
        }
        if (this.quick && this.elapsed >= SMART.MIN_QUICK_DISPLAY_S) {
          this.startReveal('quick');
        } else if (f.outcome && !this.quick && f.T >= TL.CLIMAX) {
          f.phase = f.outcome === 'success' ? 'catch' : 'impact';
          f.branchT = 0;
          if (f.outcome === 'success') this.cue('catch');
        }
        break;
      }
      case 'catch':
        f.branchT += dt;
        if (f.branchT >= BRANCH.CATCH) this.startReveal('catch');
        break;
      case 'impact': {
        if (this.freezeLeft > 0) {
          this.freezeLeft -= dt;
          f.freeze = this.freezeLeft > 0;
          break;
        }
        const rate = f.branchT >= BRANCH.IMPACT_AT && f.branchT < BRANCH.SLOWMO_UNTIL ? BRANCH.SLOWMO_RATE : 1;
        const prev = f.branchT;
        f.branchT += dt * rate;
        if (!this.impactFired && f.branchT >= BRANCH.IMPACT_AT) {
          f.branchT = BRANCH.IMPACT_AT;
          this.impactFired = true;
          this.freezeLeft = BRANCH.FREEZE;
          f.freeze = true;
          this.cue('impact');
        }
        if (prev < BRANCH.IMPACT && f.branchT >= BRANCH.IMPACT) {
          f.branchT = BRANCH.IMPACT;
          f.phase = 'error';
        }
        break;
      }
      case 'reveal': {
        f.reveal = Math.min(1, f.reveal + dt / REVEAL_SECONDS[f.revealKind ?? 'quick']);
        if (f.reveal >= 1) f.phase = 'done';
        break;
      }
      default:
        break;
    }

    this.publish();
    // Only 'done' is truly terminal (BootStage unmounts the whole overlay
    // then). 'error' must keep returning true — it's an idle, user-facing
    // screen the loop has to stay alive through, or a later retry()/
    // enterAnyway() call would reset this machine's internal state with
    // nothing left running to ever pick that change up and tick it forward.
    return f.phase !== 'done';
  }
}
