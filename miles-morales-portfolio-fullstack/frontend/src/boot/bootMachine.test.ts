import { describe, it, expect } from 'vitest';
import { createBoot, advance, resolve, retry, enterAnyway, timeScale, markAppReady } from './bootMachine';
import type { BootState } from './bootMachine';
import { BEAT, BRANCH, LOAD } from './bootConfig';

const opts = { reducedMotion: false, repeatVisit: false };

/** Step in 1/60s ticks, like a real rAF loop. */
function run(s: BootState, seconds: number): BootState {
  const steps = Math.round(seconds * 60);
  for (let i = 0; i < steps; i++) s = advance(s, 1 / 60);
  return s;
}

describe('story clock', () => {
  it('runs in real time while the load is pending and holds at DECISION', () => {
    let s = run(createBoot(opts), 5);
    expect(s.story).toBeCloseTo(5, 1);
    s = run(s, 2.5); // wall ~7.5 < timeout 8
    expect(s.story).toBe(BEAT.DECISION);
    expect(s.stage).toBe('story'); // holding, not branching
    expect(s.status).toBe('pending');
  });

  it('never lets the story finish the load on its own', () => {
    const s = run(createBoot(opts), LOAD.TIMEOUT_S - 0.2);
    expect(s.status).toBe('pending');
    expect(s.stage).toBe('story');
  });
});

describe('success path', () => {
  it('fast-forwards, then catches, then reveals, then is done', () => {
    let s = run(createBoot(opts), 0.3);
    s = markAppReady(resolve(s, 'ok', s.attempt));
    expect(timeScale(s)).toBe(LOAD.FAST_RATE);
    // remaining story ~6.7s at 6x ~= 1.1s
    s = run(s, 1.3);
    expect(s.stage).toBe('catch');
    s = run(s, BRANCH.CATCH_DUR + 0.05);
    expect(s.stage).toBe('reveal');
    s = run(s, BRANCH.REVEAL_DUR + 0.05);
    expect(s.stage).toBe('done');
  });

  it('a result arriving at the hold point catches immediately (no extra wait)', () => {
    let s = run(createBoot(opts), 7.1);
    s = resolve(s, 'ok', s.attempt);
    s = advance(s, 1 / 60);
    expect(s.stage).toBe('catch');
  });

  it('repeat visit + instant load skips the story AND the catch beat', () => {
    let s = createBoot({ reducedMotion: false, repeatVisit: true });
    s = run(s, 0.1);
    s = markAppReady(resolve(s, 'ok', s.attempt));
    expect(s.stage).toBe('reveal');
    s = run(s, BRANCH.REVEAL_DUR + 0.05);
    expect(s.stage).toBe('done');
  });

  it('repeat visit that is NOT instant still plays the full story', () => {
    let s = createBoot({ reducedMotion: false, repeatVisit: true });
    s = run(s, 1.0);
    s = resolve(s, 'ok', s.attempt);
    expect(s.stage).toBe('story');
  });

  it('first visit never skips the story even if instant', () => {
    let s = run(createBoot(opts), 0.1);
    s = resolve(s, 'ok', s.attempt);
    expect(s.story).toBeLessThan(BEAT.DECISION);
  });
});

describe('failure path', () => {
  it('network failure: fast-forward, impact, hit-stop slow-mo, then error', () => {
    let s = run(createBoot(opts), 0.5);
    s = resolve(s, 'failed', s.attempt);
    s = run(s, 1.3);
    expect(s.stage).toBe('impact');
    // inside the hit-stop window time slows down
    s = { ...s, branch: BRANCH.IMPACT_AT + 0.1 };
    expect(timeScale(s)).toBe(BRANCH.HITSTOP_SCALE);
    s = { ...s, branch: BRANCH.IMPACT_AT + BRANCH.HITSTOP_DUR + 0.1 };
    expect(timeScale(s)).toBe(1);
    s = run({ ...s, branch: 0 }, 3);
    expect(s.stage).toBe('error');
  });

  it('wall-clock timeout fails a load that never answers', () => {
    let s = run(createBoot(opts), LOAD.TIMEOUT_S + 0.1);
    expect(s.status).toBe('failed');
    s = run(s, 4);
    expect(s.stage).toBe('error');
  });

  it('timeout still counts real time when the story is throttled (hidden tab)', () => {
    let s = createBoot(opts);
    // tab hidden: 1s of wall time elapses but story only gets a sliver
    for (let i = 0; i < 10; i++) s = advance(s, 1, 0.016);
    expect(s.status).toBe('failed');
    expect(s.story).toBeLessThan(1);
  });

  it('error stage holds until the user acts', () => {
    let s = run(createBoot(opts), LOAD.TIMEOUT_S + 6);
    expect(s.stage).toBe('error');
    s = run(s, 10);
    expect(s.stage).toBe('error');
  });
});

describe('races', () => {
  it('ignores duplicate results (first one wins)', () => {
    let s = createBoot(opts);
    s = resolve(s, 'failed', s.attempt);
    s = resolve(s, 'ok', s.attempt);
    expect(s.status).toBe('failed');
  });

  it('ignores a late result from a previous attempt after Retry', () => {
    let s = run(createBoot(opts), LOAD.TIMEOUT_S + 4);
    const stale = s.attempt;
    s = retry(s);
    expect(s.attempt).toBe(stale + 1);
    s = resolve(s, 'ok', stale); // late response from attempt 1
    expect(s.status).toBe('pending');
    s = resolve(s, 'ok', s.attempt);
    expect(s.status).toBe('ok');
  });

  it('result arriving after the timeout already failed is ignored', () => {
    let s = run(createBoot(opts), LOAD.TIMEOUT_S + 0.1);
    s = resolve(s, 'ok', s.attempt);
    expect(s.status).toBe('failed');
  });
});

describe('reveal waits for the portfolio to paint', () => {
  const toReveal = () => {
    let s = markAppReady(resolve(run(createBoot(opts), 0.3), 'ok', 1));
    s = { ...s, appReady: false }; // pretend the mount is slow
    return run(s, 3);
  };

  it('holds the reveal at zero progress until appReady', () => {
    const s = toReveal();
    expect(s.stage).toBe('reveal');
    expect(s.branch).toBe(0);
  });

  it('proceeds as soon as the portfolio reports ready', () => {
    let s = markAppReady({ ...toReveal() });
    s = run(s, BRANCH.REVEAL_DUR + 0.05);
    expect(s.stage).toBe('done');
  });

  it('never deadlocks: gives up waiting after APP_WAIT_MAX_S', () => {
    let s = toReveal();
    s = run(s, LOAD.APP_WAIT_MAX_S + BRANCH.REVEAL_DUR + 0.2);
    expect(s.stage).toBe('done');
  });

  it('enter-anyway reveal also waits for the portfolio', () => {
    let s = enterAnyway(run(createBoot(opts), LOAD.TIMEOUT_S + 6));
    s = run(s, 0.5);
    expect(s.stage).toBe('reveal');
    expect(s.branch).toBe(0);
    s = markAppReady(s);
    s = run(s, BRANCH.REVEAL_DUR + 0.05);
    expect(s.stage).toBe('done');
  });
});

describe('retry & enter-anyway', () => {
  it('retry resets clocks and stage', () => {
    let s = run(createBoot(opts), LOAD.TIMEOUT_S + 6);
    s = retry(s);
    expect(s).toMatchObject({ status: 'pending', stage: 'story', story: 0, wall: 0, branch: 0 });
  });

  it('enterAnyway only works from the error stage', () => {
    const s = createBoot(opts);
    expect(enterAnyway(s)).toBe(s);
    const e = enterAnyway(run(createBoot(opts), LOAD.TIMEOUT_S + 6));
    expect(e.stage).toBe('reveal');
    expect(e.forced).toBe(true);
  });
});

describe('reduced motion', () => {
  const rm = { reducedMotion: true, repeatVisit: false };
  it('has no story: success is catch -> short crossfade -> done', () => {
    let s = createBoot(rm);
    expect(s.story).toBe(BEAT.DECISION);
    s = markAppReady(resolve(s, 'ok', s.attempt));
    s = run(s, 0.1);
    expect(s.stage).toBe('reveal');
    s = run(s, BRANCH.REDUCED_REVEAL_DUR + 0.05);
    expect(s.stage).toBe('done');
  });
  it('failure goes straight to the error state', () => {
    let s = createBoot(rm);
    s = resolve(s, 'failed', s.attempt);
    s = run(s, 0.1);
    expect(s.stage).toBe('error');
  });
});
