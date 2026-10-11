// Lets you rehearse every boot outcome without touching the backend:
//   ?boot=fast | slow | fail | fail-always | down | down-always | timeout
// Only active in dev builds or when VITE_BOOT_DEBUG=1, so visitors to the
// production site can't be sent a link that makes it look broken.

export type BootSimulation =
  | 'fast'
  | 'slow'
  | 'fail'
  | 'fail-always'
  | 'down'
  | 'down-always'
  | 'timeout';

const VALID: BootSimulation[] = ['fast', 'slow', 'fail', 'fail-always', 'down', 'down-always', 'timeout'];

export function getBootSimulation(): BootSimulation | null {
  const enabled = import.meta.env.DEV || import.meta.env.VITE_BOOT_DEBUG === '1';
  if (!enabled || typeof window === 'undefined') return null;
  const value = new URLSearchParams(window.location.search).get('boot');
  return VALID.includes(value as BootSimulation) ? (value as BootSimulation) : null;
}
