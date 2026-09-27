import { useState } from 'react';
import { ProjectItem } from '../types/portfolio';
import { ProjectModal } from './ProjectModal';
import { strangerAudio } from '../audio/soundEngine';
import { FolderGit2, ExternalLink, ArrowRight, Star } from 'lucide-react';
import { GithubIcon } from './Icons';

interface ProjectsSectionProps {
  projects: ProjectItem[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  return (
    <section id="projects" className="py-20 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase mb-2">
            EXPERIMENTS &amp; DEPLOYMENTS // CLASSIFIED
          </p>
          <h2 className="stranger-title text-3xl sm:text-5xl font-bold tracking-wider">
            CASE FILES &bull; MISSIONS
          </h2>
          <div className="w-24 h-0.5 bg-red-600 mx-auto mt-4" />
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, idx) => {
            const techList = project.techStack.split(',').map((t) => t.trim());
            return (
              <div
                key={project.title}
                className="case-file-card rounded-lg p-6 sm:p-8 flex flex-col justify-between border border-red-950/70 hover:border-red-600 transition-all duration-300 relative group"
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-red-500" />
                    <span className="font-mono text-xs text-red-400 tracking-wider">
                      CASE FILE #00{project.id || idx + 1}
                    </span>
                  </div>
                  {project.featured && (
                    <span className="flex items-center gap-1 font-mono text-[10px] bg-red-950/60 border border-red-800 text-red-300 px-2 py-0.5 rounded uppercase">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      PRIORITY ALPHA
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="stranger-title text-xl sm:text-2xl font-bold mb-3 group-hover:text-red-400 transition-colors">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-gray-300 font-sans text-sm line-clamp-3 leading-relaxed mb-6 font-light">
                  {project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {techList.slice(0, 5).map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 text-[11px] font-mono bg-[#111122] border border-gray-800 text-gray-300 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {techList.length > 5 && (
                    <span className="px-2 py-0.5 text-[11px] font-mono bg-[#111122] text-gray-500 rounded">
                      +{techList.length - 5} more
                    </span>
                  )}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-800/80">
                  <button
                    onClick={() => {
                      strangerAudio.playClick();
                      setSelectedProject(project);
                    }}
                    className="flex items-center gap-1.5 font-mono text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    INSPECT DOSSIER <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-3">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => strangerAudio.playClick()}
                        className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                        title="View Source on GitHub"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => strangerAudio.playClick()}
                        className="p-1.5 rounded text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                        title="View Live Application"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
