import { GWEN_SPEC, type Joints } from '../../boot/figureSpec';
import { FigureRig } from './FigureRig';

const PALETTE = { primary: 'url(#cinGwenCoat)', primaryDark: '#3a4a72', secondary: '#f4e3c8', mask: '', accent: '#ffd15c' };

/** Original falling-figure silhouette — flowing coat + hair, featureless rim-lit face (stylised, not a likeness). */
export function GwenCharacter({ joints, hairPhase = 0 }: { joints: Joints; hairPhase?: number }) {
  return (
    <FigureRig
      spec={GWEN_SPEC}
      joints={joints}
      palette={PALETTE}
      backAccessory={
        <path
          d="M -22 -10 C -54 -4 -66 26 -54 56 C -60 24 -44 4 -20 -2 Z
             M 22 -10 C 54 -4 66 26 54 56 C 60 24 44 4 20 -2 Z"
          fill="url(#cinGwenCoat)" opacity={0.85}
        />
      }
      headShape={(tilt) => (
        <g transform={`rotate(${tilt})`}>
          <ellipse cx={0} cy={0} rx={40} ry={52} fill="#ffe9b8" opacity={0.1} filter="url(#cinGlow)" />
          <circle cx={0} cy={0} r={17} fill="#f4e3c8" opacity={0.95} />
          <g transform="translate(0 -4)">
            <path
              transform={`rotate(${-6 + hairPhase * 8})`}
              d="M -15 -4 C -38 6 -42 32 -28 50 C -34 28 -22 10 -12 2 Z" fill="url(#cinHair)"
            />
            <path
              transform={`rotate(${hairPhase * -5})`}
              d="M 0 -10 C -8 12 -6 38 6 52 C 2 28 4 8 10 -8 Z" fill="url(#cinHair)"
            />
            <path
              transform={`rotate(${6 - hairPhase * 8})`}
              d="M 15 -4 C 38 8 40 34 26 50 C 32 28 20 10 12 2 Z" fill="url(#cinHair)"
            />
          </g>
        </g>
      )}
    />
  );
}
