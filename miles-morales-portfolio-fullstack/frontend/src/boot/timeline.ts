// Pure choreography: BootFrame (+ viewport layout) -> everything the renderer
// needs for one frame. No DOM, no React, no clocks: same input, same output,
// which is what makes the story testable and lets ghost/motion-blur trails be
// computed simply by evaluating the same function at an earlier time.

import { BRANCH, T as TL } from './bootConfig';
import type { BootFrame, RevealKind } from './bootMachine';
import {
  FIGURE_SCALE as S, GWEN_POSES, GWEN_SPEC, JOINT_KEYS, MILES_POSES, MILES_SPEC,
  handLocal, rotate, type FigureSpec, type Joints
} from './figureSpec';

export interface RigLayout { topY: number; vhUnits: number }

export interface FigureRig { x: number; y: number; rot: number; scale: number; opacity: number; joints: Joints }
export interface WebSeg { x1: number; y1: number; x2: number; y2: number; alpha: number; sag: number }
export interface Rig {
  miles: FigureRig;
  gwen: FigureRig;
  webs: WebSeg[];
  cam: { zoom: number; x: number; y: number; roll: number };
  fx: {
    sceneFade: number; sense: number; senseP: number; senseX: number; senseY: number;
    speed: number; speedAngle: number; glitch: number; flash: number; dim: number; red: number;
  };
  reveal: { p: number; kind: RevealKind | null };
}

// ---- math ------------------------------------------------------------------
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (v: number) => { const t = clamp01(v); return t * t * (3 - 2 * t); };
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const env = (x: number, at: number, dur: number) => (x >= at && x < at + dur ? Math.sin((Math.PI * (x - at)) / dur) : 0);
const decay = (x: number, amp: number, k: number) => (x < 0 ? 0 : amp * Math.exp(-x / k));

type Pts = number[][];
/** Cardinal (Catmull-Rom style) spline through [x, y] points: smooth velocities. */
function spline(x: number, pts: Pts): number {
  const n = pts.length;
  if (x <= pts[0][0]) return pts[0][1];
  if (x >= pts[n - 1][0]) return pts[n - 1][1];
  let i = 0;
  while (i < n - 2 && x > pts[i + 1][0]) i++;
  const [x0, y0] = pts[i];
  const [x1, y1] = pts[i + 1];
  const h = x1 - x0;
  const t = (x - x0) / h;
  const tan = (k: number) => {
    const a = pts[Math.max(0, k - 1)];
    const b = pts[Math.min(n - 1, k + 1)];
    return (b[1] - a[1]) / (b[0] - a[0] || 1);
  };
  const m0 = tan(i) * h;
  const m1 = tan(i + 1) * h;
  const t2 = t * t, t3 = t2 * t;
  return (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * m0 + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * m1;
}

function blendJoints(a: Joints, b: Joints, t: number): Joints {
  const out = {} as Joints;
  for (const k of JOINT_KEYS) out[k] = lerp(a[k], b[k], t);
  return out;
}
/** Pose keyframes [{at, pose}] -> smoothly blended joint angles. */
function poseAt<K extends string>(table: Record<K, Joints>, keys: Array<[number, K]>, x: number): Joints {
  if (x <= keys[0][0]) return table[keys[0][1]];
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, p0] = keys[i];
    const [t1, p1] = keys[i + 1];
    if (x <= t1) return blendJoints(table[p0], table[p1], smooth((x - t0) / (t1 - t0)));
  }
  return table[keys[keys.length - 1][1]];
}

const toWorld = (f: FigureRig, p: [number, number]): [number, number] => {
  const [rx, ry] = rotate(p[0] * f.scale, p[1] * f.scale, f.rot);
  return [f.x + rx, f.y + ry];
};
const hand = (f: FigureRig, spec: FigureSpec, side: 'L' | 'R') => toWorld(f, handLocal(spec, side, f.joints));
const headWorld = (f: FigureRig) => toWorld(f, [0, -104]);

// ---- scene keyframes (stage units; y is remapped per viewport) -------------
// Miles hangs high, Gwen falls past him, he lets go and chases from ABOVE,
// converging on her horizontally so the two meet at the climax (T=7).
const M_X: Pts = [[0, 790], [1.5, 790], [3.0, 790], [3.3, 796], [3.8, 730], [4.4, 650], [5.0, 575], [5.6, 528], [6.3, 495], [7.0, 488]];
const M_Y: Pts = [[0, 100], [1.5, 108], [3.0, 112], [3.3, 130], [3.8, 215], [4.4, 315], [5.0, 420], [5.6, 530], [6.3, 660], [7.0, 765]];
const M_R: Pts = [[0, 4], [1.5, -4], [3.0, 4], [3.3, 8], [3.8, 140], [4.4, 200], [5.0, 208], [5.6, 206], [6.3, 200], [7.0, 192]];
const G_X: Pts = [[1.5, 330], [3, 362], [4, 392], [5, 420], [6, 444], [7, 458]];
const G_Y: Pts = [[1.5, -120], [2.5, 40], [3.4, 180], [4.5, 355], [5.5, 545], [6.3, 690], [7, 800]];
const G_R: Pts = [[1.5, -40], [3, 30], [4.5, -20], [6, 35], [7, 10]];

const M_POSES_T: Array<[number, keyof typeof MILES_POSES]> = [
  [0, 'swing'], [2.9, 'swing'], [3.15, 'notice'], [3.5, 'notice'], [3.9, 'dive'], [5.1, 'dive'], [5.4, 'reach'], [7, 'reach']
];
const G_POSES_T: Array<[number, keyof typeof GWEN_POSES]> = [[0, 'fall'], [5.0, 'fall'], [5.6, 'reachUp'], [7, 'reachUp']];

// failure branch (time = seconds into the branch)
const F_MX: Pts = [[0, 488], [0.5, 492], [1.0, 482], [1.6, 476], [2.2, 476]];
const F_MY: Pts = [[0, 765], [0.5, 835], [1.0, 850], [1.6, 858], [2.2, 858]];
const F_MR: Pts = [[0, 192], [0.5, 188], [1.0, 262], [1.6, 352], [2.2, 358]];
const F_GX: Pts = [[0, 458], [0.5, 452], [2.2, 452]];
const F_GY: Pts = [[0, 800], [0.25, 832], [0.5, 905], [0.62, 893], [0.85, 905], [2.2, 905]];
const F_GR: Pts = [[0, 10], [0.5, 72], [0.7, 90], [2.2, 92]];

const ANCHOR_X = 800;
const PENDULUM_ANCHOR: [number, number] = [ANCHOR_X, -400];

function figure(x: number, y: number, rot: number, joints: Joints, opacity = 1, scale = S): FigureRig {
  return { x, y, rot, scale, opacity, joints };
}

export function computeRig(frame: BootFrame, layout: RigLayout): Rig {
  const { phase, T, branchT, reveal, revealKind } = frame;
  const branch = phase === 'catch' || phase === 'impact' || phase === 'error' ||
    (phase === 'reveal' && revealKind !== 'quick') || (phase === 'done');
  const inScene = phase === 'scene' || (phase === 'reveal' && revealKind === 'quick');
  const failed = frame.outcome === 'failure';
  const t = Math.min(T, TL.CLIMAX);

  // ---- Miles & Gwen in the scene (pre-climax) ------------------------------
  const yStart = layout.topY + 0.13 * layout.vhUnits;
  // Affine remaps: keep the T=7 meeting point fixed, stretch the start to the
  // real viewport top so entrances always come from off-screen on any shape.
  const mapY = (y: number) => 765 + (y - 765) * ((765 - yStart) / (765 - 100));
  const hangEnv = t < TL.DIVE_START ? clamp01((TL.DIVE_START - t) / 0.5) : 0;
  let mx = spline(t, M_X) + Math.sin(t * 1.7) * 9 * hangEnv;
  let my = mapY(spline(t, M_Y)) + Math.sin(t * 3.4) * 3 * hangEnv;
  let mr = spline(t, M_R) + Math.sin(t * 1.7 + 0.6) * 5 * hangEnv;
  let mJ = poseAt(MILES_POSES, M_POSES_T, t);

  const gStart = layout.topY - 120;
  const mapG = (y: number) => 800 + (y - 800) * ((800 - gStart) / 920);
  let gx = spline(Math.max(t, 1.5), G_X);
  let gy = mapG(spline(Math.max(t, 1.5), G_Y));
  let gr = spline(Math.max(t, 1.5), G_R);
  const flail = clamp01((5.6 - t) / 0.6);
  const wob = (w: number, ph: number, a: number) => Math.sin(t * w + ph) * a * flail;
  let gJ = poseAt(GWEN_POSES, G_POSES_T, t);
  gJ = { ...gJ, aUL: gJ.aUL + wob(6.1, 0, 16), aUR: gJ.aUR + wob(5.3, 1.2, 16), aFL: gJ.aFL + wob(7.2, 2, 12),
    aFR: gJ.aFR + wob(6.6, 3, 12), lTL: gJ.lTL + wob(5.7, 0.7, 10), lTR: gJ.lTR + wob(6.3, 2.1, 10) };
  let gOpacity = smooth((t - 1.5) / 0.25);

  // ---- post-climax branches -------------------------------------------------
  let mScale = S;
  if (branch) {
    if (!failed) {
      const q = smooth(branchT / BRANCH.CATCH);
      mx = lerp(488, 468, q); my = lerp(765, 772, q); mr = lerp(192, 354, q);
      mJ = poseAt(MILES_POSES, [[0, 'reach'], [0.35, 'reach'], [0.8, 'hold'], [1, 'hold']], branchT);
      const [ox, oy] = rotate(6 * S, 26 * S, mr);
      gx = lerp(458, mx + ox, q); gy = lerp(800, my + oy, q); gr = lerp(10, mr + 90, q);
      gJ = blendJoints(GWEN_POSES.reachUp, GWEN_POSES.limp, q);
      gOpacity = 1;
    } else {
      mx = spline(branchT, F_MX); my = spline(branchT, F_MY); mr = spline(branchT, F_MR);
      mJ = poseAt(MILES_POSES, [[0, 'reach'], [0.6, 'reach'], [1.2, 'kneel'], [2.2, 'kneel']], branchT);
      gx = spline(branchT, F_GX); gy = spline(branchT, F_GY); gr = spline(branchT, F_GR);
      gJ = poseAt(GWEN_POSES, [[0, 'reachUp'], [0.5, 'ground'], [2.2, 'ground']], branchT);
      gOpacity = 1;
    }
  }

  // ---- reveal transition ------------------------------------------------------
  const p = reveal;
  let sceneFade = smooth(t / 1.0);
  const webs: WebSeg[] = [];
  let mOpacity = 1;

  if (phase === 'reveal' || phase === 'done') {
    if (revealKind === 'catch') {
      const q = smooth(p / 0.62);
      const P0 = [468, 772], P1 = [520, 120], P2 = [1240, 20];
      mx = (1 - q) ** 2 * P0[0] + 2 * (1 - q) * q * P1[0] + q * q * P2[0];
      my = (1 - q) ** 2 * P0[1] + 2 * (1 - q) * q * P1[1] + q * q * P2[1];
      mr = lerp(354, 426, q);
      mScale = S * (1 + 0.25 * q);
      const [ox, oy] = rotate(6 * mScale, 26 * mScale, mr);
      gx = mx + ox; gy = my + oy; gr = mr + 90;
    } else if (revealKind === 'quick') {
      const q = smooth(p / 0.7);
      const P0 = [mx, my], P1 = [560, 470 + layout.topY * 0.2], P2 = [120, yStart - 260];
      const bx = (1 - q) ** 2 * P0[0] + 2 * (1 - q) * q * P1[0] + q * q * P2[0];
      const by = (1 - q) ** 2 * P0[1] + 2 * (1 - q) * q * P1[1] + q * q * P2[1];
      mx = bx; my = by; mr = lerp(mr, -70, q);
      mJ = poseAt(MILES_POSES, [[0, 'swing'], [1, 'swing']], 0);
      gOpacity = 0;
    }
    sceneFade = 1 - smooth((p - 0.28) / 0.28);
    if (revealKind === 'anyway') mOpacity = 1;
  }

  const miles = figure(mx, my, mr, mJ, mOpacity, mScale);
  const gwen = figure(gx, gy, gr, gJ, gOpacity, revealKind === 'catch' && (phase === 'reveal' || phase === 'done') ? mScale : S);

  // ---- web strands ---------------------------------------------------------------
  const [mrx, mry] = hand(miles, MILES_SPEC, 'R');
  const [mlx, mly] = hand(miles, MILES_SPEC, 'L');
  const [gwx, gwy] = hand(gwen, GWEN_SPEC, 'R');
  const anchor: [number, number] = [PENDULUM_ANCHOR[0], layout.topY - 300];

  if (phase === 'scene' || (phase === 'reveal' && revealKind === 'quick')) {
    // pre-dive: Miles hangs from a strand; it snaps free as he lets go
    const hangAlpha = phase === 'scene' ? (t < TL.DIVE_START ? 1 : clamp01(1 - (t - TL.DIVE_START) / 0.3)) : (p < 0.55 ? 1 : clamp01(1 - (p - 0.55) / 0.12));
    if (hangAlpha > 0) webs.push({ x1: mrx, y1: mry, x2: anchor[0], y2: anchor[1], alpha: hangAlpha, sag: 0 });
  }
  if (phase === 'scene' && t >= TL.WEB_SHOT) {
    const prog = smooth((t - TL.WEB_SHOT) / 0.4);
    webs.push({ x1: mlx, y1: mly, x2: lerp(mlx, gwx, prog), y2: lerp(mly, gwy, prog), alpha: 1, sag: (1 - prog) * 0.3 });
  }
  if (phase === 'catch') {
    webs.push({ x1: mlx, y1: mly, x2: gwx, y2: gwy, alpha: 1 - smooth(branchT / BRANCH.CATCH) * 0.6, sag: 0 });
    webs.push({ x1: mrx, y1: mry, x2: 380, y2: layout.topY - 200, alpha: smooth(branchT / 0.5), sag: 0.02 });
  }
  if (phase === 'impact' || (phase === 'error')) {
    const sag = smooth((branchT - BRANCH.IMPACT_AT) / 0.5) * 0.6;
    const alpha = 1 - smooth((branchT - 1.0) / 0.6);
    if (alpha > 0) webs.push({ x1: mlx, y1: mly, x2: gwx, y2: gwy, alpha, sag });
  }
  if (phase === 'reveal' && revealKind === 'catch') {
    const a = p < 0.5 ? 1 : clamp01(1 - (p - 0.5) / 0.15);
    if (a > 0) webs.push({ x1: mrx, y1: mry, x2: 760, y2: layout.topY - 420, alpha: a, sag: 0.02 });
  }

  // ---- camera --------------------------------------------------------------------
  const punch = decay(t - TL.WEB_SHOT, 0.05, 0.4) * (inScene ? 1 : 0);
  let zoom = spline(t, [[0, 1], [1.5, 1.03], [3, 1.07], [5, 1.14], [7, 1.2]]) + punch;
  let fx0 = spline(t, [[0, 500], [4, 540], [7, 480]]);
  let fy0 = spline(t, [[0, 380], [4, 470], [7, 720]]);
  let k = 0.55;
  let roll = spline(t, [[0, 0], [3, -0.6], [5, -3.2], [7, -2.2]]);
  let shake = decay(t - TL.WEB_SHOT, 5, 0.3) * (inScene ? 1 : 0);

  if (branch && !failed) {
    const q = smooth(branchT / BRANCH.CATCH);
    zoom = lerp(1.2, 1.32, q); fx0 = lerp(480, 470, q); fy0 = lerp(720, 770, q); roll = lerp(-2.2, 0, q);
    shake = decay(branchT, 8, 0.25);
    if (phase === 'reveal' || phase === 'done') zoom = lerp(1.32, 1.55, smooth(p));
  } else if (branch && failed) {
    const b = branchT;
    zoom = lerp(1.2, 1.28, smooth(b / 0.5)) + lerp(0, 0.22, smooth((b - 0.5) / 1.7)) + decay(b - 0.5, 0.1, 0.3);
    fx0 = lerp(480, 476, smooth(b / 1.2)); fy0 = lerp(720, 850, smooth(b / 1.2)); k = lerp(0.55, 0.78, smooth(b / 1.5));
    roll = lerp(-2.2, 0, smooth(b / 0.8));
    shake = b > BRANCH.IMPACT_AT ? decay(b - BRANCH.IMPACT_AT, 26, 0.55) : 0;
  } else if (phase === 'reveal' && revealKind === 'quick') {
    zoom = lerp(zoom, 1.12, smooth(p));
  }
  const cam = {
    zoom,
    x: -k * zoom * (fx0 - 500) + shake * Math.sin(t * 61 + branchT * 61),
    y: -k * zoom * (fy0 - 500) + shake * 0.7 * Math.cos(t * 47 + branchT * 47),
    roll
  };

  // ---- effects ---------------------------------------------------------------------
  const [hx, hy] = headWorld(miles);
  const senseP = clamp01((t - TL.NOTICE) / 0.9);
  const speedDx = spline(t + 0.1, M_X) - spline(t, M_X);
  const speedDy = mapY(spline(t + 0.1, M_Y)) - mapY(spline(t, M_Y));
  const fastEnough = inScene ? smooth((t - 3.6) / 0.6) : 0;
  const successFade = !failed && branch ? 1 - smooth(branchT / 0.6) : 1;

  const b = branchT;
  const glitch = Math.max(
    env(t, TL.NOTICE, 0.22) * (inScene ? 1 : 0),
    env(t, TL.WEB_SHOT, 0.18) * 0.8 * (inScene ? 1 : 0),
    branch && failed && b >= BRANCH.IMPACT_AT ? decay(b - BRANCH.IMPACT_AT, 0.95, 0.5) : 0,
    branch && !failed && phase === 'catch' ? env(b, 0, 0.2) * 0.5 : 0,
    phase === 'reveal' ? env(p, 0.4, 0.2) * 0.7 : 0
  );
  const flash = frame.freeze ? 0.3
    : branch && failed && b > BRANCH.IMPACT_AT ? decay(b - BRANCH.IMPACT_AT, 0.6, 0.12)
    : phase === 'reveal' ? env(p, 0.42, 0.16) * 0.55 : 0;

  return {
    miles, gwen, webs, cam,
    fx: {
      sceneFade,
      sense: (env(t, TL.NOTICE, 0.9) + env(t, TL.WEB_SHOT - 0.2, 0.6) * 0.5) * (inScene ? 1 : 0),
      senseP, senseX: hx, senseY: hy,
      speed: (branch && !failed ? fastEnough * successFade : failed && branch ? 0.15 * (1 - smooth(b / 1.2)) : fastEnough),
      speedAngle: (Math.atan2(speedDy, speedDx) * 180) / Math.PI,
      glitch: clamp01(glitch), flash: clamp01(flash),
      dim: branch && failed ? smooth((b - 1.0) / 1.2) * 0.55 : 0,
      red: branch && failed ? clamp01(smooth((b - 1.2) / 0.6)) * (0.6 + 0.4 * Math.sin(b * 7)) : 0
    },
    reveal: { p, kind: revealKind }
  };
}
