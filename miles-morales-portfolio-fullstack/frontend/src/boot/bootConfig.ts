// Single source of truth for every timing/tuning number used by the boot
// cinematic and the load-state layer. Nothing else hardcodes these.

/** Hard ceiling for the backend calls; past this the load counts as failed. */
export const BOOT_TIMEOUT_MS = 8000;

/** Scene timeline (seconds). The cinematic story beats. */
export const T = {
  ESTABLISH_END: 1.5, // environment fades in
  FALL_START: 1.5, //   Gwen starts to fall
  NOTICE: 3.0, //       Miles notices (spider-sense)
  DIVE_START: 3.3, //   Miles lets go and dives
  WEB_SHOT: 5.2, //     web fired at Gwen
  CLIMAX: 7.0 //        the moment the outcome matters
} as const;

/** Post-climax branches + transitions (seconds). */
export const BRANCH = {
  CATCH: 1.0, //          success: Miles gets her
  IMPACT: 2.2, //         failure: total length of the impact sequence
  IMPACT_AT: 0.5, //      failure: Gwen reaches the ground
  FREEZE: 0.35, //        failure: freeze-frame length at impact
  SLOWMO_UNTIL: 1.4, //   failure: slow-motion until this branch time
  SLOWMO_RATE: 0.4,
  REVEAL: 1.05, //        success reveal (web mask)
  REVEAL_COMPACT: 0.75, // "enter anyway" / quick reveals
  REVEAL_REDUCED: 0.35 // reduced-motion fade
} as const;

/** Smart-loading rules. */
export const SMART = {
  /** Loads finishing before this skip the story and go straight to the reveal. */
  QUICK_LOAD_S: 1.2,
  /** ...but the scene is still shown for at least this long so it isn't a flash. */
  MIN_QUICK_DISPLAY_S: 0.7,
  /** When the result arrives mid-story, fast-forward to the climax in this long. */
  FAST_FORWARD_SUCCESS_S: 1.4,
  FAST_FORWARD_FAILURE_S: 1.6,
  /**
   * Cap per-frame dt so a single pathological gap (a long GC pause, a very
   * slow device) can't jump the animation forward many seconds in one
   * frame. Backgrounded tabs are handled separately (BootStage resets the
   * clock baseline on visibilitychange) rather than by this clamp, so this
   * can stay generous enough that ordinary frame jitter — down to ~8fps —
   * never silently loses real elapsed time and makes the story run in
   * slow motion relative to the actual load.
   */
  MAX_DT_S: 0.25
} as const;

export const SESSION_SEEN_KEY = 'spider_boot_seen';
