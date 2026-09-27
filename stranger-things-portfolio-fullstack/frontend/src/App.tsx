import { useState, useEffect } from 'react';
import { useResumeData } from './data/useResumeData';
import { HawkinsIntro } from './components/HawkinsIntro';
import { SporesCanvas } from './components/SporesCanvas';
import { CRTOverlay } from './components/CRTOverlay';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ChristmasLightsWall } from './components/ChristmasLightsWall';
import { TimelineSection } from './components/TimelineSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AdminTerminalModal } from './components/AdminTerminalModal';
import { D20GameModal } from './components/D20GameModal';

export function App() {
  const [introDismissed, setIntroDismissed] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [d20Open, setD20Open] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [showRiftFlash, setShowRiftFlash] = useState(false);

  const {
    profile,
    projects,
    skills,
    certifications,
    education,
    experience
  } = useResumeData();

  const triggerRiftTransition = () => {
    setIsShaking(true);
    setShowRiftFlash(true);
    setTimeout(() => {
      setIsShaking(false);
    }, 600);
    setTimeout(() => {
      setShowRiftFlash(false);
    }, 700);
  };

  const handleOpenEasterEgg = () => {
    const el = document.getElementById('christmas-lights');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Konami Code Easter Egg (Up Up Down Down Left Right Left Right B A)
  useEffect(() => {
    const konami = [
      'ArrowUp', 'ArrowUp',
      'ArrowDown', 'ArrowDown',
      'ArrowLeft', 'ArrowRight',
      'ArrowLeft', 'ArrowRight',
      'b', 'a'
    ];
    let konamiIdx = 0;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === konami[konamiIdx].toLowerCase()) {
        konamiIdx++;
        if (konamiIdx === konami.length) {
          konamiIdx = 0;
          triggerRiftTransition();
          setD20Open(true);
        }
      } else {
        konamiIdx = 0;
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <div
      className={`relative min-h-screen bg-[var(--c-void)] text-[var(--c-text)] selection:bg-red-700 selection:text-white overflow-x-hidden ${
        isShaking ? 'animate-rift-shake' : ''
      }`}
    >
      {/* Red Dimensional Flash Overlay */}
      {showRiftFlash && <div className="rift-flash-overlay" />}

      {/* Opening Intro Sequence */}
      {!introDismissed && (
        <HawkinsIntro onComplete={() => setIntroDismissed(true)} />
      )}

      {/* Atmospheric Overlays */}
      <SporesCanvas />
      <CRTOverlay />
      <CustomCursor />

      {/* Navigation Header */}
      <Navbar
        onOpenAdmin={() => setAdminOpen(true)}
        onOpenEasterEgg={handleOpenEasterEgg}
        onOpenD20={() => setD20Open(true)}
        onTriggerRiftTransition={triggerRiftTransition}
      />

      {/* Main Content Sections */}
      <main className="relative">
        <HeroSection
          profile={profile}
          onOpenEasterEgg={handleOpenEasterEgg}
        />
        <AboutSection profile={profile} certifications={certifications} />
        <SkillsSection skillCategories={skills} />
        <ProjectsSection projects={projects} />

        {/* The Christmas Lights Wall Easter Egg Section */}
        <ChristmasLightsWall
          onTriggerRedFlash={() => {
            setShowRiftFlash(true);
            setIsShaking(true);
            setTimeout(() => setIsShaking(false), 500);
            setTimeout(() => setShowRiftFlash(false), 700);
          }}
        />

        <TimelineSection education={education} experience={experience} />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Hawkins Admin Mainframe Modal */}
      <AdminTerminalModal
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
      />

      {/* D&D D20 Encounter Easter Egg Modal */}
      <D20GameModal
        isOpen={d20Open}
        onClose={() => setD20Open(false)}
        onTriggerRedFlash={() => {
          setShowRiftFlash(true);
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 500);
          setTimeout(() => setShowRiftFlash(false), 700);
        }}
      />
    </div>
  );
}

export default App;
