import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Play, Pause, Radio } from 'lucide-react';
import { strangerAudio } from '../../audio/soundEngine';
import { WorldMode } from '../../types/portfolio';

interface AudioControllerProps {
  world: WorldMode;
}

export const AudioController: React.FC<AudioControllerProps> = ({ world }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [showSlider, setShowSlider] = useState(false);

  useEffect(() => {
    const update = () => {
      const state = strangerAudio.getState();
      setIsPlaying(state.isPlaying);
      setIsMuted(state.isMuted);
      setVolume(state.volume);
    };
    update();
    const unsubscribe = strangerAudio.subscribe(update);
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    strangerAudio.updateWorldAtmosphere(world);
  }, [world]);

  const handleTogglePlay = () => {
    strangerAudio.playClickSound();
    strangerAudio.toggle();
  };

  const handleToggleMute = () => {
    strangerAudio.playClickSound();
    strangerAudio.toggleMute();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    strangerAudio.setVolume(val);
  };

  return (
    <div className="relative flex items-center gap-1.5 bg-hawkins-surface/80 border border-hawkins-border px-2.5 py-1.5 rounded text-xs font-mono text-hawkins-text-muted">
      <Radio className={`w-3.5 h-3.5 ${isPlaying ? 'text-hawkins-red animate-pulse' : 'text-hawkins-text-dim'}`} />

      {/* Play / Pause Toggle */}
      <button
        onClick={handleTogglePlay}
        className="p-1 hover:text-hawkins-red focus:outline-none transition-colors"
        title={isPlaying ? 'Pause Audio Atmosphere' : 'Play 1980s Ambient Drone'}
        aria-label={isPlaying ? 'Pause Audio' : 'Play Audio'}
      >
        {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
      </button>

      {/* Mute Toggle */}
      <button
        onClick={handleToggleMute}
        className="p-1 hover:text-hawkins-amber focus:outline-none transition-colors"
        title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
        aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
      >
        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-hawkins-text-dim" /> : <Volume2 className="w-3.5 h-3.5" />}
      </button>

      {/* Volume Control Trigger */}
      <div
        className="relative flex items-center"
        onMouseEnter={() => setShowSlider(true)}
        onMouseLeave={() => setShowSlider(false)}
      >
        <span className="cursor-pointer text-[10px] uppercase tracking-wider text-hawkins-text-dim hover:text-hawkins-text">
          {isPlaying ? (isMuted ? 'MUTED' : `${Math.round(volume * 100)}%`) : 'AUDIO OFF'}
        </span>

        {showSlider && (
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-hawkins-card border border-hawkins-border shadow-case-file rounded flex flex-col items-center gap-1 w-28 z-50">
            <span className="text-[9px] text-hawkins-amber tracking-wider">OUTPUT GAIN</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-hawkins-red cursor-pointer"
            />
          </div>
        )}
      </div>
    </div>
  );
};
