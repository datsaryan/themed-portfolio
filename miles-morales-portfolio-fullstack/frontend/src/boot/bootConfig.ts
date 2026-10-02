// Single source of truth for every timing/threshold in the boot cinematic.
// "Story time" is cosmetic seconds on the cinematic's own clock (it can be
// fast-forwarded or slowed). "Wall time" is real elapsed seconds and is the
// only clock the load timeout trusts.

/** Story beats (story seconds). Mirrors the spec's 0-1.5-3-5-7 timeline. */
export const BEAT = {
  /** Gwen starts to fall. */
  FALL: 1.5,
  /** Miles' spider-sense fires and he reacts. */
  NOTICE: 3.0,
  /** Web shot leaves his wrist. */
  RESCUE: 5.0,
  /** Decision point: the story holds here until the load resolves. */
  DECISION: 7.0,
} as const;

/** Branch timings (seconds after the decision point). */
export const BRANCH = {
  /** Success: Miles grabs Gwen and swings off. */
  CATCH_DUR: 1.0,
  /** Success: web-wipe that reveals the portfolio. */
  REVEAL_DUR: 0.95,
  /** Failure: moment Gwen hits the ground. */
  IMPACT_AT: 0.9,
  /** Failure: slow-motion hit-stop window after impact. */
  HITSTOP_DUR: 0.3,
  HITSTOP_SCALE: 0.3,
  /** Failure: branch time at which the error UI takes over. */
  ERROR_AT: 1.8,
  /** Reduced motion: plain crossfade instead of the web-wipe. */
  REDUCED_REVEAL_DUR: 0.35,
} as const;

export const LOAD = {
  /** Wall-clock deadline; past this a still-pending load counts as failed. */
  TIMEOUT_S: 8,
  /** Per-request abort, kept under TIMEOUT_S so the machine stays the authority. */
  REQUEST_TIMEOUT_MS: 7500,
  /** Story speed-up once the outcome is known but the story is behind. */
  FAST_RATE: 6,
  /** A repeat visit that resolves this fast skips the story entirely. */
  INSTANT_BELOW_S: 0.4,
  /** The reveal waits at most this long for the portfolio to paint underneath. */
  APP_WAIT_MAX_S: 1.5,
} as const;

export const STORAGE_KEY_SEEN = 'spider_boot_seen';
