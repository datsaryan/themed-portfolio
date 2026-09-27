import { useEffect } from 'react';
import { ProjectItem } from '../types/portfolio';
import { strangerAudio } from '../audio/soundEngine';
import { X, ExternalLink, FileCode, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './Icons';

interface ProjectModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!project) return null;

  const techList = project.techStack.split(',').map((t) => t.trim());

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="case-file-card rounded-lg border-2 border-red-800 bg-[#0d0d18] max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-red-950 pb-4 mb-6">
          <div>
            <span className="font-mono text-xs text-red-500 tracking-[0.2em] uppercase">
              CASE FILE #00{project.id || 1} &bull; FULL DOSSIER
            </span>
            <h3 className="stranger-title text-2xl sm:text-3xl font-bold mt-1">
              {project.title}
            </h3>
          </div>
          <button
            onClick={() => {
              strangerAudio.playClick();
              onClose();
            }}
            className="p-1 rounded text-gray-400 hover:text-red-400 hover:bg-red-950/40"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div>
            <h4 className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-red-400" /> MISSION SCOPE &amp; SPECIFICATIONS
            </h4>
            <p className="text-gray-300 font-sans text-sm sm:text-base leading-relaxed">
              {project.description}
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" /> DEPLOYED TECHNOLOGIES
            </h4>
            <div className="flex flex-wrap gap-2">
              {techList.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded bg-[#16162a] border border-red-950 text-red-300 font-mono text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Links */}
          <div className="pt-4 border-t border-gray-800 flex flex-wrap gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => strangerAudio.playClick()}
                className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-600 text-white font-mono text-xs tracking-wider rounded transition-all shadow-[0_0_15px_rgba(229,62,62,0.4)]"
              >
                <GithubIcon className="w-4 h-4" />
                REPOSITORY ACCESS
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => strangerAudio.playClick()}
                className="flex items-center gap-2 px-4 py-2 bg-[#1b1b30] hover:bg-[#252542] border border-red-900/60 text-red-300 font-mono text-xs tracking-wider rounded transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                LIVE TRANSMISSION
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
