import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BootMachine, type BootCoarse, type SfxCue } from '../../boot/bootMachine';
import { computeRig } from '../../boot/timeline';
import { computeLayout } from '../../boot/layout';
import { SESSION_SEEN_KEY } from '../../boot/bootConfig';
import { retryResumeLoad, useResumeLoadState } from '../../data/useResumeData';
import { sound } from '../../audio/soundEngine';
import { SceneDefs, SceneBackdrop } from './Scene';
import { MilesCharacter } from './MilesCharacter';
import { GwenCharacter } from './GwenCharacter';
import { WebEffects } from './WebEffects';
import { ParticleEffects, type ParticleHandle } from './ParticleEffects';
import { LoadingState } from './LoadingState';
import { FailureState } from './FailureState';
import type { Joints } from '../../boot/figureSpec';
import type { WebSeg } from '../../boot/timeline';
import './BootStage.css';

function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

function useViewport() {
  const [size, setSize] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800
  }));
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setSize({ w: window.innerWidth, h: window.innerHeight }));
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, []);
  return size;
}

const CUE_SOUND: Record<SfxCue, (() => void) | null> = {
  whoosh: () => sound.playWhoosh(),
  webShot: () => sound.playThwip(),
  catch: () => sound.playWebSnap(),
  impact: () => sound.playImpact(),
  reveal: null
};

/**
 * Boot cinematic overlay. Sits above the (always-mounted, always-usable —
 * see useResumeData's fallback-first design) portfolio and reacts to the
 * REAL load state: web-slings while data is loading, catches Gwen and wipes
 * away on success, or lets her fall and shows a retry/enter-anyway screen on
 * failure/timeout. Unmounts itself entirely once resolved, so nothing here
 * costs anything on the rest of the app afterwards.
 *
 * Perf note: the camera transform and particle canvas are updated
 * imperatively every animation frame (they're cheap — one attribute write /
 * one canvas draw) for maximum smoothness, while character poses and web
 * strands go through React state throttled to ~30fps, which is plenty for
 * limb motion and avoids reconciling that SVG subtree 60 times a second.
 */
export function BootStage() {
  const reducedMotion = useReducedMotion();
  const { w: vw, h: vh } = useViewport();
  const loadState = useResumeLoadState();

  const [visible, setVisible] = useState(true);
  const [coarse, setCoarse] = useState<BootCoarse | null>(null);
  const [pose, setPose] = useState<{ miles: Joints; gwen: Joints; mx: number; my: number; mr: number; mScale: number; gx: number; gy: number; gr: number; gScale: number; gOpacity: number; mOpacity: number; webs: WebSeg[] } | null>(null);

  const camRef = useRef<SVGGElement>(null);
  const particlesRef = useRef<ParticleHandle>(null);
  const stageOuterRef = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const lastTsRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const resolvedRef = useRef(false);

  const isMobile = vw < 640;
  const density = reducedMotion ? 0 : isMobile ? 0.4 : 1;

  const machine = useMemo(() => {
    let skipIntro = false;
    try {
      skipIntro = sessionStorage.getItem(SESSION_SEEN_KEY) === '1';
      sessionStorage.setItem(SESSION_SEEN_KEY, '1');
    } catch {
      /* private mode / storage disabled — fine, just always plays the full intro */
    }
    return new BootMachine({
      reducedMotion,
      skipIntro,
      onCue: (cue) => {
        CUE_SOUND[cue]?.();
      }
    });
    // Intentionally constructed once: reducedMotion/skipIntro only matter at boot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Feed the REAL load result in. Only the first settle per attempt matters —
  // resolve() itself ignores anything after the first (see BootMachine).
  useEffect(() => {
    if (loadState.status === 'ready' || loadState.status === 'static') {
      resolvedRef.current = true;
      machine.resolve('success');
    } else if (loadState.status === 'failed') {
      resolvedRef.current = true;
      machine.resolve('failure', loadState.failure);
    }
  }, [loadState, machine]);

  useEffect(() => machine.subscribe(() => setCoarse(machine.getCoarse())), [machine]);
  useEffect(() => setCoarse(machine.getCoarse()), [machine]);

  // Letterbox bars slide in a beat after mount.
  useEffect(() => {
    const id = requestAnimationFrame(() => rootRef.current?.classList.add('ps-bars-in'));
    return () => cancelAnimationFrame(id);
  }, []);

  // See the html.ps-boot-active rule in BootStage.css — guards against a
  // mobile viewport-expansion quirk triggered by the scene's wide backdrop.
  useEffect(() => {
    document.documentElement.classList.add('ps-boot-active');
    return () => document.documentElement.classList.remove('ps-boot-active');
  }, []);

  const applyOverlayVars = useCallback((fx: ReturnType<typeof computeRig>['fx']) => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--ps-dim', String(fx.dim));
    el.style.setProperty('--ps-red', String(fx.red));
    el.style.setProperty('--ps-flash', String(fx.flash));
    el.style.setProperty('--ps-glitch', String(fx.glitch));
  }, []);

  useEffect(() => {
    if (!visible) return;
    const layout = computeLayout(vw, vh);

    const loop = (ts: number) => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;

      const stillRunning = machine.tick(dt);
      const rig = computeRig(machine.frame, layout);

      if (camRef.current) {
        const { zoom, x, y, roll } = rig.cam;
        camRef.current.setAttribute(
          'transform',
          `translate(${x} ${y}) rotate(${roll} 500 500) translate(500 500) scale(${zoom}) translate(-500 -500)`
        );
      }
      applyOverlayVars(rig.fx);
      particlesRef.current?.draw({
        vw, vh, dt,
        speed: rig.fx.speed, speedAngle: rig.fx.speedAngle,
        senseX: rig.fx.senseX * layout.unit + layout.left, senseY: rig.fx.senseY * layout.unit + layout.top,
        senseP: rig.fx.senseP, dim: rig.fx.dim
      });
      if (rootRef.current) {
        rootRef.current.style.setProperty('--ps-scene-fade', String(rig.fx.sceneFade));
        if (rig.reveal.kind) {
          const cx = layout.left + rig.miles.x * layout.unit;
          const cy = layout.top + rig.miles.y * layout.unit;
          const maxR = Math.hypot(vw, vh);
          const r = Math.max(0, rig.reveal.p) * maxR * 1.15;
          rootRef.current.style.maskImage = `radial-gradient(circle ${r}px at ${cx}px ${cy}px, transparent 0, transparent ${Math.max(0, r - 40)}px, black ${r}px)`;
          (rootRef.current.style as unknown as Record<string, string>).WebkitMaskImage = rootRef.current.style.maskImage;
        } else {
          rootRef.current.style.maskImage = '';
          (rootRef.current.style as unknown as Record<string, string>).WebkitMaskImage = '';
        }
      }

      // Character pose / web strands: throttled to ~30fps (every other frame).
      frameCountRef.current++;
      if (frameCountRef.current % 2 === 0) {
        setPose({
          miles: rig.miles.joints, gwen: rig.gwen.joints,
          mx: rig.miles.x, my: rig.miles.y, mr: rig.miles.rot, mScale: rig.miles.scale,
          gx: rig.gwen.x, gy: rig.gwen.y, gr: rig.gwen.rot, gScale: rig.gwen.scale,
          gOpacity: rig.gwen.opacity, mOpacity: rig.miles.opacity,
          webs: rig.webs
        });
      }

      if (stillRunning) {
        rafRef.current = requestAnimationFrame(loop);
      } else if (machine.getCoarse().phase === 'done') {
        setVisible(false);
      }
    };

    // A backgrounded tab stops getting rAF callbacks entirely; the next one
    // on return would otherwise carry a huge dt (minutes). Reset the clock
    // baseline instead of letting the per-frame clamp eat that gap one
    // 0.25s slice at a time, which would just replay it all in fast-forward.
    const onVisibility = () => {
      if (!document.hidden) lastTsRef.current = null;
    };
    document.addEventListener('visibilitychange', onVisibility);

    rafRef.current = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafRef.current);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    // Re-running this effect only on visible/vw/vh/machine keeps one clean
    // rAF loop alive for the overlay's whole lifetime; layout recomputes
    // itself each tick from the latest vw/vh via closure.
  }, [visible, vw, vh, machine, applyOverlayVars]);

  const onRetry = useCallback(() => {
    machine.retry();
    resolvedRef.current = false;
    void retryResumeLoad();
  }, [machine]);
  const onEnterAnyway = useCallback(() => machine.enterAnyway(), [machine]);

  if (!visible) return null;

  const phase = coarse?.phase ?? 'scene';
  const revealKind = coarse?.revealKind ?? null;

  return (
    <div
      ref={rootRef}
      id="ps-loader"
      className={reducedMotion ? 'ps-reduced' : ''}
      role="status"
      aria-live="polite"
      aria-label="Loading Aryan Singh's portfolio"
    >
      {!reducedMotion && (
        <svg viewBox={`0 0 ${vw} ${vh}`} aria-hidden="true">
          <SceneDefs />
          <g
            ref={stageOuterRef}
            style={{ opacity: 'var(--ps-scene-fade, 0)' }}
            transform={`translate(${computeLayout(vw, vh).left} ${computeLayout(vw, vh).top}) scale(${computeLayout(vw, vh).unit})`}
          >
            <g ref={camRef}>
              <SceneBackdrop />
              {pose && <g transform={`translate(${pose.gx} ${pose.gy}) rotate(${pose.gr}) scale(${pose.gScale})`} opacity={pose.gOpacity}>
                <GwenCharacter joints={pose.gwen} hairPhase={Math.sin(performance.now() / 260)} />
              </g>}
              {pose && <WebEffects webs={pose.webs} />}
              {pose && <g transform={`translate(${pose.mx} ${pose.my}) rotate(${pose.mr}) scale(${pose.mScale})`} opacity={pose.mOpacity} filter="url(#cinSoftShadow)">
                <MilesCharacter joints={pose.miles} senseGlow={phase === 'scene' ? 1 : 0} />
              </g>}
            </g>
          </g>
        </svg>
      )}

      <ParticleEffects ref={particlesRef} density={density} />

      <div className="ps-dim" style={{ opacity: 'calc(var(--ps-dim, 0) * 0.55)' }} />
      <div className="ps-red-wash" style={{ opacity: 'var(--ps-red, 0)' }} />
      <div className="ps-grade" />
      <div className="ps-vignette" />
      {!reducedMotion && <div className="ps-grain" />}
      <div className="ps-flash" style={{ opacity: 'var(--ps-flash, 0)' }} />
      {!reducedMotion && (
        <div
          className="ps-glitch-bar"
          style={{ top: '38%', background: 'linear-gradient(90deg, transparent, #0ff, transparent)', opacity: 'var(--ps-glitch, 0)', transform: 'translateX(2%)' }}
        />
      )}

      <div className="ps-bar ps-bar-top" />
      <div className="ps-bar ps-bar-bottom" />

      {(phase === 'scene' || (phase === 'reveal' && revealKind === 'quick')) && (
        <LoadingState compact={reducedMotion} />
      )}

      {phase === 'error' && (
        <FailureState
          failure={coarse?.failure ?? null}
          canEnterAnyway
          onRetry={onRetry}
          onEnterAnyway={onEnterAnyway}
        />
      )}
    </div>
  );
}
