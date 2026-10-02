import { describe, it, expect } from 'vitest';
import { frameAt, STAGE } from './choreography';
import { createBoot, advance, resolve, markAppReady } from './bootMachine';
import type { BootState } from './bootMachine';
import { BEAT, BRANCH } from './bootConfig';
import { JOINTS } from './rig';

const opts = { reducedMotion: false, repeatVisit: false };
const at = (patch: Partial<BootState>): BootState => ({ ...createBoot(opts), ...patch });
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

function allFinite(o: unknown): boolean {
  if (typeof o === 'number') return Number.isFinite(o);
  if (o && typeof o === 'object') return Object.values(o).every(allFinite);
  return true;
}

describe('frameAt', () => {
  it('produces finite numbers across the whole story and both branches', () => {
    for (let t = 0; t <= BEAT.DECISION; t += 0.05) expect(allFinite(frameAt(at({ story: t, wall: t })))).toBe(true);
    for (let b = 0; b <= 1.95; b += 0.05) {
      expect(allFinite(frameAt(at({ story: BEAT.DECISION, stage: b < 1 ? 'catch' : 'reveal', branch: b < 1 ? b : b - 1, status: 'ok' })))).toBe(true);
    }
    for (let b = 0; b <= BRANCH.ERROR_AT + 1; b += 0.05) {
      expect(allFinite(frameAt(at({ story: BEAT.DECISION, stage: b < BRANCH.ERROR_AT ? 'impact' : 'error', branch: b, status: 'failed' })))).toBe(true);
    }
  });

  it('defines every joint for every actor', () => {
    const f = frameAt(at({ story: 4, wall: 4 }));
    for (const j of JOINTS) {
      expect(Number.isFinite(f.miles.pose[j])).toBe(true);
      expect(Number.isFinite(f.gwen.pose[j])).toBe(true);
    }
  });

  it('has no teleport at story -> catch', () => {
    const a = frameAt(at({ story: BEAT.DECISION, status: 'ok' }));
    const b = frameAt(at({ story: BEAT.DECISION, stage: 'catch', branch: 0, status: 'ok' }));
    expect(dist(a.miles, b.miles)).toBeLessThan(2);
    expect(dist(a.gwen, b.gwen)).toBeLessThan(2);
    expect(Math.abs(a.camera.zoom - b.camera.zoom)).toBeLessThan(0.02);
  });

  it('has no teleport at story -> impact', () => {
    const a = frameAt(at({ story: BEAT.DECISION, status: 'failed' }));
    const b = frameAt(at({ story: BEAT.DECISION, stage: 'impact', branch: 0, status: 'failed' }));
    expect(dist(a.miles, b.miles)).toBeLessThan(2);
    expect(dist(a.gwen, b.gwen)).toBeLessThan(2);
  });

  it('has no teleport at catch -> reveal', () => {
    const a = frameAt(at({ story: BEAT.DECISION, stage: 'catch', branch: BRANCH.CATCH_DUR - 1e-4, status: 'ok' }));
    const b = frameAt(at({ story: BEAT.DECISION, stage: 'reveal', branch: 0, status: 'ok' }));
    expect(dist(a.miles, b.miles)).toBeLessThan(3);
  });

  it('Miles reaches Gwen by the decision point (close enough to read as contact)', () => {
    const f = frameAt(at({ story: BEAT.DECISION }));
    expect(dist(f.miles, f.gwen)).toBeLessThan(90);
  });

  it('Gwen actually reaches the ground on a miss, and stays there', () => {
    const hit = frameAt(at({ story: BEAT.DECISION, stage: 'impact', branch: BRANCH.IMPACT_AT + 0.01, status: 'failed' }));
    expect(hit.gwen.y).toBeGreaterThan(STAGE.GROUND - 60);
    expect(hit.impact.t).toBeGreaterThanOrEqual(0);
    const later = frameAt(at({ story: BEAT.DECISION, stage: 'error', branch: 3, status: 'failed' }));
    expect(later.gwen.y).toBeGreaterThan(STAGE.GROUND - 60);
  });

  it('Gwen is above the ground the whole time before impact', () => {
    for (let b = 0; b < BRANCH.IMPACT_AT - 0.02; b += 0.05) {
      const f = frameAt(at({ story: BEAT.DECISION, stage: 'impact', branch: b, status: 'failed' }));
      expect(f.gwen.y).toBeLessThan(STAGE.GROUND - 40);
    }
  });

  it('web is not drawn before the thwip and is taut by the decision point', () => {
    expect(frameAt(at({ story: BEAT.RESCUE - 0.1 })).web.grow).toBe(0);
    const f = frameAt(at({ story: BEAT.DECISION }));
    expect(f.web.grow).toBe(1);
    expect(f.web.tension).toBeCloseTo(1, 1);
  });

  it('web snaps on a miss', () => {
    expect(frameAt(at({ story: BEAT.DECISION, stage: 'impact', branch: 0.05, status: 'failed' })).web.snapped).toBe(false);
    expect(frameAt(at({ story: BEAT.DECISION, stage: 'impact', branch: 0.4, status: 'failed' })).web.snapped).toBe(true);
  });

  it('plays end-to-end through the real machine without NaNs', () => {
    let s = createBoot(opts);
    for (let i = 0; i < 60 * 3; i++) s = advance(s, 1 / 60);
    s = markAppReady(resolve(s, 'ok', s.attempt));
    for (let i = 0; i < 60 * 6 && s.stage !== 'done'; i++) {
      s = advance(s, 1 / 60);
      expect(allFinite(frameAt(s))).toBe(true);
    }
    expect(s.stage).toBe('done');
  });
});
