import React from 'react';
import { ProfileData, WorldMode } from '../../types/portfolio';
import { GraduationCap, Award, MapPin, Mail, Phone, BookOpen, Fingerprint } from 'lucide-react';

interface AboutSectionProps {
  personal: ProfileData;
  world: WorldMode;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ personal, world }) => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 relative">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-hawkins-border">
          <div>
            <div className="text-xs font-mono tracking-widest text-hawkins-red uppercase font-semibold mb-1 flex items-center gap-2">
              <Fingerprint className="w-4 h-4" />
              SECTION 01 // PERSONNEL DOSSIER
            </div>
            <h2 className="text-3xl sm:text-4xl font-title text-hawkins-text tracking-wide">
              THE PERSON BEHIND THE SIGNAL
            </h2>
          </div>
          <div className="mt-3 sm:mt-0">
            <span className="classified-stamp text-xs">
              CONFIDENTIAL // FILE NO. 8602
            </span>
          </div>
        </div>

        {/* Dossier Card */}
        <div className="case-file-border rounded-lg p-6 sm:p-8 bg-hawkins-card/80 backdrop-blur">
          {/* Header Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-6 border-b border-hawkins-border/60">
            {/* Identity Photo / Badge */}
            <div className="flex flex-col items-center justify-center p-6 bg-hawkins-surface/90 border border-hawkins-border rounded">
              <div className="relative w-28 h-28 rounded-full border-2 border-hawkins-red/60 p-1 flex items-center justify-center mb-3">
                <div className="w-full h-full rounded-full bg-hawkins-void flex items-center justify-center overflow-hidden">
                  <span className="font-title text-3xl text-hawkins-amber font-bold">
                    AS
                  </span>
                </div>
                <div className="absolute -bottom-1 -right-1 bg-hawkins-red text-white text-[9px] font-mono px-1.5 py-0.5 rounded font-bold">
                  011
                </div>
              </div>
              <span className="font-title text-base text-hawkins-text font-semibold">{personal.name}</span>
              <span className="text-xs font-mono text-hawkins-text-dim mt-0.5">{personal.title}</span>
              <span className="text-[10px] font-mono text-hawkins-crt mt-2 px-2 py-0.5 rounded bg-hawkins-void border border-hawkins-border">
                {personal.status}
              </span>
            </div>

            {/* Core Credentials & Coordinates */}
            <div className="md:col-span-2 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[11px] font-mono text-hawkins-amber uppercase tracking-wider block mb-1">
                  OFFICIAL SUMMARY // SUBJECT BACKGROUND
                </span>
                <p className="text-sm text-hawkins-text leading-relaxed font-sans">
                  {personal.summary}
                </p>
              </div>

              {/* Coordinates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-mono text-hawkins-text-muted">
                  <MapPin className="w-4 h-4 text-hawkins-red shrink-0" />
                  <span>{personal.location}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-hawkins-text-muted">
                  <Mail className="w-4 h-4 text-hawkins-amber shrink-0" />
                  <a href={`mailto:${personal.email}`} className="hover:text-hawkins-text truncate">
                    {personal.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-hawkins-text-muted">
                  <Phone className="w-4 h-4 text-hawkins-crt shrink-0" />
                  <span>{personal.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-hawkins-text-muted">
                  <GraduationCap className="w-4 h-4 text-hawkins-red shrink-0" />
                  <span>CGPA: {personal.cgpa}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Records */}
          <div className="mt-6 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-hawkins-amber uppercase tracking-wider mb-4">
              <BookOpen className="w-4 h-4 text-hawkins-amber" />
              ACADEMIC VERIFICATION // OP JINDAL UNIVERSITY
            </div>

            <div className="bg-hawkins-surface/60 p-4 rounded border border-hawkins-border/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="text-base font-semibold text-hawkins-text font-mono">
                  {personal.degree}
                </h3>
                <span className="text-xs text-hawkins-text-muted font-sans">
                  {personal.institution}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-hawkins-amber font-semibold block">
                  {personal.timeline}
                </span>
                <span className="text-xs font-mono text-hawkins-crt">
                  Cumulative Grade: {personal.cgpa}
                </span>
              </div>
            </div>

            {/* Coursework Tags */}
            <div>
              <span className="text-[11px] font-mono text-hawkins-text-dim uppercase tracking-wider block mb-2">
                VERIFIED RIGOROUS COURSEWORK:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {personal.relevantCoursework.map((course, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 text-xs font-mono rounded bg-hawkins-void border border-hawkins-border/80 text-hawkins-text-muted hover:text-hawkins-text hover:border-hawkins-border transition-colors"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
