import { describe, it, expect } from 'vitest';
import { computeRig } from '../timeline';
import { BRANCH, T } from '../bootConfig';
import type { BootFrame } from '../bootMachine';

const layouts = { desktop: { topY: 0, vhUnits: 1000 }, phone: { topY: -500, vhUnits: 1614 } };
const frame = (o: Partial<BootFrame>): BootFrame => ({
  phase: 'scene', T: 0, branchT: 0, freeze: false, reveal: 0, revealKind: null, outcome: null, ...o
});
const finite = (v: unknown): boolean =>
  typeof v === 'number' ? Number.isFinite(v) : v && typeof v === 'object' ? Object.values(v as object).every(finite) : true;

describe('computeRig', () => {
  for (const [name, layout] of Object.entries(layouts)) {
    it(`${name}: every value is finite across the whole story, both branches and reveals`, () => {
      const frames: BootFrame[] = [];
      for (let t = 0; t <= T.CLIMAX; t += 0.05) frames.push(frame({ T: t }));
      for (let b = 0; b <= BRANCH.CATCH; b += 0.05) frames.push(frame({ phase: 'catch', T: T.CLIMAX, branchT: b, outcome: 'success' }));
      for (let b = 0; b <= BRANCH.IMPACT; b += 0.05) frames.push(frame({ phase: 'impact', T: T.CLIMAX, branchT: b, outcome: 'failure' }));
      for (const kind of ['catch', 'quick', 'anyway', 'reduced'] as const)
        for (let p = 0; p <= 1; p += 0.05) frames.push(frame({ phase: 'reveal', T: 2, reveal: p, revealKind: kind, outcome: 'success' }));
      for (const f of frames) expect(finite(computeRig(f, layout))).toBe(true);
    });
  }

  it('Gwen starts above the viewport top on every screen shape', () => {
    for (const layout of Object.values(layouts)) {
      const rig = computeRig(frame({ T: 1.5 }), layout);
      expect(rig.gwen.y).toBeLessThan(layout.topY);
    }
  });

  it('branches start exactly where the scene ends (no teleporting at the climax)', () => {
    const end = computeRig(frame({ T: T.CLIMAX }), layouts.desktop);
    const ok = computeRig(frame({ phase: 'catch', T: T.CLIMAX, branchT: 0, outcome: 'success' }), layouts.desktop);
    const bad = computeRig(frame({ phase: 'impact', T: T.CLIMAX, branchT: 0, outcome: 'failure' }), layouts.desktop);
    for (const r of [ok, bad]) {
      expect(Math.abs(r.miles.x - end.miles.x)).toBeLessThan(4);
      expect(Math.abs(r.miles.y - end.miles.y)).toBeLessThan(4);
      expect(Math.abs(r.gwen.x - end.gwen.x)).toBeLessThan(4);
      expect(Math.abs(r.gwen.y - end.gwen.y)).toBeLessThan(4);
    }
  });

  it('failure: Gwen reaches the ground at the impact moment and stays there', () => {
    const at = computeRig(frame({ phase: 'impact', T: T.CLIMAX, branchT: BRANCH.IMPACT_AT, outcome: 'failure' }), layouts.desktop);
    const end = computeRig(frame({ phase: 'error', T: T.CLIMAX, branchT: BRANCH.IMPACT, outcome: 'failure' }), layouts.desktop);
    expect(at.gwen.y).toBeGreaterThan(895);
    expect(end.gwen.y).toBeGreaterThan(895);
  });

  it('success: Gwen ends up carried by Miles', () => {
    const r = computeRig(frame({ phase: 'catch', T: T.CLIMAX, branchT: BRANCH.CATCH, outcome: 'success' }), layouts.desktop);
    expect(Math.hypot(r.gwen.x - r.miles.x, r.gwen.y - r.miles.y)).toBeLessThan(40);
  });

  it('web reaches Gwen (her reaching hand, ~a limb away from her hip) once fired', () => {
    for (const layout of Object.values(layouts)) {
      const r = computeRig(frame({ T: T.WEB_SHOT + 0.6 }), layout);
      const shot = r.webs.find((w) => Math.hypot(w.x2 - r.gwen.x, w.y2 - r.gwen.y) < 130);
      expect(shot).toBeTruthy();
    }
  });

  it('Miles chases from above and never overtakes Gwen before the climax', () => {
    for (const layout of Object.values(layouts)) {
      for (let t = 3.4; t <= T.CLIMAX; t += 0.1) {
        const r = computeRig(frame({ T: t }), layout);
        expect(r.miles.y).toBeLessThan(r.gwen.y + 2);
      }
    }
  });
});
