import { useState, useEffect } from 'react';
import { worldEngine, WorldMode } from '../theme/themeEngine';
import { strangerAudio } from '../audio/soundEngine';
import { AudioController } from './AudioController';
import { Terminal, Compass, Menu, X, Lightbulb, Dices, AlertTriangle } from 'lucide-react';

interface NavbarProps {
  onOpenAdmin: () => void;
  onOpenEasterEgg: () => void;
  onOpenD20: () => void;
  onTriggerRiftTransition: () => void;
}

export function Navbar({ onOpenAdmin, onOpenEasterEgg, onOpenD20, onTriggerRiftTransition }: NavbarProps) {
  const [world, setWorld] = useState<WorldMode>(worldEngine.getMode());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const unsub = worldEngine.subscribe((mode) => setWorld(mode));
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      unsub();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleWorldToggle = () => {
    const newMode = world === 'hawkins' ? 'upsidedown' : 'hawkins';
    strangerAudio.playWorldShift();
    if (newMode === 'upsidedown') {
      setTimeout(() => strangerAudio.playDemogorgonRoar(), 200);
    }
    strangerAudio.setWorldMode(newMode === 'upsidedown');
    worldEngine.toggle();
    onTriggerRiftTransition();
  };

  const navLinks = [
    { label: 'ARCHIVE', href: '#hero' },
    { label: 'DOSSIER', href: '#about' },
    { label: 'PROTOCOLS', href: '#skills' },
    { label: 'CASE FILES', href: '#projects' },
    { label: 'CONDUIT', href: '#christmas-lights' },
    { label: 'TIMELINE', href: '#timeline' },
    { label: 'TRANSMIT', href: '#contact' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#090812]/95 backdrop-blur-md border-b border-red-950/80 shadow-2xl'
          : 'bg-transparent'
      }`}
    >
      {/* Top Banner Status with Animated Upside Down Warning */}
      <div
        className={`px-4 py-1.5 text-center font-mono text-[10px] sm:text-xs tracking-widest flex items-center justify-between border-b transition-colors duration-500 ${
          world === 'upsidedown'
            ? 'bg-red-950/90 border-red-600 text-red-200 animate-pulse'
            : 'bg-red-950/40 border-red-900/40 text-red-400'
        }`}
      >
        <span className="flex items-center gap-1.5 font-bold">
          {world === 'upsidedown' ? (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-bounce" />
              <span className="text-red-300 tracking-wider">
                WARNING: DIMENSIONAL BREACH // CURRENT REALITY: THE UPSIDE DOWN
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
              HAWKINS NATIONAL LABORATORY &bull; SECTOR 4 MONITORED
            </>
          )}
        </span>

        <span className="hidden lg:inline text-gray-400">
          FREQUENCY: {world === 'upsidedown' ? '66.6 MHz [ANOMALY DETECTED]' : '11.23 MHz [STEADY]'}
        </span>

        <span className="font-bold tracking-widest text-red-400/90">
          CLEARANCE: LEVEL 4
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Title */}
        <a
          href="#hero"
          onClick={() => strangerAudio.playClick()}
          className="flex items-center gap-2.5 group"
        >
          <span className="stranger-title text-xl sm:text-2xl font-bold tracking-widest group-hover:scale-105 transition-transform">
            ARYAN SINGH
          </span>
          <span
            className={`hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
              world === 'upsidedown'
                ? 'border-red-500 bg-red-950 text-red-300 shadow-[0_0_10px_rgba(255,0,0,0.8)]'
                : 'border-red-900/60 bg-red-950/30 text-red-400'
            }`}
          >
            {world === 'upsidedown' ? 'UPSIDE DOWN' : 'HAWKINS 1986'}
          </span>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center space-x-5 font-mono text-xs tracking-widest">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => strangerAudio.playClick()}
              className="text-gray-300 hover:text-red-400 transition-colors relative py-1 hover:border-b hover:border-red-500"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* World Shift Button (Super Distinct & Dramatic) */}
          <button
            onClick={handleWorldToggle}
            title={world === 'upsidedown' ? 'Escape back to Hawkins 1986' : 'Enter The Upside Down'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold tracking-wider transition-all duration-300 border ${
              world === 'upsidedown'
                ? 'bg-red-600 border-red-400 text-white shadow-[0_0_25px_rgba(255,0,0,0.9)] animate-pulse'
                : 'bg-red-950/40 border-red-700/80 text-red-400 hover:bg-red-900/60 hover:text-white hover:border-red-500 hover:shadow-[0_0_15px_rgba(229,62,62,0.5)]'
            }`}
          >
            <Compass className={`w-4 h-4 transition-transform duration-500 ${world === 'upsidedown' ? 'rotate-180 text-yellow-300' : 'text-amber-400'}`} />
            <span>
              {world === 'upsidedown' ? 'RETURN TO HAWKINS' : 'UPSIDE DOWN'}
            </span>
          </button>

          {/* Joyce's Christmas Lights Easter Egg Button */}
          <button
            onClick={() => {
              strangerAudio.playClick();
              onOpenEasterEgg();
            }}
            title="Open Joyce's Christmas Lights Wall Conduit"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-yellow-800/80 bg-yellow-950/20 hover:bg-yellow-950/50 text-yellow-400 font-mono text-xs tracking-wider transition-all"
          >
            <Lightbulb className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            <span className="hidden xl:inline">LIGHTS</span>
          </button>

          {/* D&D D20 Dice Game Easter Egg Button */}
          <button
            onClick={() => {
              strangerAudio.playDiceRoll();
              onOpenD20();
            }}
            title="Roll D20 against the Demogorgon!"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-purple-800/80 bg-purple-950/20 hover:bg-purple-950/50 text-purple-400 font-mono text-xs tracking-wider transition-all"
          >
            <Dices className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden xl:inline">D20</span>
          </button>

          {/* Audio Synthesizer */}
          <AudioController />

          {/* Admin Terminal */}
          <button
            onClick={() => {
              strangerAudio.playTerminalBeep();
              onOpenAdmin();
            }}
            title="Open Hawkins Department of Energy Admin Terminal"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-red-900/60 bg-red-950/30 hover:bg-red-900/50 text-red-400 font-mono text-xs tracking-wider transition-all"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden md:inline">TERMINAL</span>
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 text-gray-300 hover:text-red-400"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0c0c16] border-b border-red-950 px-6 py-4 space-y-3 font-mono text-sm">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => {
                strangerAudio.playClick();
                setMobileMenuOpen(false);
              }}
              className="block text-gray-300 hover:text-red-400 tracking-wider py-1 border-b border-gray-900"
            >
              &gt; {link.label}
            </a>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEasterEgg();
              }}
              className="flex items-center justify-center gap-2 w-full py-2 bg-yellow-950/40 border border-yellow-800 text-yellow-400 text-xs tracking-widest rounded"
            >
              <Lightbulb className="w-4 h-4" /> JOYCE'S CHRISTMAS LIGHTS
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenD20();
              }}
              className="flex items-center justify-center gap-2 w-full py-2 bg-purple-950/40 border border-purple-800 text-purple-400 text-xs tracking-widest rounded"
            >
              <Dices className="w-4 h-4" /> ROLL D20 VS DEMOGORGON
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="flex items-center justify-center gap-2 w-full py-2 bg-red-950/40 border border-red-900 text-red-400 text-xs tracking-widest rounded"
            >
              <Terminal className="w-4 h-4" /> ACCESS LAB TERMINAL
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
