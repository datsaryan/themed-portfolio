import { useState, useEffect } from 'react';
import { useResumeData } from './data/useResumeData';
import { worldEngine, WorldMode } from './theme/themeEngine';
import { HawkinsIntro } from './components/effects/HawkinsIntro';
import { SporesCanvas } from './components/effects/SporesCanvas';
import { CRTOverlay } from './components/effects/CRTOverlay';
import { CustomCursor } from './components/effects/CustomCursor';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { TimelineSection } from './components/sections/TimelineSection';
import { ContactSection } from './components/sections/ContactSection';
import { AdminTerminalModal } from './components/modals/AdminTerminalModal';
import { Footer } from './components/layout/Footer';

export default function App() {
  const data = useResumeData();
  const [world, setWorld] = useState<WorldMode>(worldEngine.get());
  const [introFinished, setIntroFinished] = useState<boolean>(() => {
    return typeof window !== 'undefined' && sessionStorage.getItem('stranger_intro_seen') === 'true';
  });
  const [adminOpen, setAdminOpen] = useState<boolean>(false);

  useEffect(() => {
    return worldEngine.subscribe((nextWorld) => {
      setWorld(nextWorld);
    });
  }, []);

  const handleToggleWorld = () => {
    worldEngine.toggle();
  };

  return (
    <div className="relative min-h-screen bg-hawkins-void text-hawkins-text selection:bg-hawkins-red selection:text-white transition-colors duration-700">
      {/* 1. Cinematic Hawkins 1986 Opening Sequence */}
      {!introFinished && (
        <HawkinsIntro onComplete={() => setIntroFinished(true)} />
      )}

      {/* 2. Visual Effects Overlays */}
      <CRTOverlay />
      <SporesCanvas world={world} />
      <CustomCursor world={world} />

      {/* 3. Navigation Bar */}
      <Navbar
        world={world}
        onToggleWorld={handleToggleWorld}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* 4. Main Portfolio Thematic Sections */}
      <main className="relative z-20">
        <HeroSection personal={data.personal} world={world} />
        <AboutSection personal={data.personal} world={world} />
        <SkillsSection skills={data.skills} world={world} />
        <ProjectsSection projects={data.projects} world={world} />
        <TimelineSection
          certifications={data.certifications}
          education={data.education}
          experience={data.experience}
          world={world}
        />
        <ContactSection personal={data.personal} world={world} />
      </main>

      {/* 5. Footer */}
      <Footer />

      {/* 6. Classified Hawkins Lab Security Terminal (JWT Modal) */}
      <AdminTerminalModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />
    </div>
  );
}
