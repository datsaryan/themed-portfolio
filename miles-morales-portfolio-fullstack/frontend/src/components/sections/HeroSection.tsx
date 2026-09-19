import React from 'react';
import { FileText, ArrowDown, Github, Linkedin, Code2, ShieldAlert, Cpu, Database } from 'lucide-react';
import { ProfileData, WorldMode } from '../../types/portfolio';
import { strangerAudio } from '../../audio/soundEngine';

interface HeroSectionProps {
  personal: ProfileData;
  world: WorldMode;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ personal, world }) => {
  const scrollTo = (id: string) => {
    strangerAudio.playClickSound();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden px-4 sm:px-6"
    >
      {/* Central Rift Portal Graphic in Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
        <div
          className={`w-[320px] h-[320px] sm:w-[540px] sm:h-[540px] rounded-full blur-3xl opacity-20 transition-all duration-1000 ${
            world === 'upsidedown'
              ? 'bg-gradient-to-tr from-hawkins-red via-purple-950 to-hawkins-crt opacity-30 animate-pulse-subtle'
              : 'bg-gradient-to-tr from-hawkins-red via-amber-800 to-hawkins-navy'
          }`}
        />
        {/* Dimensional Rift Core SVG */}
        <svg
          className={`w-72 h-72 sm:w-96 sm:h-96 opacity-30 animate-rift-glow transition-all duration-700 ${
            world === 'upsidedown' ? 'scale-110 text-hawkins-red' : 'text-hawkins-amber'
          }`}
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle cx="100" cy="100" r="80" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="60" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
          <path
            d="M100 10 C60 60 60 140 100 190 C140 140 140 60 100 10 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="8 4"
          />
          <path
            d="M10 100 C60 60 140 60 190 100 C140 140 60 140 10 100 Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="8 4"
          />
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Investigation Banner */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-hawkins-border bg-hawkins-surface/80 mb-6 backdrop-blur">
          <span className="w-2 h-2 rounded-full bg-hawkins-red animate-ping" />
          <span className="text-[11px] font-mono tracking-widest text-hawkins-amber uppercase font-semibold">
            {world === 'upsidedown' ? 'DIMENSIONAL BREACH DETECTED // SECTOR 11' : 'CLASSIFIED DOSSIER // HAWKINS ARCHIVES'}
          </span>
        </div>

        {/* Hero Name with Iconic Stranger Things Typography */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-title tracking-wider text-hawkins-text mb-4 stranger-title select-none">
          {personal.name}
        </h1>

        {/* Professional Title & Subtitle */}
        <div className="text-sm sm:text-base md:text-lg font-mono tracking-widest text-hawkins-red font-semibold mb-3">
          {personal.title.toUpperCase()}
        </div>

        <p className="max-w-2xl text-hawkins-text-muted text-sm sm:text-base font-sans leading-relaxed mb-8">
          &ldquo;Building high-concurrency systems from the right side of the stack.&rdquo; Specialized in{' '}
          <strong className="text-hawkins-amber font-mono font-medium">Java &amp; Spring Boot</strong>,{' '}
          <strong className="text-hawkins-text font-mono font-medium">React &amp; TypeScript</strong>,{' '}
          <strong className="text-hawkins-crt font-mono font-medium">SQL &amp; PostgreSQL</strong>, and secured RESTful micro-architectures.
        </p>

        {/* Engineering Stack Badges */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-10 max-w-xl">
          <span className="px-2.5 py-1 text-xs font-mono rounded bg-hawkins-surface border border-hawkins-border text-hawkins-amber flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> Java 21 / Spring Boot 3
          </span>
          <span className="px-2.5 py-1 text-xs font-mono rounded bg-hawkins-surface border border-hawkins-border text-hawkins-text flex items-center gap-1.5">
            <Code2 className="w-3.5 h-3.5" /> React / TypeScript
          </span>
          <span className="px-2.5 py-1 text-xs font-mono rounded bg-hawkins-surface border border-hawkins-border text-hawkins-crt flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" /> PostgreSQL / Flyway
          </span>
          <span className="px-2.5 py-1 text-xs font-mono rounded bg-hawkins-surface border border-hawkins-border text-hawkins-red flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5" /> JWT Authentication
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mb-12">
          <button
            onClick={() => scrollTo('projects')}
            className="px-6 py-3 rounded bg-hawkins-red hover:bg-red-700 text-white font-mono text-xs sm:text-sm font-semibold tracking-wider transition-all shadow-hawkins-glow flex items-center gap-2"
          >
            EXPLORE CASE FILES
            <ArrowDown className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollTo('about')}
            className="px-6 py-3 rounded bg-hawkins-surface hover:bg-hawkins-card border border-hawkins-border text-hawkins-text hover:text-hawkins-amber font-mono text-xs sm:text-sm tracking-wider transition-all"
          >
            PERSONNEL DOSSIER
          </button>

          <a
            href={personal.resumePdfPath || '/Aryan_FullStack_Resume.pdf'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => strangerAudio.playClickSound()}
            className="px-5 py-3 rounded border border-hawkins-border hover:border-hawkins-red text-hawkins-text-muted hover:text-hawkins-text font-mono text-xs sm:text-sm tracking-wider transition-all flex items-center gap-2"
          >
            <FileText className="w-4 h-4 text-hawkins-red" />
            DOWNLOAD DOSSIER
          </a>
        </div>

        {/* Social / Investigation Coordinates */}
        <div className="flex items-center gap-6 text-hawkins-text-dim">
          <a
            href={personal.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-hawkins-red transition-colors flex items-center gap-1.5 text-xs font-mono"
            aria-label="GitHub Profile"
          >
            <Github className="w-4 h-4" />
            <span>GITHUB</span>
          </a>

          <span className="text-hawkins-border">•</span>

          <a
            href={personal.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-hawkins-amber transition-colors flex items-center gap-1.5 text-xs font-mono"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="w-4 h-4" />
            <span>LINKEDIN</span>
          </a>

          <span className="text-hawkins-border">•</span>

          <a
            href={personal.leetcodeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-hawkins-crt transition-colors flex items-center gap-1.5 text-xs font-mono"
            aria-label="LeetCode Profile"
          >
            <Code2 className="w-4 h-4" />
            <span>LEETCODE</span>
          </a>
        </div>
      </div>
    </section>
  );
};
