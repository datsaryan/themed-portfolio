import React, { useState } from 'react';
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

export const HangingSpiderman: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showSpeech, setShowSpeech] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    sound.playThwip();

    setIsBouncing(true);
    setShowSpeech(true);
    setQuoteIndex((prev) => (prev + 1) % MILES_QUOTES.length);

    setTimeout(() => {
      setIsBouncing(false);
    }, 750);
  };

  return (
    <div
      className="fixed top-0 left-4 sm:left-8 md:left-12 z-50 pointer-events-auto select-none"
      style={{ transformOrigin: 'top center' }}
    >
      {/* Pendulum Swinging & Bungee Bounce Container */}
      <div
        className={`cursor-pointer transition-transform duration-300 ${
          isBouncing ? 'animate-spiderman-bungee' : 'animate-spiderman-swing'
        }`}
        style={{ transformOrigin: 'top center' }}
        onClick={handleClick}
        onMouseEnter={() => {
          setIsHovered(true);
          setShowSpeech(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowSpeech(false);
        }}
        title="Click to swing with Miles!"
        role="button"
        tabIndex={0}
        aria-label="Upside-down hanging Miles Morales Spider-Man"
      >
        <svg
          viewBox="0 0 100 240"
          className="w-16 sm:w-20 md:w-24 h-auto filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] overflow-visible"
        >
          {/* Top Anchor Point */}
          <circle cx="50" cy="0" r="3" fill="#e62429" />

          {/* Tensile Spider-Web Line */}
          <line
            x1="50"
            y1="0"
            x2="50"
            y2="75"
            stroke="#f0f0f5"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Web Spiral knots */}
          <circle cx="50" cy="25" r="1.5" fill="#f0f0f5" />
          <circle cx="50" cy="50" r="1.5" fill="#f0f0f5" />

          {/* Web wrap around ankles */}
          <ellipse cx="50" cy="74" rx="6" ry="3" fill="none" stroke="#f0f0f5" strokeWidth="2" />

          {/* Spider-Man Group (Upside Down) */}
          <g transform="translate(0, 70)">
            {/* Legs (bent at knees, ankles holding web) */}
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
              className={`transition-all duration-200 ${isHovered ? 'filter drop-shadow-[0_0_4px_#ff1744]' : ''}`}
            />
            {/* Right Eye */}
            <path
              d="M 58,95 Q 54,90 52,102 Q 56,106 58,95 Z"
              fill="#ffffff"
              stroke="#e62429"
              strokeWidth="1.8"
              className={`transition-all duration-200 ${isHovered ? 'filter drop-shadow-[0_0_4px_#ff1744]' : ''}`}
            />
          </g>
        </svg>
      </div>

      {/* Comic Speech Bubble */}
      {(showSpeech || isHovered) && (
        <div className="absolute top-28 left-16 sm:left-20 md:left-24 z-50 animate-web-burst pointer-events-none w-max max-w-[200px]">
          <div className="relative bg-graffiti-yellow text-void border-2 border-black font-comic text-sm px-3 py-1.5 shadow-comic-black leading-tight tracking-wide">
            {MILES_QUOTES[quoteIndex]}
            {/* Speech bubble pointer arrow */}
            <div className="absolute top-3 -left-2 w-0 h-0 border-t-[6px] border-t-transparent border-r-[8px] border-r-black border-b-[6px] border-b-transparent" />
            <div className="absolute top-3 -left-1.5 w-0 h-0 border-t-[5px] border-t-transparent border-r-[7px] border-r-graffiti-yellow border-b-[5px] border-b-transparent" />
          </div>
        </div>
      )}
    </div>
  );
};
