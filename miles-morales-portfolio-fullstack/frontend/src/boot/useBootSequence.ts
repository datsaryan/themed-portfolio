import { useCallback, useEffect, useRef, useState } from 'react';
import { advance, createBoot, enterAnyway, markAppReady, resolve, retry as retryMachine } from './bootMachine';
import type { BootState, LoadStatus, Stage } from './bootMachine';
import { frameAt } from './choreography';
import type { Caption, Frame } from './choreography';
import { BEAT, BRANCH, STORAGE_KEY_SEEN } from './bootConfig';
import { loadLiveData, restartLiveData } from '../data/useResumeData';
import type { LoadOutcome } from '../data/useResumeData';
import { playCue } from './bootAudio';

// Glue between the pure machine and the real world: owns the single rAF loop,
// binds the real load promise to the current attempt, plays audio cues on
// story edges, and tears everything down on unmount.

export interface BootUi {
  stage: Stage;
  status: LoadStatus;
  caption: Caption;
  attempt: number;
  /** The portfolio must be mounted underneath before the reveal can show it. */
  appNeeded: boolean;
}

interface Options {
  reducedMotion: boolean;
  repeatVisit: boolean;
  render: (s: BootState, f: Frame, ghosts: Frame[], dt: number) => void;
  onReset: () => void;
  onDone: () => void;
  /** Fired when sustained slow frames make the cinematic shed detail. */
  onQuality: (level: 1 | 2) => void;
}

const same = (a: BootUi, b: BootUi) =>
  a.stage === b.stage && a.status === b.status && a.caption === b.caption && a.attempt === b.attempt && a.appNeeded === b.appNeeded;

/** A background tab can leave a multi-second gap between frames. */
const HIDDEN_GAP_S = 0.5;

// Quality governor: if the smoothed frame time stays above ~24 fps, shed
// detail (extras first, then whole layers). It only ever steps down, so a
// weak device settles at a smooth level instead of stuttering through the
// whole sequence — the cinematic must never make the site slower.
const GOV = { SLOW_S: 0.042, MIN_SAMPLES: 40, COOLDOWN_MS: 1200, SMOOTH: 0.12 };

export function useBootSequence(opts: Options) {
  const optsRef = useRef(opts);
  optsRef.current = opts; // always call the latest callbacks without re-subscribing

  const stateRef = useRef<BootState>(null as unknown as BootState);
  if (!stateRef.current) {
    stateRef.current = createBoot({ reducedMotion: opts.reducedMotion, repeatVisit: opts.repeatVisit });
  }
  const loadRef = useRef<Promise<LoadOutcome> | null>(null);
  const forceMountRef = useRef(false);

  const derive = (s: BootState, f: Frame | null): BootUi => ({
    stage: s.stage,
    status: s.status,
    // reduced motion keeps one calm line instead of flicking through story captions
    caption: f && !s.reducedMotion ? f.caption : 'connect',
    attempt: s.attempt,
    appNeeded: s.status === 'ok' || forceMountRef.current || s.forced,
  });
  const [ui, setUi] = useState<BootUi>(() => derive(stateRef.current, null));
  const uiRef = useRef(ui);

  const push = useCallback((s: BootState, f: Frame | null) => {
    const next = derive(s, f);
    if (!same(uiRef.current, next)) {
      uiRef.current = next;
      setUi(next);
    }
  }, []);

  // ---- real load -> machine, per attempt ----------------------------------
  useEffect(() => {
    let cancelled = false;
    const attempt = ui.attempt;
    const p = loadRef.current ?? loadLiveData(); // joins the shared in-flight request
    const apply = (r: LoadOutcome) => {
      if (cancelled) return;
      stateRef.current = resolve(stateRef.current, r, attempt);
    };
    p.then(apply, () => apply('failed'));
    return () => { cancelled = true; };
  }, [ui.attempt]);

  // ---- the one animation loop ---------------------------------------------
  useEffect(() => {
    let raf = 0;
    let cancelled = false;
    let last = performance.now();
    const gov = { ema: 1 / 60, n: 0, level: 0 as 0 | 1 | 2, lastBump: 0 };

    const tick = (now: number) => {
      if (cancelled) return;
      const dtWall = Math.max(0, (now - last) / 1000);
      last = now;
      // Wall time is never clamped (the load timeout depends on it). Only the
      // cosmetic story clock sits out a long background-tab gap.
      const dtStory = dtWall > HIDDEN_GAP_S ? 1 / 60 : dtWall;

      if (dtWall <= HIDDEN_GAP_S && !stateRef.current.reducedMotion) {
        gov.ema += (dtWall - gov.ema) * GOV.SMOOTH;
        gov.n++;
        if (gov.n > GOV.MIN_SAMPLES && gov.ema > GOV.SLOW_S && gov.level < 2 && now - gov.lastBump > GOV.COOLDOWN_MS) {
          gov.level = (gov.level + 1) as 1 | 2;
          gov.lastBump = now;
          gov.n = 0;
          gov.ema = 1 / 30; // re-measure from a fair starting point
          optsRef.current.onQuality(gov.level);
        }
      }

      const prev = stateRef.current;
      const next = advance(prev, dtWall, dtStory);
      stateRef.current = next;

      const f = frameAt(next);
      const ghosts: Frame[] = [];
      if (next.stage === 'story' && f.speed > 0.3 && !next.reducedMotion) {
        ghosts.push(frameAt({ ...next, story: next.story - 0.05 }), frameAt({ ...next, story: next.story - 0.1 }));
      }
      optsRef.current.render(next, f, ghosts, dtWall);

      cues(prev, next);
      push(next, f);

      if (next.stage === 'done') {
        try { sessionStorage.setItem(STORAGE_KEY_SEEN, '1'); } catch { /* private mode */ }
        optsRef.current.onDone();
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => { cancelled = true; cancelAnimationFrame(raf); };
  }, [push]);

  // ---- user actions ---------------------------------------------------------
  const retry = useCallback(() => {
    const s = stateRef.current;
    if (s.stage !== 'error') return;
    forceMountRef.current = false;
    loadRef.current = restartLiveData(); // aborts the old request, starts one fresh
    stateRef.current = retryMachine(s);
    optsRef.current.onReset();
    push(stateRef.current, null);
  }, [push]);

  const enter = useCallback(() => {
    if (stateRef.current.stage !== 'error' || forceMountRef.current) return;
    forceMountRef.current = true;
    // Start the reveal immediately: the machine holds it at zero progress
    // until the gate reports the portfolio is painted (appReady).
    stateRef.current = enterAnyway(stateRef.current);
    push(stateRef.current, null);
  }, [push]);

  /** The gate reports the portfolio has committed and painted underneath. */
  const appReady = useCallback(() => {
    stateRef.current = markAppReady(stateRef.current);
  }, []);

  return { ui, retry, enter, appReady };
}

/** Fire sound cues on story edges. Skipped while fast-forwarding a known outcome. */
function cues(prev: BootState, next: BootState) {
  if (next.reducedMotion) return;
  const crossed = (t: number) => prev.story < t && next.story >= t;
  if (next.status === 'pending' && next.stage === 'story') {
    if (crossed(BEAT.NOTICE)) playCue('sense');
    if (crossed(BEAT.NOTICE + 0.8)) playCue('whoosh');
    if (crossed(BEAT.RESCUE)) playCue('thwip');
  }
  if (prev.stage !== 'catch' && next.stage === 'catch') playCue('catch');
  if (next.stage === 'impact' && prev.branch < BRANCH.IMPACT_AT && next.branch >= BRANCH.IMPACT_AT) playCue('impact');
}
