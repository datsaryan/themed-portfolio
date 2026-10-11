import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface ParticleDrawState {
  vw: number; vh: number; dt: number;
  speed: number; speedAngle: number; //   0..1, degrees — motion-streak intensity/direction
  senseX: number; senseY: number; senseP: number; // spider-sense ping origin (CSS px) + pulse 0..1
  dim: number; //  0..1 — ambient dust fades out as the failure branch darkens
}
export interface ParticleHandle { draw(state: ParticleDrawState): void }

type Dust = { x: number; y: number; vx: number; vy: number; r: number; a: number };
type Streak = { x: number; y: number; len: number; life: number; maxLife: number };
type Ring = { x: number; y: number; t: number };

/**
 * Ambient dust/embers + motion streaks + spider-sense rings, all on one
 * canvas. Driven imperatively from BootStage's single rAF loop (draw() is
 * called once per frame) rather than running its own loop, so there is only
 * ever one animation clock for the whole cinematic.
 */
export const ParticleEffects = forwardRef<ParticleHandle, { density: number }>(function ParticleEffects(
  { density },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dust = useRef<Dust[]>([]);
  const streaks = useRef<Streak[]>([]);
  const rings = useRef<Ring[]>([]);
  const dprRef = useRef(1);
  const sizedRef = useRef({ w: 0, h: 0 });

  // (Re)seed ambient dust whenever density or viewport size changes.
  const reseed = (vw: number, vh: number) => {
    const count = Math.round(24 * density);
    dust.current = Array.from({ length: count }, () => ({
      x: Math.random() * vw, y: Math.random() * vh,
      vx: (Math.random() - 0.5) * 6, vy: -6 - Math.random() * 10,
      r: 0.6 + Math.random() * 1.6, a: 0.15 + Math.random() * 0.35
    }));
  };

  useImperativeHandle(ref, () => ({
    draw({ vw, vh, dt, speed, speedAngle, senseX, senseY, senseP, dim }) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (sizedRef.current.w !== vw || sizedRef.current.h !== vh || dprRef.current !== dpr) {
        canvas.width = vw * dpr; canvas.height = vh * dpr;
        canvas.style.width = `${vw}px`; canvas.style.height = `${vh}px`;
        sizedRef.current = { w: vw, h: vh }; dprRef.current = dpr;
        reseed(vw, vh);
      }
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);

      // ambient dust / embers, gently rising, fades under the "dim" overlay
      ctx.fillStyle = '#ffd9a0';
      for (const p of dust.current) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        if (p.y < -10) { p.y = vh + 10; p.x = Math.random() * vw; }
        if (p.x < -10) p.x = vw + 10; else if (p.x > vw + 10) p.x = -10;
        ctx.globalAlpha = p.a * (1 - dim);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }

      // motion streaks: spawned proportional to speed, angled along travel
      if (speed > 0.03 && streaks.current.length < 60 * density) {
        const n = Math.round(speed * 3 * density);
        const rad = (speedAngle * Math.PI) / 180;
        for (let i = 0; i < n; i++) {
          const along = Math.random();
          const perp = (Math.random() - 0.5) * vh * 0.9;
          streaks.current.push({
            x: vw / 2 - Math.cos(rad) * vw * 0.7 * along - Math.sin(rad) * perp,
            y: vh / 2 - Math.sin(rad) * vh * 0.7 * along + Math.cos(rad) * perp,
            len: 40 + speed * 90 + Math.random() * 40, life: 0, maxLife: 0.35 + Math.random() * 0.2
          });
        }
      }
      ctx.strokeStyle = 'rgba(235,240,255,0.55)';
      ctx.lineWidth = 1.5;
      streaks.current = streaks.current.filter((s) => {
        s.life += dt;
        if (s.life >= s.maxLife) return false;
        const rad = (speedAngle * Math.PI) / 180;
        const k = 1 - s.life / s.maxLife;
        ctx.globalAlpha = k * 0.6;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - Math.cos(rad) * s.len, s.y - Math.sin(rad) * s.len);
        ctx.stroke();
        return true;
      });

      // spider-sense pings: expanding rings from Miles' head when he notices
      if (senseP > 0 && (rings.current.length === 0 || rings.current[rings.current.length - 1].t > 0.18)) {
        rings.current.push({ x: senseX, y: senseY, t: 0 });
      }
      rings.current = rings.current.filter((r) => {
        r.t += dt;
        if (r.t > 0.9) return false;
        const k = r.t / 0.9;
        ctx.globalAlpha = (1 - k) * 0.5 * senseP;
        ctx.strokeStyle = '#7bdcff';
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(r.x, r.y, 8 + k * 70, 0, Math.PI * 2); ctx.stroke();
        return true;
      });
      ctx.globalAlpha = 1;
    }
  }));

  // Free the canvas backing store on unmount (avoid holding onto memory).
  useEffect(() => () => {
    const c = canvasRef.current;
    if (c) { c.width = 0; c.height = 0; }
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true" />;
});
