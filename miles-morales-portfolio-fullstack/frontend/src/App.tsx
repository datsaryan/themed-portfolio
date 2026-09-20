import { useState, useEffect, useCallback } from 'react';
import { HalftoneBackground } from './components/effects/HalftoneBackground';
import { CustomCursor } from './components/effects/CustomCursor';
import { HangingSpiderman } from './components/effects/HangingSpiderman';
import { ScrollWebFall } from './components/effects/ScrollWebFall';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/sections/HeroSection';
import { AboutSection } from './components/sections/AboutSection';
import { SkillsSection } from './components/sections/SkillsSection';
import { ProjectsSection } from './components/sections/ProjectsSection';
import { TimelineSection } from './components/sections/TimelineSection';
import { ContactSection } from './components/sections/ContactSection';
import { Footer } from './components/layout/Footer';
import { VenomBlastOverlay } from './components/eastereggs/VenomBlastOverlay';
import { sound } from './audio/soundEngine';

export function App() {
  const [venomActive, setVenomActive] = useState(false);

  const triggerVenom = useCallback(() => {
    setVenomActive(true);
  }, []);

  // Global Interactive Click Listener for authentic tactile clicking sound
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = target.closest('button, a, [role="button"], input, select, textarea, .comic-border, .cursor-pointer');
        if (interactive) {
          sound.playClick();
        }
      }
    };

    window.addEventListener('click', handleGlobalClick, { capture: true });
    return () => window.removeEventListener('click', handleGlobalClick, { capture: true });
  }, []);

  // Global Keyboard Easter Eggs (V for Venom Blast, W for THWIP)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.key === 'v' || e.key === 'V') {
        triggerVenom();
      } else if (e.key === 'w' || e.key === 'W') {
        sound.playThwip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerVenom]);

  return (
    <div className="relative min-h-screen bg-void text-web font-sans selection:bg-spider selection:text-white">
      {/* Visual background layers */}
      <HalftoneBackground />

      {/* Interactive custom reticle cursor */}
      <CustomCursor />

      {/* Spider silk drops in from the top while the page is scrolled */}
      <ScrollWebFall />

      {/* Hanging Upside-Down Spider-Man (Miles Morales) in the top-left corner */}
      <HangingSpiderman />

      {/* Secret Suit Venom Discharge Overlay */}
      <VenomBlastOverlay
        active={venomActive}
        onComplete={() => setVenomActive(false)}
      />

      {/* Top HUD Navigation */}
      <Navbar onTriggerVenom={triggerVenom} />

      {/* Main Experience Stream */}
      <main className="relative z-10">
        <HeroSection onTriggerVenom={triggerVenom} />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <TimelineSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
