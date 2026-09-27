import { useState, useEffect } from 'react';
import { strangerAudio } from '../audio/soundEngine';
import { Volume2, VolumeX } from 'lucide-react';

export function AudioController() {
  const [muted, setMuted] = useState(strangerAudio.getIsMuted());

  useEffect(() => {
    const unsub = strangerAudio.subscribe((isMuted) => {
      setMuted(isMuted);
    });
    return () => {
      unsub();
    };
  }, []);

  const handleToggle = () => {
    strangerAudio.toggleMute();
    strangerAudio.playClick();
  };

  return (
    <button
      onClick={handleToggle}
      title={muted ? 'Enable Hawkins 1986 Synth Audio' : 'Mute Audio'}
      className="flex items-center gap-2 px-3 py-1.5 rounded border border-red-900/60 bg-red-950/20 hover:bg-red-950/50 text-red-400 font-mono text-xs tracking-wider transition-all duration-200"
    >
      {muted ? (
        <>
          <VolumeX className="w-3.5 h-3.5 text-red-500" />
          <span className="hidden sm:inline">SYNTH: OFF</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-green-400 animate-pulse" />
          <span className="hidden sm:inline text-green-400">SYNTH: ACTIVE</span>
          <span className="flex items-end gap-0.5 h-3">
            <span className="w-0.5 h-2 bg-green-500 animate-pulse" />
            <span className="w-0.5 h-3 bg-green-500 animate-pulse delay-75" />
            <span className="w-0.5 h-1.5 bg-green-500 animate-pulse delay-150" />
          </span>
        </>
      )}
    </button>
  );
}
