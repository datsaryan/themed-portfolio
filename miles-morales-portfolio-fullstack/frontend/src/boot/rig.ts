// Articulated 2D rig shared by Miles and Gwen. Poses are joint angles in
// degrees; the renderer applies them as nested SVG rotations (forward
// kinematics for free), and `handWorld` below mirrors that chain in math so
// effects like the web line can attach to a real hand position.
//
// Convention: characters face LEFT. Positive angle = clockwise on screen, so
// a limb rotated +30 swings forward (left); a knee/elbow bends with
// negative/positive respectively as noted in the pose tables.

export const JOINTS = [
  'torso', 'head',
  'lShoulder', 'lElbow', 'rShoulder', 'rElbow',
  'lHip', 'lKnee', 'rHip', 'rKnee',
] as const;
export type Joint = (typeof JOINTS)[number];
export type Pose = Record<Joint, number>;

/** Segment lengths in rig units (a standing figure is ~200 tall). */
export const SEG = {
  torso: 70, headR: 21, upperArm: 38, foreArm: 34, thigh: 46, shin: 46,
} as const;

/** Fixed attach point of each joint inside its parent's frame. */
export const ORIGIN: Record<Joint, readonly [number, number]> = {
  torso: [0, 0],
  head: [0, -SEG.torso - 6],
  lShoulder: [-4, -SEG.torso + 8],
  rShoulder: [5, -SEG.torso + 10],
  lElbow: [0, SEG.upperArm],
  rElbow: [0, SEG.upperArm],
  lHip: [-5, 2],
  rHip: [6, 2],
  lKnee: [0, SEG.thigh],
  rKnee: [0, SEG.thigh],
};

export interface Actor {
  x: number;
  y: number;
  rot: number;
  scale: number;
  flip: boolean;
  pose: Pose;
}

export function mixPose(a: Pose, b: Pose, t: number): Pose {
  const out = {} as Pose;
  for (const j of JOINTS) out[j] = a[j] + (b[j] - a[j]) * t;
  return out;
}

/** Set `deg` on an existing pose without mutating it. */
export function withPose(base: Pose, patch: Partial<Pose>): Pose {
  return { ...base, ...patch };
}

type P = readonly [number, number];
const rad = (d: number) => (d * Math.PI) / 180;
const rot = ([x, y]: P, deg: number): P => {
  const c = Math.cos(rad(deg)), s = Math.sin(rad(deg));
  return [x * c - y * s, x * s + y * c];
};

/** World position of a hand (near hand = 'r'), following the SVG nesting. */
export function handWorld(a: Actor, side: 'l' | 'r' = 'r'): P {
  const sh = side === 'r' ? 'rShoulder' : 'lShoulder';
  const el = side === 'r' ? 'rElbow' : 'lElbow';
  // hand in forearm frame -> elbow frame -> upper-arm frame -> torso frame
  let p: P = [0, SEG.foreArm];
  p = rot(p, a.pose[el]);
  p = [p[0] + ORIGIN[el][0], p[1] + ORIGIN[el][1]];
  p = rot(p, a.pose[sh]);
  p = [p[0] + ORIGIN[sh][0], p[1] + ORIGIN[sh][1]];
  p = rot(p, a.pose.torso);
  // root frame -> world
  p = [p[0] * (a.flip ? -1 : 1) * a.scale, p[1] * a.scale];
  p = rot(p, a.rot);
  return [p[0] + a.x, p[1] + a.y];
}

/** World position of the chest centre (good catch/hold target). */
export function chestWorld(a: Actor): P {
  let p: P = [0, -SEG.torso * 0.55];
  p = rot(p, a.pose.torso);
  p = [p[0] * (a.flip ? -1 : 1) * a.scale, p[1] * a.scale];
  p = rot(p, a.rot);
  return [p[0] + a.x, p[1] + a.y];
}

/** World position of the head centre. */
export function headWorld(a: Actor): P {
  let p: P = [ORIGIN.head[0], ORIGIN.head[1] - SEG.headR];
  p = rot(p, a.pose.head);
  p = [p[0] + 0, p[1]];
  p = rot(p, a.pose.torso);
  p = [p[0] * (a.flip ? -1 : 1) * a.scale, p[1] * a.scale];
  p = rot(p, a.rot);
  return [p[0] + a.x, p[1] + a.y];
}

/** Cache joint nodes once, then apply poses without querying the DOM again. */
export function bindRig(root: SVGGElement): (pose: Pose) => void {
  const nodes = {} as Record<Joint, SVGGElement>;
  for (const j of JOINTS) nodes[j] = root.querySelector<SVGGElement>(`[data-j="${j}"]`)!;
  return (pose) => {
    for (const j of JOINTS) {
      const [ox, oy] = ORIGIN[j];
      nodes[j].setAttribute('transform', `translate(${ox} ${oy}) rotate(${pose[j].toFixed(1)})`);
    }
  };
}
