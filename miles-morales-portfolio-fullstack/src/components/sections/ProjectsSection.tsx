import React, { useState } from 'react';
import { RESUME_DATA, ProjectItem } from '../../data/resumeData';
import { SpideyWebOverlay } from '../effects/SpideyWebOverlay';
import { ProjectModal } from './ProjectModal';
import { Target, ExternalLink, Github, Sparkles, Terminal } from 'lucide-react';
import { sound } from '../../audio/soundEngine';

export const ProjectsSection: React.FC = () => {
  const { missions } = RESUME_DATA;
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [webOrigin, setWebOrigin] = useState<{ x: number; y: number } | null>(null);
  const [rippleId, setRippleId] = useState<string | null>(null);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>, project: ProjectItem) => {
    // Prevent trigger if clicking directly on an anchor tag
    const target = e.target as HTMLElement;
    if (target.closest('a')) {
      return;
    }

    // Ripple flash effect
    setRippleId(project.id);
    setTimeout(() => setRippleId(null), 420);

    // Sound: click + thwip combo on card open
    sound.playClick();
    sound.playThwip();

    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    setWebOrigin({ x, y });
    setSelectedProject(project);
  };

  return (
    <section id="projects" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-spider font-bold">
          <Target className="w-4 h-4" />
          <span>ACTIVE MISSIONS // 03</span>
          <span className="text-borderDark">————</span>
          <span className="text-subtext">FIELD OPERATIONS & CASE FILES</span>
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight flex items-center gap-3">
              <span>TACTICAL</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-spider to-graffiti-yellow">
                MISSIONS
              </span>
            </h2>
            <p className="text-sm sm:text-base text-subtext mt-2 font-mono">
              // SELECT ANY MISSION TO DEPLOY THE SPIDEY WEB & ACCESS DECLASSIFIED ARCHITECTURE
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-ink border border-spider/60 text-spider font-mono text-xs font-bold uppercase shadow-comic-black">
            <Sparkles className="w-4 h-4" />
            <span>INTERACTIVE SPIDEY WEB ENABLED</span>
          </div>
        </div>
      </div>

      {/* Projects Grid: Asymmetric Comic Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {missions.map((mission, index) => {
          return (
            <div
              key={mission.id}
              onClick={(e) => handleCardClick(e, mission)}
              className={`group relative bg-surface/90 border comic-border p-6 sm:p-7 cursor-pointer flex flex-col justify-between transition-all duration-200 overflow-hidden ${
                rippleId === mission.id
                  ? 'border-spider shadow-[0_0_24px_4px_rgba(230,36,41,0.55)]'
                  : 'border-borderDark'
              }`}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setSelectedProject(mission);

                }
              }}
              aria-label={`Open mission dossier for ${mission.title}`}
            >
              {/* Halftone corner texture on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-halftone-red opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none" />

              {/* Spider-red ripple flash on card click */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  rippleId === mission.id ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ background: 'radial-gradient(circle at center, rgba(230,36,41,0.22) 0%, rgba(230,36,41,0.06) 55%, transparent 80%)' }}
              />

              <div>
                {/* Top Mission Tape */}
                <div className="flex items-center justify-between border-b border-borderDark/80 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-spider text-white font-mono text-xs font-bold uppercase tracking-wider shadow-comic-black">
                      {mission.missionNumber}
                    </span>
                    <span className="text-[11px] font-mono text-graffiti-yellow font-semibold uppercase">
                      {mission.dates}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-subtext bg-ink px-2 py-0.5 border border-borderDark">
                    SECTOR: {index + 1}
                  </span>
                </div>

                {/* Title & Subtitle */}
                <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide group-hover:text-spider transition-colors">
                  {mission.title}
                </h3>
                <p className="text-xs sm:text-sm font-mono text-subtext mt-1">
                  {mission.subtitle}
                </p>

                {/* Summary */}
                <p className="text-sm font-sans text-paper/80 mt-4 leading-relaxed line-clamp-3">
                  {mission.summary}
                </p>

                {/* Tech Stack Chips */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {mission.techStack.slice(0, 6).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 bg-ink text-subtext font-mono text-[11px] border border-borderDark/80 group-hover:border-spider/40 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                  {mission.techStack.length > 6 && (
                    <span className="px-2 py-0.5 bg-ink text-spider font-mono text-[11px] border border-borderDark">
                      +{mission.techStack.length - 6} MORE
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Card Footer with Actions & Spidey Web Cue */}
              <div className="mt-7 pt-4 border-t border-borderDark flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-spider group-hover:underline">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>SLING WEB &bull; OPEN DOSSIER</span>
                </div>

                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {mission.githubUrl && (
                    <a
                      href={mission.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      title="View GitHub Repository"
                      className="p-2 bg-ink hover:bg-spider text-subtext hover:text-white border border-borderDark transition-colors"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}

                  {mission.liveUrl && (
                    <a
                      href={mission.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      title="View Live Deployment"
                      className="p-2 bg-ink hover:bg-venom-purple text-subtext hover:text-white border border-borderDark transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Decorative Corner Web Tick */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 pointer-events-none opacity-20 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 100 100" fill="none" stroke="#e62429" strokeWidth="6">
                  <path d="M 0,100 Q 50,50 100,0" />
                  <path d="M 40,100 Q 70,70 100,40" />
                </svg>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Procedural Spidey Web Modal Triggered on Click */}
      {selectedProject && (
        <SpideyWebOverlay
          originX={webOrigin?.x}
          originY={webOrigin?.y}
          accentColor={selectedProject.accentColor}
          onClose={() => {
            setSelectedProject(null);
            setWebOrigin(null);
          }}
        >
          <ProjectModal
            project={selectedProject}
            onClose={() => {
              setSelectedProject(null);
              setWebOrigin(null);
            }}
          />
        </SpideyWebOverlay>
      )}
    </section>
  );
};
