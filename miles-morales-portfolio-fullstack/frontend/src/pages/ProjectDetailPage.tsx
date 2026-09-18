import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useResumeData } from '../data/useResumeData';
import { ArrowLeft, ExternalLink, Github, Terminal, CheckCircle2, Shield, Calendar } from 'lucide-react';
import { sound } from '../audio/soundEngine';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { missions } = useResumeData();

  const project = missions.find((m) => m.id === id);

  // Land at the top of the page whenever a new mission dossier is opened
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [id]);

  if (!project) {
    return (
      <div className="pt-32 pb-24 px-4 sm:px-6 max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
        <h1 className="font-display text-4xl text-headline uppercase tracking-tight">
          Dossier Not Found
        </h1>
        <p className="font-mono text-sm text-subtext">
          No mission record matches this ID.
        </p>
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 px-6 py-3 bg-spider hover:bg-spider-bright text-white font-mono text-xs uppercase font-bold tracking-widest transition-colors shadow-comic-black"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Missions
        </Link>
      </div>
    );
  }

  const goBack = () => {
    sound.playClick();
    navigate('/#projects');
  };

  return (
    <div className="relative pt-24 pb-20 px-4 sm:px-6 max-w-4xl mx-auto text-web">
      {/* Back link */}
      <button
        onClick={goBack}
        className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 bg-surface hover:bg-spider text-subtext hover:text-white font-mono text-xs uppercase font-bold tracking-wider border border-borderDark transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Missions
      </button>

      <div className="relative bg-ink/95 border-2 border-spider/80 shadow-2xl comic-cut">
        {/* Top Banner */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-borderDark/60 bg-surface/50">
          <div className="text-[10px] font-mono text-spider font-bold tracking-widest uppercase flex items-center gap-2">
            <span>// CLASSIFIED DOSSIER</span>
            <span className="text-headline/40">|</span>
            <span>{project.missionNumber}</span>
          </div>
          <span className="text-[10px] font-mono text-subtext/70 hidden sm:block">
            EARTH-1610 PROTOCOL
          </span>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6">
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

            <h1 className="text-3xl sm:text-5xl font-display uppercase tracking-wide text-headline">
              {project.title}
            </h1>
            <p className="text-sm sm:text-base text-subtext mt-1 font-sans">
              {project.subtitle}
            </p>
          </div>

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

          <div className="p-4 bg-surface/50 border-l-4 border-spider">
            <p className="text-sm sm:text-base leading-relaxed text-paper">
              {project.summary}
            </p>
          </div>

          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-subtext mb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-spider" />
              Technical Execution & Architecture
            </h2>
            <div className="space-y-3">
              {project.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-paper/90 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-spider mt-1 flex-shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-subtext mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-venom-purple" />
              Suit Sub-Systems / Technologies
            </h2>
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

        {/* Actions */}
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
            onClick={goBack}
            className="ml-auto px-4 py-2.5 bg-ink hover:bg-concrete text-subtext hover:text-headline font-mono text-xs uppercase transition-colors border border-borderDark"
          >
            Back to Missions
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
