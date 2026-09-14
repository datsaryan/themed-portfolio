import React, { useEffect, useState } from 'react';
import { sound } from '../../audio/soundEngine';
import { Zap } from 'lucide-react';

interface VenomBlastOverlayProps {
  active: boolean;
  onComplete: () => void;
}

export const VenomBlastOverlay: React.FC<VenomBlastOverlayProps> = ({ active, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      sound.playVenomZap();
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [active, onComplete]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center overflow-hidden"
      role="alert"
      aria-live="assertive"
    >
      {/* Venom Flash Screen */}
      <div className="absolute inset-0 bg-venom-purple/30 animate-pulse mix-blend-screen" />
      <div className="absolute inset-0 bg-spider/20 animate-ping mix-blend-overlay" />

      {/* Spider-Web Lightning Arcs SVG */}
      <svg
        className="absolute inset-0 w-full h-full text-venom-purple filter drop-shadow-[0_0_15px_#c026d3]"
        viewBox="0 0 1000 1000"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      >
        <path d="M500 500 L300 200 L250 150 L100 50" />
        <path d="M500 500 L700 220 L800 180 L950 80" />
        <path d="M500 500 L850 600 L950 750" />
        <path d="M500 500 L750 850 L800 950" />
        <path d="M500 500 L250 800 L150 900" />
        <path d="M500 500 L150 550 L50 650" />
      </svg>

      {/* Comic Impact Callout */}
      <div className="relative z-10 flex flex-col items-center animate-bounce">
        <div className="flex items-center gap-2 bg-graffiti-yellow text-void font-comic text-4xl sm:text-6xl px-6 py-2 rotate-[-4deg] border-4 border-black shadow-comic-hard">
          <Zap className="w-8 h-8 fill-void" />
          BZZZZT!
        </div>
        <div className="mt-2 bg-venom-purple text-white font-mono text-xs sm:text-sm px-4 py-1 uppercase tracking-widest border border-white">
          BIO-ELECTRIC VENOM DISCHARGE // 100%
        </div>
      </div>
    </div>
  );
};
