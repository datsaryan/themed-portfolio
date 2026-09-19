import React from 'react';
import { Certification, EducationItem, ExperienceItem, WorldMode } from '../../types/portfolio';
import { Archive, Calendar, Award, ExternalLink, Briefcase, GraduationCap, Code2 } from 'lucide-react';
import { strangerAudio } from '../../audio/soundEngine';

interface TimelineSectionProps {
  certifications: Certification[];
  education: EducationItem[];
  experience: ExperienceItem[];
  world: WorldMode;
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ certifications, education, experience, world }) => {
  return (
    <section id="timeline" className="py-20 px-4 sm:px-6 relative bg-hawkins-void/70">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-hawkins-border">
          <div>
            <div className="text-xs font-mono tracking-widest text-hawkins-amber uppercase font-semibold mb-1 flex items-center gap-2">
              <Archive className="w-4 h-4 text-hawkins-red" />
              SECTION 04 // HAWKINS ARCHIVES
            </div>
            <h2 className="text-3xl sm:text-4xl font-title text-hawkins-text tracking-wide">
              CHRONOLOGICAL EVIDENCE &amp; CREDENTIALS
            </h2>
          </div>
          <div className="mt-3 sm:mt-0 text-xs font-mono text-hawkins-text-dim">
            VERIFIED REPOSITORIES // DEPT. OF ENERGY
          </div>
        </div>

        {/* Timeline Records */}
        <div className="relative border-l-2 border-hawkins-border/80 ml-4 sm:ml-6 space-y-8 pb-4">
          {/* 1. Degree Record */}
          {education.map((edu) => (
            <div key={edu.id} className="relative pl-6 sm:pl-8 group">
              {/* Timeline Marker */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-hawkins-void border-2 border-hawkins-red flex items-center justify-center group-hover:scale-125 transition-transform" />

              <div className="case-file-border rounded-lg p-5 bg-hawkins-card/85">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-hawkins-amber" />
                    <span className="text-xs font-mono font-bold text-hawkins-amber uppercase">
                      ACADEMIC APPOINTMENT
                    </span>
                  </div>
                  <span className="text-xs font-mono text-hawkins-text-dim flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {edu.timeline}
                  </span>
                </div>

                <h3 className="text-lg font-mono font-bold text-hawkins-text">
                  {edu.degree}
                </h3>
                <div className="text-xs text-hawkins-text-muted font-sans mb-3">
                  {edu.institution} — Cumulative Grade: <strong className="text-hawkins-crt">{edu.cgpa}</strong>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {edu.relevantCoursework.slice(0, 6).map((c, i) => (
                    <span key={i} className="px-2 py-0.5 text-[10px] font-mono rounded bg-hawkins-surface border border-hawkins-border text-hawkins-text-dim">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* 2. Professional Experience Records */}
          {experience.map((exp) => (
            <div key={exp.id} className="relative pl-6 sm:pl-8 group">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-hawkins-void border-2 border-hawkins-amber flex items-center justify-center group-hover:scale-125 transition-transform" />

              <div className="case-file-border rounded-lg p-5 bg-hawkins-card/85">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-hawkins-red" />
                    <span className="text-xs font-mono font-bold text-hawkins-red uppercase">
                      PRACTICAL FIELD MISSION
                    </span>
                  </div>
                  <span className="text-xs font-mono text-hawkins-text-dim flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.dates}
                  </span>
                </div>

                <h3 className="text-lg font-mono font-bold text-hawkins-text">
                  {exp.role} — <span className="text-hawkins-text-muted">{exp.organization}</span>
                </h3>
                <p className="text-xs sm:text-sm text-hawkins-text-muted font-sans my-2 leading-relaxed">
                  {exp.description}
                </p>

                <ul className="space-y-1 my-3 text-xs text-hawkins-text-dim font-sans">
                  {exp.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-1.5">
                      <span className="text-hawkins-amber font-mono font-bold">›</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-1.5 pt-2 border-t border-hawkins-border/50">
                  {exp.techStack.map((tech, ti) => (
                    <span key={ti} className="px-2 py-0.5 text-[10px] font-mono rounded bg-hawkins-surface border border-hawkins-border text-hawkins-amber">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* 3. Verified Certifications & Workshops */}
          {certifications.map((cert) => (
            <div key={cert.id} className="relative pl-6 sm:pl-8 group">
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-hawkins-void border-2 border-hawkins-crt flex items-center justify-center group-hover:scale-125 transition-transform" />

              <div className="case-file-border rounded-lg p-5 bg-hawkins-card/85">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-hawkins-crt" />
                    <span className="text-xs font-mono font-bold text-hawkins-crt uppercase">
                      {cert.type}
                    </span>
                  </div>
                  {cert.dates && (
                    <span className="text-xs font-mono text-hawkins-text-dim flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {cert.dates}
                    </span>
                  )}
                </div>

                <h3 className="text-base sm:text-lg font-mono font-semibold text-hawkins-text">
                  {cert.title}
                </h3>
                {cert.issuer && (
                  <div className="text-xs font-mono text-hawkins-text-dim mb-2">
                    Issued by: {cert.issuer}
                  </div>
                )}

                <p className="text-xs text-hawkins-text-muted font-sans leading-relaxed mb-3">
                  {cert.description}
                </p>

                {cert.link && (
                  <div className="pt-2 border-t border-hawkins-border/50">
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => strangerAudio.playClickSound()}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-hawkins-amber hover:text-hawkins-red transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      VERIFY OFFICIAL CREDENTIAL
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
