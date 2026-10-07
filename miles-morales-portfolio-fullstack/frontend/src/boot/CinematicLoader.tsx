import { startTransition, useCallback, useEffect, useMemo, useRef } from 'react';
import './boot.css';
import { Stage } from './scene/Stage';
import type { StageHandle } from './scene/Stage';
import { LoadingState } from './scene/LoadingState';
import { FailureState } from './scene/FailureState';
import { RevealWeb } from './scene/RevealWeb';
import { useBootSequence } from './useBootSequence';
import type { BootState } from './bootMachine';
import { easeInOut } from './choreography';
import type { Frame } from './choreography';
import { BRANCH, STORAGE_KEY_SEEN } from './bootConfig';

interface Props {
  /** Mount the portfolio underneath (needed before the reveal can show it). */
  onAppNeeded: () => void;
  /** Cinematic finished — remove the overlay. */
  onDone: () => void;
  /** The portfolio has been committed underneath. */
  appMounted: boolean;
}

function detectEnv() {
  const mq = (q: string) => typeof matchMedia === 'function' && matchMedia(q).matches;
  const reducedMotion = mq('(prefers-reduced-motion: reduce)');
  const weak = (navigator.hardwareConcurrency ?? 8) <= 4 || ((navigator as { deviceMemory?: number }).deviceMemory ?? 8) <= 4;
  const lowPower = mq('(max-width: 768px)') || mq('(pointer: coarse)') || weak;
  let seen = false;
  try { seen = sessionStorage.getItem(STORAGE_KEY_SEEN) === '1'; } catch { /* storage blocked */ }
  // ?cinematic=full replays the whole story even on a repeat visit.
  const forceFull = new URLSearchParams(window.location.search).get('cinematic') === 'full';
  return { reducedMotion, lowPower, repeatVisit: seen && !forceFull };
}

export default function CinematicLoader({ onAppNeeded, onDone, appMounted }: Props) {
  const env = useMemo(detectEnv, []);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<StageHandle>(null);
  const webRef = useRef<SVGGElement>(null);
  const lastStageKey = useRef('');
  const holeKey = useRef('');

  // Per-frame DOM work: stage compositing plus the reveal mask. No React state.
  const render = useCallback((s: BootState, f: Frame, ghosts: Frame[], dt: number) => {
    const stage = stageRef.current;
    const root = rootRef.current;
    if (!stage || !root) return;

    if (env.reducedMotion) {
      // Static poster: repaint only when the stage changes (story hold -> error).
      if (lastStageKey.current !== s.stage) {
        lastStageKey.current = s.stage;
        stage.apply(f, [], s.wall, 0, false);
      }
      if (s.stage === 'reveal') {
        root.style.opacity = String(Math.max(0, 1 - s.branch / BRANCH.REDUCED_REVEAL_DUR));
        root.classList.add('boot-passthrough');
      }
      return;
    }

    stage.apply(f, ghosts, s.wall, dt, s.stage !== 'error');

    // Reveal: the overlay fades and pushes toward Miles while the web strands
    // expand and fade. Only opacity/transform change, so Chrome does it on the
    // compositor. (The old animated clip-path re-rasterised the overlay and the
    // whole portfolio underneath on every frame, which was the main source of lag.)
    const u = f.reveal.progress;
    const web = webRef.current;
    if (s.stage === 'reveal' && u > 0) {
      const { w, h } = stage.size();
      const c = s.forced ? { x: w / 2, y: h / 2 } : stage.project(f.reveal.cx, f.reveal.cy);
      const e = easeInOut(u);
      if (holeKey.current !== 'open') {
        root.classList.add('boot-passthrough');
        root.style.willChange = 'opacity, transform';
        root.style.transformOrigin = `${c.x.toFixed(0)}px ${c.y.toFixed(0)}px`;
      }
      root.style.opacity = String((1 - e).toFixed(3));
      root.style.transform = `scale(${(1 + e * 0.1).toFixed(3)})`;
      if (web) {
        const r = Math.hypot(Math.max(c.x, w - c.x), Math.max(c.y, h - c.y)) * 1.12 * e;
        web.setAttribute('transform', `translate(${c.x.toFixed(1)} ${c.y.toFixed(1)}) scale(${(Math.max(1, r) / 100).toFixed(3)})`);
        web.setAttribute('opacity', String(Math.max(0, 1 - u * u).toFixed(3)));
      }
      holeKey.current = 'open';
    } else if (web && holeKey.current === 'open') {
      web.setAttribute('opacity', '0');
    }
  }, [env.reducedMotion]);

  const { ui, retry, enter, appReady } = useBootSequence({
    reducedMotion: env.reducedMotion,
    repeatVisit: env.repeatVisit,
    render,
    onReset: () => {
      lastStageKey.current = '';
      holeKey.current = '';
      stageRef.current?.reset();
      const root = rootRef.current;
      if (root) { root.style.opacity = ''; root.style.transform = ''; root.style.willChange = ''; root.classList.remove('boot-passthrough'); }
    },
    onDone,
    onQuality: (level) => stageRef.current?.setQuality(level),
  });

  // Mount the portfolio underneath as soon as the outcome allows a reveal.
  // startTransition keeps the cinematic's frames smooth while it renders.
  useEffect(() => {
    if (ui.appNeeded) startTransition(onAppNeeded);
  }, [ui.appNeeded, onAppNeeded]);

  // Once the portfolio has committed, give it two frames to paint, then let the
  // reveal proceed — so the web-wipe never opens onto a blank page.
  useEffect(() => {
    if (!appMounted) return;
    let id = requestAnimationFrame(() => { id = requestAnimationFrame(appReady); });
    return () => cancelAnimationFrame(id);
  }, [appMounted, appReady]);

  // Hand off from the static pre-React splash (index.html) once we're on screen.
  useEffect(() => {
    const id = requestAnimationFrame(() => window.dispatchEvent(new Event('portfolio:boot-handoff')));
    return () => cancelAnimationFrame(id);
  }, []);

  const label = ui.stage === 'error' ? 'Failed to load the portfolio' : "Loading Aryan Singh's portfolio";

  return (
    <>
      <div ref={rootRef} className="boot-root" role="status" aria-live="polite" aria-label={label}>
        <Stage ref={stageRef} lowPower={env.lowPower} />
        {ui.stage === 'error' ? (
          <FailureState onRetry={retry} onEnter={enter} />
        ) : (
          ui.stage !== 'reveal' && <LoadingState caption={ui.caption} />
        )}
      </div>
      {!env.reducedMotion && <RevealWeb ref={webRef} />}
    </>
  );
}
