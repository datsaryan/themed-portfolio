import { forwardRef, memo } from 'react';

// The web that "becomes the transition mask": a radial web whose rim tracks the
// expanding clip-path hole in the overlay. Drawn once in a 100-unit space and
// positioned/scaled each frame; sits above the portfolio it is revealing.

export const WEB_SPOKES = 16;

/** Scalloped (web-like) closed outline of radius `r`, in the given coords. */
export function scallopPath(cx: number, cy: number, r: number, inward = 0.8): string {
  const n = WEB_SPOKES;
  const pt = (i: number, rad: number, off = 0) => {
    const a = (i * 2 * Math.PI) / n + off;
    return `${(cx + Math.cos(a) * rad).toFixed(1)} ${(cy + Math.sin(a) * rad).toFixed(1)}`;
  };
  let d = `M ${pt(0, r)}`;
  for (let i = 0; i < n; i++) d += ` Q ${pt(i, r * inward, Math.PI / n)} ${pt(i + 1, r)}`;
  return `${d} Z`;
}

const STRANDS = Array.from({ length: WEB_SPOKES }, (_, i) => {
  const a = (i * 2 * Math.PI) / WEB_SPOKES;
  return { x: Math.cos(a) * 100, y: Math.sin(a) * 100 };
});
const RINGS = [scallopPath(0, 0, 38), scallopPath(0, 0, 66), scallopPath(0, 0, 100)];

export const RevealWeb = memo(
  forwardRef<SVGGElement>(function RevealWeb(_, ref) {
    return (
      <div className="boot-reveal-web" aria-hidden="true">
        <svg>
          <g ref={ref} opacity={0} stroke="#f4f7ff" fill="none" strokeLinecap="round">
            {STRANDS.map((s, i) => (
              <line key={i} x1={0} y1={0} x2={s.x} y2={s.y} strokeWidth={1.6} vectorEffect="non-scaling-stroke" opacity={0.85} />
            ))}
            {RINGS.map((d, i) => (
              <path key={i} d={d} strokeWidth={i === 2 ? 3.2 : 1.5} vectorEffect="non-scaling-stroke" opacity={i === 2 ? 1 : 0.7} />
            ))}
          </g>
        </svg>
      </div>
    );
  }),
);
