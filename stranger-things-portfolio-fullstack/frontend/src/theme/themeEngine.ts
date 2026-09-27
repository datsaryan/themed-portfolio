export type WorldMode = 'hawkins' | 'upsidedown';

type WorldListener = (mode: WorldMode) => void;

class WorldEngine {
  private currentMode: WorldMode = 'hawkins';
  private listeners: Set<WorldListener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('stranger_world_mode') as WorldMode;
      if (saved === 'hawkins' || saved === 'upsidedown') {
        this.currentMode = saved;
      }
      this.applyWorldClass();
    }
  }

  public getMode(): WorldMode {
    return this.currentMode;
  }

  public isUpsideDown(): boolean {
    return this.currentMode === 'upsidedown';
  }

  public toggle(): WorldMode {
    this.currentMode = this.currentMode === 'hawkins' ? 'upsidedown' : 'hawkins';
    if (typeof window !== 'undefined') {
      localStorage.setItem('stranger_world_mode', this.currentMode);
    }
    this.applyWorldClass();
    this.notify();
    return this.currentMode;
  }

  public setMode(mode: WorldMode): void {
    if (this.currentMode === mode) return;
    this.currentMode = mode;
    if (typeof window !== 'undefined') {
      localStorage.setItem('stranger_world_mode', this.currentMode);
    }
    this.applyWorldClass();
    this.notify();
  }

  public subscribe(listener: WorldListener): () => void {
    this.listeners.add(listener);
    listener(this.currentMode);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private applyWorldClass(): void {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    if (this.currentMode === 'upsidedown') {
      root.classList.add('upsidedown');
      root.classList.add('dark');
    } else {
      root.classList.remove('upsidedown');
      root.classList.add('dark');
    }
  }

  private notify(): void {
    this.listeners.forEach((listener) => {
      try {
        listener(this.currentMode);
      } catch (err) {
        console.error('WorldEngine listener error:', err);
      }
    });
  }
}

export const worldEngine = new WorldEngine();
