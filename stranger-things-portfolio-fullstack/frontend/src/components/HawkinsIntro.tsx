import { useState, useEffect } from 'react';
import { strangerAudio } from '../audio/soundEngine';

interface HawkinsIntroProps {
  onComplete: () => void;
}

export function HawkinsIntro({ onComplete }: HawkinsIntroProps) {
  const [fading, setFading] = useState(false);
  const [skipped, setSkipped] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleDismiss();
    }, 4500);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    if (skipped) return;
    setSkipped(true);
    setFading(true);
    strangerAudio.playClick();
    setTimeout(() => {
      onComplete();
    }, 800);
  };

  return (
    <div
      onClick={handleDismiss}
      className={`fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-black cursor-pointer select-none transition-opacity duration-700 ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="text-center px-4">
        <p className="font-mono-hawkins text-xs md:text-sm text-red-500 tracking-[0.3em] uppercase mb-4 opacity-75 animate-pulse">
          Hawkins National Laboratory // Archive 1986
        </p>

        <h1 className="stranger-title text-4xl sm:text-6xl md:text-8xl tracking-wider mb-6">
          ARYAN SINGH
        </h1>

        <p className="font-mono-hawkins text-xs md:text-sm text-gray-400 tracking-widest uppercase">
          Full-Stack Dossier &bull; Java &bull; Spring Boot &bull; React
        </p>

        <div className="mt-12 inline-block border border-red-900/60 bg-red-950/30 px-4 py-2 rounded text-red-400 font-mono text-xs tracking-wider animate-bounce">
          CLICK OR PRESS ANYWHERE TO ENTER
        </div>
      </div>
    </div>
  );
}
