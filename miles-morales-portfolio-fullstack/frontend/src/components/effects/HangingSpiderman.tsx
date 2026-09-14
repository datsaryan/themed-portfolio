import React, { useCallback, useRef, useState } from 'react';
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

// How far (in SVG viewBox units) the figure can be pulled down.
const MAX_PULL = 55;
// Below this, a release is treated as a simple tap (old click behavior).
const TAP_THRESHOLD = 6;
// Above this, a release counts as a real "pull" and triggers the burst effect.
const MIN_TRIGGER = 18;

export const HangingSpiderman: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quote, setQuote] = useState(MILES_QUOTES[0]);
  const [showSpeech, setShowSpeech] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pull, setPull] = useState(0);
  const [burst, setBurst] = useState<{ y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartY = useRef(0);
  const scaleFactor = useRef(1); // px per viewBox unit

  const fireConfetti = useCallback((intensity: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height * 0.65) / window.innerHeight;

    confetti({
      particleCount: Math.round(24 + intensity * 55),
      spread: 65 + intensity * 30,
      startVelocity: 22 + intensity * 22,
      gravity: 1.1,
      scalar: 0.7,
      ticks: 90,
      colors: ['#e62429', '#f0f0f5', '#00f0ff', '#ffd600'],
      origin: { x: Math.max(0, Math.min(1, originX)), y: Math.max(0, Math.min(1, originY)) },
    });
  }, []);

  const handlePointerDown = (e: React.PointerEvent<SVGGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const rect = svgRef.current?.getBoundingClientRect();
    scaleFactor.current = rect ? rect.width / 100 : 1; // viewBox width is 100
    dragStartY.current = e.clientY;
    setIsDragging(true);
    setShowSpeech(false);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGGElement>) => {
    if (!isDragging) return;
    const deltaPx = e.clientY - dragStartY.current;
    const deltaUnits = deltaPx / scaleFactor.current;
    setPull(Math.max(0, Math.min(MAX_PULL, deltaUnits)));
  };

  const handlePointerUp = (e: React.PointerEvent<SVGGElement>) => {
    if (!isDragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDragging(false);

    const releasedPull = pull;
    setPull(0);
    setIsBouncing(true);
    setTimeout(() => setIsBouncing(false), 750);

    if (releasedPull < TAP_THRESHOLD) {
      // Treat as a simple tap/click
      sound.playClick();
      sound.playThwip();
      setQuote(MILES_QUOTES[quoteIndex % MILES_QUOTES.length]);
      setQuoteIndex((prev) => prev + 1);
      setShowSpeech(true);
      return;
    }

    if (releasedPull >= MIN_TRIGGER) {
      const intensity = Math.min(1, releasedPull / MAX_PULL);
      sound.playThwip();
      if (intensity > 0.75) {
        sound.playVenomZap();
      }
      fireConfetti(intensity);
      setBurst({ y: 90 + releasedPull });
      setTimeout(() => setBurst(null), 650);
      setQuote(RELEASE_QUOTES[Math.floor(Math.random() * RELEASE_QUOTES.length)]);
      setShowSpeech(true);
      setTimeout(() => setShowSpeech(false), 1800);
    }
  };

  const swingClass = isDragging
    ? ''
    : isBouncing
    ? 'animate-spiderman-bungee'
    : 'animate-spiderman-swing';

  return (
    <div
      ref={containerRef}
      className="fixed top-0 left-4 sm:left-8 md:left-12 z-50 pointer-events-auto select-none"
      style={{ transformOrigin: 'top center' }}
    >
      {/* Pendulum Swinging, Drag-to-Pull & Bungee Bounce Container */}
      <div
        className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${swingClass}`}
        style={{ transformOrigin: 'top center' }}
        onMouseEnter={() => !isDragging && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title="Pull Miles down, then let go!"
      >
        <svg
          ref={svgRef}
          viewBox="0 0 100 240"
          className="w-16 sm:w-20 md:w-24 h-auto filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] overflow-visible touch-none"
        >
          {/* Top Anchor Point */}
          <circle cx="50" cy="0" r="3" fill="#e62429" />

          {/* Tensile Spider-Web Line (stretches as you pull) */}
          <line
            x1="50"
            y1="0"
            x2="50"
            y2={75 + pull}
            stroke="#f0f0f5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Web Spiral knots */}
          <circle cx="50" cy={25 + pull * 0.33} r="1.5" fill="#f0f0f5" />
          <circle cx="50" cy={50 + pull * 0.66} r="1.5" fill="#f0f0f5" />

          {/* Web wrap around ankles */}
          <ellipse cx="50" cy={74 + pull} rx="6" ry="3" fill="none" stroke="#f0f0f5" strokeWidth="2" />

          {/* Web release burst, positioned at the release point */}
          {burst && (
            <g
              className="animate-web-burst pointer-events-none"
              style={{ transformOrigin: `50px ${burst.y}px` }}
            >
              {Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x2 = 50 + Math.cos(angle) * 34;
                const y2 = burst.y + Math.sin(angle) * 34;
                return (
                  <line
                    key={i}
                    x1="50"
                    y1={burst.y}
                    x2={x2}
                    y2={y2}
                    stroke={i % 2 === 0 ? '#f0f0f5' : '#e62429'}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                );
              })}
              <circle cx="50" cy={burst.y} r="6" fill="none" stroke="#00f0ff" strokeWidth="2" />
            </g>
          )}

          {/* Spider-Man Group (Upside Down, draggable) */}
          <g
            transform={`translate(0, ${70 + pull})`}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            role="button"
            tabIndex={0}
            aria-label="Upside-down hanging Miles Morales Spider-Man. Drag down and release for a web-release effect."
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                sound.playClick();
                sound.playThwip();
                setQuote(MILES_QUOTES[quoteIndex % MILES_QUOTES.length]);
                setQuoteIndex((prev) => prev + 1);
                setShowSpeech(true);
                setIsBouncing(true);
                setTimeout(() => setIsBouncing(false), 750);
              }
            }}
          >
            {/* Left Thigh & Shin */}
            <path
              d="M 47,4 L 38,20 L 44,38 L 47,44"
              fill="none"
              stroke="#0a0a0e"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 47,4 L 38,20 L 44,38 L 47,44"
              fill="none"
              stroke="#e62429"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Right Thigh & Shin */}
            <path
              d="M 53,4 L 62,20 L 56,38 L 53,44"
              fill="none"
              stroke="#0a0a0e"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 53,4 L 62,20 L 56,38 L 53,44"
              fill="none"
              stroke="#e62429"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Torso (Upside Down, V-Shape towards waist) */}
            <path
              d="M 42,42 L 58,42 L 64,75 L 36,75 Z"
              fill="#0d0e14"
              stroke="#e62429"
              strokeWidth="1.5"
            />

            {/* Miles Red Spider Emblem on Chest (Upside Down) */}
            <g transform="translate(50, 60)">
              <ellipse cx="0" cy="0" rx="3.5" ry="6" fill="#e62429" />
              {/* Spider Legs */}
              <path d="M -3,-3 Q -10,-8 -12,2" stroke="#e62429" strokeWidth="1.6" fill="none" />
              <path d="M 3,-3 Q 10,-8 12,2" stroke="#e62429" strokeWidth="1.6" fill="none" />
              <path d="M -3,2 Q -11,8 -10,14" stroke="#e62429" strokeWidth="1.6" fill="none" />
              <path d="M 3,2 Q 11,8 10,14" stroke="#e62429" strokeWidth="1.6" fill="none" />
            </g>

            {/* Arms (Relaxed / Folded across chest) */}
            {/* Left Arm */}
            <path
              d="M 36,70 Q 25,75 30,90 Q 38,98 46,88"
              fill="none"
              stroke="#0a0a0e"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 36,70 Q 25,75 30,90 Q 38,98 46,88"
              fill="none"
              stroke="#e62429"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Right Arm */}
            <path
              d="M 64,70 Q 75,75 70,90 Q 62,98 54,88"
              fill="none"
              stroke="#0a0a0e"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 64,70 Q 75,75 70,90 Q 62,98 54,88"
              fill="none"
              stroke="#e62429"
              strokeWidth="2"
              strokeLinecap="round"
            />

            {/* Head / Mask (Upside Down at bottom) */}
            <path
              d="M 40,84 C 36,92 38,114 50,118 C 62,114 64,92 60,84 C 55,78 45,78 40,84 Z"
              fill="#08080c"
              stroke="#e62429"
              strokeWidth="2"
            />

            {/* Mask Web Pattern */}
            <line x1="50" y1="80" x2="50" y2="116" stroke="#252736" strokeWidth="1" />
            <path d="M 40,92 Q 50,96 60,92" stroke="#252736" strokeWidth="1" fill="none" />
            <path d="M 42,104 Q 50,108 58,104" stroke="#252736" strokeWidth="1" fill="none" />

            {/* Expressive Mask Eyes (Upside down, angled lenses) */}
            {/* Left Eye */}
            <path
              d="M 42,95 Q 46,90 48,102 Q 44,106 42,95 Z"
              fill="#ffffff"
              stroke="#e62429"
              strokeWidth="1.8"
              className={`transition-all duration-200 ${isHovered || isDragging ? 'filter drop-shadow-[0_0_4px_#ff1744]' : ''}`}
            />
            {/* Right Eye */}
            <path
              d="M 58,95 Q 54,90 52,102 Q 56,106 58,95 Z"
              fill="#ffffff"
              stroke="#e62429"
              strokeWidth="1.8"
              className={`transition-all duration-200 ${isHovered || isDragging ? 'filter drop-shadow-[0_0_4px_#ff1744]' : ''}`}
            />
          </g>
        </svg>
      </div>

      {/* Comic Speech Bubble */}
      {(showSpeech || (isHovered && !isDragging)) && (
        <div className="absolute top-28 left-16 sm:left-20 md:left-24 z-50 animate-web-burst pointer-events-none w-max max-w-[200px]">
          <div className="relative bg-graffiti-yellow text-void border-2 border-black font-comic text-sm px-3 py-1.5 shadow-comic-black leading-tight tracking-wide">
            {showSpeech ? quote : MILES_QUOTES[quoteIndex % MILES_QUOTES.length]}
            {/* Speech bubble pointer arrow */}
            <div className="absolute top-3 -left-2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-black border-b-[6px] border-b-transparent" />
            <div className="absolute top-3 -left-1.5 w-0 h-0 border-t-[5px] border-t-transparent border-r-[7px] border-r-graffiti-yellow border-b-[5px] border-b-transparent" />
          </div>
        </div>
      )}
    </div>
  );
};
