import { ProfileData } from '../types/portfolio';
import { strangerAudio } from '../audio/soundEngine';
import { FileText, Send, FolderGit2, Code, Radio, Lightbulb, Sparkles } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';

interface HeroSectionProps {
  profile: ProfileData;
  onOpenEasterEgg: () => void;
}

export function HeroSection({ profile, onOpenEasterEgg }: HeroSectionProps) {
  const handleTestComms = () => {
    strangerAudio.playWalkieTalkieStatic();
  };

  return (
    <section id="hero" className="relative pt-36 pb-20 md:pt-44 md:pb-28 overflow-hidden">
      {/* 80s Grid Background Effect */}
      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[linear-gradient(to_right,#ff2a2a_1px,transparent_1px),linear-gradient(to_bottom,#ff2a2a_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Classified Dossier Stamp */}
          <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
            <span className="classified-stamp text-xs sm:text-sm">
              DEPARTMENT OF ENERGY &bull; CLASSIFIED DOSSIER #1986-AS
            </span>
            <button
              onClick={handleTestComms}
              title="Test Walkie-Talkie Radio Squelch"
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/40 hover:bg-red-900/50 border border-red-800/80 rounded font-mono text-[11px] text-red-400 transition-all cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>TEST WALKIE COMMS</span>
            </button>
          </div>

          {/* Main Name in Stranger Things Aesthetic */}
          <h1 className="stranger-title text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider font-extrabold mb-4 select-none drop-shadow-[0_0_25px_rgba(255,42,42,0.8)]">
            {profile.name}
          </h1>

          {/* Subtitle / Role */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-10 sm:w-20 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
            <p className="font-mono text-xs sm:text-base md:text-lg text-red-400 tracking-[0.25em] uppercase font-semibold">
              Full-Stack Developer &bull; Java Specialist
            </p>
            <span className="w-10 sm:w-20 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent" />
          </div>

          {/* Bio Overview */}
          <p className="text-gray-200 font-sans text-base sm:text-lg leading-relaxed mb-8 max-w-3xl mx-auto font-light">
            Engineering robust, production-grade distributed architectures and immersive user interfaces. Specializing in <span className="text-red-400 font-semibold underline decoration-red-900 underline-offset-4">Java, Spring Boot, Spring Security, JWT authentication</span>, and <span className="text-amber-400 font-semibold underline decoration-amber-900 underline-offset-4">React, TypeScript, PostgreSQL</span>.
          </p>

          {/* Interactive CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <a
              href="#projects"
              onClick={() => strangerAudio.playClick()}
              className="flex items-center gap-2 px-6 py-3.5 bg-red-700 hover:bg-red-600 text-white font-mono text-xs sm:text-sm font-bold tracking-widest rounded transition-all shadow-[0_0_20px_rgba(229,62,62,0.5)] hover:shadow-[0_0_35px_rgba(229,62,62,0.8)] hover:scale-105 active:scale-95"
            >
              <FolderGit2 className="w-4 h-4" />
              CASE FILES
            </a>

            <button
              onClick={() => {
                strangerAudio.playClick();
                onOpenEasterEgg();
              }}
              className="flex items-center gap-2 px-6 py-3.5 bg-yellow-950/40 hover:bg-yellow-950/80 border border-yellow-600/70 text-yellow-300 font-mono text-xs sm:text-sm font-bold tracking-widest rounded transition-all shadow-[0_0_15px_rgba(255,230,0,0.3)] hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Lightbulb className="w-4 h-4 text-yellow-400 animate-pulse" />
              JOYCE&apos;S LIGHTS
            </button>

            <a
              href="#contact"
              onClick={() => strangerAudio.playClick()}
              className="flex items-center gap-2 px-6 py-3.5 bg-[#141224] hover:bg-[#1f1b36] border border-red-900/70 text-red-400 hover:text-red-300 font-mono text-xs sm:text-sm font-bold tracking-widest rounded transition-all hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
              TRANSMIT
            </a>

            <a
              href="/Aryan_FullStack_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => strangerAudio.playClick()}
              className="flex items-center gap-2 px-5 py-3.5 bg-[#141224] hover:bg-[#1f1b36] border border-gray-800 text-gray-300 hover:text-white font-mono text-xs sm:text-sm tracking-widest rounded transition-all hover:scale-105 active:scale-95"
            >
              <FileText className="w-4 h-4" />
              DOSSIER PDF
            </a>
          </div>

          {/* Social Profiles */}
          <div className="flex items-center justify-center gap-6 text-gray-300 mb-8">
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => strangerAudio.playClick()}
              className="hover:text-red-400 transition-all flex items-center gap-1.5 font-mono text-xs hover:scale-110"
              title="GitHub Profile"
            >
              <GithubIcon className="w-4 h-4" /> GitHub
            </a>
            <span className="text-gray-700">&bull;</span>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => strangerAudio.playClick()}
              className="hover:text-red-400 transition-all flex items-center gap-1.5 font-mono text-xs hover:scale-110"
              title="LinkedIn Profile"
            >
              <LinkedinIcon className="w-4 h-4" /> LinkedIn
            </a>
            <span className="text-gray-700">&bull;</span>
            <a
              href={profile.leetcodeUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => strangerAudio.playClick()}
              className="hover:text-red-400 transition-all flex items-center gap-1.5 font-mono text-xs hover:scale-110"
              title="LeetCode Profile"
            >
              <Code className="w-4 h-4" /> LeetCode
            </a>
          </div>

          {/* Hawkins Telemetry Status Bar */}
          <div className="border border-red-950/80 bg-red-950/15 backdrop-blur-sm rounded-lg px-5 py-2.5 font-mono text-xs text-gray-400 flex flex-wrap items-center justify-between gap-3 max-w-2xl mx-auto shadow-lg">
            <span className="text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SPRING BOOT 3 &bull; REACT 19 &bull; H2 / POSTGRES
            </span>
            <span className="text-red-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              SECURE CLEARANCE 4
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
