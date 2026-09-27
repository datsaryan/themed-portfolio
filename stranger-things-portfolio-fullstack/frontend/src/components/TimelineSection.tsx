import { EducationItem, ExperienceItem } from '../types/portfolio';
import { Briefcase, GraduationCap, Calendar, MapPin } from 'lucide-react';

interface TimelineSectionProps {
  education: EducationItem[];
  experience: ExperienceItem[];
}

export function TimelineSection({ education, experience }: TimelineSectionProps) {
  return (
    <section id="timeline" className="py-20 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase mb-2">
            CHRONOLOGICAL LOGS // 1983 - 1986
          </p>
          <h2 className="stranger-title text-3xl sm:text-5xl font-bold tracking-wider">
            MISSION TIMELINE
          </h2>
          <div className="w-24 h-0.5 bg-red-600 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Experience Column */}
          <div>
            <div className="flex items-center gap-3 mb-8 border-b border-red-950 pb-3">
              <Briefcase className="w-5 h-5 text-red-500" />
              <h3 className="font-mono text-lg font-bold text-white tracking-wider">
                FIELD EXPERIENCE &bull; MISSIONS
              </h3>
            </div>

            <div className="space-y-6 relative border-l-2 border-red-900/40 ml-3 pl-6">
              {experience.map((exp) => (
                <div key={exp.organization} className="relative group">
                  {/* Timeline Node Indicator */}
                  <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-red-600 border-2 border-[#0a0a0f] shadow-[0_0_8px_rgba(229,62,62,0.8)]" />

                  <div className="case-file-card rounded-lg p-5 border border-red-950/60">
                    <div className="flex items-center justify-between text-xs font-mono text-red-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {exp.startDate} &mdash; {exp.endDate}
                      </span>
                      {exp.isCurrent && (
                        <span className="bg-red-900/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                          ACTIVE
                        </span>
                      )}
                    </div>

                    <h4 className="font-mono text-base font-bold text-white mb-1">
                      {exp.role}
                    </h4>
                    <p className="font-mono text-xs text-amber-400 mb-3">
                      {exp.organization}
                    </p>

                    <p className="text-gray-300 font-sans text-xs sm:text-sm leading-relaxed mb-3 font-light">
                      {exp.description}
                    </p>

                    {exp.skillsUsed && (
                      <div className="pt-2 border-t border-gray-800 text-[11px] font-mono text-gray-400">
                        <strong className="text-red-400">STACK:</strong> {exp.skillsUsed}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div>
            <div className="flex items-center gap-3 mb-8 border-b border-red-950 pb-3">
              <GraduationCap className="w-5 h-5 text-amber-500" />
              <h3 className="font-mono text-lg font-bold text-white tracking-wider">
                ACADEMIC TRAINING &bull; CLEARANCES
              </h3>
            </div>

            <div className="space-y-6 relative border-l-2 border-amber-900/40 ml-3 pl-6">
              {education.map((edu) => (
                <div key={edu.institution} className="relative group">
                  {/* Timeline Node Indicator */}
                  <span className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-amber-500 border-2 border-[#0a0a0f] shadow-[0_0_8px_rgba(246,173,85,0.8)]" />

                  <div className="case-file-card rounded-lg p-5 border border-red-950/60">
                    <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {edu.startYear} &mdash; {edu.endYear} {edu.expected && '(EXPECTED)'}
                      </span>
                      <span className="bg-amber-950/60 border border-amber-800/60 text-amber-300 text-[10px] px-2 py-0.5 rounded">
                        CGPA: {edu.cgpa}
                      </span>
                    </div>

                    <h4 className="font-mono text-base font-bold text-white mb-1">
                      {edu.degree} in {edu.fieldOfStudy}
                    </h4>
                    <p className="font-mono text-xs text-gray-400 mb-3 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-red-500" /> {edu.institution}
                    </p>

                    <p className="text-gray-300 font-sans text-xs sm:text-sm leading-relaxed font-light">
                      {edu.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
