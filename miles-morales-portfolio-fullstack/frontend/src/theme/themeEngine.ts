export type ThemeName = 'dark' | 'light';

const STORAGE_KEY = 'spider_theme';

/**
 * Tiny subscribable store for the light/dark palette. All it does is toggle
 * `class="light"` on <html> — every colour in the app resolves through the CSS
 * variables defined for that class in index.css, so nothing else has to know
 * which theme is active.
 */
class ThemeEngine {
  private theme: ThemeName = 'dark';
  private listeners = new Set<(t: ThemeName) => void>();

  constructor() {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(STORAGE_KEY) as ThemeName | null;
    if (saved === 'light' || saved === 'dark') {
      this.theme = saved;
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      // Respect the OS preference on a first visit, then remember the choice.
      this.theme = 'light';
    }
    this.apply();
  }

  private apply() {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('light', this.theme === 'light');
    document.documentElement.style.colorScheme = this.theme;
  }

  public get(): ThemeName {
    return this.theme;
  }

  public set(theme: ThemeName) {
    this.theme = theme;
    this.apply();
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* private browsing — the theme just won't persist */
    }
    this.listeners.forEach((cb) => cb(theme));
  }

  public toggle(): ThemeName {
    const next: ThemeName = this.theme === 'dark' ? 'light' : 'dark';
    this.set(next);
    return next;
  }

  public subscribe(cb: (t: ThemeName) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }
}

export const theme = new ThemeEngine();
