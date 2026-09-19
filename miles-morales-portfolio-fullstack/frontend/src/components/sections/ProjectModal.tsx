import React, { useEffect } from 'react';
import { X, Github, ExternalLink, Activity, CheckCircle2, Layers } from 'lucide-react';
import { ProjectItem } from '../../types/portfolio';
import { strangerAudio } from '../../audio/soundEngine';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-hawkins-card border border-hawkins-border rounded-lg shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="flex items-start justify-between pb-4 border-b border-hawkins-border mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-hawkins-red tracking-widest uppercase">
                {project.missionNumber}
              </span>
              <span className="text-hawkins-border">•</span>
              <span className="text-xs font-mono text-hawkins-amber">{project.sector}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-title text-hawkins-text tracking-wide">
              {project.title}
            </h2>
            <div className="text-xs font-mono text-hawkins-text-dim mt-0.5">{project.subtitle} ({project.dates})</div>
          </div>

          <button
            onClick={() => {
              strangerAudio.playClickSound();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-hawkins-surface text-hawkins-text-muted hover:text-hawkins-red transition-colors focus:outline-none"
            aria-label="Close Dossier"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Summary */}
        <div className="mb-6">
          <span className="text-xs font-mono text-hawkins-text-dim uppercase tracking-wider block mb-2">
            EXPERIMENT SPECIFICATION:
          </span>
          <p className="text-sm text-hawkins-text font-sans leading-relaxed bg-hawkins-surface/70 p-4 rounded border border-hawkins-border/80">
            {project.summary}
          </p>
        </div>

        {/* Metrics Bar */}
        {project.metrics && project.metrics.length > 0 && (
          <div className="mb-6">
            <span className="text-xs font-mono text-hawkins-amber uppercase tracking-wider block mb-2 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-hawkins-red" />
              VERIFIED EXPERIMENTAL METRICS:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {project.metrics.map((metric, idx) => (
                <div key={idx} className="p-2.5 rounded bg-hawkins-surface border border-hawkins-border text-center">
                  <span className="text-xs font-mono font-bold text-hawkins-crt block">{metric}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Engineering Bullets */}
        <div className="mb-6">
          <span className="text-xs font-mono text-hawkins-text-dim uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-hawkins-amber" />
            ENGINEERING IMPLEMENTATION &amp; ARCHITECTURE:
          </span>
          <div className="space-y-2.5">
            {project.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-hawkins-text-muted font-sans leading-relaxed">
                <CheckCircle2 className="w-4 h-4 text-hawkins-red shrink-0 mt-0.5" />
                <span>{bullet}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div className="mb-8">
          <span className="text-xs font-mono text-hawkins-text-dim uppercase tracking-wider block mb-2">
            TECHNOLOGY STACK:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 text-xs font-mono rounded bg-hawkins-void border border-hawkins-border text-hawkins-amber"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Action Links */}
        <div className="pt-4 border-t border-hawkins-border flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => strangerAudio.playClickSound()}
                className="px-4 py-2 rounded bg-hawkins-surface hover:bg-hawkins-border border border-hawkins-border text-hawkins-text font-mono text-xs flex items-center gap-1.5 transition-colors"
              >
                <Github className="w-4 h-4" />
                VIEW SOURCE CODE
              </a>
            )}

            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => strangerAudio.playClickSound()}
                className="px-4 py-2 rounded bg-hawkins-red hover:bg-red-700 text-white font-mono text-xs flex items-center gap-1.5 transition-colors font-semibold shadow-hawkins-glow"
              >
                <ExternalLink className="w-4 h-4" />
                LIVE EXPERIMENT
              </a>
            )}
          </div>

          <span className="text-[10px] font-mono text-hawkins-text-dim">
            HAWKINS LAB ARCHIVAL CLASSIFICATION: LEVEL 4
          </span>
        </div>
      </div>
    </div>
  );
};
