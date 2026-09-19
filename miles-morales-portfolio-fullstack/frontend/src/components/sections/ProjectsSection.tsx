import React, { useState } from 'react';
import { ProjectItem, WorldMode } from '../../types/portfolio';
import { Folder, ExternalLink, Github, ArrowUpRight, Activity } from 'lucide-react';
import { strangerAudio } from '../../audio/soundEngine';
import { ProjectModal } from './ProjectModal';

interface ProjectsSectionProps {
  projects: ProjectItem[];
  world: WorldMode;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects, world }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const handleOpenCase = (p: ProjectItem) => {
    strangerAudio.playClickSound();
    setSelectedProject(p);
  };

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-hawkins-border">
          <div>
            <div className="text-xs font-mono tracking-widest text-hawkins-red uppercase font-semibold mb-1 flex items-center gap-2">
              <Folder className="w-4 h-4" />
              SECTION 03 // THE EXPERIMENTS
            </div>
            <h2 className="text-3xl sm:text-4xl font-title text-hawkins-text tracking-wide">
              CLASSIFIED HAWKINS CASE FILES
            </h2>
          </div>
          <div className="mt-3 sm:mt-0 text-xs font-mono text-hawkins-text-dim">
            ACCESS: AUTHORIZED PERSONNEL ONLY
          </div>
        </div>

        {/* Case Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleOpenCase(project)}
              className="case-file-border rounded-lg p-6 bg-hawkins-card/90 flex flex-col justify-between cursor-pointer group transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                {/* Case File Header */}
                <div className="flex items-center justify-between pb-3 border-b border-hawkins-border/60 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-hawkins-red tracking-wider">
                      {project.missionNumber}
                    </span>
                    <span className="text-hawkins-border">•</span>
                    <span className="text-[10px] font-mono text-hawkins-amber uppercase">
                      {project.sector}
                    </span>
                  </div>
                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-hawkins-surface border border-hawkins-border text-hawkins-crt">
                    STATUS: VERIFIED
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-title text-hawkins-text group-hover:text-hawkins-amber transition-colors mb-1">
                  {project.title}
                </h3>
                <div className="text-xs font-mono text-hawkins-text-dim mb-3">
                  {project.subtitle} ({project.dates})
                </div>

                <p className="text-xs sm:text-sm text-hawkins-text-muted font-sans line-clamp-3 mb-4 leading-relaxed">
                  {project.summary}
                </p>

                {/* Key Metrics */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.metrics.slice(0, 2).map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[10px] font-mono rounded bg-hawkins-surface border border-hawkins-border text-hawkins-text-dim flex items-center gap-1"
                      >
                        <Activity className="w-3 h-3 text-hawkins-red" />
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.techStack.slice(0, 5).map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[10px] font-mono rounded bg-hawkins-void border border-hawkins-border/80 text-hawkins-text-dim"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.techStack.length > 5 && (
                    <span className="px-1.5 py-0.5 text-[10px] font-mono text-hawkins-text-dim">
                      +{project.techStack.length - 5}
                    </span>
                  )}
                </div>

                {/* Footer Action */}
                <div className="pt-3 border-t border-hawkins-border/60 flex items-center justify-between">
                  <span className="text-xs font-mono text-hawkins-amber group-hover:text-hawkins-red flex items-center gap-1 font-semibold transition-colors">
                    OPEN CASE DOSSIER
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-hawkins-text-dim hover:text-hawkins-text"
                        aria-label="GitHub Repository"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-hawkins-text-dim hover:text-hawkins-red"
                        aria-label="Live Experiment"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Project Dossier Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
