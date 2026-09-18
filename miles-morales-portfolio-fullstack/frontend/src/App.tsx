import { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { HalftoneBackground } from './components/effects/HalftoneBackground';
import { CustomCursor } from './components/effects/CustomCursor';
import { HangingSpiderman } from './components/effects/HangingSpiderman';
import { ScrollWebFall } from './components/effects/ScrollWebFall';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { SkillsPage } from './pages/SkillsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TimelinePage } from './pages/TimelinePage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { Footer } from './components/layout/Footer';
import { VenomBlastOverlay } from './components/eastereggs/VenomBlastOverlay';
import { sound } from './audio/soundEngine';

// Resets scroll position to the top whenever the route changes, since the
// browser doesn't do this automatically for client-side navigation.
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

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

      {/* Resets scroll to top on every route change */}
      <ScrollToTop />

      {/* Main Experience Stream — each section now lives on its own page/route */}
      <main className="relative z-10 min-h-[60vh]">
        <Routes>
          <Route path="/" element={<HomePage onTriggerVenom={triggerVenom} />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
