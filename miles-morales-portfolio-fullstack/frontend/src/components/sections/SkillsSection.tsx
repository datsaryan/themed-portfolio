import React, { useState } from 'react';
import { useResumeData } from '../../data/useResumeData';
import { Cpu, Server, Layout, Database, Wrench, ShieldCheck, Terminal, CheckCircle2 } from 'lucide-react';
import { sound } from '../../audio/soundEngine';
import { Reveal, RevealStagger, RevealItem } from '../effects/ScrollReveal';

export const SkillsSection: React.FC = () => {
  const { skillCategories } = useResumeData();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [rippleCategory, setRippleCategory] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Terminal':
        return <Terminal className="w-5 h-5 text-spider" />;
      case 'Server':
        return <Server className="w-5 h-5 text-venom-purple" />;
      case 'Layout':
        return <Layout className="w-5 h-5 text-graffiti-yellow" />;
      case 'Database':
        return <Database className="w-5 h-5 text-graffiti-cyan" />;
      case 'Wrench':
        return <Wrench className="w-5 h-5 text-spider-bright" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-green-400" />;
      default:
        return <Cpu className="w-5 h-5 text-paper" />;
    }
  };

  const handleCategoryClick = (category: string) => {
    const isSelected = selectedCategory === category;
    // Ripple flash
    setRippleCategory(category);
    setTimeout(() => setRippleCategory(null), 420);
    // Sound: click + thwip combo
    sound.playClick();
    sound.playThwip();
    setSelectedCategory(isSelected ? null : category);
  };

  return (
    <section id="skills" className="relative py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Section Header */}
      <Reveal className="mb-12">
        <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-widest text-spider font-bold">
          <Cpu className="w-4 h-4" />
          <span>SUIT MODULES // 02</span>
          <span className="text-borderDark">————</span>
          <span className="text-subtext">TECHNICAL CAPABILITIES</span>
        </div>
        <h2 className="font-display text-4xl sm:text-6xl text-headline uppercase tracking-tight flex items-center gap-3">
          <span>THE SUIT</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-spider via-venom-purple to-graffiti-yellow">
            SYSTEMS
          </span>
        </h2>
        <p className="text-sm sm:text-base text-subtext mt-2 font-mono">
          // ZERO ARBITRARY PERCENTAGES. RIGOROUS SKILLS EXTRACTED DIRECTLY FROM VERIFIED PRODUCTION WORK.
        </p>
      </Reveal>

      {/* Skills Matrix Grid */}
      <RevealStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skillCategories.map((cat) => {
          const isSelected = selectedCategory === cat.category;
          const isRippling = rippleCategory === cat.category;
          return (
            <RevealItem
              key={cat.category}
              onClick={() => handleCategoryClick(cat.category)}
              className={`relative bg-surface/90 border p-6 comic-border cursor-pointer transition-all overflow-hidden ${
                isSelected
                  ? 'border-spider shadow-comic-hard bg-surface'
                  : isRippling
                  ? 'border-spider shadow-[0_0_20px_3px_rgba(230,36,41,0.5)]'
                  : 'border-borderDark hover:border-spider/60'
              }`}
            >
              {/* Radial spider-red ripple flash on click */}
              <div
                className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
                  isRippling ? 'opacity-100' : 'opacity-0'
                }`}
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(230,36,41,0.22) 0%, rgba(230,36,41,0.06) 55%, transparent 80%)',
                }}
              />

              {/* Top Module Tape */}
              <div className="flex items-center justify-between border-b border-borderDark/80 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  {getIcon(cat.icon)}
                  <span className="font-mono text-xs font-bold text-headline uppercase tracking-wider">
                    {cat.category}
                  </span>
                </div>
                <span className="text-[10px] font-mono text-subtext bg-ink px-2 py-0.5 border border-borderDark">
                  {cat.suitModule}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs font-sans text-subtext mb-5 leading-relaxed">
                {cat.description}
              </p>

              {/* Skills Tags / Suit Nodes */}
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-ink text-paper font-mono text-xs font-medium border border-borderDark/80 hover:border-spider hover:text-headline transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-spider" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>

              {/* Bottom Telemetry Status */}
              <div className="mt-5 pt-3 border-t border-borderDark/40 flex items-center justify-between text-[10px] font-mono text-subtext">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-spider" />
                  VERIFIED IN RESUME
                </span>
                <span className="text-spider font-bold">STATUS: DEPLOYABLE</span>
              </div>
            </RevealItem>
          );
        })}
      </RevealStagger>
    </section>
  );
};
