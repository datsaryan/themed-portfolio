import { memo, useMemo } from 'react';
import { STAGE } from '../choreography';

// Static environment art. Every layer is rendered once and then only ever
// moved with a CSS transform by the camera, so none of this costs per frame.
// Art spans far beyond the 1600x900 stage so any viewport aspect stays filled.

const X0 = -1600, X1 = 3200, Y_TOP = -1600, Y_BOT = 2600;

/** Tiny deterministic RNG so the skyline is identical every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Tower { x: number; w: number; h: number; lit: string[]; }

function skyline(seed: number, from: number, to: number, minW: number, maxW: number, minH: number, maxH: number, density: number): Tower[] {
  const r = rng(seed);
  const out: Tower[] = [];
  const palette = ['#f6c177', '#f6c177', '#7fd0ff', '#ff5a64', '#c9b6ff'];
  let x = from;
  while (x < to) {
    const w = minW + r() * (maxW - minW);
    const h = minH + r() * (maxH - minH);
    const lit: string[] = [];
    const cols = Math.max(2, Math.floor(w / 18));
    const rows = Math.floor(h / 26);
    for (let ry = 0; ry < rows; ry++) {
      for (let cx = 0; cx < cols; cx++) {
        if (r() < density) {
          lit.push(`${(8 + cx * ((w - 16) / cols)).toFixed(0)},${(14 + ry * 26).toFixed(0)},${palette[Math.floor(r() * palette.length)]}`);
        }
      }
    }
    out.push({ x, w, h, lit });
    x += w + r() * 14;
  }
  return out;
}

function Towers({ list, base, fill, rim, windowSize }: { list: Tower[]; base: number; fill: string; rim: string; windowSize: number }) {
  return (
    <>
      {list.map((t, i) => (
        <g key={i} transform={`translate(${t.x.toFixed(0)} ${(base - t.h).toFixed(0)})`}>
          <rect width={t.w} height={t.h + 2400} fill={fill} />
          <rect width={t.w} height={3} fill={rim} opacity={0.7} />
          {t.lit.map((s, k) => {
            const [wx, wy, col] = s.split(',');
            return <rect key={k} x={wx} y={wy} width={windowSize} height={windowSize * 1.3} fill={col} opacity={0.75} />;
          })}
        </g>
      ))}
    </>
  );
}

const SVG_PROPS = {
  className: 'boot-layer-svg',
  preserveAspectRatio: 'xMidYMid slice' as const,
  'aria-hidden': true,
};

export const SkyLayer = memo(function SkyLayer() {
  return (
    <svg {...SVG_PROPS} data-layer="sky" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="bSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#03040a" />
          <stop offset="0.5" stopColor="#0a0d1f" />
          <stop offset="0.82" stopColor="#1b1030" />
          <stop offset="1" stopColor="#3a1228" />
        </linearGradient>
        <radialGradient id="bMoon">
          <stop offset="0" stopColor="#f2f6ff" stopOpacity="0.95" />
          <stop offset="0.45" stopColor="#a6bff0" stopOpacity="0.28" />
          <stop offset="1" stopColor="#a6bff0" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bRed">
          <stop offset="0" stopColor="#e62429" stopOpacity="0.38" />
          <stop offset="1" stopColor="#e62429" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="bViolet">
          <stop offset="0" stopColor="#6a5cff" stopOpacity="0.30" />
          <stop offset="1" stopColor="#6a5cff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={X0} y={Y_TOP} width={X1 - X0} height={Y_BOT - Y_TOP} fill="url(#bSky)" />
      <circle cx={330} cy={170} r={420} fill="url(#bMoon)" />
      <circle cx={330} cy={170} r={46} fill="#eef3ff" opacity={0.9} />
      <circle cx={1350} cy={760} r={640} fill="url(#bRed)" />
      <circle cx={420} cy={620} r={560} fill="url(#bViolet)" />
      {/* a few stars */}
      {Array.from({ length: 36 }, (_, i) => {
        const r = rng(i + 7);
        return <circle key={i} cx={-200 + r() * 2000} cy={-100 + r() * 480} r={0.8 + r() * 1.4} fill="#fff" opacity={0.25 + r() * 0.5} />;
      })}
    </svg>
  );
});

export const FarLayer = memo(function FarLayer() {
  const towers = useMemo(() => skyline(11, X0, X1, 70, 150, 220, 520, 0.22), []);
  return (
    <svg {...SVG_PROPS} data-layer="far" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="bHaze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a1838" stopOpacity="0" />
          <stop offset="1" stopColor="#4a1a34" stopOpacity="0.55" />
        </linearGradient>
      </defs>
      <Towers list={towers} base={820} fill="#0b0f20" rim="#3a4a8a" windowSize={5} />
      <rect x={X0} y={420} width={X1 - X0} height={1800} fill="url(#bHaze)" />
    </svg>
  );
});

export const MidLayer = memo(function MidLayer() {
  const towers = useMemo(() => skyline(29, X0, X1, 90, 190, 300, 640, 0.18), []);
  return (
    <svg {...SVG_PROPS} data-layer="mid" viewBox="0 0 1600 900">
      <Towers list={towers} base={860} fill="#070a16" rim="#e62429" windowSize={7} />
      {/* rooftop details: water tower + antenna + neon signs */}
      <g opacity={0.95}>
        <g transform="translate(205 330)">
          <rect x={-18} y={-26} width={36} height={32} rx={4} fill="#06080f" />
          <path d="M -22 -26 L 0 -42 L 22 -26 Z" fill="#06080f" />
          <path d="M -14 6 L -18 52 M 14 6 L 18 52" stroke="#06080f" strokeWidth={4} />
        </g>
        <path d="M 1010 390 L 1010 250 M 1000 290 L 1020 290 M 1003 320 L 1017 320" stroke="#06080f" strokeWidth={3} />
        <circle cx={1010} cy={246} r={3} fill="#ff2a33" />
        <g transform="translate(1260 520) rotate(-3)">
          <rect x={-60} y={-18} width={120} height={36} rx={4} fill="#1a0509" stroke="#ff2a33" strokeWidth={2} />
          <text x={0} y={7} textAnchor="middle" fontFamily="Bangers, Impact, sans-serif" fontSize={24} fill="#ff4650" letterSpacing={3}>EARTH-1610</text>
        </g>
        <g transform="translate(-30 560) rotate(2)">
          <rect x={-46} y={-16} width={92} height={32} rx={4} fill="#08091c" stroke="#6a5cff" strokeWidth={2} />
          <text x={0} y={7} textAnchor="middle" fontFamily="Bangers, Impact, sans-serif" fontSize={22} fill="#8f84ff" letterSpacing={3}>BROOKLYN</text>
        </g>
      </g>
    </svg>
  );
});

/** Brick-ish wall with window grid + graffiti, between two x extents. */
function Wall({ x, w, top, flip }: { x: number; w: number; top: number; flip?: boolean }) {
  const cols = Math.floor(w / 70);
  const r = rng(x + 3);
  const wins: { x: number; y: number; on: boolean; c: string }[] = [];
  for (let cy = 0; cy < 22; cy++) {
    for (let cx = 0; cx < Math.min(cols, 14); cx++) {
      wins.push({ x: x + 30 + cx * 70, y: top + 70 + cy * 96, on: r() < 0.22, c: r() < 0.5 ? '#f6c177' : '#7fd0ff' });
    }
  }
  return (
    <g>
      <rect x={x} y={top} width={w} height={Y_BOT} fill="#0a0c18" />
      {/* parapet lip, lit from the moon side */}
      <rect x={x} y={top} width={w} height={14} fill="#161a2e" />
      <rect x={x} y={top} width={w} height={3} fill={flip ? '#ff3b45' : '#6a5cff'} opacity={0.85} />
      <rect x={flip ? x : x + w - 3} y={top} width={3} height={Y_BOT} fill={flip ? '#ff3b45' : '#6a5cff'} opacity={0.35} />
      {wins.map((m, i) => (
        <rect key={i} x={m.x} y={m.y} width={34} height={54} rx={2} fill={m.on ? m.c : '#05060d'} opacity={m.on ? 0.55 : 1} />
      ))}
    </g>
  );
}

export const ActionBackdrop = memo(function ActionBackdrop() {
  const { LEDGE_L: L, LEDGE_R: R, GROUND } = STAGE;
  return (
    <svg {...SVG_PROPS} data-layer="backdrop" viewBox="0 0 1600 900">
      <defs>
        <linearGradient id="bStreet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a0f1e" />
          <stop offset="0.12" stopColor="#0b0a14" />
          <stop offset="1" stopColor="#040409" />
        </linearGradient>
        <linearGradient id="bCanyon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#12162c" stopOpacity="0" />
          <stop offset="1" stopColor="#5a1a36" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* canyon haze + street */}
      <rect x={L.x} y={0} width={R.x - L.x} height={GROUND} fill="url(#bCanyon)" />
      <rect x={X0} y={GROUND} width={X1 - X0} height={Y_BOT - GROUND} fill="url(#bStreet)" />
      <rect x={X0} y={GROUND} width={X1 - X0} height={3} fill="#ff3b45" opacity={0.55} />
      {/* wet-street reflections */}
      {[420, 640, 880, 1100, 1320].map((rx, i) => (
        <rect key={rx} x={rx} y={GROUND + 12 + (i % 2) * 18} width={90 + (i % 3) * 30} height={5} rx={2.5}
          fill={i % 2 ? '#6a5cff' : '#ff3b45'} opacity={0.28} />
      ))}
      {/* the two buildings of the canyon */}
      <Wall x={L.x - 1400} w={1400} top={L.y} flip />
      <Wall x={R.x} w={1600} top={R.y} />
      {/* graffiti: arrow + tag on the left wall, tag on the right */}
      <g fill="none" strokeLinecap="round" strokeLinejoin="round" opacity={0.5}>
        <path d="M 350 520 q 60 -70 150 -20 q 70 40 90 -30" stroke="#ffd23f" strokeWidth={7} />
        <path d="M 572 440 l 20 28 l -34 8" stroke="#ffd23f" strokeWidth={7} />
        <path d="M 120 620 q 70 -30 100 20 t 120 -10" stroke="#44d8ff" strokeWidth={6} />
        <path d="M 1290 560 q 40 -50 90 -10 q 40 30 60 -20" stroke="#ff3b45" strokeWidth={7} />
      </g>
      <text x={1250} y={760} fontFamily="Bangers, Impact, sans-serif" fontSize={64} fill="#ff3b45" opacity={0.28}
        transform="rotate(-6 1250 760)" letterSpacing={4}>WEB</text>
      {/* fire escape on the right wall */}
      <g stroke="#06070e" strokeWidth={4} fill="none" opacity={0.95}>
        <path d={`M ${R.x + 30} ${R.y + 220} h 220 M ${R.x + 30} ${R.y + 330} h 220 M ${R.x + 30} ${R.y + 440} h 220`} />
        <path d={`M ${R.x + 30} ${R.y + 220} v 220 M ${R.x + 250} ${R.y + 220} v 220`} />
        <path d={`M ${R.x + 30} ${R.y + 330} l 220 110`} strokeWidth={3} />
      </g>
      {/* broken ledge Gwen is hanging from */}
      <g>
        <path d={`M ${L.x - 120} ${L.y} L ${L.x + 12} ${L.y} L ${L.x + 22} ${L.y + 18} L ${L.x - 6} ${L.y + 34} L ${L.x - 120} ${L.y + 30} Z`}
          fill="#161a2e" />
        <path d={`M ${L.x + 12} ${L.y} L ${L.x + 22} ${L.y + 18} L ${L.x + 4} ${L.y + 26}`} stroke="#ff3b45" strokeWidth={2} fill="none" opacity={0.8} />
      </g>
    </svg>
  );
});

export const NearLayer = memo(function NearLayer() {
  return (
    <svg {...SVG_PROPS} data-layer="near" viewBox="0 0 1600 900">
      {/* out-of-focus city lights (depth of field). Soft radial gradients rather
          than a blur filter: same look, none of the per-frame filter cost. */}
      <defs>
        {[['bk1', '#ff3b45'], ['bk2', '#6a5cff'], ['bk3', '#44d8ff']].map(([id, c]) => (
          <radialGradient key={id} id={id}>
            <stop offset="0" stopColor={c} stopOpacity="0.55" />
            <stop offset="0.55" stopColor={c} stopOpacity="0.3" />
            <stop offset="1" stopColor={c} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {[[110, 760, 120, 'bk1'], [280, 840, 80, 'bk2'], [1480, 790, 135, 'bk1'], [1320, 860, 90, 'bk3'], [1560, 90, 105, 'bk2'], [60, 70, 95, 'bk1']].map(([cx, cy, r, g], i) => (
        <circle key={i} cx={cx as number} cy={cy as number} r={r as number} fill={`url(#${g})`} />
      ))}
      {/* overhead cables */}
      <g stroke="#04050a" strokeWidth={3} fill="none" opacity={0.95}>
        <path d="M -400 40 Q 400 190 1000 70 T 2200 140" />
        <path d="M -400 90 Q 500 250 1200 120 T 2200 190" strokeWidth={2} opacity={0.8} />
      </g>
      {/* web corner, top-left */}
      <g stroke="#e9eeff" fill="none" strokeLinecap="round" opacity={0.28} transform="translate(-60 -60)">
        {[0, 12, 24, 36, 48, 60, 72, 84].map((a) => {
          const rad = (a * Math.PI) / 180;
          return <line key={a} x1={0} y1={0} x2={Math.cos(rad) * 420} y2={Math.sin(rad) * 420} strokeWidth={1.4} />;
        })}
        {[70, 130, 195, 265, 340].map((rr) => (
          <path key={rr} d={`M ${rr} 0 Q ${rr * 0.78} ${rr * 0.2} ${rr * 0.72} ${rr * 0.72} Q ${rr * 0.2} ${rr * 0.78} 0 ${rr}`} strokeWidth={1.1} />
        ))}
      </g>
    </svg>
  );
});
