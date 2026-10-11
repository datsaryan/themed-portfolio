import { describe, it, expect } from 'vitest';
import { BootMachine, type SfxCue } from '../bootMachine';
import { BRANCH, SMART, T } from '../bootConfig';

const STEP = 1 / 60;
function run(m: BootMachine, seconds: number) {
  for (let i = 0; i < Math.round(seconds / STEP); i++) m.tick(STEP);
}
const make = (o: Partial<{ reducedMotion: boolean; skipIntro: boolean }> = {}, cues?: SfxCue[]) =>
  new BootMachine({ reducedMotion: false, skipIntro: false, onCue: (c) => cues?.push(c), ...o });
const failure = { kind: 'http' as const, status: 500, message: 'HTTP 500' };

describe('BootMachine', () => {
  it('plays the story while loading and holds at the climax (never blocks or runs away)', () => {
    const m = make();
    run(m, 12);
    expect(m.frame.phase).toBe('scene');
    expect(m.frame.T).toBe(T.CLIMAX);
  });

  it('fast success (< quick threshold) skips the story and reveals after the minimum beat', () => {
    const m = make();
    run(m, 0.2);
    m.resolve('success');
    run(m, SMART.MIN_QUICK_DISPLAY_S + 0.1);
    expect(m.frame.phase).toBe('reveal');
    expect(m.frame.revealKind).toBe('quick');
    run(m, BRANCH.REVEAL_COMPACT + 0.1);
    expect(m.frame.phase).toBe('done');
  });

  it('mid-story success fast-forwards to the climax, catches, then reveals', () => {
    const m = make();
    run(m, 3);
    m.resolve('success');
    const started = m.frame.T;
    run(m, SMART.FAST_FORWARD_SUCCESS_S + 0.2);
    expect(started).toBeLessThan(T.CLIMAX);
    expect(['catch', 'reveal']).toContain(m.frame.phase);
    run(m, BRANCH.CATCH + BRANCH.REVEAL + 0.3);
    expect(m.frame.phase).toBe('done');
    expect(m.frame.revealKind).toBe('catch');
  });

  it('success arriving at the climax hold plays catch -> reveal', () => {
    const m = make();
    run(m, 9);
    m.resolve('success');
    run(m, 0.1);
    expect(m.frame.phase).toBe('catch');
  });

  it('failure fast-forwards, freezes at impact, then lands on the error screen', () => {
    const cues: SfxCue[] = [];
    const m = make({}, cues);
    run(m, 0.5);
    m.resolve('failure', failure);
    run(m, 10);
    expect(m.frame.phase).toBe('error');
    expect(m.getCoarse().failure).toEqual(failure);
    expect(cues).toContain('impact');
  });

  it('failure at the timeout (climax hold) impacts immediately and freezes exactly once', () => {
    const m = make();
    run(m, 8);
    m.resolve('failure', failure);
    let frozenFrames = 0;
    for (let i = 0; i < 60 * 6 && m.frame.phase !== 'error'; i++) {
      m.tick(STEP);
      if (m.frame.freeze) frozenFrames++;
    }
    expect(m.frame.phase).toBe('error');
    expect(frozenFrames).toBeGreaterThan(BRANCH.FREEZE * 60 * 0.6);
  });

  it('ignores a late/duplicate result (no race between animation and load)', () => {
    const m = make();
    run(m, 1);
    m.resolve('failure', failure);
    m.resolve('success'); // late contradicting result
    run(m, 10);
    expect(m.frame.phase).toBe('error');
    expect(m.frame.outcome).toBe('failure');
  });

  it('tick keeps returning true through the error screen (the render loop must stay alive for a later retry/enterAnyway to ever be picked up)', () => {
    const m = make();
    m.resolve('failure', failure);
    let keepGoing = true;
    for (let i = 0; i < 60 * 10 && keepGoing; i++) keepGoing = m.tick(STEP);
    expect(m.frame.phase).toBe('error');
    expect(keepGoing).toBe(true); // tick() must still say "keep scheduling frames"
    // and a retry placed while "stopped" actually progresses on the next tick:
    m.retry();
    m.tick(STEP);
    expect(m.frame.T).toBeGreaterThan(0);
  });

  it('retry restarts the whole sequence; enterAnyway reveals', () => {
    const m = make();
    m.resolve('failure', failure);
    run(m, 10);
    const before = m.getCoarse().attempt;
    m.retry();
    expect(m.frame.phase).toBe('scene');
    expect(m.frame.T).toBe(0);
    expect(m.frame.outcome).toBeNull();
    expect(m.getCoarse().attempt).toBe(before + 1);
    m.resolve('failure', failure);
    run(m, 10);
    m.enterAnyway();
    run(m, BRANCH.REVEAL_COMPACT + 0.2);
    expect(m.frame.phase).toBe('done');
  });

  it('retry/enterAnyway are no-ops outside the error screen', () => {
    const m = make();
    m.retry();
    m.enterAnyway();
    expect(m.frame.phase).toBe('scene');
    expect(m.getCoarse().attempt).toBe(1);
  });

  it('reduced motion: no story — instant fade on success, instant error on failure', () => {
    const ok = make({ reducedMotion: true });
    ok.resolve('success');
    expect(ok.frame.revealKind).toBe('reduced');
    run(ok, BRANCH.REVEAL_REDUCED + 0.1);
    expect(ok.frame.phase).toBe('done');
    const bad = make({ reducedMotion: true });
    bad.resolve('failure', failure);
    expect(bad.frame.phase).toBe('error');
  });

  it('returning visitor (skipIntro) takes the quick path even when the load is slow', () => {
    const m = make({ skipIntro: true });
    run(m, 4);
    m.resolve('success');
    run(m, 0.05);
    expect(m.frame.phase).toBe('reveal');
    expect(m.frame.revealKind).toBe('quick');
  });

  it('clamps huge frame gaps (background tab) so the animation cannot teleport', () => {
    const m = make();
    m.tick(30);
    expect(m.frame.T).toBeLessThanOrEqual(SMART.MAX_DT_S + 1e-9);
  });

  it('only notifies React (coarse subscribers) on real state changes, not every frame', () => {
    const m = make();
    let notes = 0;
    m.subscribe(() => notes++);
    run(m, 2);
    expect(notes).toBe(0);
    m.resolve('success');
    expect(notes).toBeGreaterThan(0);
  });
});
