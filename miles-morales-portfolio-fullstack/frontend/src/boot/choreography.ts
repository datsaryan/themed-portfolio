// Pure choreography: BootState -> a complete description of one frame.
// Everything here is in "stage space" (a 1600x900 canvas); the renderer maps
// stage space to the viewport. No DOM, no randomness — same state, same frame.

import { BEAT, BRANCH } from './bootConfig';
import type { BootState } from './bootMachine';
import { Actor, Pose, handWorld, chestWorld, headWorld, mixPose, withPose } from './rig';

export const STAGE = {
  W: 1600,
  H: 900,
  GROUND: 835,
  /** Where Gwen hangs on to the left building's corner. */
  LEDGE_L: { x: 700, y: 150 },
  /** Where Miles perches on the right building's corner. */
  LEDGE_R: { x: 1185, y: 330 },
  /** Swing anchor (off-screen above) for the post-catch swing. */
  ANCHOR: { x: 900, y: -500 },
} as const;

// ---------- easing / tracks ------------------------------------------------
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeIn = (t: number) => t * t;

type Key<T> = readonly [t: number, v: T];

/** Piecewise-eased interpolation of numeric keyframes. */
function num(t: number, keys: readonly Key<number>[], ease = easeInOut): number {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, v0] = keys[i - 1], [t1, v1] = keys[i];
      return lerp(v0, v1, ease((t - t0) / (t1 - t0)));
    }
  }
  return keys[keys.length - 1][1];
}

function poseTrack(t: number, keys: readonly Key<Pose>[], ease = easeInOut): Pose {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, p0] = keys[i - 1], [t1, p1] = keys[i];
      return mixPose(p0, p1, ease((t - t0) / (t1 - t0)));
    }
  }
  return keys[keys.length - 1][1];
}

// ---------- poses ----------------------------------------------------------
const P = (o: Pose): Pose => o;

const MILES = {
  // Crouched on the ledge, watching the street.
  perch: P({ torso: -30, head: 14, lShoulder: 38, lElbow: 28, rShoulder: 62, rElbow: 24,
    lHip: 72, lKnee: -64, rHip: 88, rKnee: -58 }),
  // Spider-sense hits: head snaps up, body locks.
  sense: P({ torso: -18, head: -8, lShoulder: 20, lElbow: 70, rShoulder: 30, rElbow: 90,
    lHip: 62, lKnee: -58, rHip: 76, rKnee: -52 }),
  // Coiled, about to launch.
  coil: P({ torso: -42, head: 6, lShoulder: -35, lElbow: 25, rShoulder: -20, rElbow: 20,
    lHip: 96, lKnee: -92, rHip: 108, rKnee: -88 }),
  // Head-first dive, arms back, legs trailing.
  dive: P({ torso: 6, head: -12, lShoulder: -150, lElbow: 8, rShoulder: -165, rElbow: 6,
    lHip: -18, lKnee: -14, rHip: -26, rKnee: -22 }),
  // Right arm thrown forward to fire the web.
  shoot: P({ torso: 4, head: -10, lShoulder: -120, lElbow: 20, rShoulder: 178, rElbow: 4,
    lHip: -16, lKnee: -26, rHip: -30, rKnee: -34 }),
  // Reaching, fully extended.
  reach: P({ torso: 2, head: -8, lShoulder: 150, lElbow: 12, rShoulder: 172, rElbow: 2,
    lHip: -8, lKnee: -18, rHip: -22, rKnee: -26 }),
  // Holding Gwen.
  hold: P({ torso: -6, head: 4, lShoulder: 62, lElbow: 70, rShoulder: 52, rElbow: 78,
    lHip: 24, lKnee: -40, rHip: 38, rKnee: -50 }),
  // Landed beside her, head bowed.
  defeat: P({ torso: -34, head: 38, lShoulder: 28, lElbow: 14, rShoulder: 40, rElbow: 10,
    lHip: 66, lKnee: -84, rHip: 78, rKnee: -78 }),
};

const GWEN = {
  // Hanging from the ledge by one hand, the other scrabbling.
  hang: P({ torso: 4, head: -6, lShoulder: 150, lElbow: 20, rShoulder: 178, rElbow: 2,
    lHip: 10, lKnee: -22, rHip: 22, rKnee: -30 }),
  // Grip failing — fingers slipping.
  slip: P({ torso: 10, head: 8, lShoulder: 120, lElbow: 40, rShoulder: 150, rElbow: 10,
    lHip: 16, lKnee: -30, rHip: 30, rKnee: -36 }),
  // Free-falling, arms flailing up.
  fall: P({ torso: -6, head: -14, lShoulder: 140, lElbow: 30, rShoulder: 165, rElbow: 20,
    lHip: 32, lKnee: -44, rHip: 18, rKnee: -36 }),
  // Reaching back for the web.
  grab: P({ torso: -10, head: -16, lShoulder: 120, lElbow: 20, rShoulder: 170, rElbow: 4,
    lHip: 26, lKnee: -38, rHip: 14, rKnee: -30 }),
  // Held.
  held: P({ torso: -4, head: 18, lShoulder: 30, lElbow: 60, rShoulder: 24, rElbow: 70,
    lHip: 14, lKnee: -26, rHip: 26, rKnee: -34 }),
  // On the ground.
  down: P({ torso: 4, head: 10, lShoulder: 70, lElbow: 20, rShoulder: 100, rElbow: 14,
    lHip: 40, lKnee: -20, rHip: 56, rKnee: -26 }),
};

// ---------- frame description ---------------------------------------------
export type Caption = 'connect' | 'rescue' | 'catch' | 'miss';

export interface Frame {
  miles: Actor;
  gwen: Actor;
  camera: { cx: number; cy: number; zoom: number; roll: number; shake: number };
  /** Web from Miles' hand to Gwen; `snapped` splits it into two retracting halves. */
  web: { grow: number; tension: number; snapped: boolean; from: readonly [number, number]; to: readonly [number, number] };
  /** Swing line from Miles' hand up to the anchor (success path). */
  swing: { grow: number; from: readonly [number, number] };
  /** Spider-sense burst progress 0..1 (or -1 when idle) plus a faint idle level. */
  sense: { burst: number; level: number; at: readonly [number, number] };
  speed: number;       // radial speed-line intensity 0..1
  aberration: number;  // chromatic split 0..1
  flash: number;       // white flash 0..1
  glitch: number;      // glitch-bar intensity 0..1
  impact: { t: number; at: readonly [number, number] }; // t: -1 idle, else 0..1 shock ring progress
  reveal: { progress: number; cx: number; cy: number };  // web-wipe, stage coords
  letterbox: number;   // 0..1
  caption: Caption;
  sfx: { thwip: boolean }; // convenience for renderer; edge detection lives in the hook
  /** Progress 0..1 of the "THWIP!" lettering, or -1 when hidden. */
  thwipT: number;
}

const ZERO_XY = [0, 0] as const;

function gwenFall(story: number) {
  // Gravity-like ease-in from the ledge hang to the catch height.
  const t = Math.max(0, story - BEAT.FALL);
  const k = (600 - 286) / Math.pow(BEAT.DECISION - BEAT.FALL, 2);
  return { y: 286 + k * t * t, vy: 2 * k * t };
}

export function frameAt(s: BootState): Frame {
  const t = s.story;
  const wall = s.wall;

  // ---- Gwen (story-driven until the decision point) -----------------------
  const g = gwenFall(Math.min(t, BEAT.DECISION));
  const gwenPose = poseTrack(t, [
    [0, GWEN.hang], [BEAT.FALL - 0.05, GWEN.slip], [BEAT.FALL + 0.35, GWEN.fall],
    [BEAT.RESCUE, GWEN.fall], [BEAT.RESCUE + 0.4, GWEN.grab],
  ]);
  const flail = Math.sin(wall * 9) * (t >= BEAT.FALL ? 14 : 5);
  const gwen: Actor = {
    x: num(t, [[0, 692], [BEAT.FALL, 692], [BEAT.DECISION, 722]], easeInOut),
    y: t < BEAT.FALL ? 286 + Math.sin(wall * 3) * 3 : g.y,
    rot: num(t, [[0, 0], [BEAT.FALL, 2], [BEAT.DECISION, 32]], easeIn),
    scale: 1, flip: true,
    pose: withPose(gwenPose, {
      lShoulder: gwenPose.lShoulder + flail,
      lElbow: gwenPose.lElbow + flail * 0.5,
    }),
  };

  // ---- Miles ---------------------------------------------------------------
  const milesPose = poseTrack(t, [
    [0, MILES.perch], [BEAT.NOTICE - 0.05, MILES.perch], [BEAT.NOTICE + 0.2, MILES.sense],
    [BEAT.NOTICE + 0.55, MILES.coil], [BEAT.NOTICE + 0.8, MILES.dive],
    [BEAT.RESCUE - 0.1, MILES.dive], [BEAT.RESCUE + 0.15, MILES.shoot],
    [BEAT.RESCUE + 0.9, MILES.shoot], [BEAT.DECISION, MILES.reach],
  ]);
  const breathe = t < BEAT.NOTICE ? Math.sin(wall * 2.4) * 2 : 0;
  const miles: Actor = {
    x: num(t, [
      [0, 1310], [BEAT.NOTICE + 0.55, 1300], [BEAT.NOTICE + 0.85, 1230],
      [BEAT.RESCUE, 1010], [BEAT.DECISION, 765],
    ], easeInOut),
    y: num(t, [
      [0, 258], [BEAT.NOTICE + 0.55, 244], [BEAT.NOTICE + 0.85, 262],
      [BEAT.RESCUE, 318], [BEAT.DECISION, 556],
    ], easeInOut) + breathe,
    rot: num(t, [
      [0, 0], [BEAT.NOTICE + 0.55, -8], [BEAT.NOTICE + 0.85, -52],
      [BEAT.RESCUE - 0.1, -148], [BEAT.DECISION, -166],
    ], easeInOut),
    scale: 1, flip: false, pose: milesPose,
  };

  // ---- Effects defaults ----------------------------------------------------
  const frame: Frame = {
    miles, gwen,
    camera: { cx: 800, cy: 450, zoom: 1, roll: 0, shake: 0 },
    web: { grow: 0, tension: 0, snapped: false, from: ZERO_XY, to: ZERO_XY },
    swing: { grow: 0, from: ZERO_XY },
    sense: { burst: -1, level: 0, at: ZERO_XY },
    speed: 0, aberration: 0, flash: 0, glitch: 0,
    impact: { t: -1, at: ZERO_XY },
    reveal: { progress: 0, cx: 0, cy: 0 },
    letterbox: num(t, [[0, 0], [0.8, 1]], easeOut),
    caption: 'connect',
    sfx: { thwip: false },
    thwipT: -1,
  };

  // Camera while the story runs (also the hold frame at DECISION).
  const midX = lerp(miles.x, gwen.x, 0.5), midY = lerp(miles.y, gwen.y, 0.5);
  frame.camera.cx = num(t, [[0, 800], [BEAT.FALL, 830], [BEAT.NOTICE, 870], [BEAT.NOTICE + 0.3, 1300],
    [BEAT.NOTICE + 1.1, 1040], [BEAT.RESCUE, 960], [BEAT.DECISION, midX]], easeInOut);
  frame.camera.cy = num(t, [[0, 450], [BEAT.FALL, 420], [BEAT.NOTICE, 400], [BEAT.NOTICE + 0.3, 230],
    [BEAT.NOTICE + 1.1, 330], [BEAT.RESCUE, 380], [BEAT.DECISION, midY]], easeInOut);
  frame.camera.zoom = num(t, [[0, 1], [BEAT.NOTICE, 1.07], [BEAT.NOTICE + 0.3, 1.38],
    [BEAT.NOTICE + 1.1, 1.0], [BEAT.RESCUE, 1.08], [BEAT.DECISION, 1.4]], easeInOut);
  frame.camera.roll = num(t, [[0, 0], [BEAT.NOTICE + 0.85, -2.5], [BEAT.RESCUE, 3], [BEAT.DECISION, -3.5]], easeInOut);

  // Spider-sense: one hard burst on notice, then a faint pulse while diving.
  const sb = (t - BEAT.NOTICE) / 0.9;
  frame.sense = {
    burst: sb >= 0 && sb <= 1 ? sb : -1,
    level: t >= BEAT.NOTICE ? num(t, [[BEAT.NOTICE, 1], [BEAT.NOTICE + 0.9, 0.35], [BEAT.DECISION, 0.5]]) : 0,
    at: headWorld(miles),
  };

  // Shake: a short kick when the web fires.
  const sinceThwip = t - BEAT.RESCUE;
  if (sinceThwip >= 0 && sinceThwip < 0.5) {
    frame.camera.shake = (1 - sinceThwip / 0.5) * 0.5;
    frame.sfx.thwip = sinceThwip < 0.1;
  }
  if (sinceThwip >= 0 && sinceThwip < 0.9) frame.thwipT = sinceThwip / 0.9;
  // Notice: tiny jolt.
  const sinceNotice = t - BEAT.NOTICE;
  if (sinceNotice >= 0 && sinceNotice < 0.35) frame.camera.shake = Math.max(frame.camera.shake, 0.35 * (1 - sinceNotice / 0.35));

  // Speed lines build through the dive and the pull.
  frame.speed = num(t, [[BEAT.NOTICE + 0.6, 0], [BEAT.NOTICE + 1.0, 0.8], [BEAT.RESCUE - 0.2, 0.55],
    [BEAT.RESCUE + 0.2, 1], [BEAT.DECISION, 0.7]], easeInOut);
  frame.aberration = Math.max(frame.speed * 0.35, frame.camera.shake * 0.6);
  frame.caption = t >= BEAT.NOTICE ? 'rescue' : 'connect';

  // Web: thwip out fast, then the line goes taut as he closes in.
  const handM = handWorld(miles, 'r');
  const targetG = handWorld(gwen, 'r');
  frame.web.from = handM;
  frame.web.to = targetG;
  frame.web.grow = num(t, [[BEAT.RESCUE, 0], [BEAT.RESCUE + 0.28, 1]], easeOut);
  frame.web.tension = num(t, [[BEAT.RESCUE + 0.28, 0], [BEAT.DECISION, 1]], easeIn);

  // ---- Branches ------------------------------------------------------------
  const b = s.branch;

  if (s.stage === 'catch' || (s.stage === 'reveal' && !s.forced)) {
    // Continuous pendulum swing over catch + reveal so velocity never resets.
    const total = BRANCH.CATCH_DUR + BRANCH.REVEAL_DUR;
    const bt = s.stage === 'catch' ? b : BRANCH.CATCH_DUR + b;
    const u = clamp01(bt / total);
    const A = STAGE.ANCHOR;
    const R = Math.hypot(765 - A.x, 556 - A.y);
    const th0 = Math.atan2(765 - A.x, 556 - A.y);
    const th = th0 + (-85 * Math.PI / 180 - th0) * Math.pow(u, 1.6);
    const grab = clamp01(bt / 0.35);

    miles.x = A.x + R * Math.sin(th);
    miles.y = A.y + R * Math.cos(th);
    miles.rot = num(bt, [[0, -166], [0.55, -340], [total, -340 - 18]], easeInOut);
    miles.pose = mixPose(MILES.reach, MILES.hold, easeOut(grab));

    // Gwen is gathered into his arms, then rides along.
    const chest = chestWorld(miles);
    const held = { x: chest[0] - 4, y: chest[1] + 26 };
    gwen.x = lerp(722, held.x, easeOut(grab));
    gwen.y = lerp(600, held.y, easeOut(grab));
    gwen.rot = lerp(32, miles.rot + 24, easeOut(grab));
    gwen.pose = mixPose(GWEN.grab, GWEN.held, easeOut(grab));

    frame.web.grow = 1 - easeOut(clamp01(bt / 0.2)); // the first web releases
    frame.web.tension = 1;
    frame.web.from = handWorld(miles, 'r');
    frame.web.to = handWorld(gwen, 'r');
    frame.swing = { grow: easeOut(clamp01((bt - 0.15) / 0.2)), from: handWorld(miles, 'l') };
    frame.caption = 'catch';
    frame.speed = num(bt, [[0.3, 0.2], [1.0, 1], [total, 0.8]], easeInOut);
    frame.aberration = frame.speed * 0.4;
    frame.camera.shake = bt < 0.25 ? 0.5 * (1 - bt / 0.25) : 0; // the catch lands
    frame.camera.zoom = num(bt, [[0, 1.4], [0.5, 1.05], [total, 1.0]], easeOut);
    frame.camera.cx = lerp(midX, miles.x, easeInOut(clamp01(bt / 1.2)));
    frame.camera.cy = lerp(midY, miles.y, easeInOut(clamp01(bt / 1.2)));
    frame.camera.roll = num(bt, [[0, -3.5], [total, 5]], easeInOut);
    frame.flash = bt < 0.12 ? (1 - bt / 0.12) * 0.35 : 0;

    if (s.stage === 'reveal') {
      const r = clamp01(b / BRANCH.REVEAL_DUR);
      frame.reveal = { progress: r, cx: miles.x, cy: miles.y };
    }
  } else if (s.stage === 'impact' || s.stage === 'error' || (s.stage === 'reveal' && s.forced)) {
    const bb = s.stage === 'impact' ? b : s.stage === 'error' ? BRANCH.ERROR_AT + 1 : BRANCH.ERROR_AT + 1;
    const ground = STAGE.GROUND - 56;

    // Web goes slack, then snaps just after the decision point.
    const snapAt = 0.18;
    frame.web.snapped = bb >= snapAt;
    frame.web.grow = frame.web.snapped ? clamp01(1 - (bb - snapAt) / 0.35) : 1;
    frame.web.tension = frame.web.snapped ? 0 : 1;

    // Gwen: continues her fall, faster than before, and hits the ground.
    const v0 = gwenFall(BEAT.DECISION).vy;
    const fallDist = ground - 600;
    const A = (fallDist - v0 * BRANCH.IMPACT_AT) / (0.5 * BRANCH.IMPACT_AT * BRANCH.IMPACT_AT);
    const fb = Math.min(bb, BRANCH.IMPACT_AT);
    gwen.y = 600 + v0 * fb + 0.5 * A * fb * fb;
    gwen.x = 722;
    gwen.rot = num(fb, [[0, 32], [BRANCH.IMPACT_AT, 84]], easeIn);
    gwen.pose = bb >= BRANCH.IMPACT_AT
      ? mixPose(GWEN.fall, GWEN.down, easeOut(clamp01((bb - BRANCH.IMPACT_AT) / 0.25)))
      : GWEN.fall;
    if (bb >= BRANCH.IMPACT_AT) gwen.y = ground + 8;

    // Miles: momentum carries him past, then he lands beside her, head bowed.
    const land = BRANCH.IMPACT_AT + 0.35;
    miles.x = num(bb, [[0, 765], [BRANCH.IMPACT_AT, 700], [land, 640], [BRANCH.ERROR_AT, 640]], easeInOut);
    miles.y = num(bb, [[0, 556], [BRANCH.IMPACT_AT, 700], [land, STAGE.GROUND - 66], [BRANCH.ERROR_AT, STAGE.GROUND - 66]], easeIn);
    miles.rot = num(bb, [[0, -166], [BRANCH.IMPACT_AT, -300], [land, -360]], easeInOut);
    miles.pose = bb < BRANCH.IMPACT_AT
      ? MILES.reach
      : mixPose(MILES.reach, MILES.defeat, easeOut(clamp01((bb - BRANCH.IMPACT_AT) / 0.5)));

    // The impact itself.
    const si = bb - BRANCH.IMPACT_AT;
    if (si >= 0) {
      frame.impact = { t: clamp01(si / 0.6), at: [gwen.x, STAGE.GROUND] };
      frame.camera.shake = si < 0.7 ? 1 - si / 0.7 : 0;
      frame.flash = si < 0.14 ? (1 - si / 0.14) * 0.7 : 0;
      frame.aberration = si < 0.8 ? 1 - si / 0.8 : 0;
      frame.glitch = si < 0.5 ? 1 - si / 0.5 : 0;
      frame.camera.zoom = num(si, [[0, 1.5], [BRANCH.ERROR_AT - BRANCH.IMPACT_AT, 1.22]], easeOut);
      frame.camera.cx = lerp(midX, 700, 0.9);
      frame.camera.cy = 540;
      frame.camera.roll = 0;
    } else {
      frame.camera.zoom = num(bb, [[0, 1.4], [BRANCH.IMPACT_AT, 1.5]], easeIn);
      frame.camera.cx = lerp(midX, 710, clamp01(bb / BRANCH.IMPACT_AT));
      frame.camera.cy = lerp(midY, 540, clamp01(bb / BRANCH.IMPACT_AT));
      frame.camera.roll = lerp(-3.5, 0, clamp01(bb / BRANCH.IMPACT_AT));
    }
    frame.sense.level = 0;
    frame.speed = 0;
    frame.caption = 'miss';
    if (s.stage === 'error') {
      frame.camera.shake = 0;
      frame.impact = { t: 1, at: [gwen.x, STAGE.GROUND] };
    }
    if (s.stage === 'reveal' && s.forced) {
      frame.reveal = { progress: clamp01(b / BRANCH.REVEAL_DUR), cx: STAGE.W / 2, cy: STAGE.H / 2 };
      frame.camera.zoom = 1.22;
    }
  }

  return frame;
}
