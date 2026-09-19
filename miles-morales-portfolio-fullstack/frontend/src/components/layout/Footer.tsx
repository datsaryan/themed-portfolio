import React from 'react';
import { ArrowUp, Radio, Heart } from 'lucide-react';
import { strangerAudio } from '../../audio/soundEngine';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    strangerAudio.playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-hawkins-border bg-hawkins-surface/80 py-12 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-hawkins-red animate-pulse" />
            <span className="font-title text-base text-hawkins-text font-bold tracking-wider">
              ARYAN SINGH
            </span>
          </div>
          <div className="text-xs font-mono text-hawkins-text-dim">
            FULL STACK ENGINEER // HAWKINS ARCHIVES
          </div>
          <p className="text-[10px] font-mono text-hawkins-text-dim mt-2 max-w-md">
            The Stranger Things universe is used purely as creative visual &amp; narrative inspiration for this personal engineering portfolio. Not affiliated with, endorsed by, or sponsored by Netflix or The Duffer Brothers.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-[11px] font-mono text-hawkins-crt flex items-center gap-1.5">
            <Radio className="w-3 h-3" />
            TELEMETRY ONLINE
          </span>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded bg-hawkins-card border border-hawkins-border hover:border-hawkins-red text-hawkins-text-muted hover:text-hawkins-red transition-all focus:outline-none"
            aria-label="Return to top of page"
            title="Return to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};
