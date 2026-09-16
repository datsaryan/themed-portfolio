import React, { useEffect, useRef } from 'react';

/**
 * Small spider-web medallions that drop in on a silk thread while the page
 * is being scrolled, then settle and slowly fade. Purely decorative and
 * `pointer-events-none`, so it never interferes with reading or clicking
 * anything underneath it.
 *
 * Driven by a canvas rather than DOM nodes: scroll events can fire dozens of
 * times a second, and spawning/removing real elements at that rate is what
 * causes scroll-jank on lower-end phones. One canvas + rAF loop stays smooth
 * regardless of scroll speed.
 */

interface WebDrop {
  x: number;
  y: number;
  radius: number;
  rotation: number;
  spinSpeed: number;
  swayPhase: number;
  swaySpeed: number;
  fallSpeed: number;
  life: number; // 0..1, counts down after it stops falling
  settled: boolean;
  settleY: number;
  spokes: number;
  turns: number;
  glintPhase: number;
}

const MAX_DROPS = 22;
const SPAWN_PER_TICK = 1;

/**
 * Draws a small spider-web medallion centered on the current canvas origin:
 * straight spokes radiating out, plus a single continuous spiral thread
 * winding between them — the way a real orb-weaver's web is actually built
 * (concentric rings read as a dartboard, not a web; the spiral is what makes
 * it unmistakably a spiderweb at a glance, even at 20px).
 */
function drawWebMedallion(
  ctx: CanvasRenderingContext2D,
  radius: number,
  rotation: number,
  spokes: number,
  turns: number,
  alpha: number,
  colorRgb: string,
  glintPhase: number
) {
  ctx.save();
  ctx.rotate(rotation);

  // Soft halo so the web reads against busy backgrounds without needing to
  // raise the line opacity (which would make it look like a flat sticker).
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, radius * 1.15);
  halo.addColorStop(0, `rgba(${colorRgb}, ${alpha * 0.16})`);
  halo.addColorStop(1, `rgba(${colorRgb}, 0)`);
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = `rgba(${colorRgb}, ${alpha})`;
  ctx.lineWidth = 1;
  ctx.lineCap = 'round';

  // Spokes, radiating from the center — real webs leave a small open hub.
  const hub = radius * 0.1;
  for (let i = 0; i < spokes; i++) {
    const a = (i / spokes) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * hub, Math.sin(a) * hub);
    ctx.lineTo(Math.cos(a) * radius, Math.sin(a) * radius);
    ctx.stroke();
  }

  // One continuous spiral thread winding out from the hub to the rim.
  const steps = spokes * turns * 3;
  ctx.beginPath();
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const a = t * turns * Math.PI * 2;
    const r = hub + t * (radius - hub);
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * r;
    if (s === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // A single glinting dewdrop on the spiral — catches the eye like real wet
  // silk, only on a subset of webs and only near full opacity so it doesn't
  // read as visual noise once the fragment starts fading.
  if (alpha > 0.18) {
    const gt = 0.55 + 0.15 * Math.sin(glintPhase);
    const ga = gt * turns * Math.PI * 2;
    const gr = hub + gt * (radius - hub);
    ctx.beginPath();
    ctx.arc(Math.cos(ga) * gr, Math.sin(ga) * gr, 1.4, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${colorRgb}, ${Math.min(0.85, alpha * 2.4)})`;
    ctx.fill();
  }

  ctx.restore();
}

export const ScrollWebFall: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropsRef = useRef<WebDrop[]>([]);
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
      // Feeds the spawn budget — faster scrolling drops more webs, so a
      // quick flick reads as a heavier web-fall than a slow drift.
      scrollEnergyRef.current = Math.min(scrollEnergyRef.current + delta, 260);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const isLight = () => document.documentElement.classList.contains('light');

    const spawn = () => {
      if (dropsRef.current.length >= MAX_DROPS) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      dropsRef.current.push({
        x: Math.random() * vw,
        y: -30,
        radius: 16 + Math.random() * 22,
        rotation: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.01,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: 0.5 + Math.random() * 0.7,
        fallSpeed: 1.1 + Math.random() * 1.8,
        life: 1,
        settled: false,
        settleY: vh * (0.22 + Math.random() * 0.56),
        spokes: 6 + Math.floor(Math.random() * 2), // 6..7
        turns: 2 + Math.floor(Math.random() * 2), // 2..3 spiral wraps
        glintPhase: Math.random() * Math.PI * 2,
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

      // Spend scroll energy on spawning new webs.
      if (!prefersReducedMotion && scrollEnergyRef.current > 4) {
        const toSpawn = Math.min(SPAWN_PER_TICK, Math.ceil(scrollEnergyRef.current / 60));
        for (let i = 0; i < toSpawn; i++) spawn();
        scrollEnergyRef.current *= 0.86; // decays even while still scrolling
      } else {
        scrollEnergyRef.current *= 0.9;
      }

      const colorRgb = isLight() ? '40, 32, 26' : '243, 244, 248';

      const drops = dropsRef.current;
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.swayPhase += 0.02 * d.swaySpeed * dt;
        d.rotation += d.spinSpeed * dt;
        d.glintPhase += 0.05 * dt;

        if (!d.settled) {
          d.y += d.fallSpeed * dt;
          if (d.y >= d.settleY) {
            d.settled = true;
          }
        } else {
          // Once settled, a web just hangs and slowly fades away.
          d.life -= 0.0055 * dt;
          if (d.life <= 0) {
            drops.splice(i, 1);
            continue;
          }
        }

        const sway = Math.sin(d.swayPhase) * 8;
        const cx = d.x + sway;
        const cy = d.y;
        const threadAlpha = d.settled ? 0 : 0.26;
        const webAlpha = d.settled ? 0.3 * d.life : 0.34;

        // Silk thread it's still hanging from while falling.
        if (!d.settled) {
          ctx.strokeStyle = `rgba(${colorRgb}, ${threadAlpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(d.x, 0);
          ctx.quadraticCurveTo((d.x + cx) / 2, cy * 0.5, cx, cy - d.radius);
          ctx.stroke();
        }

        ctx.save();
        ctx.translate(cx, cy);
        drawWebMedallion(ctx, d.radius, d.rotation, d.spokes, d.turns, webAlpha, colorRgb, d.glintPhase);
        ctx.restore();
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
