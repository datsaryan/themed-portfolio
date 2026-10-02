import { memo } from 'react';
import { SEG } from '../rig';

// Original stylised vector characters — no traced or copied artwork. Drawn in
// rig space facing LEFT with the hip at the origin; the nested <g data-j>
// groups are rotated every frame by bindRig(). The component itself is
// memoised and never re-renders, so animation costs zero React work.

export type FigureKind = 'miles' | 'gwen';

const PAL = {
  miles: {
    suit: '#0d0d16', out: '#040409', rimNear: '#ff3b45', rimFar: '#6a5cff',
    accent: '#e62429', shoe: '#e62429', sole: '#f3f4f8', lens: '#f4f6ff', glow: '#7d8bff',
  },
  gwen: {
    suit: '#eceef6', out: '#08080e', rimNear: '#ff6ec7', rimFar: '#44d8ff',
    accent: '#14141c', shoe: '#f5f6fb', sole: '#44d8ff', lens: '#ffffff', glow: '#ff6ec7',
  },
} as const;

type Colors = (typeof PAL)[FigureKind];

function Seg({ len, w, c, near }: { len: number; w: number; c: Colors; near: boolean }) {
  return (
    <>
      <line x1={0} y1={0} x2={0} y2={len} stroke={c.out} strokeWidth={w + 6} strokeLinecap="round" />
      <line x1={0} y1={0} x2={0} y2={len} stroke={c.suit} strokeWidth={w} strokeLinecap="round" />
      <line x1={-w * 0.3} y1={2} x2={-w * 0.3} y2={len - 2} stroke={near ? c.rimNear : c.rimFar}
        strokeWidth={2.2} strokeLinecap="round" opacity={0.8} />
    </>
  );
}

function Arm({ side, c }: { side: 'l' | 'r'; c: Colors }) {
  const near = side === 'r';
  return (
    <g data-j={`${side}Shoulder`}>
      <Seg len={SEG.upperArm} w={12} c={c} near={near} />
      <g data-j={`${side}Elbow`}>
        <Seg len={SEG.foreArm} w={10.5} c={c} near={near} />
        <circle cx={0} cy={SEG.foreArm + 3} r={7.4} fill={c.out} />
        <circle cx={0} cy={SEG.foreArm + 3} r={5.4} fill={c.suit} />
      </g>
    </g>
  );
}

function Leg({ side, c }: { side: 'l' | 'r'; c: Colors }) {
  const near = side === 'r';
  return (
    <g data-j={`${side}Hip`}>
      <Seg len={SEG.thigh} w={15} c={c} near={near} />
      <g data-j={`${side}Knee`}>
        <Seg len={SEG.shin} w={12.5} c={c} near={near} />
        {/* shoe */}
        <path d={`M -8 ${SEG.shin - 1} Q -17 ${SEG.shin + 4} -15 ${SEG.shin + 10} L 8 ${SEG.shin + 10} Q 11 ${SEG.shin + 3} 6 ${SEG.shin - 3} Z`}
          fill={c.out} />
        <path d={`M -7 ${SEG.shin} Q -14 ${SEG.shin + 4} -12.5 ${SEG.shin + 8} L 6.5 ${SEG.shin + 8} Q 8.5 ${SEG.shin + 3} 5 ${SEG.shin - 2} Z`}
          fill={c.shoe} />
        <rect x={-13} y={SEG.shin + 8} width={21} height={3.2} rx={1.6} fill={c.sole} />
      </g>
    </g>
  );
}

function MilesHead({ c }: { c: Colors }) {
  return (
    <g data-j="head">
      <circle cx={0} cy={-20} r={SEG.headR + 3} fill={c.out} />
      <circle cx={0} cy={-20} r={SEG.headR} fill={c.suit} />
      {/* red web lines on the mask */}
      <g stroke={c.accent} strokeWidth={1.4} fill="none" strokeLinecap="round" opacity={0.9}>
        <path d="M -2 -40 Q -4 -20 -2 0" />
        <path d="M -20 -26 Q -6 -22 16 -28" />
        <path d="M -19 -14 Q -6 -12 15 -16" />
        <path d="M -14 -36 Q -9 -22 -12 -4" />
        <path d="M 10 -36 Q 8 -22 11 -5" />
      </g>
      {/* lenses */}
      <path d="M -17 -24 L -5 -27 L -4 -18 L -15 -16 Z" fill={c.lens} />
      <path d="M 1 -27 L 12 -24 L 11 -15 L 0 -18 Z" fill={c.lens} />
      <path d="M -17 -24 L -5 -27 L -4 -18 L -15 -16 Z" fill="none" stroke={c.glow} strokeWidth={1.2} opacity={0.8} />
      <path d="M -19 -30 Q -4 -43 14 -34" stroke={c.rimNear} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.85} />
    </g>
  );
}

function GwenHead({ c }: { c: Colors }) {
  return (
    <g data-j="head">
      {/* hood tail trailing behind (to the right, since she faces left) */}
      <path d="M 12 -34 Q 40 -40 46 -16 Q 30 -22 14 -10 Z" fill={c.out} />
      <path d="M 13 -32 Q 37 -37 42 -17 Q 29 -22 15 -12 Z" fill={c.suit} />
      <circle cx={0} cy={-20} r={SEG.headR + 3} fill={c.out} />
      <circle cx={0} cy={-20} r={SEG.headR} fill={c.suit} />
      {/* face opening */}
      <ellipse cx={-5} cy={-19} rx={15} ry={15.5} fill={c.accent} />
      <path d="M -17 -25 L -7 -27 L -6 -19 L -15 -17 Z" fill={c.lens} />
      <path d="M -2 -27 L 7 -25 L 6 -17 L -3 -19 Z" fill={c.lens} />
      <path d="M -20 -34 Q -2 -44 14 -30" stroke={c.rimFar} strokeWidth={2.2} fill="none" strokeLinecap="round" />
      <path d="M -20 -8 Q -4 4 14 -10" stroke={c.rimNear} strokeWidth={2.2} fill="none" strokeLinecap="round" />
    </g>
  );
}

function Torso({ kind, c }: { kind: FigureKind; c: Colors }) {
  const body = 'M -18 -58 Q -21 -28 -12 0 L 12 0 Q 21 -28 18 -58 Q 0 -70 -18 -58 Z';
  return (
    <>
      <path d={body} fill={c.out} stroke={c.out} strokeWidth={6} strokeLinejoin="round" />
      <path d={body} fill={c.suit} />
      <path d="M -17 -54 Q -19 -28 -11 -2" stroke={c.rimNear} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.85} />
      <path d="M 17 -54 Q 19 -28 11 -2" stroke={c.rimFar} strokeWidth={2.2} fill="none" strokeLinecap="round" opacity={0.7} />
      {kind === 'miles' ? (
        // chest spider emblem
        <g stroke={c.accent} strokeWidth={1.8} strokeLinecap="round" fill={c.accent}>
          <ellipse cx={-3} cy={-38} rx={3.2} ry={5} />
          <path d="M -6 -42 L -15 -48 M -6 -38 L -17 -38 M -6 -35 L -15 -29 M 0 -42 L 9 -48 M 0 -38 L 11 -38 M 0 -35 L 9 -29" fill="none" />
        </g>
      ) : (
        // black belt stripe + side panel
        <g>
          <path d="M -12 0 L 12 0 L 13 -9 L -13 -9 Z" fill={c.accent} />
          <path d="M 10 -56 Q 18 -30 11 -2 L 4 -2 Q 11 -30 4 -56 Z" fill={c.accent} opacity={0.9} />
        </g>
      )}
    </>
  );
}

export const Figure = memo(function Figure({ kind }: { kind: FigureKind }) {
  const c = PAL[kind];
  return (
    <g data-j="torso">
      {/* far limbs behind the torso */}
      <Arm side="l" c={c} />
      <Leg side="l" c={c} />
      <Torso kind={kind} c={c} />
      <Leg side="r" c={c} />
      <g data-j="head-wrap">{kind === 'miles' ? <MilesHead c={c} /> : <GwenHead c={c} />}</g>
      <Arm side="r" c={c} />
    </g>
  );
});
