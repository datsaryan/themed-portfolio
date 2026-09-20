import React from 'react';
import { useResumeData } from '../../data/useResumeData';
import { User, GraduationCap, BookOpen, Terminal, Shield } from 'lucide-react';
import { sound } from '../../audio/soundEngine';

export const AboutSection: React.FC = () => {
  const { personal, education } = useResumeData();

  return (
    <section id="about" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-spider font-bold">
          <User className="w-4 h-4" />
          <span>DOSSIER // 01</span>
          <span className="text-borderDark">————</span>
          <span className="text-subtext">BACKGROUND PROTOCOL</span>
        </div>
        <h2 className="font-display text-4xl sm:text-6xl text-headline uppercase tracking-tight flex items-center gap-3">
          <span>THE PERSON BEHIND</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-spider to-venom-purple">
            THE MASK
          </span>
        </h2>
      </div>

      {/* Comic Panel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Panel 1: Origin Philosophy & Engineering Mindset */}
        <div className="lg:col-span-7 bg-surface/90 border border-borderDark comic-border p-6 sm:p-8 relative overflow-hidden">
          {/* Halftone texture inside */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-halftone-red opacity-15 pointer-events-none" />

          <div className="flex items-center justify-between border-b border-borderDark/80 pb-3 mb-6">
            <span className="font-mono text-xs text-graffiti-yellow font-bold uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4 text-spider" />
              FULL-STACK ENGINEERING DNA
            </span>
            <span className="text-[10px] font-mono text-subtext bg-void px-2 py-0.5 border border-borderDark">
              EARTH-1610 ARCHIVE
            </span>
          </div>

          <div className="space-y-4 text-paper/90 leading-relaxed font-sans text-sm sm:text-base">
            <p>
              I am a <strong className="text-headline font-semibold">Full Stack Engineer</strong> and Computer Science undergraduate with hands-on experience designing end-to-end web applications. My work spans the entire lifecycle: from relational schema design and Spring Boot REST micro-architectures to high-performance React frontends.
            </p>
            <p>
              I specialize in robust software infrastructure — implementing practical authentication, role-based access control (RBAC), multi-tenant isolation, and continuous Flyway database migrations.
            </p>
            <p>
              Beyond feature engineering, I maintain a disciplined algorithmic foundation through active daily problem-solving on LeetCode, mastering Data Structures, Graph algorithms, and System Design fundamentals.
            </p>
          </div>

          {/* Key Traits Chips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 mt-6 border-t border-borderDark/70">
            <div className="bg-ink/70 border border-borderDark p-3">
              <div className="font-mono text-xs text-spider font-bold uppercase">Multi-Tenancy</div>
              <div className="text-[11px] text-subtext mt-1">Tenant-isolated schemas & data boundaries</div>
            </div>
            <div className="bg-ink/70 border border-borderDark p-3">
              <div className="font-mono text-xs text-venom-purple font-bold uppercase">Security & Auth</div>
              <div className="text-[11px] text-subtext mt-1">JWT token pipelines & granular RBAC</div>
            </div>
            <div className="bg-ink/70 border border-borderDark p-3">
              <div className="font-mono text-xs text-graffiti-yellow font-bold uppercase">Rigorous QA</div>
              <div className="text-[11px] text-subtext mt-1">80%+ test coverage with JUnit & Mockito</div>
            </div>
          </div>
        </div>

        {/* Side Panel 2: Academic Origin Arc & Coursework */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Education Card */}
          <div className="bg-ink/90 border border-spider/50 comic-border p-6 relative">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-spider" />
              <span className="font-mono text-xs text-spider font-bold uppercase tracking-wider">
                TRAINING ARC // EDUCATION
              </span>
            </div>

            <h3 className="font-display text-2xl text-headline uppercase tracking-wide">
              {education.institution}
            </h3>
            <p className="text-sm text-subtext mt-1 font-mono">
              {education.degree}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="px-3 py-1 bg-surface border border-spider text-headline font-mono text-xs font-bold">
                CGPA: {education.cgpa}
              </div>
              <div className="px-3 py-1 bg-surface border border-borderDark text-graffiti-yellow font-mono text-xs">
                {education.timeline}
              </div>
            </div>
          </div>

          {/* Relevant Coursework Panel */}
          <div className="bg-surface/80 border border-borderDark p-6 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-graffiti-yellow" />
                <span className="font-mono text-xs text-subtext uppercase tracking-wider font-semibold">
                  RELEVANT ACADEMIC COURSEWORK
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {education.relevantCoursework.map((course) => (
                  <span
                    key={course}
                    className="px-2.5 py-1 bg-ink text-paper/80 font-mono text-xs border border-borderDark hover:border-spider hover:text-headline transition-colors cursor-default"
                  >
                    {course}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume verification stamp */}
            <div className="mt-6 pt-4 border-t border-borderDark/60 flex items-center justify-between font-mono text-[10px] text-subtext">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-spider" />
                VERIFIED VIA RESUME
              </span>
              <a
                href={personal.links.leetcode}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => sound.playClick()}
                className="text-spider hover:underline font-bold"
              >
                LEETCODE PROFILE &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
