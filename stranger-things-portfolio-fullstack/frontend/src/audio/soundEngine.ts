export class StrangerAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private synthGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private isPlayingDrone: boolean = false;
  private isUpsideDownMode: boolean = false;
  private listeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('stranger_audio_muted');
      this.isMuted = savedMute !== 'false';
    }
  }

  private initCtx(): boolean {
    if (typeof window === 'undefined') return false;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return false;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return true;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public subscribe(listener: (muted: boolean) => void): () => void {
    this.listeners.add(listener);
    listener(this.isMuted);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l(this.isMuted));
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('stranger_audio_muted', String(this.isMuted));
    }

    if (!this.isMuted) {
      this.initCtx();
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      }
      this.startAmbientSynth(this.isUpsideDownMode);
    } else {
      if (this.masterGain && this.ctx) {
        this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      }
      this.stopAmbientSynth();
    }

    this.notify();
    return this.isMuted;
  }

  public setWorldMode(isUpside: boolean): void {
    this.isUpsideDownMode = isUpside;
    if (!this.isMuted && this.isPlayingDrone) {
      this.stopAmbientSynth();
      this.startAmbientSynth(isUpside);
    }
  }

  public startAmbientSynth(upsideDown: boolean = false): void {
    if (this.isMuted || this.isPlayingDrone) return;
    if (!this.initCtx() || !this.ctx || !this.masterGain) return;

    try {
      this.synthGain = this.ctx.createGain();
      this.synthGain.gain.setValueAtTime(upsideDown ? 0.22 : 0.12, this.ctx.currentTime);
      this.synthGain.connect(this.masterGain);

      if (upsideDown) {
        // Deep subterranean ominous cluster (F#0, C1, D#1)
        const freqs = [46.25, 65.41, 77.78, 116.54];
        this.droneOscillators = freqs.map((f, i) => {
          const osc = this.ctx!.createOscillator();
          osc.type = i === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(f, this.ctx!.currentTime);

          const lfo = this.ctx!.createOscillator();
          const lfoGain = this.ctx!.createGain();
          lfo.frequency.setValueAtTime(0.3 + i * 0.1, this.ctx!.currentTime);
          lfoGain.gain.setValueAtTime(3.0, this.ctx!.currentTime);
          lfo.connect(lfoGain);
          lfoGain.connect(osc.frequency);
          lfo.start();

          const filter = this.ctx!.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(280 + i * 50, this.ctx!.currentTime);

          osc.connect(filter);
          filter.connect(this.synthGain!);
          osc.start();
          return osc;
        });
      } else {
        // Classic 1980s Hawkins Synth Arpeggio/Pads (C, E, G, B)
        const freqs = [65.41, 130.81, 164.81, 196.00];
        this.droneOscillators = freqs.map((f, i) => {
          const osc = this.ctx!.createOscillator();
          osc.type = i % 2 === 0 ? 'sawtooth' : 'triangle';
          osc.frequency.setValueAtTime(f, this.ctx!.currentTime);

          const filter = this.ctx!.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(450 + i * 100, this.ctx!.currentTime);

          osc.connect(filter);
          filter.connect(this.synthGain!);
          osc.start();
          return osc;
        });
      }

      this.isPlayingDrone = true;
    } catch (e) {
      console.warn('Audio start failed', e);
    }
  }

  public stopAmbientSynth(): void {
    this.droneOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore
      }
    });
    this.droneOscillators = [];
    this.isPlayingDrone = false;
  }

  public playClick(): void {
    if (this.isMuted || !this.initCtx() || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio autoplay policy
    }
  }

  public playWorldShift(): void {
    if (this.isMuted || !this.initCtx() || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.7);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.7);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(now + 0.85);

      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, now);
      noiseFilter.Q.setValueAtTime(3, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      whiteNoise.start(now);
    } catch {
      // audio
    }
  }

  public playDemogorgonRoar(): void {
    if (this.isMuted || !this.initCtx() || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(140, now);
      osc1.frequency.linearRampToValueAtTime(320, now + 0.2);
      osc1.frequency.exponentialRampToValueAtTime(45, now + 0.9);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(145, now);
      osc2.frequency.linearRampToValueAtTime(290, now + 0.25);
      osc2.frequency.exponentialRampToValueAtTime(50, now + 0.9);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 1.0);
      osc2.stop(now + 1.0);
    } catch {
      // audio
    }
  }

  public playChristmasBulb(freq: number = 440): void {
    if (this.isMuted || !this.initCtx() || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch {
      // audio
    }
  }

  public playWalkieTalkieStatic(): void {
    if (this.isMuted || !this.initCtx() || !this.ctx || !this.masterGain) return;
    try {
      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.8;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1800, now);
      filter.Q.setValueAtTime(1.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
    } catch {
      // audio
    }
  }

  public playDiceRoll(): void {
    if (this.isMuted || !this.initCtx() || !this.ctx || !this.masterGain) return;
    try {
      for (let i = 0; i < 4; i++) {
        const time = this.ctx.currentTime + i * 0.07;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300 + Math.random() * 200, time);
        gain.gain.setValueAtTime(0.15, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc.stop(time + 0.06);
      }
    } catch {
      // audio
    }
  }

  public playVictoryFanfare(): void {
    if (this.isMuted || !this.initCtx() || !this.ctx || !this.masterGain) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const time = this.ctx!.currentTime + idx * 0.1;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, time);

        gain.gain.setValueAtTime(0.18, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.25);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(time);
        osc.stop(time + 0.26);
      });
    } catch {
      // audio
    }
  }

  public playTerminalBeep(): void {
    if (this.isMuted || !this.initCtx() || !this.ctx || !this.masterGain) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(950, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch {
      // Audio policy
    }
  }
}

export const strangerAudio = new StrangerAudioEngine();
