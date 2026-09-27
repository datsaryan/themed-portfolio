import { useState, useEffect, useRef } from 'react';
import { strangerAudio } from '../audio/soundEngine';
import { Lightbulb, Play, RotateCcw, Sparkles, Volume2 } from 'lucide-react';

const ALPHABET_ROWS = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  ['I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'],
  ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
];

const BULB_COLORS: Record<string, { color: string; glowClass: string; hex: string; freq: number }> = {
  A: { color: 'yellow', glowClass: 'bulb-lit-yellow', hex: '#ffe600', freq: 261.63 },
  B: { color: 'blue', glowClass: 'bulb-lit-blue', hex: '#00d4ff', freq: 293.66 },
  C: { color: 'green', glowClass: 'bulb-lit-green', hex: '#00ff66', freq: 329.63 },
  D: { color: 'red', glowClass: 'bulb-lit-red', hex: '#ff2a2a', freq: 349.23 },
  E: { color: 'purple', glowClass: 'bulb-lit-purple', hex: '#e600ff', freq: 392.00 },
  F: { color: 'orange', glowClass: 'bulb-lit-orange', hex: '#ff7700', freq: 440.00 },
  G: { color: 'yellow', glowClass: 'bulb-lit-yellow', hex: '#ffe600', freq: 493.88 },
  H: { color: 'blue', glowClass: 'bulb-lit-blue', hex: '#00d4ff', freq: 523.25 },

  I: { color: 'green', glowClass: 'bulb-lit-green', hex: '#00ff66', freq: 277.18 },
  J: { color: 'red', glowClass: 'bulb-lit-red', hex: '#ff2a2a', freq: 311.13 },
  K: { color: 'purple', glowClass: 'bulb-lit-purple', hex: '#e600ff', freq: 369.99 },
  L: { color: 'orange', glowClass: 'bulb-lit-orange', hex: '#ff7700', freq: 415.30 },
  M: { color: 'yellow', glowClass: 'bulb-lit-yellow', hex: '#ffe600', freq: 466.16 },
  N: { color: 'blue', glowClass: 'bulb-lit-blue', hex: '#00d4ff', freq: 554.37 },
  O: { color: 'green', glowClass: 'bulb-lit-green', hex: '#00ff66', freq: 587.33 },
  P: { color: 'red', glowClass: 'bulb-lit-red', hex: '#ff2a2a', freq: 659.25 },
  Q: { color: 'purple', glowClass: 'bulb-lit-purple', hex: '#e600ff', freq: 698.46 },

  R: { color: 'red', glowClass: 'bulb-lit-red', hex: '#ff2a2a', freq: 349.23 },
  S: { color: 'orange', glowClass: 'bulb-lit-orange', hex: '#ff7700', freq: 392.00 },
  T: { color: 'yellow', glowClass: 'bulb-lit-yellow', hex: '#ffe600', freq: 440.00 },
  U: { color: 'red', glowClass: 'bulb-lit-red', hex: '#ff2a2a', freq: 493.88 },
  V: { color: 'blue', glowClass: 'bulb-lit-blue', hex: '#00d4ff', freq: 523.25 },
  W: { color: 'green', glowClass: 'bulb-lit-green', hex: '#00ff66', freq: 587.33 },
  X: { color: 'purple', glowClass: 'bulb-lit-purple', hex: '#e600ff', freq: 659.25 },
  Y: { color: 'orange', glowClass: 'bulb-lit-orange', hex: '#ff7700', freq: 698.46 },
  Z: { color: 'yellow', glowClass: 'bulb-lit-yellow', hex: '#ffe600', freq: 783.99 },
};

interface ChristmasLightsWallProps {
  onTriggerRedFlash?: () => void;
}

export function ChristmasLightsWall({ onTriggerRedFlash }: ChristmasLightsWallProps) {
  const [litLetter, setLitLetter] = useState<string | null>(null);
  const [customText, setCustomText] = useState('');
  const [isPlayingSequence, setIsPlayingSequence] = useState(false);
  const [transcript, setTranscript] = useState<string[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  };

  useEffect(() => {
    return () => clearAllTimeouts();
  }, []);

  // Keyboard typing listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      const char = e.key.toUpperCase();
      if (BULB_COLORS[char]) {
        lightUpLetter(char);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const lightUpLetter = (letter: string) => {
    setLitLetter(letter);
    const config = BULB_COLORS[letter];
    if (config) {
      strangerAudio.playChristmasBulb(config.freq);
    }
    setTranscript((prev) => [...prev.slice(-12), letter]);

    setTimeout(() => {
      setLitLetter((current) => (current === letter ? null : current));
    }, 450);
  };

  const playWord = (word: string, onDone?: () => void) => {
    clearAllTimeouts();
    setIsPlayingSequence(true);
    setTranscript([]);

    const clean = word.toUpperCase().replace(/[^A-Z ]/g, '');
    let delay = 0;

    clean.split('').forEach((char, idx) => {
      if (char === ' ') {
        delay += 600;
        return;
      }

      const t1 = setTimeout(() => {
        setLitLetter(char);
        const config = BULB_COLORS[char];
        if (config) {
          strangerAudio.playChristmasBulb(config.freq);
        }
        setTranscript((prev) => [...prev, char]);
      }, delay);

      const t2 = setTimeout(() => {
        setLitLetter(null);
      }, delay + 500);

      timeoutRef.current.push(t1, t2);
      delay += 750;
    });

    const finishTimeout = setTimeout(() => {
      setIsPlayingSequence(false);
      setLitLetter(null);
      if (onDone) onDone();
    }, delay + 400);

    timeoutRef.current.push(finishTimeout);
  };

  const handleRunTransmission = () => {
    playWord('RUN', () => {
      // Climax of the RUN scene: all lights go berserk and flash red!
      strangerAudio.playDemogorgonRoar();
      if (onTriggerRedFlash) onTriggerRedFlash();
      let flashes = 0;
      const interval = setInterval(() => {
        setLitLetter(flashes % 2 === 0 ? 'R' : 'N');
        flashes++;
        if (flashes > 8) {
          clearInterval(interval);
          setLitLetter(null);
        }
      }, 90);
    });
  };

  return (
    <section id="christmas-lights" className="py-20 relative z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-950/40 border border-yellow-700/60 rounded text-yellow-400 font-mono text-xs tracking-widest uppercase mb-3 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            SECRET EASTER EGG // JOYCE'S LIVING ROOM CONDUIT
          </div>
          <h2 className="stranger-title text-3xl sm:text-5xl font-bold tracking-wider">
            THE CHRISTMAS LIGHTS WALL
          </h2>
          <p className="text-gray-400 font-mono text-xs mt-3 max-w-xl mx-auto">
            Will Byers is communicating from the Upside Down. Click any bulb, press keys on your keyboard, or transmit custom secret messages through the living room wallpaper.
          </p>
          <div className="w-24 h-0.5 bg-yellow-600 mx-auto mt-4" />
        </div>

        {/* Vintage Floral Wallpaper Board */}
        <div className="case-file-card rounded-2xl p-6 sm:p-10 border-2 border-yellow-950/80 bg-gradient-to-b from-[#1c140f] via-[#140e0b] to-[#0d0908] relative overflow-hidden shadow-[0_15px_50px_rgba(0,0,0,0.85)]">
          {/* Subtle wallpaper floral pattern overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#ffe600_1px,transparent_1px)] [background-size:24px_24px]" />

          {/* Wire String Lines */}
          <div className="relative space-y-10 sm:space-y-14 my-4">
            {ALPHABET_ROWS.map((row, rowIdx) => (
              <div key={rowIdx} className="relative">
                {/* Wobbly String Wire */}
                <div className="absolute top-4 left-0 right-0 h-1 bg-gray-900 border-t border-gray-700/60 rounded-full" />

                {/* Bulbs and Painted Letters */}
                <div className="relative flex justify-around items-center pt-2">
                  {row.map((char) => {
                    const info = BULB_COLORS[char];
                    const isLit = litLetter === char;

                    return (
                      <div
                        key={char}
                        onClick={() => !isPlayingSequence && lightUpLetter(char)}
                        className="flex flex-col items-center group cursor-pointer select-none transition-transform duration-150 active:scale-95"
                      >
                        {/* Bulb socket */}
                        <div className="w-2.5 h-2.5 bg-gray-800 border border-gray-600 rounded-sm mb-0.5" />

                        {/* Christmas Light Bulb */}
                        <div
                          className={`w-5 h-7 sm:w-7 sm:h-9 rounded-full transition-all duration-150 relative ${
                            isLit
                              ? `${info.glowClass} scale-125 z-20`
                              : 'opacity-40 hover:opacity-85'
                          }`}
                          style={{
                            backgroundColor: isLit ? info.hex : `${info.hex}33`,
                            border: `2px solid ${isLit ? '#ffffff' : info.hex}`,
                            boxShadow: isLit ? `0 0 25px ${info.hex}, 0 0 45px ${info.hex}` : 'none'
                          }}
                        >
                          {/* Inner glowing filament */}
                          {isLit && (
                            <div className="absolute inset-1 rounded-full bg-white/70 blur-[1px]" />
                          )}
                        </div>

                        {/* Hand-painted Black Letters on Wallpaper */}
                        <span
                          className={`font-serif text-2xl sm:text-4xl font-extrabold mt-3 tracking-wider transition-all duration-200 select-none ${
                            isLit
                              ? 'text-yellow-200 scale-110 drop-shadow-[0_0_12px_rgba(255,230,0,0.8)]'
                              : 'text-gray-400 group-hover:text-gray-200'
                          }`}
                          style={{
                            fontFamily: '"Cinzel Decorative", cursive, serif'
                          }}
                        >
                          {char}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Transcript / Received Signal Strip */}
          <div className="mt-10 border-t border-yellow-950/60 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="font-mono text-xs text-yellow-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-yellow-400" />
                RECEIVED SIGNAL:
              </span>
              <div className="font-mono text-sm tracking-[0.25em] bg-black/60 px-4 py-1.5 rounded border border-yellow-900/60 text-yellow-300 min-w-[140px] text-center font-bold">
                {transcript.length > 0 ? transcript.join('') : '...'}
              </div>
            </div>

            {/* Quick Iconic Transmissions */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-gray-500">SIGNALS:</span>
              <button
                onClick={handleRunTransmission}
                disabled={isPlayingSequence}
                className="px-3 py-1 rounded bg-red-950/70 border border-red-600 text-red-300 hover:bg-red-900 hover:text-white font-mono text-xs font-bold tracking-widest transition-all shadow-[0_0_12px_rgba(255,0,0,0.4)] disabled:opacity-50"
              >
                &quot;RUN&quot;
              </button>
              <button
                onClick={() => playWord('HELP ME')}
                disabled={isPlayingSequence}
                className="px-3 py-1 rounded bg-yellow-950/50 border border-yellow-700/60 text-yellow-300 hover:bg-yellow-900/60 font-mono text-xs tracking-wider transition-all disabled:opacity-50"
              >
                &quot;HELP ME&quot;
              </button>
              <button
                onClick={() => playWord('RIGHT HERE')}
                disabled={isPlayingSequence}
                className="px-3 py-1 rounded bg-blue-950/50 border border-blue-700/60 text-blue-300 hover:bg-blue-900/60 font-mono text-xs tracking-wider transition-all disabled:opacity-50"
              >
                &quot;RIGHT HERE&quot;
              </button>
              <button
                onClick={() => playWord('ARYAN')}
                disabled={isPlayingSequence}
                className="px-3 py-1 rounded bg-purple-950/50 border border-purple-700/60 text-purple-300 hover:bg-purple-900/60 font-mono text-xs tracking-wider transition-all disabled:opacity-50"
              >
                &quot;ARYAN&quot;
              </button>
              <button
                onClick={() => playWord('DEMOGORGON', () => strangerAudio.playDemogorgonRoar())}
                disabled={isPlayingSequence}
                className="px-3 py-1 rounded bg-red-950/50 border border-red-900 text-red-400 hover:bg-red-900/50 font-mono text-xs tracking-wider transition-all disabled:opacity-50"
              >
                &quot;DEMOGORGON&quot;
              </button>
            </div>
          </div>

          {/* Custom Message Transmitter Input */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              maxLength={24}
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Type any message to transmit across dimensions (e.g. ELEVEN)..."
              disabled={isPlayingSequence}
              className="w-full bg-black/70 border border-yellow-900/50 focus:border-yellow-500 rounded px-4 py-2 font-mono text-xs text-yellow-200 placeholder-gray-600 focus:outline-none"
            />
            <button
              onClick={() => {
                if (customText.trim()) playWord(customText);
              }}
              disabled={isPlayingSequence || !customText.trim()}
              className="w-full sm:w-auto px-5 py-2 rounded bg-yellow-600 hover:bg-yellow-500 disabled:opacity-40 text-black font-mono text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(255,230,0,0.3)] shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              TRANSMIT
            </button>
            {transcript.length > 0 && (
              <button
                onClick={() => {
                  clearAllTimeouts();
                  setTranscript([]);
                  setLitLetter(null);
                  setIsPlayingSequence(false);
                }}
                className="p-2 text-gray-500 hover:text-gray-300 transition-colors"
                title="Reset Lights Wall"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
