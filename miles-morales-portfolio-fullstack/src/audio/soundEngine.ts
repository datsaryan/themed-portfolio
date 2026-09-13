export interface SongInfo {
  title: string;
  artist: string;
  soundtrack: string;
  src: string;
}

export const MILES_SONG: SongInfo = {
  title: "Sunflower",
  artist: "Post Malone & Swae Lee",
  soundtrack: "Spider-Man: Into the Spider-Verse",
  src: "/assets/audio/sunflower_miles_morales.mp3",
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = true;
  private volume: number = 0.5;
  private bgmAudio: HTMLAudioElement | null = null;
  private isBgmPlaying: boolean = false;
  private listeners: Set<(state: { isMuted: boolean; volume: number; isPlaying: boolean; song: SongInfo }) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('spider_sound_muted');
      const savedVol = localStorage.getItem('spider_sound_volume');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol) || 0.5;
      }
      this.initBgmAudio();
    }
  }

  private initBgmAudio() {
    if (this.bgmAudio || typeof window === 'undefined') return;
    try {
      this.bgmAudio = new Audio(MILES_SONG.src);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.isMuted ? 0 : this.volume;

      this.bgmAudio.addEventListener('play', () => {
        this.isBgmPlaying = true;
        this.notify();
      });
      this.bgmAudio.addEventListener('pause', () => {
        this.isBgmPlaying = false;
        this.notify();
      });
      this.bgmAudio.addEventListener('ended', () => {
        this.isBgmPlaying = false;
        this.notify();
      });
    } catch (e) {
      console.warn("Failed to initialize BGM audio", e);
    }
  }

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 1.0;
      this.masterGain.connect(this.ctx.destination);
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  public async enableAudio(): Promise<boolean> {
    this.initContext();
    this.initBgmAudio();
    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isMuted = false;

    if (this.bgmAudio) {
      this.bgmAudio.volume = this.volume;
      try {
        await this.bgmAudio.play();
        this.isBgmPlaying = true;
      } catch (err) {
        console.warn("BGM autoplay blocked by browser, waiting for user gesture", err);
      }
    }

    localStorage.setItem('spider_sound_muted', 'false');
    this.notify();
    return true;
  }

  public async toggleMute(): Promise<boolean> {
    this.initContext();
    this.initBgmAudio();

    if (this.ctx && this.ctx.state === 'suspended') {
      await this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (this.bgmAudio) {
      if (this.isMuted) {
        this.bgmAudio.pause();
        this.isBgmPlaying = false;
      } else {
        this.bgmAudio.volume = this.volume;
        try {
          await this.bgmAudio.play();
          this.isBgmPlaying = true;
        } catch (e) {
          console.warn("Audio play blocked", e);
        }
      }
    }

    this.playClick();

    localStorage.setItem('spider_sound_muted', String(this.isMuted));
    this.notify();
    return this.isMuted;
  }

  public async toggleSong(): Promise<boolean> {
    return this.toggleMute();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgmAudio && !this.isMuted) {
      this.bgmAudio.volume = this.volume;
    }
    localStorage.setItem('spider_sound_volume', String(this.volume));
    this.notify();
  }

  public getState() {
    return {
      isMuted: this.isMuted,
      volume: this.volume,
      isPlaying: !this.isMuted && this.isBgmPlaying,
      song: MILES_SONG,
    };
  }

  public subscribe(cb: (state: { isMuted: boolean; volume: number; isPlaying: boolean; song: SongInfo }) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notify() {
    const st = this.getState();
    this.listeners.forEach((cb) => cb(st));
  }

  // --- Sound Effects ---

  /**
   * Classic retro tactile/mechanical UI click sound
   * Plays a distinct dual-transient mechanical switch click
   */
  public playClick() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // Layer 1: High crisp transient click snap (mechanical keyboard / tactile switch strike)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(2400, now);
      osc1.frequency.exponentialRampToValueAtTime(600, now + 0.02);

      gain1.gain.setValueAtTime(0.22, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc1.connect(gain1);
      gain1.connect(this.masterGain);
      osc1.start(now);
      osc1.stop(now + 0.03);

      // Layer 2: Low-mid tactile body thump (switch housing click body)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(450, now);
      osc2.frequency.exponentialRampToValueAtTime(110, now + 0.035);

      gain2.gain.setValueAtTime(0.18, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc2.connect(gain2);
      gain2.connect(this.masterGain);
      osc2.start(now);
      osc2.stop(now + 0.04);
    } catch {
      // ignore
    }
  }

  /**
   * Iconic Spider-Man "THWIP!" web shooter sound
   */
  public playThwip() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // 1. High velocity air whip / noise sweep
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.22);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2600, now);
      filter.frequency.exponentialRampToValueAtTime(320, now + 0.2);
      filter.Q.setValueAtTime(3.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.38, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);

      // 2. High tension web-snap transient
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.15);

      oscGain.gain.setValueAtTime(0.25, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn("playThwip failed", e);
    }
  }

  /**
   * Venom icon button buzz — a harsh, droning electric buzz/hum
   * Distinct from the zap: lower, sustained, menacing
   */
  public playVenomBuzz() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;

      // Layer 1: Raw sawtooth drone — thick electric hum that stutters
      const buzz = this.ctx.createOscillator();
      const buzzGain = this.ctx.createGain();
      buzz.type = 'sawtooth';
      buzz.frequency.setValueAtTime(55, now);
      buzz.frequency.setValueAtTime(110, now + 0.05);
      buzz.frequency.setValueAtTime(55, now + 0.1);
      buzz.frequency.setValueAtTime(110, now + 0.15);
      buzz.frequency.setValueAtTime(82, now + 0.25);
      buzzGain.gain.setValueAtTime(0.0, now);
      buzzGain.gain.linearRampToValueAtTime(0.28, now + 0.02);
      buzzGain.gain.setValueAtTime(0.28, now + 0.3);
      buzzGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      buzz.connect(buzzGain);
      buzzGain.connect(this.masterGain);
      buzz.start(now);
      buzz.stop(now + 0.52);

      // Layer 2: High-freq electric crackle noise burst
      const bufSize = Math.floor(this.ctx.sampleRate * 0.35);
      const noiseBuf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const nd = noiseBuf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        nd[i] = (Math.random() * 2 - 1) * (i % 4 === 0 ? 1 : 0.15);
      }
      const crackle = this.ctx.createBufferSource();
      crackle.buffer = noiseBuf;
      const crackleFilter = this.ctx.createBiquadFilter();
      crackleFilter.type = 'highpass';
      crackleFilter.frequency.setValueAtTime(1800, now);
      const crackleGain = this.ctx.createGain();
      crackleGain.gain.setValueAtTime(0.15, now);
      crackleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      crackle.connect(crackleFilter);
      crackleFilter.connect(crackleGain);
      crackleGain.connect(this.masterGain);
      crackle.start(now);

      // Layer 3: Sub-bass impact thud at the very start
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(120, now);
      sub.frequency.exponentialRampToValueAtTime(30, now + 0.12);
      subGain.gain.setValueAtTime(0.4, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      sub.connect(subGain);
      subGain.connect(this.masterGain);
      sub.start(now);
      sub.stop(now + 0.13);
    } catch (e) {
      console.warn('playVenomBuzz failed', e);
    }
  }

  /**
   * Bio-electric Venom zap (Miles' signature electric charge)
   */
  public playVenomZap() {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const mod = this.ctx.createOscillator();
      const modGain = this.ctx.createGain();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      mod.type = 'square';
      mod.frequency.setValueAtTime(60, now);
      modGain.gain.setValueAtTime(300, now);

      mod.connect(osc.frequency);
      osc.frequency.setValueAtTime(280, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.35);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.masterGain);

      mod.start(now);
      osc.start(now);
      mod.stop(now + 0.36);
      osc.stop(now + 0.36);
    } catch (e) {
      console.warn("playVenomZap failed", e);
    }
  }
}

export const sound = new SoundEngine();
