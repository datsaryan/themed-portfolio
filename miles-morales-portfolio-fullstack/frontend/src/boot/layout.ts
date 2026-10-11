// Maps the 1000-unit "stage" (where the choreography lives) onto the real
// viewport. The stage is a square kept large enough that characters stay
// readable on tall phones, and pinned so the ground line sits near the
// bottom.

export interface StageLayout {
  vw: number;
  vh: number;
  size: number; //     stage side in CSS px
  unit: number; //     CSS px per stage unit
  left: number; //     stage box position in the viewport
  top: number;
  topY: number; //     stage-y of the viewport's top edge (negative on tall screens)
  vhUnits: number; //  viewport height in stage units
  portrait: boolean;
}

export const GROUND_Y = 930; // stage-y of the ground line
const GROUND_SCREEN_FRAC = 0.885; // where the ground sits on screen (clear of the letterbox bar)

export function computeLayout(vw: number, vh: number): StageLayout {
  // Never exceed vw: on some mobile browsers, fixed-position content wider
  // than the device width silently inflates window.innerWidth itself (the
  // layout viewport grows to fit it, independent of the overlay's own
  // overflow:hidden), which both breaks "no horizontal scroll" and becomes
  // a feedback loop since this function is fed that same innerWidth next
  // frame. Capping at vw keeps the stage strictly within the real viewport
  // on every device; on tall narrow phones that means a squarer, slightly
  // more zoomed-out stage rather than a wider one, which reads fine.
  const size = Math.min(vw, vh);
  const unit = size / 1000;
  const top = GROUND_SCREEN_FRAC * vh - (GROUND_Y / 1000) * size;
  return {
    vw,
    vh,
    size,
    unit,
    left: (vw - size) / 2,
    top,
    topY: -top / unit,
    vhUnits: vh / unit,
    portrait: vh > vw
  };
}
