import { describe, it, expect } from 'vitest';
import { computeLayout } from '../layout';

describe('computeLayout', () => {
  const viewports: Array<[string, number, number]> = [
    ['iPhone SE portrait', 375, 667],
    ['iPhone 15 portrait', 393, 852],
    ['very tall narrow', 320, 900],
    ['iPhone landscape', 844, 390],
    ['iPad portrait', 768, 1024],
    ['desktop landscape', 1280, 800],
    ['ultrawide', 2560, 1080],
    ['square', 600, 600]
  ];

  it.each(viewports)('%s (%dx%d): the stage never exceeds the real viewport width', (_name, vw, vh) => {
    const layout = computeLayout(vw, vh);
    // This is the exact invariant that, when violated, triggers a mobile
    // browser's layout-viewport-expansion quirk: fixed-position content
    // wider than the device silently grows window.innerWidth itself,
    // which both breaks "no horizontal scroll" and feeds back into the
    // next computeLayout call (since vw comes from that same innerWidth).
    expect(layout.size).toBeLessThanOrEqual(vw);
    expect(layout.size).toBeLessThanOrEqual(vh);
    expect(layout.left).toBeGreaterThanOrEqual(0);
    expect(layout.left + layout.size).toBeLessThanOrEqual(vw + 0.001);
  });

  it('ground line stays on-screen (within a reasonable band) on every shape', () => {
    for (const [, vw, vh] of viewports) {
      const layout = computeLayout(vw, vh);
      const groundScreenY = layout.top + (930 / 1000) * layout.size;
      expect(groundScreenY).toBeGreaterThan(vh * 0.5);
      expect(groundScreenY).toBeLessThan(vh + 1);
    }
  });
});
