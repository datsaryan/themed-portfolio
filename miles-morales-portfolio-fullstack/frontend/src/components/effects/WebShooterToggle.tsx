import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { theme, ThemeName } from '../../theme/themeEngine';
import { sound } from '../../audio/soundEngine';

interface Splat {
  id: number;
  x: number;
  y: number;
  to: ThemeName;
}

/**
 * Wrist web-shooter that fires a web across the screen and swaps the palette
 * behind it. The splat is portalled to <body> so it sits above every section
 * regardless of where the button lives.
 */
export const WebShooterToggle: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const [current, setCurrent] = useState<ThemeName>(theme.get());
  const [splat, setSplat] = useState<Splat | null>(null);
  const [recoil, setRecoil] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const splatId = useRef(0);

  useEffect(() => theme.subscribe(setCurrent), []);

  const fire = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const originY = rect ? rect.top + rect.height / 2 : 0;
    const next: ThemeName = current === 'dark' ? 'light' : 'dark';

    sound.playThwip();
    setRecoil(true);
    window.setTimeout(() => setRecoil(false), 360);

    splatId.current += 1;
    setSplat({ id: splatId.current, x: originX, y: originY, to: next });

    // Swap the palette while the web covers the screen, so the change lands
    // hidden rather than flashing mid-scroll.
    window.setTimeout(() => theme.set(next), 280);
    window.setTimeout(() => setSplat(null), 900);
  };

  // Radius needed to reach the furthest screen corner from the muzzle.
  const reach = splat
    ? Math.hypot(
        Math.max(splat.x, window.innerWidth - splat.x),
        Math.max(splat.y, window.innerHeight - splat.y)
      ) * 1.05
    : 0;

  const label = current === 'dark' ? 'Shoot web: switch to day suit' : 'Shoot web: switch to night suit';

  return (
    <>
      <button
        ref={btnRef}
        onClick={fire}
        title={label}
        aria-label={label}
        className={`flex items-center gap-1.5 border transition-all font-mono font-semibold ${
          compact
            ? 'px-3 py-2 text-xs bg-concrete text-headline border-borderDark'
            : 'px-2.5 py-1.5 text-xs bg-surface/90 hover:bg-spider/20 border-spider/60 text-spider hover:text-headline'
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          className={`w-4 h-4 ${recoil ? 'animate-shooter-recoil' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        >
          {/* Wrist cuff */}
          <path d="M3 9 L3 15 L8 16 L8 8 Z" />
          {/* Muzzle */}
          <path d="M8 11.2 L12 11.2" />
          <path d="M8 12.8 L12 12.8" />
          {/* Web spray */}
          <path d="M13 12 L20 7" />
          <path d="M13 12 L21 12" />
          <path d="M13 12 L20 17" />
          <path d="M16.5 9 Q 18 12 16.5 15" />
        </svg>
        <span className={compact ? '' : 'hidden sm:inline'}>
          {current === 'dark' ? 'DAY SUIT' : 'NIGHT SUIT'}
        </span>
      </button>

      {splat &&
        typeof document !== 'undefined' &&
        createPortal(
          <div className="fixed inset-0 z-[99998] pointer-events-none overflow-hidden" aria-hidden="true">
            <div
              className="absolute animate-web-splat"
              style={{
                left: splat.x - reach,
                top: splat.y - reach,
                width: reach * 2,
                height: reach * 2,
                transformOrigin: 'center center',
              }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <defs>
                  <radialGradient id="splat-fill" cx="50%" cy="50%" r="50%">
                    <stop
                      offset="0%"
                      stopColor={splat.to === 'light' ? '#fffdf6' : '#07080b'}
                      stopOpacity="0.97"
                    />
                    <stop
                      offset="72%"
                      stopColor={splat.to === 'light' ? '#f3eee1' : '#0e1017'}
                      stopOpacity="0.93"
                    />
                    <stop
                      offset="100%"
                      stopColor={splat.to === 'light' ? '#e6ded0' : '#12141d'}
                      stopOpacity="0"
                    />
                  </radialGradient>
                </defs>

                <circle cx="100" cy="100" r="100" fill="url(#splat-fill)" />

                {/* Web lattice riding on the splat */}
                <g
                  fill="none"
                  stroke={splat.to === 'light' ? 'rgba(35,28,20,0.5)' : 'rgba(243,244,248,0.5)'}
                  strokeWidth="0.7"
                >
                  {Array.from({ length: 16 }).map((_, i) => {
                    const a = (i / 16) * Math.PI * 2;
                    return (
                      <line
                        key={i}
                        x1="100"
                        y1="100"
                        x2={100 + Math.cos(a) * 100}
                        y2={100 + Math.sin(a) * 100}
                      />
                    );
                  })}
                  {[18, 34, 52, 70, 88].map((r) => (
                    <circle key={r} cx="100" cy="100" r={r} />
                  ))}
                </g>

                <circle cx="100" cy="100" r="6" fill="#e62429" opacity="0.85" />
              </svg>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
