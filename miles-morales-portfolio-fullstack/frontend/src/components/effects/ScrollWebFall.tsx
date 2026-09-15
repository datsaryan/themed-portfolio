import React, { useEffect, useRef } from 'react';

/**
 * Thin strands of spider silk that drop from the top of the viewport while
 * the page is being scrolled, then settle and fade. Purely decorative and
 * `pointer-events-none`, so it never interferes with reading or clicking
 * anything underneath it.
 *
 * Driven by a canvas rather than DOM nodes: scroll events can fire dozens of
 * times a second, and spawning/removing real elements at that rate is what
 * causes scroll-jank on lower-end phones. One canvas + rAF loop stays smooth
 * regardless of scroll speed.
 */

interface Strand {
  x: number;
  y: number;
  length: number;
  swayPhase: number;
  swaySpeed: number;
  fallSpeed: number;
  life: number; // 0..1, counts down after it stops falling
  settled: boolean;
  settleY: number;
}

const MAX_STRANDS = 42;
const SPAWN_PER_TICK = 2;

export const ScrollWebFall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strandsRef = useRef<Strand[]>([]);
  const scrollEnergyRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const dprRef = useRef(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const resize = () => {
      dprRef.current = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dprRef.current;
      canvas.height = window.innerHeight * dprRef.current;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();
    window.addEventListener('resize', resize);

    lastScrollYRef.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = Math.abs(y - lastScrollYRef.current);
      lastScrollYRef.current = y;
      // Feeds the spawn budget — faster scrolling drops more strands, so a
      // quick flick reads as a heavier web-fall than a slow drift.
      scrollEnergyRef.current = Math.min(scrollEnergyRef.current + delta, 260);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const isLight = () => document.documentElement.classList.contains('light');

    const spawn = () => {
      if (strandsRef.current.length >= MAX_STRANDS) return;
      const vw = window.innerWidth;
      strandsRef.current.push({
        x: Math.random() * vw,
        y: -20 - Math.random() * 60,
        length: 40 + Math.random() * 90,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.6 + Math.random() * 0.8,
        fallSpeed: 1.4 + Math.random() * 2.2,
        life: 1,
        settled: false,
        settleY: window.innerHeight * (0.28 + Math.random() * 0.5),
      });
    };

    let lastTime = performance.now();

    const tick = (t: number) => {
      const dt = Math.min((t - lastTime) / 16.67, 3); // normalize to ~60fps steps
      lastTime = t;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.setTransform(dprRef.current, 0, 0, dprRef.current, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Spend scroll energy on spawning new strands.
      if (!prefersReducedMotion && scrollEnergyRef.current > 4) {
        const toSpawn = Math.min(SPAWN_PER_TICK, Math.ceil(scrollEnergyRef.current / 40));
        for (let i = 0; i < toSpawn; i++) spawn();
        scrollEnergyRef.current *= 0.86; // decays even while still scrolling
      } else {
        scrollEnergyRef.current *= 0.9;
      }

      const strandColor = isLight() ? '40, 32, 26' : '243, 244, 248';

      const strands = strandsRef.current;
      for (let i = strands.length - 1; i >= 0; i--) {
        const s = strands[i];
        s.swayPhase += 0.02 * s.swaySpeed * dt;

        if (!s.settled) {
          s.y += s.fallSpeed * dt;
          if (s.y >= s.settleY) {
            s.settled = true;
          }
        } else {
          // Once settled, a strand just hangs and slowly fades away.
          s.life -= 0.006 * dt;
          if (s.life <= 0) {
            strands.splice(i, 1);
            continue;
          }
        }

        const sway = Math.sin(s.swayPhase) * 10;
        const topX = s.x;
        const topY = Math.max(0, s.y - s.length);
        const botX = s.x + sway;
        const botY = s.y;
        const alpha = s.settled ? 0.16 * s.life : 0.22;

        ctx.strokeStyle = `rgba(${strandColor}, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(topX, topY);
        ctx.quadraticCurveTo((topX + botX) / 2 + sway * 0.4, (topY + botY) / 2, botX, botY);
        ctx.stroke();

        // Tiny anchor dot where the strand meets the "ceiling" of the
        // viewport, and a spider-silk droplet at the tip.
        ctx.fillStyle = `rgba(${strandColor}, ${alpha * 1.3})`;
        ctx.beginPath();
        ctx.arc(botX, botY, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-30 pointer-events-none"
      aria-hidden="true"
    />
  );
};
