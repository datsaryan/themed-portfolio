import { memo } from 'react';

// Static skeleton for the stage-space effects. Geometry is written every
// frame by Stage.applyFx() through data-fx hooks — React never re-renders it.

const STROKE_TEXT = { paintOrder: 'stroke' as const, strokeLinejoin: 'round' as const };

export const Fx = memo(function Fx() {
  return (
    <g data-fx="root">
      {/* swing line (success) */}
      <g data-fx="swing" opacity={0}>
        <path data-fx="swing-glow" fill="none" stroke="#8fb0ff" strokeWidth={9} strokeLinecap="round" opacity={0.3} pathLength={1} />
        <path data-fx="swing-core" fill="none" stroke="#f4f7ff" strokeWidth={3} strokeLinecap="round" pathLength={1} />
      </g>

      {/* web from Miles to Gwen: one line, or two retracting halves once snapped */}
      <g data-fx="web" opacity={0}>
        <path data-fx="web-glow" fill="none" stroke="#8fb0ff" strokeWidth={10} strokeLinecap="round" opacity={0.32} pathLength={1} />
        <path data-fx="web-core" fill="none" stroke="#f4f7ff" strokeWidth={3.2} strokeLinecap="round" pathLength={1} />
        <path data-fx="web-half-a" fill="none" stroke="#f4f7ff" strokeWidth={3.2} strokeLinecap="round" pathLength={1} />
        <path data-fx="web-half-b" fill="none" stroke="#f4f7ff" strokeWidth={3.2} strokeLinecap="round" pathLength={1} />
      </g>

      {/* spider-sense */}
      <g data-fx="sense" opacity={0} fill="none">
        <circle data-fx="sense-0" stroke="#f4f7ff" strokeWidth={3} />
        <circle data-fx="sense-1" stroke="#6a5cff" strokeWidth={4} />
        <circle data-fx="sense-2" stroke="#ff3b45" strokeWidth={2.5} />
        <g data-fx="sense-ticks" stroke="#f4f7ff" strokeWidth={4} strokeLinecap="round">
          {Array.from({ length: 8 }, (_, i) => {
            const a = ((i * 45 - 90) * Math.PI) / 180;
            return <line key={i} x1={Math.cos(a) * 62} y1={Math.sin(a) * 62} x2={Math.cos(a) * 92} y2={Math.sin(a) * 92} />;
          })}
        </g>
      </g>

      {/* comic lettering */}
      <g data-fx="thwip" opacity={0}>
        <text fontFamily="Bangers, Impact, sans-serif" fontSize={76} fill="#f4f7ff" stroke="#e62429" strokeWidth={9}
          letterSpacing={3} textAnchor="middle" style={STROKE_TEXT}>THWIP!</text>
      </g>

      {/* impact */}
      <g data-fx="impact" opacity={0}>
        <ellipse data-fx="ring-0" fill="none" stroke="#f4f7ff" strokeWidth={5} />
        <ellipse data-fx="ring-1" fill="none" stroke="#ff3b45" strokeWidth={4} />
        <g data-fx="burst">
          <polygon fill="#ffd23f" stroke="#08080e" strokeWidth={6} strokeLinejoin="round" points={burstPoints(150, 84, 14)} />
          <text y={22} fontFamily="Bangers, Impact, sans-serif" fontSize={70} fill="#e62429" stroke="#08080e" strokeWidth={8}
            letterSpacing={3} textAnchor="middle" style={STROKE_TEXT}>THUD!</text>
        </g>
        <g stroke="#08080e" strokeWidth={4} strokeLinecap="round" fill="none" opacity={0.9}>
          <path d="M -20 0 l -60 14 l -34 -8" /><path d="M 20 0 l 70 10 l 40 -10" /><path d="M 0 4 l -8 24 l 14 20" />
        </g>
      </g>
    </g>
  );
});

/** Comic "burst" star polygon points. */
function burstPoints(outer: number, inner: number, spikes: number): string {
  const pts: string[] = [];
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner + ((i * 37) % 13);
    const a = (Math.PI * i) / spikes;
    pts.push(`${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r * 0.78).toFixed(1)}`);
  }
  return pts.join(' ');
}

/** Screen-space radial speed lines — fixed geometry, driven by opacity/scale. */
export const SpeedLines = memo(function SpeedLines({ count }: { count: number }) {
  const lines = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2 + (i % 3) * 0.05;
    const r0 = 0.62 + ((i * 53) % 17) / 100;
    const r1 = 0.9 + ((i * 29) % 11) / 60;
    return { a, r0, r1, w: 1 + ((i * 7) % 4) * 0.7 };
  });
  return (
    <svg className="boot-speed" viewBox="-1 -1 2 2" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <g data-fx="speed" stroke="#f4f7ff" strokeLinecap="round">
        {lines.map((l, i) => (
          <line key={i} x1={Math.cos(l.a) * l.r0} y1={Math.sin(l.a) * l.r0} x2={Math.cos(l.a) * l.r1} y2={Math.sin(l.a) * l.r1}
            strokeWidth={l.w / 520} opacity={0.4} />
        ))}
      </g>
    </svg>
  );
});
