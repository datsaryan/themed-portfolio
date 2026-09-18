import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, Zap, Menu, X, FileDown, Music, Play, Pause } from 'lucide-react';
import { sound, SongInfo, BGM_TRACK } from '../../audio/soundEngine';
import { WebShooterToggle } from '../effects/WebShooterToggle';

interface NavbarProps {
  onTriggerVenom: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onTriggerVenom }) => {
  const [audioState, setAudioState] = useState(sound.getState());
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showVolumePopup, setShowVolumePopup] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = sound.subscribe((st: { isMuted: boolean; volume: number; isPlaying: boolean; song: SongInfo; usingFile: boolean }) => setAudioState(st));
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      unsub();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { label: 'ORIGIN', to: '/about', badge: '01' },
    { label: 'SUIT SPECS', to: '/skills', badge: '02' },
    { label: 'MISSIONS', to: '/projects', badge: '03' },
    { label: 'TIMELINE', to: '/timeline', badge: '04' },
    { label: 'COMMS', to: '/contact', badge: '05' },
  ];

  const handleNavClick = (to: string) => {
    sound.playClick();
    setMobileMenuOpen(false);
    navigate(to);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-void/90 backdrop-blur-md border-b border-borderDark py-2 shadow-2xl'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Spider Mark Logo & Identity */}
        <Link
          to="/"
          onClick={() => sound.playThwip()}
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="relative w-10 h-10 flex items-center justify-center bg-surface border border-spider group-hover:border-spider-bright transition-colors shadow-comic-black">
            {/* Miles spray spider icon */}
            <img
              src="/assets/spiderman/miles_spider_icon.svg"
              alt="Miles Morales Spider Mark"
              className="w-7 h-7 group-hover:scale-110 transition-transform"
            />
            {/* Corner tick */}
            <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-spider animate-ping" />
          </div>

          <div className="flex flex-col">
            <span className="font-display text-lg tracking-wider text-headline group-hover:text-spider transition-colors">
              ARYAN SINGH
            </span>
            <span className="font-mono text-[10px] text-subtext tracking-widest uppercase">
              EARTH-1610 // SUIT HUD
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 bg-surface/70 border border-borderDark/80 px-3 py-1.5 rounded-none">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <button
                key={item.label}
                onClick={() => handleNavClick(item.to)}
                className={`relative px-3 py-1.5 text-xs font-mono font-medium transition-colors group flex items-center gap-1.5 ${
                  isActive ? 'text-headline' : 'text-subtext hover:text-headline'
                }`}
              >
                <span className={`text-[10px] font-bold ${isActive ? 'text-spider' : 'text-spider/70 group-hover:text-spider'}`}>
                  {item.badge}
                </span>
                <span>{item.label}</span>
                <span
                  className={`absolute bottom-0 left-3 right-3 h-[2px] bg-spider transition-transform origin-left ${
                    isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* HUD Controls (Audio, Venom charge, Resume) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Web Shooter: fires a web across the screen and swaps the palette */}
          <WebShooterToggle />

          {/* Venom Charge Meter / Easter Egg Trigger */}
          <button
            onClick={() => {
              sound.playVenomBuzz();
              onTriggerVenom();
            }}
            title="Bio-Electric Venom Charge (Press 'V' or Click)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface/90 hover:bg-venom-dark border border-venom-purple/60 text-venom-purple hover:text-white transition-all text-xs font-mono font-semibold"
          >
            <Zap className="w-3.5 h-3.5 fill-venom-purple animate-pulse" />
            <span className="hidden sm:inline">VENOM</span>
            <span className="bg-venom-purple/20 px-1 py-0.2 text-[10px] text-headline">100%</span>
          </button>

          {/* Miles Morales BGM Song Controller */}
          <div className="relative">
            <button
              onClick={() => sound.toggleSong()}
              onMouseEnter={() => setShowVolumePopup(true)}
              title={audioState.isPlaying ? `Pause ${BGM_TRACK.title}` : `Play ${BGM_TRACK.title} (${BGM_TRACK.artist})`}
              className={`flex items-center gap-2 px-2.5 py-1.5 border transition-all text-xs font-mono ${
                audioState.isPlaying
                  ? 'bg-spider/20 border-spider text-headline shadow-spider-glow'
                  : 'bg-surface border-borderDark text-subtext hover:text-headline'
              }`}
            >
              <Music className={`w-3.5 h-3.5 ${audioState.isPlaying ? 'text-spider animate-spin' : 'text-subtext'}`} style={{ animationDuration: '4s' }} />
              
              <div className="hidden lg:flex items-center gap-1.5 text-left">
                <span className="font-bold text-graffiti-yellow">{BGM_TRACK.title.toUpperCase()}</span>
                <span className="text-[10px] text-subtext/80 hidden xl:inline">// {BGM_TRACK.artist.toUpperCase()}</span>
              </div>

              {audioState.isPlaying ? (
                <div className="flex items-center gap-1.5">
                  <Pause className="w-3 h-3 text-spider fill-spider" />
                  {/* Equalizer animation */}
                  <div className="flex items-end gap-0.5 h-3">
                    <span className="w-0.5 h-full bg-spider animate-pulse" />
                    <span className="w-0.5 h-2 bg-spider animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-0.5 h-3 bg-spider animate-pulse" style={{ animationDelay: '300ms' }} />
                    <span className="w-0.5 h-1.5 bg-spider animate-pulse" style={{ animationDelay: '450ms' }} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-subtext">
                  <Play className="w-3 h-3 text-spider fill-spider" />
                  <span className="hidden sm:inline">BGM</span>
                </div>
              )}
            </button>

            {/* Volume popup on hover */}
            {showVolumePopup && (
              <div
                onMouseLeave={() => setShowVolumePopup(false)}
                className="absolute right-0 top-full mt-2 bg-ink border border-spider p-3 shadow-2xl z-50 flex flex-col gap-2 w-48 animate-web-burst"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-subtext">
                  <span className="text-spider font-bold">MILES MORALES BGM</span>
                  <span>{Math.round(audioState.volume * 100)}%</span>
                </div>
                <div className="text-[11px] font-mono text-headline truncate">
                  {BGM_TRACK.title} — {BGM_TRACK.artist}
                </div>
                {audioState.isPlaying && !audioState.usingFile && (
                  <div className="text-[9px] font-mono text-subtext leading-tight">
                    NO TRACK FILE FOUND — PLAYING PROCEDURAL SCORE
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => sound.toggleMute()}
                    className="text-subtext hover:text-headline"
                  >
                    {audioState.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-spider" />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={audioState.volume}
                    onChange={(e) => sound.setVolume(parseFloat(e.target.value))}
                    className="w-full accent-spider h-1.5 bg-concrete rounded-none cursor-pointer"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Resume Quick Access */}
          <a
            href="/Aryan_FullStack_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-spider hover:bg-spider-bright text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors shadow-comic-black"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>CV</span>
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => {
              sound.playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="md:hidden p-2 bg-surface border border-borderDark text-headline hover:bg-concrete"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Web Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-void/98 border-b border-spider/50 px-6 py-6 animate-web-burst">
          <div className="flex flex-col gap-3">
            <div className="text-[10px] font-mono text-spider tracking-widest border-b border-borderDark pb-2 flex items-center justify-between">
              <span>// TELEPORTATION NODES</span>
              <span>EARTH-1610</span>
            </div>

            {/* Mobile BGM Song Row */}
            <div className="bg-surface/90 border border-spider/50 p-3 my-1 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-spider" />
                <div>
                  <div className="font-mono text-xs font-bold text-headline">{BGM_TRACK.title}</div>
                  <div className="font-mono text-[10px] text-subtext">{BGM_TRACK.artist}</div>
                </div>
              </div>
              <button
                onClick={() => sound.toggleSong()}
                className={`px-3 py-1 font-mono text-xs font-bold uppercase flex items-center gap-1 ${
                  audioState.isPlaying ? 'bg-spider text-white' : 'bg-concrete text-headline'
                }`}
              >
                {audioState.isPlaying ? <><Pause className="w-3 h-3" /> PAUSE</> : <><Play className="w-3 h-3" /> PLAY</>}
              </button>
            </div>

            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavClick(item.to)}
                  className={`flex items-center justify-between p-2.5 text-left font-display text-lg tracking-wider transition-all border ${
                    isActive
                      ? 'text-spider bg-surface border-borderDark'
                      : 'text-headline hover:text-spider hover:bg-surface border-transparent hover:border-borderDark'
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono text-xs text-spider">{item.badge}</span>
                </button>
              );
            })}

            <div className="pt-4 border-t border-borderDark flex items-center justify-between">
              <a
                href="/Aryan_FullStack_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="flex items-center gap-2 px-4 py-2 bg-spider text-white font-mono text-xs uppercase font-bold"
              >
                <FileDown className="w-4 h-4" />
                Download CV
              </a>

              <WebShooterToggle compact />

              <button
                onClick={() => {
                  sound.playVenomBuzz();
                  onTriggerVenom();
                }}
                className="flex items-center gap-1 px-3 py-2 bg-venom-purple text-white font-mono text-xs font-bold"
              >
                <Zap className="w-4 h-4" />
                Venom Zap
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
