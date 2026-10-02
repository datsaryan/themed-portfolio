// Tiny canvas particle system: ambient dust/embers plus event bursts (web
// sparks, spider-sense crackle, impact debris). Imperative and allocation-
// light — a fixed pool, no per-frame object churn.

import type { Frame } from './choreography';

type Kind = 'dust' | 'ember' | 'spark' | 'debris' | 'dust-cloud';

interface Particle {
  active: boolean;
  kind: Kind;
  world: boolean; // true: stage space (moves with the camera); false: screen space
  x: number; y: number; vx: number; vy: number;
  life: number; max: number; size: number; color: string; g: number;
}

const COLORS = {
  dust: 'rgba(235,240,255,', ember: 'rgba(255,70,80,', spark: 'rgba(244,247,255,',
  debris: 'rgba(160,170,210,', cloud: 'rgba(210,200,230,',
};

export class ParticleSystem {
  private pool: Particle[];
  private prev: { thwip: boolean; impact: boolean; sense: boolean; caught: boolean } = { thwip: false, impact: false, sense: false, caught: false };
  private ambientAcc = 0;
  private seed = 1337;

  constructor(capacity: number, private ambientRate: number) {
    this.pool = Array.from({ length: capacity }, () => ({
      active: false, kind: 'dust', world: false, x: 0, y: 0, vx: 0, vy: 0, life: 0, max: 1, size: 1, color: '', g: 0,
    }));
  }

  private rand() {
    // xorshift — deterministic & cheap; visuals don't need Math.random's cost.
    this.seed ^= this.seed << 13; this.seed ^= this.seed >>> 17; this.seed ^= this.seed << 5;
    return ((this.seed >>> 0) % 10000) / 10000;
  }

  private spawn(p: Partial<Particle> & Pick<Particle, 'kind' | 'x' | 'y'>) {
    for (let i = 0; i < this.pool.length; i++) {
      const q = this.pool[i];
      if (q.active) continue;
      Object.assign(q, {
        active: true, world: false, vx: 0, vy: 0, life: 0, max: 1, size: 2, color: COLORS.dust, g: 0, ...p,
      });
      return;
    }
  }

  /** Edge-detect story events from the frame and fire matching bursts. */
  observe(f: Frame) {
    const thwip = f.sfx.thwip;
    if (thwip && !this.prev.thwip) this.burst('spark', f.web.from[0], f.web.from[1], 16, 360);
    this.prev.thwip = thwip;

    const sense = f.sense.burst >= 0 && f.sense.burst < 0.25;
    if (sense && !this.prev.sense) this.burst('spark', f.sense.at[0], f.sense.at[1], 14, 280);
    this.prev.sense = sense;

    const impact = f.impact.t >= 0;
    if (impact && !this.prev.impact) {
      this.burst('debris', f.impact.at[0], f.impact.at[1], 30, 520, true);
      this.burst('dust-cloud', f.impact.at[0], f.impact.at[1] - 10, 12, 180);
    }
    this.prev.impact = impact;

    const caught = f.caption === 'catch' && f.flash > 0.2;
    if (caught && !this.prev.caught) this.burst('spark', f.gwen.x, f.gwen.y, 18, 300);
    this.prev.caught = caught;
  }

  burst(kind: Kind, x: number, y: number, n: number, speed: number, upward = false) {
    for (let i = 0; i < n; i++) {
      const a = upward ? -Math.PI * (0.1 + this.rand() * 0.8) : this.rand() * Math.PI * 2;
      const sp = speed * (0.35 + this.rand() * 0.65);
      this.spawn({
        kind, world: true, x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        max: kind === 'dust-cloud' ? 1.1 + this.rand() * 0.6 : 0.55 + this.rand() * 0.6,
        size: kind === 'dust-cloud' ? 26 + this.rand() * 26 : kind === 'debris' ? 3 + this.rand() * 5 : 2 + this.rand() * 3,
        color: kind === 'debris' ? COLORS.debris : kind === 'dust-cloud' ? COLORS.cloud : COLORS.spark,
        g: kind === 'debris' ? 900 : kind === 'dust-cloud' ? -20 : 120,
      });
    }
  }

  private ambient(dt: number, w: number, h: number) {
    this.ambientAcc += dt * this.ambientRate;
    while (this.ambientAcc >= 1) {
      this.ambientAcc -= 1;
      const ember = this.rand() < 0.3;
      this.spawn({
        kind: ember ? 'ember' : 'dust', world: false,
        x: this.rand() * w, y: ember ? h * (0.7 + this.rand() * 0.3) : this.rand() * h,
        vx: (this.rand() - 0.5) * 14, vy: ember ? -(24 + this.rand() * 40) : -(4 + this.rand() * 10),
        max: ember ? 3 + this.rand() * 3 : 4 + this.rand() * 4,
        size: ember ? 1.4 + this.rand() * 1.6 : 0.8 + this.rand() * 1.8,
        color: ember ? COLORS.ember : COLORS.dust,
      });
    }
  }

  /**
   * Advance and draw. `world` is the stage->screen matrix of the action layer
   * (CSS px); `dpr` converts CSS px to canvas pixels.
   */
  step(dt: number, ctx: CanvasRenderingContext2D, w: number, h: number, dpr: number, world: DOMMatrix, ambient: boolean) {
    if (ambient) this.ambient(dt, w, h);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < this.pool.length; i++) {
      const p = this.pool[i];
      if (!p.active) continue;
      p.life += dt;
      if (p.life >= p.max) { p.active = false; continue; }
      p.vy += p.g * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      const t = p.life / p.max;
      const alpha = (p.kind === 'dust-cloud' ? 0.32 : p.kind === 'ember' || p.kind === 'dust' ? 0.55 : 0.95) * (1 - t) * (t < 0.1 ? t / 0.1 : 1);
      ctx.fillStyle = `${p.color}${alpha.toFixed(3)})`;
      if (p.world) {
        const sx = world.a * p.x + world.c * p.y + world.e;
        const sy = world.b * p.x + world.d * p.y + world.f;
        const s = p.size * Math.hypot(world.a, world.b) * (p.kind === 'dust-cloud' ? 1 + t * 1.6 : 1);
        ctx.beginPath();
        ctx.arc(sx, sy, s, 0, 6.2832);
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, 6.2832);
        ctx.fill();
      }
    }
  }

  /** True while any event particle (spark/debris/cloud) is alive. */
  hasBursts(): boolean {
    for (let i = 0; i < this.pool.length; i++) {
      const p = this.pool[i];
      if (p.active && p.world) return true;
    }
    return false;
  }

  clear() {
    for (const p of this.pool) p.active = false;
    this.prev = { thwip: false, impact: false, sense: false, caught: false };
  }
}
