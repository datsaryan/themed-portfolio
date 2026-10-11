import { memo } from 'react';
import type { WebSeg } from '../../boot/timeline';

/** One taut-to-slack web strand as a quadratic curve sagging under `sag`. */
function Strand({ x1, y1, x2, y2, alpha, sag }: WebSeg) {
  if (alpha <= 0.01) return null;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 + sag * Math.hypot(x2 - x1, y2 - y1);
  return (
    <path
      d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${x2 === x1 && y2 === y1 ? y2 : y2}`}
      stroke="#eaf3ff" strokeWidth={3.2} strokeLinecap="round" fill="none"
      opacity={alpha * 0.85} filter="url(#cinWebGlow)"
    />
  );
}

export const WebEffects = memo(function WebEffects({ webs }: { webs: WebSeg[] }) {
  return (
    <g>
      {webs.map((w, i) => (
        <Strand key={i} {...w} />
      ))}
    </g>
  );
});
