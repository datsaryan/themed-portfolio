import React, { useState } from 'react';
import { SkillCategory, WorldMode } from '../../types/portfolio';
import {
  Terminal,
  Server,
  Layout,
  Database,
  Wrench,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { strangerAudio } from '../../audio/soundEngine';

interface SkillsSectionProps {
  skills: SkillCategory[];
  world: WorldMode;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ skills, world }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(skills[0]?.id || 1);

  const getIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'terminal': return <Terminal className="w-4 h-4" />;
      case 'server': return <Server className="w-4 h-4" />;
      case 'layout': return <Layout className="w-4 h-4" />;
      case 'database': return <Database className="w-4 h-4" />;
      case 'wrench': return <Wrench className="w-4 h-4" />;
      case 'shieldcheck': return <ShieldCheck className="w-4 h-4" />;
      case 'cpu': return <Cpu className="w-4 h-4" />;
      default: return <Radio className="w-4 h-4" />;
    }
  };

  const selectedCategory = skills.find((s) => s.id === selectedCategoryId) || skills[0];

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 relative bg-hawkins-void/60">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-hawkins-border">
          <div>
            <div className="text-xs font-mono tracking-widest text-hawkins-amber uppercase font-semibold mb-1 flex items-center gap-2">
              <Radio className="w-4 h-4 text-hawkins-red" />
              SECTION 02 // TECHNICAL ARSENAL
            </div>
            <h2 className="text-3xl sm:text-4xl font-title text-hawkins-text tracking-wide">
              HAWKINS LABORATORY EQUIPMENT BOARD
            </h2>
          </div>
          <div className="mt-3 sm:mt-0 text-xs font-mono text-hawkins-text-dim">
            SYSTEM STATUS: ALL CHANNELS ENCRYPTED
          </div>
        </div>

        {/* FULL STACK ARCHITECTURAL FLOW BANNER */}
        <div className="mb-10 p-5 rounded-lg bg-hawkins-card border border-hawkins-border/90 shadow-case-file">
          <div className="text-[11px] font-mono text-hawkins-text-dim uppercase tracking-wider mb-3">
            VERIFIED FULL-STACK PIPELINE ARCHITECTURE:
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Step 1 */}
            <div className="p-3 bg-hawkins-surface border border-hawkins-border/70 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-hawkins-amber">01 // CLIENT TIER</span>
                <Layout className="w-3.5 h-3.5 text-hawkins-amber" />
              </div>
              <span className="text-sm font-mono font-bold text-hawkins-text">React.js + TypeScript</span>
              <span className="text-[11px] text-hawkins-text-muted mt-0.5">HTML5 • CSS3 • Tailwind</span>
            </div>

            {/* Step 2 */}
            <div className="p-3 bg-hawkins-surface border border-hawkins-border/70 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-hawkins-red">02 // GATEWAY TIER</span>
                <Radio className="w-3.5 h-3.5 text-hawkins-red" />
              </div>
              <span className="text-sm font-mono font-bold text-hawkins-text">REST API + JWT Auth</span>
              <span className="text-[11px] text-hawkins-text-muted mt-0.5">RBAC • Stateless Tokens</span>
            </div>

            {/* Step 3 */}
            <div className="p-3 bg-hawkins-surface border border-hawkins-border/70 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-hawkins-amber">03 // SERVICE TIER</span>
                <Server className="w-3.5 h-3.5 text-hawkins-amber" />
              </div>
              <span className="text-sm font-mono font-bold text-hawkins-text">Java 21 + Spring Boot</span>
              <span className="text-[11px] text-hawkins-text-muted mt-0.5">Layered • JPA • Flyway</span>
            </div>

            {/* Step 4 */}
            <div className="p-3 bg-hawkins-surface border border-hawkins-border/70 rounded flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono text-hawkins-crt">04 // DATA TIER</span>
                <Database className="w-3.5 h-3.5 text-hawkins-crt" />
              </div>
              <span className="text-sm font-mono font-bold text-hawkins-text">SQL / PostgreSQL</span>
              <span className="text-[11px] text-hawkins-text-muted mt-0.5">MySQL • Schema Migrations</span>
            </div>
          </div>
        </div>

        {/* Categories Tab Navigation */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category List */}
          <div className="space-y-2">
            {skills.map((cat) => {
              const isSelected = cat.id === selectedCategory?.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    strangerAudio.playClickSound();
                    setSelectedCategoryId(cat.id);
                  }}
                  className={`w-full text-left p-3.5 rounded border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-hawkins-card border-hawkins-red text-hawkins-text shadow-hawkins-glow'
                      : 'bg-hawkins-surface/60 border-hawkins-border text-hawkins-text-muted hover:border-hawkins-border-light hover:text-hawkins-text'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isSelected ? 'text-hawkins-red' : 'text-hawkins-text-dim group-hover:text-hawkins-amber'}>
                      {getIcon(cat.icon)}
                    </span>
                    <div>
                      <div className="text-xs font-mono font-semibold">{cat.category}</div>
                      <div className="text-[10px] font-mono text-hawkins-text-dim uppercase tracking-wider">
                        {cat.suitModule || 'ACTIVE MODULE'}
                      </div>
                    </div>
                  </div>
                  <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-hawkins-red translate-x-1' : 'opacity-0'}`} />
                </button>
              );
            })}
          </div>

          {/* Detailed Arsenal Display */}
          {selectedCategory && (
            <div className="lg:col-span-2 case-file-border rounded-lg p-6 sm:p-8 bg-hawkins-card/90 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-hawkins-border mb-6">
                  <div>
                    <span className="text-[10px] font-mono text-hawkins-amber uppercase tracking-widest">
                      {selectedCategory.suitModule}
                    </span>
                    <h3 className="text-2xl font-title text-hawkins-text tracking-wide mt-1">
                      {selectedCategory.category}
                    </h3>
                  </div>
                  <div className="p-2.5 rounded bg-hawkins-surface border border-hawkins-border text-hawkins-red">
                    {getIcon(selectedCategory.icon)}
                  </div>
                </div>

                <p className="text-sm text-hawkins-text-muted font-sans leading-relaxed mb-6">
                  {selectedCategory.description}
                </p>

                {/* Skills Grid */}
                <div>
                  <span className="text-xs font-mono text-hawkins-text-dim uppercase tracking-wider block mb-3">
                    ACTIVE WEAPONS &amp; CAPABILITIES:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {selectedCategory.skills.map((skill, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded bg-hawkins-surface border border-hawkins-border flex items-center gap-2 hover:border-hawkins-red/60 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-hawkins-crt shrink-0" />
                        <span className="text-xs font-mono text-hawkins-text font-medium">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-hawkins-border/60 flex items-center justify-between text-[11px] font-mono text-hawkins-text-dim">
                <span>CHANNEL FREQUENCY: OPTIMAL</span>
                <span>SECURITY LEVEL: SECRET</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
