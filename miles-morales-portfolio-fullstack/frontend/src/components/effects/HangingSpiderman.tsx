import React, { useCallback, useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { sound } from '../../audio/soundEngine';

const MILES_QUOTES = [
  "Hey.",
  "What's up danger?",
  "Just hanging around.",
  "Brooklyn style!",
  "Full-stack senses tingling!",
  "Earth-1610 operative on watch.",
  "Nice clicks!",
];

const RELEASE_QUOTES = [
  "WEB RELEASE!",
  "Catch you later!",
  "Gotta swing!",
  "THWIP!",
];

const FAR_RELEASE_QUOTES = [
  "WHOOOA!",
  "TOO FAR, MAN!",
  "MAXIMUM TENSION!",
  "LEGGO!",
];

type Vec = { x: number; y: number };

/** Below this much stretch beyond rest length, a release counts as a plain tap. */
const TAP_THRESHOLD = 12;
/** Stretch (px) that counts as a full-power release for effects scaling. */
const FULL_POWER_STRETCH = 700;

const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);

/** Point along a quadratic bezier at parameter t. */
function quadPoint(p0: Vec, c: Vec, p1: Vec, t: number): Vec {
  const inv = 1 - t;
  return {
    x: inv * inv * p0.x + 2 * inv * t * c.x + t * t * p1.x,
    y: inv * inv * p0.y + 2 * inv * t * c.y + t * t * p1.y,
  };
}

function lerpColor(tension: number): string {
  // #f0f0f5 (slack) -> #ff1f3d (taut)
  const r = Math.round(240 + (255 - 240) * tension);
  const g = Math.round(240 + (31 - 240) * tension);
  const b = Math.round(245 + (61 - 245) * tension);
  return `rgb(${r}, ${g}, ${b})`;
}

export const HangingSpiderman: React.FC = () => {
  const [viewport, setViewport] = useState<Vec>(() => ({
    x: typeof window === 'undefined' ? 1280 : window.innerWidth,
    y: typeof window === 'undefined' ? 800 : window.innerHeight,
  }));
  const [pos, setPos] = useState<Vec>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [quote, setQuote] = useState(MILES_QUOTES[0]);
  const [showSpeech, setShowSpeech] = useState(false);
  const [burst, setBurst] = useState<Vec | null>(null);

  const quoteIndex = useRef(0);
  const posRef = useRef<Vec>({ x: 0, y: 0 });
  const velRef = useRef<Vec>({ x: 0, y: 0 });
  const modeRef = useRef<'idle' | 'drag' | 'spring'>('idle');
  const grabOffset = useRef<Vec>({ x: 0, y: 0 });
  const lastPointer = useRef<{ p: Vec; t: number } | null>(null);
  const swingStart = useRef(0);
  const speechTimer = useRef<number | null>(null);

  // Figure scale + anchor derive from viewport width, so it stays proportional.
  const scale = viewport.x < 640 ? 0.62 : viewport.x < 768 ? 0.76 : 0.92;
  const anchor: Vec = { x: Math.min(Math.max(viewport.x * 0.07, 38), 118), y: 0 };
  const restLen = 78 * scale;
  const rest: Vec = { x: anchor.x, y: anchor.y + restLen };

  const anchorRef = useRef(anchor);
  const restRef = useRef(rest);
  anchorRef.current = anchor;
  restRef.current = rest;

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Keep the viewport (and therefore the SVG's 1:1 px coordinate system) current.
  useEffect(() => {
    const onResize = () => setViewport({ x: window.innerWidth, y: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Single animation loop: idle pendulum swing, or spring-back after a release.
  useEffect(() => {
    let raf = 0;
    posRef.current = { ...restRef.current };
    swingStart.current = performance.now();

    const tick = (t: number) => {
      const a = anchorRef.current;
      const r = restRef.current;
      const len = r.y - a.y;

      if (modeRef.current === 'idle') {
        const amp = prefersReducedMotion ? 0 : 0.11; // radians (~6.3 degrees)
        const ang = amp * Math.sin((t - swingStart.current) / 1500);
        posRef.current = {
          x: a.x + Math.sin(ang) * len,
          y: a.y + Math.cos(ang) * len,
        };
        velRef.current = { x: 0, y: 0 };
        setPos({ ...posRef.current });
      } else if (modeRef.current === 'spring') {
        const k = 0.15;
        const damping = 0.86;
        velRef.current = {
          x: (velRef.current.x + (r.x - posRef.current.x) * k) * damping,
          y: (velRef.current.y + (r.y - posRef.current.y) * k) * damping,
        };
        posRef.current = {
          x: posRef.current.x + velRef.current.x,
          y: posRef.current.y + velRef.current.y,
        };
        setPos({ ...posRef.current });

        const settled =
          dist(posRef.current, r) < 0.7 &&
          Math.hypot(velRef.current.x, velRef.current.y) < 0.7;
        if (settled) {
          modeRef.current = 'idle';
          swingStart.current = t;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [prefersReducedMotion]);

  const say = useCallback((text: string, holdMs: number | null) => {
    setQuote(text);
    setShowSpeech(true);
    if (speechTimer.current !== null) window.clearTimeout(speechTimer.current);
    if (holdMs !== null) {
      speechTimer.current = window.setTimeout(() => setShowSpeech(false), holdMs);
    }
  }, []);

  const fireConfetti = useCallback((at: Vec, intensity: number) => {
    confetti({
      particleCount: Math.round(26 + intensity * 90),
      spread: 70 + intensity * 50,
      startVelocity: 24 + intensity * 34,
      gravity: 1.1,
      scalar: 0.7,
      ticks: 110,
      colors: ['#e62429', '#f0f0f5', '#00f0ff', '#ffd600', '#a855f7'],
      origin: {
        x: Math.max(0, Math.min(1, at.x / window.innerWidth)),
        y: Math.max(0, Math.min(1, at.y / window.innerHeight)),
      },
    });
  }, []);

  const handlePointerDown = (e: React.PointerEvent<SVGGElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    modeRef.current = 'drag';
    grabOffset.current = {
      x: posRef.current.x - e.clientX,
      y: posRef.current.y - e.clientY,
    };
    lastPointer.current = { p: { x: e.clientX, y: e.clientY }, t: performance.now() };
    setIsDragging(true);
    setShowSpeech(false);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGGElement>) => {
    if (modeRef.current !== 'drag') return;
    // No clamping at all — the web stretches as far as the pointer goes.
    posRef.current = {
      x: e.clientX + grabOffset.current.x,
      y: e.clientY + grabOffset.current.y,
    };
    lastPointer.current = { p: { x: e.clientX, y: e.clientY }, t: performance.now() };
    setPos({ ...posRef.current });
  };

  const handlePointerUp = (e: React.PointerEvent<SVGGElement>) => {
    if (modeRef.current !== 'drag') return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDragging(false);

    const releasedAt = { ...posRef.current };
    const stretch = Math.max(0, dist(releasedAt, restRef.current));

    // Carry a little of the fling velocity into the spring for extra whip.
    velRef.current = { x: 0, y: 0 };
    modeRef.current = 'spring';

    if (stretch < TAP_THRESHOLD) {
      sound.playThwip();
      say(MILES_QUOTES[quoteIndex.current % MILES_QUOTES.length], 2200);
      quoteIndex.current += 1;
      return;
    }

    const intensity = Math.min(1, stretch / FULL_POWER_STRETCH);
    sound.playWebSnap();
    sound.playThwip();
    if (intensity > 0.65) sound.playVenomZap();

    fireConfetti(releasedAt, intensity);
    setBurst(releasedAt);
    window.setTimeout(() => setBurst(null), 650);

    const pool = intensity > 0.65 ? FAR_RELEASE_QUOTES : RELEASE_QUOTES;
    say(pool[Math.floor(Math.random() * pool.length)], 1800);
  };

  const handleKeyDown = (e: React.KeyboardEvent<SVGGElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    sound.playThwip();
    say(MILES_QUOTES[quoteIndex.current % MILES_QUOTES.length], 2200);
    quoteIndex.current += 1;
  };

  // --- Derived geometry for this frame ---
  const dx = pos.x - anchor.x;
  const dy = pos.y - anchor.y;
  const lineLen = Math.hypot(dx, dy);
  const stretch = Math.max(0, lineLen - restLen);
  const tension = Math.min(1, stretch / FULL_POWER_STRETCH);

  // Rotate the figure so its body always points away from the anchor.
  const angleDeg = (Math.atan2(-dx, dy) * 180) / Math.PI;

  // Slack sags; a taut line runs dead straight.
  const sag = Math.max(0, 18 * (1 - lineLen / (restLen * 2.2)));
  const ctrl: Vec = { x: (anchor.x + pos.x) / 2, y: (anchor.y + pos.y) / 2 + sag };
  const knotA = quadPoint(anchor, ctrl, pos, 0.34);
  const knotB = quadPoint(anchor, ctrl, pos, 0.67);

  const lineColor = lerpColor(tension);
  const lineWidth = Math.max(1.1, 2.4 - 1.2 * tension);
  const eyesHot = isHovered || isDragging;

  return (
    <div
      className="fixed inset-0 z-50 pointer-events-none select-none"
      style={{ touchAction: 'none' }}
    >
      <svg
        viewBox={`0 0 ${viewport.x} ${viewport.y}`}
        width="100%"
        height="100%"
        className="overflow-visible"
        aria-hidden={false}
      >
        {/* Ceiling anchor point */}
        <circle cx={anchor.x} cy={anchor.y} r={3.4} fill="#e62429" />
        <circle cx={anchor.x} cy={anchor.y} r={7} fill="none" stroke="#e62429" strokeOpacity={0.35} strokeWidth={1} />

        {/* Elastic web line — stretches anywhere on screen */}
        <path
          d={`M ${anchor.x} ${anchor.y} Q ${ctrl.x} ${ctrl.y} ${pos.x} ${pos.y}`}
          fill="none"
          stroke={lineColor}
          strokeWidth={lineWidth}
          strokeLinecap="round"
        />
        <circle cx={knotA.x} cy={knotA.y} r={1.6} fill={lineColor} />
        <circle cx={knotB.x} cy={knotB.y} r={1.6} fill={lineColor} />

        {/* Tension sparks along the line once it's really stretched */}
        {tension > 0.55 && (
          <g opacity={(tension - 0.55) / 0.45}>
            <circle cx={knotA.x} cy={knotA.y} r={5} fill="none" stroke="#00f0ff" strokeWidth={1} />
            <circle cx={knotB.x} cy={knotB.y} r={4} fill="none" stroke="#a855f7" strokeWidth={1} />
          </g>
        )}

        {/* Impact burst left at the release point */}
        {burst && (
          <g
            className="animate-web-impact-burst pointer-events-none"
            style={{ transformOrigin: `${burst.x}px ${burst.y}px` }}
          >
            {Array.from({ length: 10 }).map((_, i) => {
              const angle = (i / 10) * Math.PI * 2;
              return (
                <line
                  key={i}
                  x1={burst.x}
                  y1={burst.y}
                  x2={burst.x + Math.cos(angle) * 38}
                  y2={burst.y + Math.sin(angle) * 38}
                  stroke={i % 2 === 0 ? '#f0f0f5' : '#e62429'}
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              );
            })}
            <circle cx={burst.x} cy={burst.y} r={9} fill="none" stroke="#00f0ff" strokeWidth={2} />
          </g>
        )}

        {/* The figure itself: grabbable, rotates to follow the web line */}
        <g
          transform={`translate(${pos.x}, ${pos.y}) rotate(${angleDeg}) scale(${scale})`}
          className="pointer-events-auto filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
          style={{ touchAction: 'none' }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          aria-label="Upside-down hanging Miles Morales Spider-Man. Drag him anywhere on screen and release to snap the web back."
        >
          {/* Generous invisible grab area */}
          <rect x={-34} y={-10} width={68} height={132} fill="transparent" />

          {/* Web wrap around the ankles, at the attachment point */}
          <ellipse cx={0} cy={0} rx={6} ry={3} fill="none" stroke={lineColor} strokeWidth={2} />

          {/* Body: local origin (0,0) is the ankle wrap */}
          <g transform="translate(-50, -4)">
            {/* Left Thigh & Shin */}
            <path d="M 47,4 L 38,20 L 44,38 L 47,44" fill="none" stroke="#0a0a0e" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 47,4 L 38,20 L 44,38 L 47,44" fill="none" stroke="#e62429" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Right Thigh & Shin */}
            <path d="M 53,4 L 62,20 L 56,38 L 53,44" fill="none" stroke="#0a0a0e" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 53,4 L 62,20 L 56,38 L 53,44" fill="none" stroke="#e62429" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

            {/* Torso */}
            <path d="M 42,42 L 58,42 L 64,75 L 36,75 Z" fill="#0d0e14" stroke="#e62429" strokeWidth="1.5" />

            {/* Chest spider emblem */}
            <g transform="translate(50, 60)">
              <ellipse cx="0" cy="0" rx="3.5" ry="6" fill="#e62429" />
              <path d="M -3,-3 Q -10,-8 -12,2" stroke="#e62429" strokeWidth="1.6" fill="none" />
              <path d="M 3,-3 Q 10,-8 12,2" stroke="#e62429" strokeWidth="1.6" fill="none" />
              <path d="M -3,2 Q -11,8 -10,14" stroke="#e62429" strokeWidth="1.6" fill="none" />
              <path d="M 3,2 Q 11,8 10,14" stroke="#e62429" strokeWidth="1.6" fill="none" />
            </g>

            {/* Arms — they trail upward as the web goes taut */}
            <g transform={`translate(0, ${tension * 3})`}>
              <path
                d={`M 36,70 Q ${25 - tension * 6},${75 - tension * 4} ${30 - tension * 8},${90 - tension * 6} Q 38,98 46,88`}
                fill="none" stroke="#0a0a0e" strokeWidth="7" strokeLinecap="round"
              />
              <path
                d={`M 36,70 Q ${25 - tension * 6},${75 - tension * 4} ${30 - tension * 8},${90 - tension * 6} Q 38,98 46,88`}
                fill="none" stroke="#e62429" strokeWidth="2" strokeLinecap="round"
              />
              <path
                d={`M 64,70 Q ${75 + tension * 6},${75 - tension * 4} ${70 + tension * 8},${90 - tension * 6} Q 62,98 54,88`}
                fill="none" stroke="#0a0a0e" strokeWidth="7" strokeLinecap="round"
              />
              <path
                d={`M 64,70 Q ${75 + tension * 6},${75 - tension * 4} ${70 + tension * 8},${90 - tension * 6} Q 62,98 54,88`}
                fill="none" stroke="#e62429" strokeWidth="2" strokeLinecap="round"
              />
            </g>

            {/* Head / Mask */}
            <path d="M 40,84 C 36,92 38,114 50,118 C 62,114 64,92 60,84 C 55,78 45,78 40,84 Z" fill="#08080c" stroke="#e62429" strokeWidth="2" />

            {/* Mask web pattern */}
            <line x1="50" y1="80" x2="50" y2="116" stroke="#252736" strokeWidth="1" />
            <path d="M 40,92 Q 50,96 60,92" stroke="#252736" strokeWidth="1" fill="none" />
            <path d="M 42,104 Q 50,108 58,104" stroke="#252736" strokeWidth="1" fill="none" />

            {/* Mask eyes — widen with tension */}
            <path
              d="M 42,95 Q 46,90 48,102 Q 44,106 42,95 Z"
              fill="#ffffff"
              stroke="#e62429"
              strokeWidth={1.8 + tension}
              className={`transition-all duration-200 ${eyesHot ? 'filter drop-shadow-[0_0_4px_#ff1744]' : ''}`}
            />
            <path
              d="M 58,95 Q 54,90 52,102 Q 56,106 58,95 Z"
              fill="#ffffff"
              stroke="#e62429"
              strokeWidth={1.8 + tension}
              className={`transition-all duration-200 ${eyesHot ? 'filter drop-shadow-[0_0_4px_#ff1744]' : ''}`}
            />
          </g>
        </g>
      </svg>

      {/* Comic speech bubble — tracks the figure wherever it goes */}
      {(showSpeech || (isHovered && !isDragging)) && (
        <div
          className="fixed z-50 animate-web-burst pointer-events-none w-max max-w-[200px]"
          style={{
            left: Math.min(Math.max(pos.x + 46 * scale, 8), viewport.x - 210),
            top: Math.min(Math.max(pos.y + 18, 8), viewport.y - 60),
          }}
        >
          <div className="relative bg-graffiti-yellow text-void border-2 border-black font-comic text-sm px-3 py-1.5 shadow-comic-black leading-tight tracking-wide">
            {showSpeech ? quote : MILES_QUOTES[quoteIndex.current % MILES_QUOTES.length]}
            <div className="absolute top-3 -left-2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-black border-b-[6px] border-b-transparent" />
            <div className="absolute top-3 -left-1.5 w-0 h-0 border-t-[5px] border-t-transparent border-r-[7px] border-r-graffiti-yellow border-b-[5px] border-b-transparent" />
          </div>
        </div>
      )}

      {/* Tension HUD readout while dragging */}
      {isDragging && stretch > 40 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
          <div className="flex items-center gap-3 bg-void/90 border border-spider px-4 py-2 font-mono text-[11px] uppercase tracking-widest shadow-comic-black">
            <span className="text-subtext">WEB TENSION</span>
            <div className="w-32 h-1.5 bg-concrete">
              <div
                className="h-full transition-none"
                style={{
                  width: `${Math.round(tension * 100)}%`,
                  background: tension > 0.65 ? '#ff1f3d' : '#00f0ff',
                }}
              />
            </div>
            <span className={tension > 0.65 ? 'text-spider font-bold' : 'text-graffiti-yellow'}>
              {Math.round(tension * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
