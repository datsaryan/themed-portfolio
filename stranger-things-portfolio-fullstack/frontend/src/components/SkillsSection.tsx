import { useState } from 'react';
import { SkillCategory } from '../types/portfolio';
import { strangerAudio } from '../audio/soundEngine';
import { Cpu, Terminal, Layers, Database, Wrench, CheckCircle, BookOpen } from 'lucide-react';

interface SkillsSectionProps {
  skillCategories: SkillCategory[];
}

export function SkillsSection({ skillCategories }: SkillsSectionProps) {
  const [activeCategory, setActiveCategory] = useState<number>(0);

  const getCategoryIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'languages':
        return <Terminal className="w-4 h-4 text-red-400" />;
      case 'backend & apis':
        return <Cpu className="w-4 h-4 text-amber-400" />;
      case 'frontend':
        return <Layers className="w-4 h-4 text-blue-400" />;
      case 'databases':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'devops & tools':
        return <Wrench className="w-4 h-4 text-purple-400" />;
      case 'testing':
        return <CheckCircle className="w-4 h-4 text-yellow-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-pink-400" />;
    }
  };

  const selectedCategory = skillCategories[activeCategory] || skillCategories[0];

  return (
    <section id="skills" className="py-20 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <p className="font-mono text-xs text-red-500 tracking-[0.3em] uppercase mb-2">
            SYSTEM CAPABILITIES // HAWKINS SPEC
          </p>
          <h2 className="stranger-title text-3xl sm:text-5xl font-bold tracking-wider">
            TECHNICAL PROTOCOLS
          </h2>
          <div className="w-24 h-0.5 bg-red-600 mx-auto mt-4" />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {skillCategories.map((cat, idx) => (
            <button
              key={cat.categoryName}
              onClick={() => {
                strangerAudio.playClick();
                setActiveCategory(idx);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded font-mono text-xs tracking-wider transition-all duration-200 border ${
                activeCategory === idx
                  ? 'bg-red-950/60 border-red-600 text-white shadow-[0_0_15px_rgba(229,62,62,0.3)]'
                  : 'bg-[#10101c] border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700'
              }`}
            >
              {getCategoryIcon(cat.categoryName)}
              <span>{cat.categoryName}</span>
              <span className="text-[10px] text-gray-500 font-normal">
                ({cat.skills?.length || 0})
              </span>
            </button>
          ))}
        </div>

        {/* Active Skills Display Grid */}
        {selectedCategory && (
          <div className="case-file-card rounded-lg p-6 sm:p-8 max-w-4xl mx-auto border border-red-950/60">
            <div className="flex items-center justify-between border-b border-gray-800 pb-4 mb-6">
              <div className="flex items-center gap-3">
                {getCategoryIcon(selectedCategory.categoryName)}
                <h3 className="font-mono text-lg font-bold text-white tracking-wider">
                  {selectedCategory.categoryName}
                </h3>
              </div>
              <span className="font-mono text-xs text-red-400">
                ACTIVE MONITOR
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {selectedCategory.skills?.map((skill) => (
                <div key={skill.name} className="space-y-2">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-gray-300 font-medium">{skill.name}</span>
                    <span className="text-red-400 font-bold">{skill.proficiency}%</span>
                  </div>
                  {/* Retro LED Progress Bar */}
                  <div className="h-2 w-full bg-gray-900 rounded overflow-hidden border border-gray-800 flex">
                    <div
                      className="bg-gradient-to-r from-red-700 to-red-500 transition-all duration-500 shadow-[0_0_8px_rgba(229,62,62,0.6)]"
                      style={{ width: `${skill.proficiency}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
