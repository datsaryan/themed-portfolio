import React from 'react';
import { rotate, type FigureSpec, type Joints } from '../../boot/figureSpec';

/** One rendered limb: shoulder/hip -> elbow/knee -> hand/foot, as a tapered capsule path. */
function Limb({
  origin, upperLen, foreLen, aUpper, aFore, widthA, widthB, fill,
}: {
  origin: [number, number]; upperLen: number; foreLen: number; aUpper: number; aFore: number;
  widthA: number; widthB: number; fill: string;
}) {
  const [ex, ey] = rotate(0, upperLen, aUpper);
  const elbow: [number, number] = [origin[0] + ex, origin[1] + ey];
  const [hx, hy] = rotate(0, foreLen, aUpper + aFore);
  const hand: [number, number] = [elbow[0] + hx, elbow[1] + hy];
  return (
    <g>
      <path
        d={`M ${origin[0]} ${origin[1]} L ${elbow[0]} ${elbow[1]}`}
        stroke={fill} strokeWidth={widthA} strokeLinecap="round" fill="none"
      />
      <path
        d={`M ${elbow[0]} ${elbow[1]} L ${hand[0]} ${hand[1]}`}
        stroke={fill} strokeWidth={widthB} strokeLinecap="round" fill="none"
      />
    </g>
  );
}

export type RigPalette = {
  primary: string; primaryDark: string; secondary: string; mask: string; accent: string;
};

/**
 * Shared humanoid rig, driven entirely by joint angles from figureSpec.ts —
 * MilesCharacter and GwenCharacter are thin palette/silhouette wrappers
 * around this so both stay physically consistent (same limb model).
 */
export function FigureRig({
  spec, joints, palette, headShape, backAccessory, frontAccessory, emblem,
}: {
  spec: FigureSpec;
  joints: Joints;
  palette: RigPalette;
  /** Renders the head (mask/hair etc.), given the head tilt in degrees. */
  headShape: (tilt: number) => React.ReactNode;
  /** Optional decoration behind the torso (cape/coat/motion swoosh). */
  backAccessory?: React.ReactNode;
  frontAccessory?: React.ReactNode;
  emblem?: React.ReactNode;
}) {
  const limbWidth = 15;
  return (
    <g>
      {backAccessory}
      {/* back limbs first so the torso overlaps them */}
      <Limb origin={spec.hipR} upperLen={spec.thigh} foreLen={spec.shin} aUpper={joints.lTR} aFore={joints.lSR}
        widthA={limbWidth} widthB={limbWidth * 0.82} fill={palette.primaryDark} />
      <Limb origin={spec.shoulderR} upperLen={spec.upper} foreLen={spec.fore} aUpper={joints.aUR} aFore={joints.aFR}
        widthA={limbWidth * 0.88} widthB={limbWidth * 0.72} fill={palette.primaryDark} />

      {/* torso */}
      <path
        d={`M ${spec.shoulderL[0] - 6} ${spec.shoulderL[1]}
            C ${spec.shoulderL[0] - 10} ${spec.hipL[1] - 20}, ${spec.hipL[0] - 14} ${spec.hipL[1] - 6}, ${spec.hipL[0] - 6} ${spec.hipL[1] + 8}
            L ${spec.hipR[0] + 6} ${spec.hipR[1] + 8}
            C ${spec.hipR[0] + 14} ${spec.hipR[1] - 6}, ${spec.shoulderR[0] + 10} ${spec.shoulderR[1] - 20}, ${spec.shoulderR[0] + 6} ${spec.shoulderR[1]}
            Z`}
        fill={palette.primary}
      />
      {emblem}

      {/* front limbs */}
      <Limb origin={spec.hipL} upperLen={spec.thigh} foreLen={spec.shin} aUpper={joints.lTL} aFore={joints.lSL}
        widthA={limbWidth} widthB={limbWidth * 0.82} fill={palette.primary} />
      <Limb origin={spec.shoulderL} upperLen={spec.upper} foreLen={spec.fore} aUpper={joints.aUL} aFore={joints.aFL}
        widthA={limbWidth * 0.88} widthB={limbWidth * 0.72} fill={palette.primary} />

      {frontAccessory}

      <g transform={`translate(0 -78)`}>{headShape(joints.head)}</g>
    </g>
  );
}
