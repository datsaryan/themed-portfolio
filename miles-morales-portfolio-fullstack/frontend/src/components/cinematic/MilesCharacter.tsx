import { MILES_SPEC, type Joints } from '../../boot/figureSpec';
import { FigureRig } from './FigureRig';

const PALETTE = { primary: 'url(#cinMilesSuit)', primaryDark: '#5c0a10', secondary: '#0b0c10', mask: 'url(#cinMilesMask)', accent: '#e62429' };

/** Original silhouette — red/black suit, web-line mask texture, glowing lenses. Not a likeness of any specific artwork. */
export function MilesCharacter({ joints, senseGlow = 0 }: { joints: Joints; senseGlow?: number }) {
  return (
    <FigureRig
      spec={MILES_SPEC}
      joints={joints}
      palette={PALETTE}
      backAccessory={
        <path
          d="M -10 -20 C -60 -6 -110 18 -150 60 C -100 30 -55 14 -14 4 Z"
          fill={PALETTE.primary} opacity={0.4}
        />
      }
      emblem={
        <g stroke="#050506" strokeWidth={2} opacity={0.55} strokeLinecap="round">
          <line x1={0} y1={-64} x2={0} y2={-2} />
          <line x1={0} y1={-56} x2={-16} y2={-38} /> <line x1={0} y1={-56} x2={16} y2={-38} />
          <line x1={0} y1={-38} x2={-18} y2={-16} /> <line x1={0} y1={-38} x2={18} y2={-16} />
        </g>
      }
      headShape={(tilt) => (
        <g transform={`rotate(${tilt})`}>
          <path
            d="M -24 4 C -30 -26 -16 -46 0 -46 C 16 -46 30 -26 24 4 C 20 22 10 30 0 30 C -10 30 -20 22 -24 4 Z"
            fill="url(#cinMilesMask)"
          />
          <g stroke="#1a0406" strokeWidth={1.2} opacity={0.4} fill="none">
            <path d="M -20 -6 Q 0 0 20 -6" /> <path d="M -19 4 Q 0 14 19 4" />
            <path d="M -12 -30 L -8 10" /> <path d="M 12 -30 L 8 10" />
          </g>
          <g filter="url(#cinGlow)" opacity={0.5 + senseGlow * 0.5}>
            <path d="M -19 -8 Q -6 -20 -3 -4 Q -12 5 -19 -8 Z" fill="#7bdcff" />
            <path d="M 19 -8 Q 6 -20 3 -4 Q 12 5 19 -8 Z" fill="#7bdcff" />
          </g>
          <path d="M -19 -8 Q -6 -20 -3 -4 Q -12 5 -19 -8 Z" fill="#eaf9ff" stroke="#160406" strokeWidth={1.4} />
          <path d="M 19 -8 Q 6 -20 3 -4 Q 12 5 19 -8 Z" fill="#eaf9ff" stroke="#160406" strokeWidth={1.4} />
        </g>
      )}
    />
  );
}
