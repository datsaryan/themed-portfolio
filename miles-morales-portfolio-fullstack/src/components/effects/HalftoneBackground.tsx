import React, { useMemo } from 'react';

export const HalftoneBackground: React.FC = () => {
  // Generate random rain drops
  const rainDrops = useMemo(() => {
    return Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: `${(i * 2.9) % 100}%`,
      duration: `${1.2 + (i % 5) * 0.3}s`,
      delay: `${(i % 10) * 0.25}s`,
      height: `${20 + (i % 4) * 20}px`,
      opacity: 0.15 + (i % 3) * 0.1,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* 1. Base Dark Void Canvas */}
      <div className="absolute inset-0 bg-void" />

      {/* 2. Comic Halftone Screen Pattern */}
      <div className="absolute inset-0 bg-halftone-dots opacity-40 mix-blend-screen" />

      {/* 3. Subtle Brooklyn Skyline Silhouette at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-96 opacity-25 overflow-hidden">
        <svg
          className="absolute bottom-0 w-full h-full text-ink"
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
          fill="currentColor"
        >
          {/* Distant building blocks */}
          <rect x="0" y="220" width="80" height="180" />
          <rect x="70" y="160" width="60" height="240" />
          <rect x="120" y="240" width="90" height="160" />
          <rect x="200" y="110" width="110" height="290" />
          {/* Spire */}
          <line x1="255" y1="50" x2="255" y2="110" stroke="currentColor" strokeWidth="3" />
          <rect x="300" y="190" width="75" height="210" />
          <rect x="370" y="270" width="95" height="130" />
          <rect x="450" y="140" width="120" height="260" />
          <rect x="560" y="210" width="80" height="190" />
          <rect x="630" y="90" width="100" height="310" />
          <line x1="680" y1="30" x2="680" y2="90" stroke="currentColor" strokeWidth="3" />
          <rect x="720" y="170" width="90" height="230" />
          <rect x="800" y="230" width="110" height="170" />
          <rect x="900" y="130" width="100" height="270" />
          <rect x="990" y="200" width="85" height="200" />
          <rect x="1070" y="260" width="130" height="140" />
        </svg>

        {/* Subtle red/purple city atmospheric rim */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-void via-spider-dark/10 to-transparent" />
      </div>

      {/* 4. Ambient Rain Overlay */}
      <div className="absolute inset-0">
        {rainDrops.map((drop) => (
          <div
            key={drop.id}
            className="rain-drop"
            style={{
              left: drop.left,
              top: '-100px',
              height: drop.height,
              opacity: drop.opacity,
              animationDuration: drop.duration,
              animationDelay: drop.delay,
            }}
          />
        ))}
      </div>

      {/* 5. Subtle Web Strands in the Top Corners */}
      <svg
        className="absolute -top-6 -left-6 w-56 h-56 text-spider/20 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <line x1="0" y1="0" x2="200" y2="0" />
        <line x1="0" y1="0" x2="180" y2="80" />
        <line x1="0" y1="0" x2="140" y2="140" />
        <line x1="0" y1="0" x2="80" y2="180" />
        <line x1="0" y1="0" x2="0" y2="200" />
        <path d="M 50,0 Q 40,20 0,50" />
        <path d="M 100,0 Q 80,40 0,100" />
        <path d="M 150,0 Q 120,60 0,150" />
        <path d="M 200,0 Q 160,80 0,200" />
      </svg>

      <svg
        className="absolute -top-6 -right-6 w-56 h-56 text-venom-purple/20 pointer-events-none rotate-90"
        viewBox="0 0 200 200"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <line x1="0" y1="0" x2="200" y2="0" />
        <line x1="0" y1="0" x2="180" y2="80" />
        <line x1="0" y1="0" x2="140" y2="140" />
        <line x1="0" y1="0" x2="80" y2="180" />
        <line x1="0" y1="0" x2="0" y2="200" />
        <path d="M 50,0 Q 40,20 0,50" />
        <path d="M 100,0 Q 80,40 0,100" />
        <path d="M 150,0 Q 120,60 0,150" />
        <path d="M 200,0 Q 160,80 0,200" />
      </svg>

      {/* 6. Subtle CRT scanline overlay */}
      <div className="absolute inset-0 comic-speed-lines pointer-events-none" />
    </div>
  );
};
