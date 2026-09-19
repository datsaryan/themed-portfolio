import React, { useState, useEffect } from 'react';
import { Menu, X, Shield, Terminal, Flame } from 'lucide-react';
import { WorldMode } from '../../types/portfolio';
import { strangerAudio } from '../../audio/soundEngine';
import { AudioController } from './AudioController';

interface NavbarProps {
  world: WorldMode;
  onToggleWorld: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ world, onToggleWorld, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);

      const sections = ['hero', 'about', 'skills', 'projects', 'timeline', 'contact'];
      for (const s of sections) {
        const el = document.getElementById(s);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(s);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#hero', label: 'THE SIGNAL', id: 'hero' },
    { href: '#about', label: 'THE DOSSIER', id: 'about' },
    { href: '#skills', label: 'THE ARSENAL', id: 'skills' },
    { href: '#projects', label: 'THE EXPERIMENTS', id: 'projects' },
    { href: '#timeline', label: 'THE ARCHIVES', id: 'timeline' },
    { href: '#contact', label: 'THE GATEWAY', id: 'contact' },
  ];

  const handleNavClick = (href: string) => {
    strangerAudio.playClickSound();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWorldToggle = () => {
    strangerAudio.playRiftSound();
    onToggleWorld();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-hawkins-void/90 backdrop-blur-md border-b border-hawkins-border py-2.5 shadow-case-file'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Callout */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            handleNavClick('#hero');
          }}
          className="flex items-center gap-2 group focus:outline-none"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-hawkins-red animate-pulse" />
          <div className="flex flex-col">
            <span className="font-title text-sm tracking-wider text-hawkins-text group-hover:text-hawkins-red transition-colors">
              ARYAN SINGH
            </span>
            <span className="text-[10px] font-mono tracking-widest text-hawkins-text-dim">
              HAWKINS LAB // RF: 86.4 MHz
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(link.href);
              }}
              className={`text-xs font-mono tracking-widest transition-all ${
                activeSection === link.id
                  ? 'text-hawkins-red font-semibold border-b border-hawkins-red pb-0.5'
                  : 'text-hawkins-text-muted hover:text-hawkins-text'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Action Controls: Audio + World Mode + Terminal */}
        <div className="hidden md:flex items-center gap-3">
          <AudioController world={world} />

          {/* Upside Down Switch */}
          <button
            onClick={handleWorldToggle}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono tracking-wider transition-all border ${
              world === 'upsidedown'
                ? 'bg-hawkins-red/20 border-hawkins-red text-hawkins-text hover:bg-hawkins-red/30'
                : 'bg-hawkins-surface/80 border-hawkins-border text-hawkins-text-muted hover:border-hawkins-amber hover:text-hawkins-amber'
            }`}
            title={world === 'upsidedown' ? 'Return to Hawkins' : 'Cross into the Upside Down'}
          >
            <Flame className={`w-3.5 h-3.5 ${world === 'upsidedown' ? 'text-hawkins-red animate-bounce' : 'text-hawkins-amber'}`} />
            <span>{world === 'upsidedown' ? 'RETURN TO HAWKINS' : 'UPSIDE DOWN'}</span>
          </button>

          {/* Admin Terminal Button */}
          <button
            onClick={() => {
              strangerAudio.playClickSound();
              onOpenAdmin();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono tracking-wider border border-hawkins-border hover:border-hawkins-crt bg-hawkins-surface/60 text-hawkins-text-muted hover:text-hawkins-crt transition-all"
            title="Classified Security Terminal (JWT Authentication)"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">LAB TERMINAL</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={handleWorldToggle}
            className="p-1.5 rounded border border-hawkins-border text-hawkins-amber"
            aria-label="Toggle World"
          >
            <Flame className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              strangerAudio.playClickSound();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-1.5 text-hawkins-text hover:text-hawkins-red focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-hawkins-card/95 backdrop-blur-xl border-b border-hawkins-border px-6 py-6 mt-2 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className={`text-sm font-mono tracking-widest py-1 ${
                  activeSection === link.id ? 'text-hawkins-red font-semibold' : 'text-hawkins-text-muted'
                }`}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-hawkins-border flex flex-col gap-3">
            <AudioController world={world} />

            <div className="flex items-center gap-2">
              <button
                onClick={handleWorldToggle}
                className="flex-1 py-2 text-xs font-mono border border-hawkins-amber text-hawkins-amber rounded flex items-center justify-center gap-2"
              >
                <Flame className="w-3.5 h-3.5" />
                {world === 'upsidedown' ? 'RETURN TO HAWKINS' : 'CROSS TO UPSIDE DOWN'}
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="py-2 px-3 text-xs font-mono border border-hawkins-border text-hawkins-crt rounded flex items-center justify-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" />
                TERMINAL
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
