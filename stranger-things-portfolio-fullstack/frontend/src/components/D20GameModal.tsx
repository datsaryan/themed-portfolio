import { useState, useEffect } from 'react';
import { strangerAudio } from '../audio/soundEngine';
import confetti from 'canvas-confetti';
import { X, Dices, Flame, ShieldAlert, Award } from 'lucide-react';

interface D20GameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerRedFlash?: () => void;
}

export function D20GameModal({ isOpen, onClose, onTriggerRedFlash }: D20GameModalProps) {
  const [rolling, setRolling] = useState(false);
  const [rollResult, setRollResult] = useState<number | null>(null);
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleRoll = () => {
    if (rolling) return;
    setRolling(true);
    setRollResult(null);
    strangerAudio.playDiceRoll();

    let counter = 0;
    const interval = setInterval(() => {
      setRollResult(Math.floor(Math.random() * 20) + 1);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        setRollResult(finalRoll);
        setRolling(false);

        if (finalRoll >= 13) {
          // Success! Fireball hits Demogorgon
          strangerAudio.playVictoryFanfare();
          setWins((w) => w + 1);
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 }
          });
        } else {
          // Failure: Demogorgon attacks
          strangerAudio.playDemogorgonRoar();
          if (onTriggerRedFlash) onTriggerRedFlash();
          setLosses((l) => l + 1);
        }
      }
    }, 80);
  };

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="case-file-card rounded-2xl border-2 border-purple-900 bg-[#0d0914] max-w-lg w-full p-6 sm:p-8 relative font-mono text-center shadow-[0_0_50px_rgba(147,51,234,0.3)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-purple-950 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <Dices className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm sm:text-base font-bold text-white tracking-widest uppercase">
              MIKE&apos;S BASEMENT // D&amp;D ENCOUNTER
            </h3>
          </div>
          <button
            onClick={() => {
              strangerAudio.playClick();
              onClose();
            }}
            className="p-1 rounded text-gray-400 hover:text-purple-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Narrative Intro */}
        <p className="text-xs text-gray-400 leading-relaxed mb-6 font-sans">
          &quot;Something is coming. Something hungry for blood. A shadow grows on the wall behind you. <strong className="text-red-400">IT&apos;S THE DEMOGORGON!</strong> Roll a <strong>13 or higher</strong> to cast <strong>Fireball</strong> and banish it!&quot;
        </p>

        {/* The D20 Die Graphic */}
        <div className="my-8 flex justify-center">
          <div
            onClick={handleRoll}
            className={`w-32 h-32 rounded-2xl border-4 flex flex-col items-center justify-center cursor-pointer select-none transition-all duration-200 ${
              rolling
                ? 'rotate-180 scale-95 border-purple-500 bg-purple-950/70 shadow-[0_0_30px_rgba(168,85,247,0.8)]'
                : rollResult && rollResult >= 13
                ? 'border-green-500 bg-green-950/40 text-green-300 shadow-[0_0_30px_rgba(34,197,94,0.6)]'
                : rollResult && rollResult < 13
                ? 'border-red-600 bg-red-950/50 text-red-300 shadow-[0_0_30px_rgba(239,68,68,0.7)]'
                : 'border-purple-600 bg-purple-950/30 text-purple-300 hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
            }`}
          >
            <span className="text-4xl font-extrabold tracking-wider font-mono">
              {rollResult !== null ? rollResult : 'D20'}
            </span>
            <span className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
              {rolling ? 'ROLLING...' : 'CLICK TO ROLL'}
            </span>
          </div>
        </div>

        {/* Outcome Display */}
        {rollResult !== null && !rolling && (
          <div className="mb-6 p-4 rounded-lg border">
            {rollResult >= 13 ? (
              <div className="text-green-400 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-sm font-bold">
                  <Flame className="w-4 h-4 fill-green-400" />
                  CRITICAL HIT! FIREBALL STRIKES! (ROLL: {rollResult})
                </div>
                <p className="text-xs text-gray-300 font-sans">
                  The Demogorgon lets out a deafening screech and dissolves into the darkness. Hawkins is safe once more!
                </p>
              </div>
            ) : (
              <div className="text-red-400 space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-sm font-bold">
                  <ShieldAlert className="w-4 h-4" />
                  ROLL FAILED (ROLL: {rollResult}). THE DEMOGORGON ADVANCES!
                </div>
                <p className="text-xs text-gray-300 font-sans">
                  You rolled under 13. The Demogorgon drags your party into the Upside Down!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleRoll}
          disabled={rolling}
          className="w-full py-3 bg-gradient-to-r from-purple-700 to-red-600 hover:from-purple-600 hover:to-red-500 disabled:opacity-50 text-white font-mono text-xs font-bold tracking-widest rounded-lg shadow-[0_0_20px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2"
        >
          <Dices className="w-4 h-4" />
          {rolling ? 'ROLLING THE D20...' : 'ROLL D20 AGAINST THE BEAST'}
        </button>

        {/* Score Tracker */}
        <div className="mt-6 flex items-center justify-around border-t border-purple-950/70 pt-4 text-xs font-mono text-gray-400">
          <span className="flex items-center gap-1 text-green-400">
            <Award className="w-3.5 h-3.5" /> VICTORIES: {wins}
          </span>
          <span className="text-gray-600">&bull;</span>
          <span className="text-red-400">
            ABDUCTIONS: {losses}
          </span>
        </div>
      </div>
    </div>
  );
}
