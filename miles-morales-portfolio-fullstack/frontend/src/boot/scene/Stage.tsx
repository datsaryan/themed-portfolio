import { forwardRef, useImperativeHandle, useLayoutEffect, useMemo, useRef } from 'react';
import { Figure } from './Figure';
import { ActionBackdrop, FarLayer, MidLayer, NearLayer, SkyLayer } from './Layers';
import { Fx, SpeedLines } from './Fx';
import { ParticleSystem } from '../particles';
import { STAGE, easeOut } from '../choreography';
import type { Frame } from '../choreography';
import { bindRig } from '../rig';
import type { Actor } from '../rig';

// The compositor. React renders this skeleton exactly once; every frame after
// that is a handful of transform/opacity/attribute writes through cached
// element refs — no React work, no layout, GPU-composited layers.

export interface StageHandle {
  apply(frame: Frame, ghosts: Frame[], wall: number, dt: number, ambient: boolean): void;
  /** Stage -> screen px using the action layer's current camera matrix. */
  project(x: number, y: number): { x: number; y: number };
  size(): { w: number; h: number };
  /** 0 = full, 1 = lite (no extras), 2 = minimal (static backdrop only). */
  setQuality(level: 0 | 1 | 2): void;
  reset(): void;
}

interface Props { lowPower: boolean; }

// parallax / zoom / roll depth per layer
const DEPTH = {
  sky: { p: 0.08, z: 0.15 },
  far: { p: 0.22, z: 0.35 },
  mid: { p: 0.5, z: 0.65 },
  action: { p: 1, z: 1 },
  near: { p: 1.35, z: 1.3 },
} as const;
type LayerKey = keyof typeof DEPTH;

const actorTransform = (a: Actor) =>
  `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${a.rot.toFixed(1)}) scale(${a.flip ? -a.scale : a.scale} ${a.scale})`;

function computeView(W: number, H: number) {
  const aspect = W / H;
  let vbW: number, vbH: number, cx: number;
  if (aspect >= 16 / 9) { vbH = STAGE.H; vbW = STAGE.H * aspect; cx = 800; }
  else if (aspect >= 1) { vbW = STAGE.W; vbH = STAGE.W / aspect; cx = 800; }
  else { vbW = 820; vbH = 820 / aspect; cx = 1000; } // portrait: frame just the action
  return { vbW, vbH, cx, cy: 450, k: W / vbW };
}

export const Stage = forwardRef<StageHandle, Props>(function Stage({ lowPower }, ref) {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const view = useRef({ W: 1, H: 1, vbW: 1600, vbH: 900, cx: 800, cy: 450, k: 1, dpr: 1 });
  const world = useRef(new DOMMatrix());
  const quality = useRef<0 | 1 | 2>(0);
  const frameNo = useRef(0);
  const particles = useMemo(() => new ParticleSystem(lowPower ? 70 : 160, lowPower ? 5 : 11), [lowPower]);
  const els = useRef<{
    layers: Record<LayerKey, HTMLElement>;
    miles: SVGGElement; gwen: SVGGElement; ghostA: SVGGElement; ghostB: SVGGElement;
    bind: Record<'miles' | 'gwen' | 'ghostA' | 'ghostB', (p: Actor['pose']) => void>;
    fx: Record<string, SVGElement>;
    speed: SVGElement; flash: HTMLElement; glitch: HTMLElement; barT: HTMLElement; barB: HTMLElement;
    svgs: SVGSVGElement[];
  } | null>(null);

  useLayoutEffect(() => {
    const r = root.current!;
    const q = <T extends Element>(s: string) => r.querySelector<T>(s)!;
    const fx: Record<string, SVGElement> = {};
    r.querySelectorAll<SVGElement>('[data-fx]').forEach((n) => { fx[n.dataset.fx!] = n; });
    const miles = q<SVGGElement>('[data-actor="miles"]');
    const gwen = q<SVGGElement>('[data-actor="gwen"]');
    const ghostA = q<SVGGElement>('[data-actor="ghostA"]');
    const ghostB = q<SVGGElement>('[data-actor="ghostB"]');
    els.current = {
      layers: {
        sky: q('[data-cam="sky"]'), far: q('[data-cam="far"]'), mid: q('[data-cam="mid"]'),
        action: q('[data-cam="action"]'), near: q('[data-cam="near"]'),
      },
      miles, gwen, ghostA, ghostB,
      bind: { miles: bindRig(miles), gwen: bindRig(gwen), ghostA: bindRig(ghostA), ghostB: bindRig(ghostB) },
      fx,
      speed: fx['speed'],
      flash: q('.boot-flash'), glitch: q('.boot-glitch'), barT: q('.boot-bar-top'), barB: q('.boot-bar-bottom'),
      svgs: Array.from(r.querySelectorAll<SVGSVGElement>('svg.boot-layer-svg')),
    };

    const measure = () => {
      const W = r.clientWidth || 1, H = r.clientHeight || 1;
      const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 1.75);
      const v = computeView(W, H);
      view.current = { W, H, dpr, ...v };
      // svgs are 150% of the viewport (see boot.css), so their viewBox is too
      const bw = v.vbW * 1.5, bh = v.vbH * 1.5;
      const x = v.cx - bw / 2, y = v.cy - bh / 2;
      els.current!.svgs.forEach((s) => s.setAttribute('viewBox', `${x} ${y} ${bw} ${bh}`));
      const c = canvas.current!;
      c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(r);
    return () => { ro.disconnect(); els.current = null; particles.clear(); };
  }, [lowPower, particles]);

  useImperativeHandle(ref, () => ({
    apply(f, ghosts, wall, dt, ambient) {
      const e = els.current;
      if (!e) return;
      const v = view.current;
      const cam = f.camera;
      const amp = cam.shake * Math.min(v.W, v.H) * 0.03;
      const nx = Math.sin(wall * 83) + Math.sin(wall * 131.7) * 0.5;
      const ny = Math.sin(wall * 97.3 + 1.7) + Math.sin(wall * 151.1 + 0.4) * 0.5;

      // ---- camera: one matrix per depth layer ----
      (Object.keys(DEPTH) as LayerKey[]).forEach((key) => {
        // minimal quality: the three background layers + foreground are frozen/hidden
        if (quality.current === 2 && key !== 'action') return;
        const { p, z } = DEPTH[key];
        const dx = (cam.cx - v.cx) * v.k * p;
        const dy = (cam.cy - v.cy) * v.k * p;
        const m = new DOMMatrix()
          .translate(v.W / 2 + nx * amp * (0.6 + p * 0.4), v.H / 2 + ny * amp * (0.6 + p * 0.4))
          .rotate(cam.roll * (0.5 + p * 0.5))
          .scale(1 + (cam.zoom - 1) * z)
          .translate(-v.W / 2 - dx, -v.H / 2 - dy);
        e.layers[key].style.transform = `matrix(${m.a},${m.b},${m.c},${m.d},${m.e},${m.f})`;
        if (key === 'action') {
          // stage -> screen for particles & reveal: camera matrix after base fit
          world.current = m.multiply(new DOMMatrix().translate(v.W / 2, v.H / 2).scale(v.k).translate(-v.cx, -v.cy));
        }
      });

      // ---- actors ----
      e.miles.setAttribute('transform', actorTransform(f.miles)); e.bind.miles(f.miles.pose);
      e.gwen.setAttribute('transform', actorTransform(f.gwen)); e.bind.gwen(f.gwen.pose);
      const gA = quality.current === 0 ? ghosts[0] : undefined, gB = quality.current === 0 ? ghosts[1] : undefined;
      e.ghostA.style.opacity = gA ? '0.34' : '0';
      e.ghostB.style.opacity = gB ? '0.16' : '0';
      if (gA) { e.ghostA.setAttribute('transform', actorTransform(gA.miles)); e.bind.ghostA(gA.miles.pose); }
      if (gB) { e.ghostB.setAttribute('transform', actorTransform(gB.miles)); e.bind.ghostB(gB.miles.pose); }

      // ---- effects ----
      applyFx(e.fx, f);
      e.speed.style.opacity = String(quality.current === 0 ? Math.min(1, f.speed) * 0.8 : 0);
      e.speed.style.transform = `scale(${1 + f.speed * 0.12}) rotate(${(Math.floor(wall * 24) % 3) * 1.5}deg)`;
      e.flash.style.opacity = String(f.flash);
      applyGlitch(e.glitch, quality.current === 2 ? 0 : f.glitch, wall);
      const lb = easeOut(f.letterbox);
      e.barT.style.transform = `translateY(${(lb - 1) * 100}%)`;
      e.barB.style.transform = `translateY(${(1 - lb) * 100}%)`;
      // chromatic aberration only in short bursts, and never on weak devices
      e.layers.action.style.filter = !lowPower && quality.current === 0 && f.aberration > 0.06
        ? `drop-shadow(${(f.aberration * 5).toFixed(1)}px 0 0 rgba(255,40,70,.55)) drop-shadow(${(-f.aberration * 5).toFixed(1)}px 0 0 rgba(0,210,255,.55))`
        : '';

      // ---- particles (screen-space canvas) ----
      const ctx = canvas.current?.getContext('2d');
      // Ambient-only dust is imperceptible above 30 Hz, so redraw it every
      // other frame; event bursts (impact, web sparks) always redraw.
      if (ctx && quality.current < 2) {
        particles.observe(f);
        frameNo.current++;
        if (particles.hasBursts() || frameNo.current % 2 === 0) {
          const step = particles.hasBursts() ? dt : dt * 2;
          particles.step(step, ctx, v.W, v.H, v.dpr, world.current, ambient && quality.current === 0);
        }
      }
    },
    project(x, y) {
      const m = world.current;
      return { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f };
    },
    size: () => ({ w: view.current.W, h: view.current.H }),
    setQuality(level) {
      quality.current = level;
      const e = els.current;
      if (!e) return;
      const hide = (el: HTMLElement | null | undefined, on: boolean) => { if (el) el.style.display = on ? 'none' : ''; };
      hide(root.current?.querySelector('.boot-halftone'), level >= 1);
      hide(canvas.current, level >= 2);
      hide(e.layers.far, level >= 2);
      hide(e.layers.mid, level >= 2);
      hide(e.layers.near, level >= 2);
      if (level >= 1) e.layers.action.style.filter = '';
    },
    reset() {
      particles.clear();
    },
  }), [lowPower, particles]);

  return (
    <div ref={root} className="boot-stage">
      <div className="boot-layer boot-layer-sky" data-cam="sky"><SkyLayer /></div>
      <div className="boot-layer boot-layer-far" data-cam="far"><FarLayer /></div>
      <div className="boot-layer boot-layer-mid" data-cam="mid"><MidLayer /></div>
      <div className="boot-layer boot-layer-action" data-cam="action">
        <ActionBackdrop />
        <svg className="boot-layer-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" data-layer="actors">
          <g data-actor="ghostB" opacity={0}><Figure kind="miles" /></g>
          <g data-actor="ghostA" opacity={0}><Figure kind="miles" /></g>
          <g data-actor="gwen"><Figure kind="gwen" /></g>
          <g data-actor="miles"><Figure kind="miles" /></g>
          <Fx />
        </svg>
      </div>
      <div className="boot-layer boot-layer-near" data-cam="near"><NearLayer /></div>

      <canvas ref={canvas} className="boot-particles" aria-hidden="true" />
      <SpeedLines count={lowPower ? 18 : 34} />
      <div className="boot-halftone" aria-hidden="true" />
      <div className="boot-vignette" aria-hidden="true" />
      <div className="boot-glitch" aria-hidden="true">
        <i /><i /><i />
      </div>
      <div className="boot-flash" aria-hidden="true" />
      <div className="boot-bar boot-bar-top" aria-hidden="true" />
      <div className="boot-bar boot-bar-bottom" aria-hidden="true" />
    </div>
  );
});

// ---------------------------------------------------------------------------

const set = (el: SVGElement | undefined, k: string, v: string) => el?.setAttribute(k, v);

function applyFx(fx: Record<string, SVGElement>, f: Frame) {
  // web
  const w = f.web;
  const showWeb = w.grow > 0.002;
  set(fx['web'], 'opacity', showWeb ? '1' : '0');
  if (showWeb) {
    const [x0, y0] = w.from, [x1, y1] = w.to;
    const sag = (1 - w.tension) * 80;
    const mx = (x0 + x1) / 2, my = (y0 + y1) / 2 + sag;
    if (!w.snapped) {
      const d = `M ${x0.toFixed(1)} ${y0.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
      const dash = `${w.grow.toFixed(3)} 2`;
      for (const k of ['web-glow', 'web-core']) { set(fx[k], 'd', d); set(fx[k], 'stroke-dasharray', dash); }
      set(fx['web-half-a'], 'opacity', '0'); set(fx['web-half-b'], 'opacity', '0');
      set(fx['web-core'], 'opacity', '1'); set(fx['web-glow'], 'opacity', '0.32');
    } else {
      set(fx['web-core'], 'opacity', '0'); set(fx['web-glow'], 'opacity', '0');
      const droop = my + 40;
      set(fx['web-half-a'], 'd', `M ${x0.toFixed(1)} ${y0.toFixed(1)} Q ${((x0 + mx) / 2).toFixed(1)} ${droop.toFixed(1)} ${mx.toFixed(1)} ${(my + 60).toFixed(1)}`);
      set(fx['web-half-b'], 'd', `M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${((x1 + mx) / 2).toFixed(1)} ${droop.toFixed(1)} ${mx.toFixed(1)} ${(my + 60).toFixed(1)}`);
      for (const k of ['web-half-a', 'web-half-b']) { set(fx[k], 'stroke-dasharray', `${w.grow.toFixed(3)} 2`); set(fx[k], 'opacity', '1'); }
    }
  }

  // swing line
  const sw = f.swing;
  set(fx['swing'], 'opacity', sw.grow > 0.002 ? '1' : '0');
  if (sw.grow > 0.002) {
    const d = `M ${sw.from[0].toFixed(1)} ${sw.from[1].toFixed(1)} L ${STAGE.ANCHOR.x} ${STAGE.ANCHOR.y}`;
    for (const k of ['swing-glow', 'swing-core']) { set(fx[k], 'd', d); set(fx[k], 'stroke-dasharray', `${sw.grow.toFixed(3)} 2`); }
  }

  // spider-sense
  const sb = f.sense.burst;
  set(fx['sense'], 'opacity', sb >= 0 ? '1' : '0');
  if (sb >= 0) {
    fx['sense'].setAttribute('transform', `translate(${f.sense.at[0].toFixed(1)} ${f.sense.at[1].toFixed(1)})`);
    for (let i = 0; i < 3; i++) {
      const c = fx[`sense-${i}`];
      const t = Math.max(0, sb - i * 0.1);
      set(c, 'r', (30 + t * (220 + i * 80)).toFixed(1));
      set(c, 'opacity', Math.max(0, 1 - t * 1.15).toFixed(3));
    }
    set(fx['sense-ticks'], 'opacity', Math.max(0, 1 - sb * 2.4).toFixed(3));
    set(fx['sense-ticks'], 'transform', `scale(${(1 + sb * 0.7).toFixed(3)})`);
  }

  // THWIP!
  const th = f.thwipT;
  set(fx['thwip'], 'opacity', th >= 0 ? (th > 0.75 ? (1 - th) * 4 : 1).toFixed(3) : '0');
  if (th >= 0) {
    const pop = th < 0.2 ? 0.4 + (th / 0.2) * 0.8 : 1.2 - Math.min(0.2, (th - 0.2) * 0.4);
    fx['thwip'].setAttribute('transform',
      `translate(${(f.web.from[0] - 60).toFixed(1)} ${(f.web.from[1] - 70).toFixed(1)}) rotate(-8) scale(${pop.toFixed(3)})`);
  }

  // impact
  const it = f.impact.t;
  set(fx['impact'], 'opacity', it >= 0 && it < 1 ? '1' : '0');
  if (it >= 0 && it < 1) {
    const [ix, iy] = f.impact.at;
    fx['impact'].setAttribute('transform', `translate(${ix.toFixed(1)} ${iy.toFixed(1)})`);
    for (let i = 0; i < 2; i++) {
      const c = fx[`ring-${i}`];
      const t = Math.max(0, it - i * 0.12);
      const rx = 30 + t * (460 + i * 160);
      set(c, 'rx', rx.toFixed(1)); set(c, 'ry', (rx * 0.2).toFixed(1));
      set(c, 'opacity', Math.max(0, 1 - t * 1.1).toFixed(3));
    }
    const pop = it < 0.18 ? 0.3 + (it / 0.18) * 0.9 : 1.2 - Math.min(0.2, (it - 0.18) * 0.4);
    fx['burst'].setAttribute('transform', `translate(10 -250) rotate(-7) scale(${pop.toFixed(3)})`);
    fx['burst'].setAttribute('opacity', it > 0.7 ? Math.max(0, (1 - it) / 0.3).toFixed(3) : '1');
  }
}

/** Three horizontal slice bars that jump around while `amount` > 0. */
function applyGlitch(el: HTMLElement, amount: number, wall: number) {
  if (amount < 0.04) { if (el.style.display !== 'none') el.style.display = 'none'; return; }
  if (el.style.display !== 'block') el.style.display = 'block';
  const bars = el.children;
  const step = Math.floor(wall * 30);
  for (let i = 0; i < bars.length; i++) {
    const b = bars[i] as HTMLElement;
    const h = 2 + ((step * (i + 3)) % 9) * 1.5;
    const y = ((step * 37 + i * 211) % 100);
    const x = (((step * (i + 5)) % 21) - 10) * amount * 2.4;
    b.style.height = `${h.toFixed(1)}%`;
    b.style.top = `${y}%`;
    b.style.transform = `translateX(${x.toFixed(1)}%)`;
    b.style.opacity = String(amount * (i === 1 ? 0.8 : 0.55));
  }
}
