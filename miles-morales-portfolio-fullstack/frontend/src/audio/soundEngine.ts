import { WorldMode } from '../types/portfolio';

class StrangerAudioEngine {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.4;
  private masterGain: GainNode | null = null;

  // Synthesizer nodes for procedural 1980s ambient drone
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  // External audio element for licensed music (public/audio/background.mp3)
  private audioElement: HTMLAudioElement | null = null;
  private hasCustomAudio = false;

  private listeners = new Set<() => void>();

  constructor() {
    if (typeof window === 'undefined') return;

    // Check stored preferences
    const savedVol = localStorage.getItem('stranger_audio_vol');
    if (savedVol !== null) {
      this.volume = parseFloat(savedVol);
    }
    const savedMute = localStorage.getItem('stranger_audio_mute');
    if (savedMute !== null) {
      this.isMuted = savedMute === 'true';
    }

    // Check if external licensed audio file exists at /audio/background.mp3
    this.checkExternalAudio();
  }

  private checkExternalAudio() {
    try {
      const audio = new Audio('/audio/background.mp3');
      audio.loop = true;
      audio.preload = 'none';
      audio.addEventListener('canplaythrough', () => {
        this.hasCustomAudio = true;
        this.audioElement = audio;
      });
    } catch {
      this.hasCustomAudio = false;
    }
  }

  private initAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public async start() {
    this.initAudioContext();
    if (!this.ctx) return;

    if (this.audioElement && this.hasCustomAudio) {
      try {
        this.audioElement.volume = this.isMuted ? 0 : this.volume;
        await this.audioElement.play();
        this.isPlaying = true;
        this.notify();
        return;
      } catch {
        // Fallback to procedural synth if playback blocked or file missing
      }
    }

    // Start procedural 1980s analog synth drone
    this.startSynthDrone('hawkins');
    this.isPlaying = true;
    this.notify();
  }

  public stop() {
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynthDrone();
    this.isPlaying = false;
    this.notify();
  }

  public toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    try {
      localStorage.setItem('stranger_audio_mute', String(muted));
    } catch {}

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
    }
    if (this.audioElement) {
      this.audioElement.volume = muted ? 0 : this.volume;
    }
    this.notify();
  }

  public toggleMute() {
    this.setMuted(!this.isMuted);
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    try {
      localStorage.setItem('stranger_audio_vol', String(this.volume));
    } catch {}

    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    if (this.audioElement && !this.isMuted) {
      this.audioElement.volume = this.volume;
    }
    this.notify();
  }

  public updateWorldAtmosphere(world: WorldMode) {
    if (!this.isPlaying || !this.ctx) return;

    if (world === 'upsidedown') {
      // Shift to dark, bruised, corrupted frequencies
      if (this.osc1 && this.osc2 && this.filter) {
        const now = this.ctx.currentTime;
        this.osc1.frequency.setTargetAtTime(43.65, now, 0.8); // F1 low dissonant
        this.osc2.frequency.setTargetAtTime(61.74, now, 0.8); // B1 tritone
        this.filter.frequency.setTargetAtTime(280, now, 0.8);
        this.filter.Q.setTargetAtTime(8, now, 0.8);
      }
    } else {
      // Shift to warm 1980s analog synthesizer drone
      if (this.osc1 && this.osc2 && this.filter) {
        const now = this.ctx.currentTime;
        this.osc1.frequency.setTargetAtTime(55.0, now, 0.8);  // A1 warm fundamental
        this.osc2.frequency.setTargetAtTime(110.5, now, 0.8); // A2 slightly detuned
        this.filter.frequency.setTargetAtTime(450, now, 0.8);
        this.filter.Q.setTargetAtTime(3.5, now, 0.8);
      }
    }
  }

  private startSynthDrone(world: WorldMode) {
    if (!this.ctx) return;
    this.stopSynthDrone();

    const now = this.ctx.currentTime;

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, now);
    this.masterGain.gain.exponentialRampToValueAtTime(this.isMuted ? 0.001 : this.volume, now + 1.2);
    this.masterGain.connect(this.ctx.destination);

    // Filter
    this.filter = this.ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(world === 'upsidedown' ? 280 : 450, now);
    this.filter.Q.setValueAtTime(world === 'upsidedown' ? 8 : 3.5, now);
    this.filter.connect(this.masterGain);

    // LFO for filter sweep
    this.lfo = this.ctx.createOscillator();
    this.lfo.frequency.setValueAtTime(0.2, now); // slow 0.2Hz sweep
    this.lfoGain = this.ctx.createGain();
    this.lfoGain.gain.setValueAtTime(120, now);
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.filter.frequency);
    this.lfo.start(now);

    // Osc 1 (Sawtooth)
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(world === 'upsidedown' ? 43.65 : 55.0, now);
    this.osc1.connect(this.filter);
    this.osc1.start(now);

    // Osc 2 (Detuned Sawtooth for analog chorus)
    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'sawtooth';
    this.osc2.frequency.setValueAtTime(world === 'upsidedown' ? 61.74 : 110.5, now);
    this.osc2.connect(this.filter);
    this.osc2.start(now);

    // Sub Bass Oscillator (Sine for foundation)
    this.subOsc = this.ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(world === 'upsidedown' ? 27.5 : 27.5, now);
    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.3, now);
    this.subOsc.connect(subGain);
    subGain.connect(this.filter);
    this.subOsc.start(now);
  }

  private stopSynthDrone() {
    if (this.masterGain && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        this.masterGain.gain.setTargetAtTime(0.001, now, 0.3);
      } catch {}
    }
    setTimeout(() => {
      try {
        this.osc1?.stop();
        this.osc2?.stop();
        this.subOsc?.stop();
        this.lfo?.stop();
      } catch {}
      this.osc1 = null;
      this.osc2 = null;
      this.subOsc = null;
      this.lfo = null;
      this.filter = null;
      this.masterGain = null;
    }, 400);
  }

  public playClickSound() {
    try {
      this.initAudioContext();
      if (!this.ctx || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.04);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  public playRiftSound() {
    try {
      this.initAudioContext();
      if (!this.ctx || this.isMuted) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      volume: this.volume,
    };
  }

  public subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }
}

export const strangerAudio = new StrangerAudioEngine();
