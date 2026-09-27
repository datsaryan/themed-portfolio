import { strangerAudio } from '../audio/soundEngine';
import { ArrowUp, ShieldCheck } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    strangerAudio.playClick();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative z-20 border-t border-red-950/70 bg-[#07070d] py-12 text-gray-500 font-mono text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <p className="text-gray-300 font-bold tracking-widest uppercase">
            ARYAN SINGH &bull; FULL-STACK DOSSIER
          </p>
          <p className="text-gray-600 text-[11px]">
            &copy; 1986 HAWKINS NATIONAL LABORATORY &bull; DEPT. OF ENERGY ARCHIVE
          </p>
          <p className="text-red-500/80 text-[10px] flex items-center justify-center md:justify-start gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            SPRING BOOT 3 &bull; REACT 19 &bull; TYPESCRIPT &bull; POSTGRESQL
          </p>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[11px] text-gray-600">
            SECTOR: 39.83° N, 86.15° W
          </span>
          <button
            onClick={scrollToTop}
            title="Return to Top of Hawkins Archive"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/30 border border-red-900/50 hover:border-red-600 text-red-400 rounded transition-colors"
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span>TOP</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
