import React from 'react';
import { useResumeData } from '../../data/useResumeData';
import { Award, ExternalLink, Calendar, CheckCircle2, BookmarkCheck, Sparkles, MapPin } from 'lucide-react';
import { sound } from '../../audio/soundEngine';

export const TimelineSection: React.FC = () => {
  const { education, credentials } = useResumeData();

  return (
    <section id="timeline" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-spider font-bold">
          <Award className="w-4 h-4" />
          <span>ORIGIN & CREDENTIALS // 04</span>
          <span className="text-borderDark">————</span>
          <span className="text-subtext">EXPERIENCE & VERIFIED CERTIFICATIONS</span>
        </div>
        <h2 className="font-display text-4xl sm:text-6xl text-white uppercase tracking-tight flex items-center gap-3">
          <span>THE JOURNEY &</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-spider via-graffiti-yellow to-venom-purple">
            CREDENTIALS
          </span>
        </h2>
        <p className="text-sm sm:text-base text-subtext mt-2 font-mono">
          // CHRONICLED OPERATIONAL TIMELINE & VERIFIED INSTITUTIONAL RECORDS
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Education & Training Arc */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-surface/90 border border-borderDark comic-border p-6 relative">
            <div className="flex items-center gap-2 mb-4 font-mono text-xs text-spider font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>CORE ACADEMIC STATION</span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide">
              {education.institution}
            </h3>
            <p className="text-sm font-mono text-subtext mt-1">
              {education.degree}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-ink text-white font-mono text-xs border border-spider font-bold">
                CGPA: {education.cgpa}
              </span>
              <span className="px-3 py-1 bg-ink text-graffiti-yellow font-mono text-xs border border-borderDark flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {education.timeline}
              </span>
              <span className="px-3 py-1 bg-ink text-subtext font-mono text-xs border border-borderDark flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-spider" />
                Raigarh, India
              </span>
            </div>

            <div className="mt-6 pt-4 border-t border-borderDark/80">
              <div className="font-mono text-xs text-subtext uppercase tracking-wider mb-2">
                Focused Engineering Curricula:
              </div>
              <div className="text-xs text-paper/80 leading-relaxed font-sans">
                Comprehensive training in distributed networks, artificial intelligence, neural networks & deep learning, database systems, and modern operating system kernels.
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Experience, Workshops & Certifications Timeline */}
        <div className="lg:col-span-7">
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-spider before:via-venom-purple before:to-borderDark">
            {credentials.map((item, idx) => (
              <div
                key={idx}
                className="relative bg-surface/80 border border-borderDark comic-border p-5 sm:p-6 transition-all hover:border-spider/80"
              >
                {/* Spider Node Marker on timeline */}
                <div className="absolute -left-[27px] sm:-left-[35px] top-6 w-4 h-4 bg-void border-2 border-spider rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-1.5 bg-spider rounded-full" />
                </div>

                {/* Top Tape */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs text-spider font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <BookmarkCheck className="w-4 h-4" />
                    {item.issuer}
                  </span>
                  {item.dates && (
                    <span className="font-mono text-[11px] text-subtext bg-ink px-2 py-0.5 border border-borderDark">
                      {item.dates}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-display text-xl text-white uppercase tracking-wide">
                  {item.title}
                </h4>

                {/* Description */}
                <p className="text-xs sm:text-sm font-sans text-paper/80 mt-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Link if available */}
                {item.link && (
                  <div className="mt-4 pt-3 border-t border-borderDark/60 flex items-center justify-between">
                    <span className="font-mono text-[10px] text-subtext flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-spider" />
                      AUTHENTIC RESUME ATTESTATION
                    </span>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => sound.playClick()}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-ink hover:bg-spider text-white font-mono text-xs uppercase font-bold border border-borderDark transition-colors shadow-comic-black"
                    >
                      <span>VIEW CREDENTIAL</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
