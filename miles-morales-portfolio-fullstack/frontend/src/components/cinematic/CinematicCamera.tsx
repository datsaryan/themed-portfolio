import { type ReactNode } from 'react';

/**
 * Applies the computed camera transform to its children. A plain wrapper
 * (not a React-state-driven component) — BootStage writes to this element's
 * style directly via a ref every animation frame, bypassing React entirely
 * for the 60fps path. See BootStage.tsx.
 */
export function CinematicCamera({
  innerRef, children,
}: {
  innerRef: React.RefObject<SVGGElement>;
  children: ReactNode;
}) {
  return <g ref={innerRef}>{children}</g>;
}
