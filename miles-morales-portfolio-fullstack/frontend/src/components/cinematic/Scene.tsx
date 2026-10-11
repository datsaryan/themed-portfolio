/**
 * Static SVG defs (gradients/filters) + the night-city backdrop. The
 * skyline/moon/window-lights don't need per-frame updates, so this is a
 * plain memo-friendly component; only the figures/camera/particles above it
 * are driven imperatively.
 */
export function SceneDefs() {
  return (
    <defs>
      <linearGradient id="cinSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#050308" />
        <stop offset="55%" stopColor="#0b0a16" />
        <stop offset="100%" stopColor="#1c0f22" />
      </linearGradient>
      <radialGradient id="cinRedGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#e62429" stopOpacity="0.28" />
        <stop offset="100%" stopColor="#e62429" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="cinVenomGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#a855f7" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cinMilesSuit" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#ff3b45" /><stop offset="100%" stopColor="#8f0e14" />
      </linearGradient>
      <linearGradient id="cinMilesMask" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ff4b53" /><stop offset="100%" stopColor="#a3131a" />
      </linearGradient>
      <linearGradient id="cinGwenCoat" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#dce8ff" /><stop offset="100%" stopColor="#5f7bb8" />
      </linearGradient>
      <linearGradient id="cinHair" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffd76b" /><stop offset="100%" stopColor="#b8862f" />
      </linearGradient>
      <filter id="cinGlow" x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <filter id="cinWebGlow" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="1.4" />
      </filter>
      <filter id="cinSoftShadow" x="-40%" y="-40%" width="180%" height="180%">
        <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000" floodOpacity="0.45" />
      </filter>
      <pattern id="cinHalftone" width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="7" cy="7" r="1.4" fill="#e62429" opacity="0.18" />
      </pattern>
    </defs>
  );
}

/** City skyline + moon + lit windows, positioned in stage units (0..1000, y grows down). */
export function SceneBackdrop() {
  return (
    <g>
      <rect x={-200} y={-1000} width={1400} height={2400} fill="url(#cinSky)" />
      <circle cx={170} cy={-100} r={110} fill="#eef5ff" opacity={0.85} />
      <circle cx={170} cy={-100} r={190} fill="#a9c4e6" opacity={0.16} />
      <circle cx={880} cy={150} r={300} fill="url(#cinRedGlow)" />
      <circle cx={330} cy={620} r={340} fill="url(#cinVenomGlow)" />

      <g opacity={0.5} fill="#0a0c16">
        <polygon points="-200,1400 -200,760 -120,760 -120,660 -20,660 -20,780 80,780 80,700 180,700 180,860 300,860 300,780 380,780 380,1400" />
        <polygon points="1200,1400 1200,700 1100,700 1100,600 1000,600 1000,720 900,720 900,630 800,630 800,780 700,780 700,1400" />
      </g>
      <g fill="#04050a">
        <polygon points="-200,1400 -200,600 -80,600 -80,470 60,470 60,560 160,560 160,400 300,400 300,540 420,540 420,1400" />
        <polygon points="820,1400 820,540 940,540 940,380 1080,380 1080,500 1200,500 1200,1400" />
      </g>
      <g fill="#ffd15c" opacity={0.85}>
        <rect x={-40} y={660} width={9} height={13} /> <rect x={-6} y={660} width={9} height={13} />
        <rect x={80} y={520} width={9} height={13} /> <rect x={140} y={520} width={9} height={13} />
        <rect x={280} y={460} width={9} height={13} /> <rect x={320} y={460} width={9} height={13} opacity={0.5} />
        <rect x={860} y={600} width={9} height={13} opacity={0.6} /> <rect x={960} y={440} width={9} height={13} />
        <rect x={1040} y={420} width={9} height={13} opacity={0.55} /> <rect x={1120} y={540} width={9} height={13} />
      </g>
      <rect x={-200} y={930} width={1400} height={120} fill="#020203" />
      <rect x={-200} y={930} width={1400} height={4} fill="#e62429" opacity={0.35} />
    </g>
  );
}
