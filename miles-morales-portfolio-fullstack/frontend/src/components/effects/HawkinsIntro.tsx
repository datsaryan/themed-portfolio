import React, { useState, useEffect } from 'react';
import { strangerAudio } from '../../audio/soundEngine';

interface HawkinsIntroProps {
  onComplete: () => void;
}

export const HawkinsIntro: React.FC<HawkinsIntroProps> = ({ onComplete }) => {
  const [stage, setStage] = useState<number>(0);
  const [fade, setFade] = useState<boolean>(false);

  useEffect(() => {
    // Check if user has already seen intro in this session
    if (sessionStorage.getItem('stranger_intro_seen') === 'true') {
      onComplete();
      return;
    }

    const t1 = setTimeout(() => setStage(1), 400);   // "HAWKINS, INDIANA"
    const t2 = setTimeout(() => setStage(2), 1600);  // "1986"
    const t3 = setTimeout(() => setStage(3), 2800);  // "AN UNUSUAL SIGNAL HAS BEEN DETECTED."
    const t4 = setTimeout(() => setStage(4), 4200);  // "CONNECTING TO LABORATORY ARCHIVES..."
    const t5 = setTimeout(() => {
      setFade(true);
      setTimeout(() => {
        sessionStorage.setItem('stranger_intro_seen', 'true');
        onComplete();
      }, 700);
    }, 5400);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === ' ') {
        skipIntro();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const skipIntro = () => {
    strangerAudio.playClickSound();
    sessionStorage.setItem('stranger_intro_seen', 'true');
    setFade(true);
    setTimeout(onComplete, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[1000] bg-[#070509] flex flex-col items-center justify-center transition-opacity duration-700 select-none ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background CRT Scanlines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.9)_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        {stage >= 1 && (
          <div className="animate-flicker">
            <span className="text-xs uppercase tracking-[0.35em] text-hawkins-red font-mono font-semibold block mb-2">
              HAWKINS, INDIANA
            </span>
          </div>
        )}

        {stage >= 2 && (
          <div className="text-5xl md:text-7xl font-title text-hawkins-text tracking-widest my-4 stranger-title">
            1986
          </div>
        )}

        {stage >= 3 && (
          <div className="mt-6 text-sm md:text-base font-mono text-hawkins-amber tracking-wider animate-pulse-subtle">
            &gt; AN UNUSUAL SIGNAL HAS BEEN DETECTED.
          </div>
        )}

        {stage >= 4 && (
          <div className="mt-3 text-xs font-mono text-hawkins-crt tracking-widest">
            [ INITIALIZING ARYAN SINGH // FULL STACK DOSSIER ]
          </div>
        )}
      </div>

      {/* Skip Button */}
      <button
        onClick={skipIntro}
        className="absolute bottom-10 right-10 text-xs font-mono tracking-widest text-hawkins-text-muted hover:text-hawkins-red border border-hawkins-border hover:border-hawkins-red px-4 py-2 bg-hawkins-surface/80 rounded transition-all focus:outline-none"
      >
        SKIP SEQUENCE [ESC]
      </button>
    </div>
  );
};
