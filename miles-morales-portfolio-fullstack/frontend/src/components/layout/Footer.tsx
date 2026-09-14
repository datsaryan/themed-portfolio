import React from 'react';
import { useResumeData } from '../../data/useResumeData';
import { ArrowUp, Github, Linkedin, Terminal, Shield } from 'lucide-react';
import { sound } from '../../audio/soundEngine';

export const Footer: React.FC = () => {
  const { personal } = useResumeData();

  const scrollToTop = () => {
    sound.playThwip();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-borderDark/80 bg-ink/95 pt-12 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Identity */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 flex items-center justify-center bg-surface border border-spider">
              <img
                src="/assets/spiderman/miles_spider_icon.svg"
                alt="Miles Icon"
                className="w-4 h-4"
              />
            </div>
            <span className="font-display text-lg tracking-wider text-white">
              ARYAN SINGH
            </span>
            <span className="font-mono text-xs text-spider font-bold">
              // EARTH-1610
            </span>
          </div>

          <p className="font-mono text-xs text-subtext mt-2 max-w-md">
            &ldquo;WITH GREAT CODE COMES GREAT ARCHITECTURAL RESPONSIBILITY.&rdquo;
          </p>

          <div className="flex items-center gap-2 mt-2 text-[10px] font-mono text-subtext/70">
            <Shield className="w-3 h-3 text-spider" />
            <span>100% SOURCED FROM ARYAN_FULLSTACK_RESUME.PDF &bull; ZERO FABRICATION</span>
          </div>
        </div>

        {/* Middle: Social icons */}
        <div className="flex items-center gap-3">
          <a
            href={personal.links.github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            aria-label="GitHub Profile"
            className="p-2.5 bg-surface hover:bg-spider text-subtext hover:text-white border border-borderDark transition-colors"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href={personal.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            aria-label="LinkedIn Profile"
            className="p-2.5 bg-surface hover:bg-spider text-subtext hover:text-white border border-borderDark transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href={personal.links.leetcode}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            aria-label="LeetCode Profile"
            className="p-2.5 bg-surface hover:bg-graffiti-yellow text-subtext hover:text-void border border-borderDark transition-colors"
          >
            <Terminal className="w-4 h-4" />
          </a>
        </div>

        {/* Right Side: Back to Top Web Slingshot */}
        <div>
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-4 py-2.5 bg-surface hover:bg-concrete border border-borderDark hover:border-spider text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors"
          >
            <span>SLING TO APEX</span>
            <ArrowUp className="w-4 h-4 text-spider" />
          </button>
        </div>
      </div>
    </footer>
  );
};
