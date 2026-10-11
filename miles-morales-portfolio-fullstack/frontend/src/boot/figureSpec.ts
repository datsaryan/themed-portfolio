// Rig geometry shared by the SVG art (components/cinematic) and the timeline
// (hand positions for the web). Local space: origin at the pelvis, +y down.
// Joint angles are degrees; 0 = limb hangs straight down, positive = clockwise.

export interface Joints {
  aUL: number; aFL: number; aUR: number; aFR: number; // upper/fore arm, left/right
  lTL: number; lSL: number; lTR: number; lSR: number; // thigh/shin, left/right
  head: number;
}
export const JOINT_KEYS: Array<keyof Joints> = ['aUL', 'aFL', 'aUR', 'aFR', 'lTL', 'lSL', 'lTR', 'lSR', 'head'];

export interface FigureSpec {
  shoulderL: [number, number];
  shoulderR: [number, number];
  hipL: [number, number];
  hipR: [number, number];
  upper: number;
  fore: number;
  thigh: number;
  shin: number;
}

export const MILES_SPEC: FigureSpec = {
  shoulderL: [-27, -66], shoulderR: [27, -66], hipL: [-11, 2], hipR: [11, 2],
  upper: 44, fore: 40, thigh: 54, shin: 52
};
export const GWEN_SPEC: FigureSpec = {
  shoulderL: [-24, -64], shoulderR: [24, -64], hipL: [-10, 2], hipR: [10, 2],
  upper: 42, fore: 40, thigh: 56, shin: 54
};

/** World size of a figure relative to the 1000-unit stage. */
export const FIGURE_SCALE = 0.62;

const rad = (d: number) => (d * Math.PI) / 180;

export function rotate(x: number, y: number, deg: number): [number, number] {
  const c = Math.cos(rad(deg));
  const s = Math.sin(rad(deg));
  return [x * c - y * s, x * s + y * c];
}

/** Forward kinematics: local position of a hand (fingertip end of the forearm). */
export function handLocal(spec: FigureSpec, side: 'L' | 'R', j: Joints): [number, number] {
  const sh = side === 'L' ? spec.shoulderL : spec.shoulderR;
  const aU = side === 'L' ? j.aUL : j.aUR;
  const aF = side === 'L' ? j.aFL : j.aFR;
  const [ux, uy] = rotate(0, spec.upper, aU);
  const [fx, fy] = rotate(0, spec.fore, aU + aF);
  return [sh[0] + ux + fx, sh[1] + uy + fy];
}

export type PoseTable<K extends string> = Record<K, Joints>;

export const MILES_POSES = {
  swing: { aUL: -14, aFL: -16, aUR: 168, aFR: -12, lTL: 12, lSL: -26, lTR: -16, lSR: 30, head: 0 },
  notice: { aUL: 28, aFL: 42, aUR: -28, aFR: -42, lTL: 24, lSL: -42, lTR: -24, lSR: 42, head: -8 },
  dive: { aUL: 170, aFL: 6, aUR: -176, aFR: -4, lTL: 4, lSL: 8, lTR: -4, lSR: -8, head: 0 },
  reach: { aUL: 150, aFL: 26, aUR: -178, aFR: -2, lTL: 14, lSL: -12, lTR: -8, lSR: 10, head: 0 },
  hold: { aUL: 120, aFL: -70, aUR: -120, aFR: 70, lTL: 14, lSL: -22, lTR: -14, lSR: 22, head: 0 },
  kneel: { aUL: 30, aFL: 55, aUR: -20, aFR: -70, lTL: 70, lSL: -95, lTR: 20, lSR: -40, head: 14 }
} satisfies PoseTable<string>;

export const GWEN_POSES = {
  fall: { aUL: 150, aFL: -24, aUR: -146, aFR: 28, lTL: 24, lSL: -30, lTR: -30, lSR: 34, head: 0 },
  reachUp: { aUL: 150, aFL: -20, aUR: -176, aFR: -4, lTL: 24, lSL: -30, lTR: -30, lSR: 34, head: 0 },
  limp: { aUL: 14, aFL: 10, aUR: -10, aFR: -14, lTL: 6, lSL: -4, lTR: -8, lSR: 6, head: 6 },
  ground: { aUL: 70, aFL: 20, aUR: -60, aFR: -30, lTL: 14, lSL: 10, lTR: -10, lSR: -8, head: 10 }
} satisfies PoseTable<string>;
