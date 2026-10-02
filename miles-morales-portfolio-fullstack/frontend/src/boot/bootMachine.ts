// Pure boot state machine. No timers, no DOM, no React — time is injected, so
// every race between "animation finished" and "app loaded" is unit-testable.
//
// Two ideas keep the races out:
//  1. The story never decides the outcome. It runs to DECISION and *holds*
//     there until the real load result (or the wall-clock timeout) arrives.
//  2. Results are tagged with an attempt id, so a late response from a
//     previous attempt can never resolve the current one after Retry.

import { BEAT, BRANCH, LOAD } from './bootConfig';

export type LoadStatus = 'pending' | 'ok' | 'failed';
export type Stage = 'story' | 'catch' | 'reveal' | 'impact' | 'error' | 'done';

export interface BootState {
  attempt: number;
  status: LoadStatus;
  stage: Stage;
  /** Cosmetic story clock (seconds), clamped to BEAT.DECISION until resolved. */
  story: number;
  /** Real seconds since this attempt started. */
  wall: number;
  /** Seconds spent inside the current branch stage. */
  branch: number;
  reducedMotion: boolean;
  /** Repeat visit => allowed to skip the story when the load is instant. */
  repeatVisit: boolean;
  /** True when the visitor chose "Enter anyway" after a failure. */
  forced: boolean;
  /** The portfolio has painted underneath, so the reveal has something to show. */
  appReady: boolean;
  /** Seconds the reveal has been held waiting for appReady. */
  revealWait: number;
}

export interface BootOptions {
  reducedMotion: boolean;
  repeatVisit: boolean;
}

export function createBoot(opts: BootOptions, attempt = 1): BootState {
  return {
    attempt,
    status: 'pending',
    stage: 'story',
    // Reduced motion has no story: jump straight to the (static) decision frame.
    story: opts.reducedMotion ? BEAT.DECISION : 0,
    wall: 0,
    branch: 0,
    reducedMotion: opts.reducedMotion,
    repeatVisit: opts.repeatVisit,
    forced: false,
    appReady: false,
    revealWait: 0,
  };
}

/** Report the real load outcome. Stale or duplicate reports are ignored. */
export function resolve(s: BootState, result: 'ok' | 'failed', attempt: number): BootState {
  if (attempt !== s.attempt || s.status !== 'pending') return s;
  const next: BootState = { ...s, status: result };
  if (result === 'ok' && s.repeatVisit && s.wall < LOAD.INSTANT_BELOW_S) {
    // Instant path: a repeat visit that loads at once gets no montage and no
    // catch beat — straight to the web-wipe (which still waits for appReady).
    next.story = BEAT.DECISION;
    next.stage = 'reveal';
    next.branch = 0;
  }
  return next;
}

/** The portfolio is mounted and painted under the overlay. */
export function markAppReady(s: BootState): BootState {
  return s.appReady ? s : { ...s, appReady: true };
}

/** Restart loading. Returns a fresh state with a new attempt id. */
export function retry(s: BootState): BootState {
  return createBoot({ reducedMotion: s.reducedMotion, repeatVisit: s.repeatVisit }, s.attempt + 1);
}

/** "Enter portfolio anyway" — only meaningful from the error stage. */
export function enterAnyway(s: BootState): BootState {
  if (s.stage !== 'error') return s;
  return { ...s, stage: 'reveal', branch: 0, forced: true };
}

/** Story speed multiplier for the current state. */
export function timeScale(s: BootState): number {
  if (s.stage === 'story') {
    return s.status !== 'pending' && s.story < BEAT.DECISION ? LOAD.FAST_RATE : 1;
  }
  if (s.stage === 'impact') {
    const sinceImpact = s.branch - BRANCH.IMPACT_AT;
    if (sinceImpact >= 0 && sinceImpact < BRANCH.HITSTOP_DUR) return BRANCH.HITSTOP_SCALE;
  }
  return 1;
}

/**
 * Advance by `dtWall` real seconds. `dtStory` defaults to dtWall but callers
 * pass less when the tab was hidden, so a backgrounded tab doesn't burn the
 * cinematic — while the load timeout (which uses dtWall) keeps ticking.
 */
export function advance(s: BootState, dtWall: number, dtStory = dtWall): BootState {
  if (s.stage === 'done' || dtWall <= 0) return s;
  let n: BootState = { ...s, wall: s.wall + dtWall };

  // Wall-clock timeout: the only thing that can turn "pending" into "failed"
  // without a network result.
  if (n.status === 'pending' && n.wall >= LOAD.TIMEOUT_S) n.status = 'failed';

  const dt = dtStory * timeScale(n);

  switch (n.stage) {
    case 'story': {
      n.story = Math.min(BEAT.DECISION, n.story + dt);
      if (n.story >= BEAT.DECISION && n.status !== 'pending') {
        n.stage = n.status === 'ok' ? 'catch' : 'impact';
        n.branch = 0;
      }
      break;
    }
    case 'catch': {
      n.branch += dt;
      if (n.reducedMotion || n.branch >= BRANCH.CATCH_DUR) {
        n.stage = 'reveal';
        n.branch = 0;
      }
      break;
    }
    case 'reveal': {
      // Never wipe to a blank page: hold until the portfolio is painted, but
      // not forever — a stuck mount must not strand the visitor.
      if (!n.appReady && n.revealWait < LOAD.APP_WAIT_MAX_S) {
        n.revealWait += dtWall;
        break;
      }
      n.branch += dt;
      const dur = n.reducedMotion ? BRANCH.REDUCED_REVEAL_DUR : BRANCH.REVEAL_DUR;
      if (n.branch >= dur) n.stage = 'done';
      break;
    }
    case 'impact': {
      n.branch += dt;
      if (n.reducedMotion || n.branch >= BRANCH.ERROR_AT) n.stage = 'error';
      break;
    }
    case 'error':
      // Hold. Only retry()/enterAnyway() leave this stage.
      break;
  }
  return n;
}
