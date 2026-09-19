export type WorldMode = 'hawkins' | 'upsidedown';

const STORAGE_KEY = 'stranger_world';

class WorldEngine {
  private world: WorldMode = 'hawkins';
  private listeners = new Set<(w: WorldMode) => void>();

  constructor() {
    if (typeof window === 'undefined') return;

    const saved = localStorage.getItem(STORAGE_KEY) as WorldMode | null;
    if (saved === 'upsidedown' || saved === 'hawkins') {
      this.world = saved;
    }
    this.apply();
  }

  private apply() {
    if (typeof document === 'undefined') return;
    document.documentElement.classList.toggle('upsidedown', this.world === 'upsidedown');
  }

  public get(): WorldMode {
    return this.world;
  }

  public set(world: WorldMode) {
    this.world = world;
    this.apply();
    try {
      localStorage.setItem(STORAGE_KEY, world);
    } catch {
      // Ignore private browsing storage restrictions
    }
    this.listeners.forEach((cb) => cb(world));
  }

  public toggle(): WorldMode {
    const next: WorldMode = this.world === 'hawkins' ? 'upsidedown' : 'hawkins';
    this.set(next);
    return next;
  }

  public subscribe(cb: (w: WorldMode) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }
}

export const worldEngine = new WorldEngine();
