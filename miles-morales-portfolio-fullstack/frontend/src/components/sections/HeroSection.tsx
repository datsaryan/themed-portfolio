import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeData } from '../../data/useResumeData';
import { sound, SongInfo, BGM_TRACK } from '../../audio/soundEngine';
import { ArrowDown, FileText, Send, Radio, Terminal, Zap, Headphones, Play, Pause } from 'lucide-react';

interface HeroSectionProps {
  onTriggerVenom: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onTriggerVenom }) => {
  const { personal } = useResumeData();
  const [audioState, setAudioState] = useState(sound.getState());
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = sound.subscribe((st: { isMuted: boolean; volume: number; isPlaying: boolean; song: SongInfo; usingFile: boolean }) => setAudioState(st));
    return () => unsub();
  }, []);

  const goToMissions = () => {
    sound.playThwip();
    navigate('/projects');
  };

  const goToContact = () => {
    sound.playClick();
    navigate('/contact');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 overflow-hidden">
      {/* Background Spider-Web Stencil & Graffiti Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-5">
        <span className="font-comic text-[22vw] text-spider tracking-tighter uppercase transform -rotate-6">
          SPIDER-MAN
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
        {/* Left Column: Comic Narrative & Typography */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">
          {/* Comic Label Pill & BGM Walkman Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-spider text-white font-mono text-xs font-bold uppercase tracking-wider shadow-comic-black border border-white/20">
              <Radio className="w-3 h-3 animate-pulse" />
              EARTH-1610 TRANSMISSION
            </span>
            <span className="px-2.5 py-1 bg-surface border border-borderDark text-subtext font-mono text-xs">
              SECTOR: WEB ARCHITECTURE
            </span>
          </div>

          {/* Subtitle / Catchphrase */}
          <div className="font-mono text-xs sm:text-sm text-spider font-bold tracking-widest uppercase flex items-center gap-2">
            <span className="inline-block w-8 h-[2px] bg-spider" />
            {personal.tagline}
          </div>

          {/* Main Giant Display Typography */}
          <div className="space-y-1">
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight text-headline uppercase leading-[0.9] select-none">
              <span className="block text-paper">ARYAN</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-spider via-spider-bright to-venom-purple glitch-hover">
                SINGH
              </span>
            </h1>
            <div className="pt-2 font-mono text-base sm:text-lg text-graffiti-yellow font-semibold tracking-wider flex items-center gap-2">
              <Terminal className="w-5 h-5 text-spider" />
              <span>{personal.title}</span>
              <span className="text-subtext/50">|</span>
              <span className="text-xs text-subtext">JAVA // SPRING BOOT // REACT // POSTGRESQL</span>
            </div>
          </div>

          {/* Authentic Resume Summary Paragraph */}
          <div className="relative p-4 sm:p-5 bg-surface/80 border-l-4 border-spider border-y border-r border-borderDark/60 comic-cut">
            <div className="text-[10px] font-mono text-subtext/70 uppercase tracking-widest mb-1.5 flex items-center justify-between">
              <span>// OPERATIVE SPECIFICATION</span>
              <span>B.TECH CSE &bull; OP JINDAL UNIV</span>
            </div>
            <p className="text-sm sm:text-base text-paper/90 leading-relaxed font-sans">
              {personal.summary}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
            <button
              onClick={goToMissions}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-6 py-3.5 bg-spider hover:bg-spider-bright text-white font-mono text-xs uppercase font-bold tracking-widest transition-all shadow-comic-black border border-white/20 hover:translate-x-0.5 hover:-translate-y-0.5"
            >
              <span>EXPLORE MISSIONS</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>

            <a
              href="/Aryan_FullStack_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => sound.playClick()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 bg-surface hover:bg-concrete border border-borderDark hover:border-spider text-headline font-mono text-xs uppercase font-bold tracking-wider transition-all"
            >
              <FileText className="w-4 h-4 text-spider" />
              <span>ACCESS FULL RESUME</span>
            </a>

            <button
              onClick={goToContact}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 bg-transparent hover:bg-surface border border-borderDark text-subtext hover:text-headline font-mono text-xs uppercase font-medium transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>TRANSMIT SIGNAL</span>
            </button>
          </div>

          {/* Miles Morales Walkman Soundtrack Player */}
          <div className="w-full">
            <button
              onClick={() => sound.toggleSong()}
              className="w-full flex items-center justify-between p-3 bg-surface/90 hover:bg-ink border border-spider/60 hover:border-spider text-headline transition-all shadow-comic-black group"
              title={`${audioState.isPlaying ? 'Pause' : 'Play'} ${BGM_TRACK.title} — ${BGM_TRACK.artist}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 border ${audioState.isPlaying ? 'bg-spider border-white text-white' : 'bg-concrete border-borderDark text-spider'}`}>
                  <Headphones className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-mono text-spider font-bold tracking-widest uppercase flex items-center gap-1.5">
                    <span>MILES' SOUNDTRACK // BGM</span>
                    {audioState.isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-spider animate-ping" />}
                  </span>
                  <span className="text-xs sm:text-sm font-display uppercase tracking-wider text-headline group-hover:text-graffiti-yellow">
                    {BGM_TRACK.title} &bull; {BGM_TRACK.artist}
                  </span>
                  <span className="text-[10px] font-mono text-subtext">
                    {BGM_TRACK.soundtrack}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {audioState.isPlaying ? (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-spider text-white font-mono text-xs font-bold uppercase shadow-comic-black">
                    <Pause className="w-3.5 h-3.5 fill-white" />
                    <span className="hidden sm:inline">PAUSE BGM</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-spider text-white font-mono text-xs font-bold uppercase shadow-comic-black">
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span className="hidden sm:inline">PLAY BGM</span>
                  </div>
                )}
              </div>
            </button>
          </div>

          {/* Live Telemetry / Suit Status bar */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-borderDark/60 w-full font-mono text-[11px]">
            <div className="flex flex-col">
              <span className="text-subtext/70">OPERATIONAL STATUS</span>
              <span className="text-headline font-bold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                ACTIVE OPERATIVE
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-subtext/70">SUIT CHARGE</span>
              <button
                onClick={onTriggerVenom}
                className="text-venom-purple hover:underline font-bold flex items-center gap-1 mt-0.5 text-left"
              >
                <Zap className="w-3 h-3 fill-venom-purple" />
                100% (READY)
              </button>
            </div>
            <div className="flex flex-col">
              <span className="text-subtext/70">SYSTEM CORE</span>
              <span className="text-graffiti-yellow font-bold mt-0.5">
                REST &bull; CLOUD &bull; DSA
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Miles Morales Themed Hero Visual Art Frame */}
        <div className="lg:col-span-5 flex justify-center relative">
          {/* Angled Comic Panel Frame */}
          <div className="relative w-full max-w-md bg-ink border-2 border-spider shadow-comic-hard p-4 comic-cut">
            {/* Top Comic Header Tape */}
            <div className="flex items-center justify-between border-b border-borderDark pb-2 mb-3 font-mono text-[10px] text-subtext">
              <span className="text-spider font-bold tracking-widest">// SUIT RECON HUD</span>
              <span className="bg-concrete px-1.5 py-0.5 text-headline">EARTH-1610</span>
            </div>

            {/* Visual Spider-Man Graphic Silhouette & Web Core */}
            <div className="relative w-full aspect-[4/5] bg-surface overflow-hidden border border-borderDark flex items-center justify-center">
              {/* Halftone texture inside frame */}
              <div className="absolute inset-0 bg-halftone-red opacity-30 pointer-events-none" />

              {/* Spider Web Matrix background */}
              <svg
                className="absolute inset-0 w-full h-full text-borderDark/60 pointer-events-none"
                viewBox="0 0 400 500"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <line x1="200" y1="250" x2="0" y2="0" />
                <line x1="200" y1="250" x2="200" y2="0" />
                <line x1="200" y1="250" x2="400" y2="0" />
                <line x1="200" y1="250" x2="400" y2="250" />
                <line x1="200" y1="250" x2="400" y2="500" />
                <line x1="200" y1="250" x2="200" y2="500" />
                <line x1="200" y1="250" x2="0" y2="500" />
                <line x1="200" y1="250" x2="0" y2="250" />
                {/* Web polygons */}
                <polygon points="200,190 235,215 235,265 200,290 165,265 165,215" stroke="rgba(230,36,41,0.3)" />
                <polygon points="200,140 270,180 270,280 200,330 130,280 130,180" stroke="rgba(230,36,41,0.25)" />
                <polygon points="200,80 320,140 320,320 200,400 80,320 80,140" stroke="rgba(230,36,41,0.2)" />
              </svg>

              {/* Miles Morales Mask Silhouette & Iconic Spray Spider */}
              <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center">
                {/* Stylized Miles Spider Mask Eyes SVG */}
                <div className="relative mb-4 w-44 h-28 flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 120"
                    className="w-full h-full filter drop-shadow-[0_0_12px_rgba(255,23,68,0.6)]"
                    fill="none"
                  >
                    {/* Left Eye: Miles sharp angled lens */}
                    <path
                      d="M 25,35 Q 65,20 90,65 Q 60,75 25,35 Z"
                      fill="#f5f5f7"
                      stroke="#e62429"
                      strokeWidth="5"
                    />
                    {/* Right Eye */}
                    <path
                      d="M 175,35 Q 135,20 110,65 Q 140,75 175,35 Z"
                      fill="#f5f5f7"
                      stroke="#e62429"
                      strokeWidth="5"
                    />
                    {/* Eye inner glow accent */}
                    <path d="M 35,38 Q 65,28 82,60" stroke="#ff1f3d" strokeWidth="2" fill="none" />
                    <path d="M 165,38 Q 135,28 118,60" stroke="#ff1f3d" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                {/* Stencil spray spider insignia */}
                <div className="w-24 h-24 relative mb-2">
                  <img
                    src="/assets/spiderman/miles_spider_icon.svg"
                    alt="Miles Morales Spider Spray Insignia"
                    className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(230,36,41,0.7)]"
                  />
                </div>

                {/* Comic Badge text */}
                <div className="bg-void/90 border border-borderDark px-3 py-1 font-mono text-xs text-paper uppercase tracking-wider">
                  TACTICAL DEV IDENTITY
                </div>
                <div className="mt-1 text-[11px] font-mono text-spider font-bold">
                  MILES MORALES SUIT DESIGNATION
                </div>
              </div>

              {/* Bottom Diagonal Tag */}
              <div className="absolute bottom-2 right-2 bg-graffiti-yellow text-void font-comic text-sm px-2 py-0.5 rotate-[-3deg] border border-black shadow-comic-black font-bold">
                SPRING &bull; REACT &bull; DOCKER
              </div>
            </div>

            {/* Frame Footer Data */}
            <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-subtext">
              <span>LAT: 21.8974° N &bull; LON: 83.3950° E</span>
              <span className="text-spider">REST API ENGINE READY</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
