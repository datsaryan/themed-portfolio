import React from 'react';
import { ProjectItem } from '../../data/resumeData';
import { X, ExternalLink, Github, Terminal, CheckCircle2, Shield, Calendar } from 'lucide-react';
import { sound } from '../../audio/soundEngine';

interface ProjectModalProps {
  project: ProjectItem;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  return (
    <div className="relative bg-ink/95 backdrop-blur-md border-2 border-spider/80 shadow-2xl rounded-none comic-cut text-web max-h-[88vh] flex flex-col">
      {/* Top Banner / HUD Corner markers */}
      <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-borderDark/60 bg-surface/50">
        <div className="text-[10px] font-mono text-spider font-bold tracking-widest uppercase flex items-center gap-2">
          <span>// CLASSIFIED DOSSIER</span>
          <span className="text-headline/40">|</span>
          <span>{project.missionNumber}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-mono text-subtext/70 hidden sm:block">
            EARTH-1610 PROTOCOL
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            aria-label="Close Dossier"
            className="p-1.5 bg-surface hover:bg-spider text-headline hover:text-white transition-colors border border-borderDark focus:outline-none focus:ring-2 focus:ring-spider"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
        {/* Header */}
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-spider text-white uppercase tracking-wider">
              {project.missionNumber}
            </span>
            <span className="px-2.5 py-0.5 text-xs font-mono text-graffiti-yellow bg-concrete/60 uppercase">
              {project.sector}
            </span>
            <span className="flex items-center gap-1 text-xs font-mono text-subtext ml-auto">
              <Calendar className="w-3.5 h-3.5" />
              {project.dates}
            </span>
          </div>

          <h3 className="text-3xl sm:text-4xl font-display uppercase tracking-wide text-headline">
            {project.title}
          </h3>
          <p className="text-sm sm:text-base text-subtext mt-1 font-sans">
            {project.subtitle}
          </p>
        </div>

        {/* Metrics Row */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {project.metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-surface/90 border border-borderDark p-2.5 text-center flex flex-col justify-center items-center"
              >
                <div className="text-[11px] font-mono text-spider font-semibold">METRIC {idx + 1}</div>
                <div className="text-sm font-sans font-bold text-paper mt-0.5">{m}</div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        <div className="p-4 bg-surface/50 border-l-4 border-spider">
          <p className="text-sm sm:text-base leading-relaxed text-paper">
            {project.summary}
          </p>
        </div>

        {/* Detailed Technical Bullet Points strictly from resume */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-subtext mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-spider" />
            Technical Execution & Architecture
          </h4>
          <div className="space-y-3">
            {project.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-paper/90 leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-spider mt-1 flex-shrink-0" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Tags */}
        <div>
          <h4 className="text-xs font-mono uppercase tracking-widest text-subtext mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-venom-purple" />
            Suit Sub-Systems / Technologies
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2.5 py-1 text-xs font-mono font-medium bg-concrete/80 text-web border border-borderDark"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions Bar */}
      <div className="p-4 sm:px-6 bg-surface border-t border-borderDark flex flex-wrap items-center gap-3">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2 px-5 py-2.5 bg-spider hover:bg-spider-bright text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors shadow-comic-black"
          >
            <Github className="w-4 h-4" />
            GitHub Repository
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="flex items-center gap-2 px-5 py-2.5 bg-venom-purple hover:bg-venom-electric text-white font-mono text-xs uppercase font-bold tracking-wider transition-colors shadow-comic-black"
          >
            <ExternalLink className="w-4 h-4" />
            Live Deployment
          </a>
        )}

        <button
          type="button"
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="ml-auto px-4 py-2.5 bg-ink hover:bg-concrete text-subtext hover:text-headline font-mono text-xs uppercase transition-colors border border-borderDark"
        >
          Dismiss [Esc]
        </button>
      </div>
    </div>
  );
};
