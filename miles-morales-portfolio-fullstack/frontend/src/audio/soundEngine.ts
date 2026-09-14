export interface SongInfo {
  title: string;
  artist: string;
  soundtrack: string;
  src: string;
}

// Originally this pointed at a licensed commercial track. That file can't be
// shipped in this build (copyright), so the "BGM" is an original short
// procedural loop synthesized live with the Web Audio API — same oscillator
// approach as the click/thwip/venom effects below, just scheduled on a loop.
// No audio file involved, so there's nothing that can 404 or go silent for
// lack of a file.
export const MILES_SONG: SongInfo = {
  title: 'Wall-Crawler Groove',
  artist: 'Original Score',
  soundtrack: 'Composed for this build',
  src: '',
};

type SoundState = { isMuted: boolean; volume: number; isPlaying: boolean; song: SongInfo };

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private isMuted: boolean = true;
  private volume: number = 0.6;
  private isBgmPlaying: boolean = false;
  private bgmTimer: number | null = null;
  private bgmScheduledUntil: number = 0;
  private listeners: Set<(state: SoundState) => void> = new Set();

  // A2-rooted minor-pentatonic walk, purely original.
  private readonly BGM_BAR_SECONDS = 0.42;
  private readonly BGM_BASS_NOTES = [110, 130.81, 146.83, 110, 164.81, 146.83, 130.81, 98];
  private readonly BGM_LEAD_NOTES = [440, 523.25, 587.33, 440];

  constructor() {
    if (typeof window !== 'undefined') {
      const savedMute = localStorage.getItem('spider_sound_muted');
      const savedVol = localStorage.getItem('spider_sound_volume');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol) || 0.6;
      }

      // Warm up the AudioContext on the very first interaction with the page,
      // well before any specific sound is requested.
      const unlock = () => {
        void this.ensureRunning();
        window.removeEventListener('pointerdown', unlock, true);
        window.removeEventListener('keydown', unlock, true);
        window.removeEventListener('touchstart', unlock, true);
      };
      window.addEventListener('pointerdown', unlock, true);
      window.addEventListener('keydown', unlock, true);
      window.addEventListener('touchstart', unlock, true);
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
      console.warn('Web Audio API not supported', e);
    }
  }

  /**
   * Guarantees the AudioContext exists and is actually running before the
   * caller reads ctx.currentTime or schedules anything against it.
   *
   * Scheduling against a *suspended* context is what causes the "slightly
   * delayed" click some browsers show: ctx.currentTime is frozen while
   * suspended, so a fire-and-forget resume() call followed immediately by
   * osc.start(now) schedules the sound against a stale timestamp, and the
   * browser has to reconcile that once resume() actually completes. Awaiting
   * resume() first — every time, not just on the very first interaction —
   * removes that race entirely.
   */
  private async ensureRunning(): Promise<boolean> {
    this.initContext();
    if (!this.ctx) return false;
    if (this.ctx.state === 'suspended') {
      try {
        await this.ctx.resume();
      } catch {
        return false;
      }
    }
    return this.ctx.state === 'running';
  }

  private ensureBgmGain() {
    if (!this.ctx) return;
    if (!this.bgmGain) {
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.isMuted ? 0 : this.volume;
      this.bgmGain.connect(this.ctx.destination);
    }
  }

  /** Schedules one loop's worth of notes, starting where the last one left off. */
  private scheduleBgmLoop() {
    if (!this.ctx || !this.bgmGain) return;
    const barLen = this.BGM_BAR_SECONDS;
    const startAt = Math.max(this.ctx.currentTime + 0.02, this.bgmScheduledUntil);

    this.BGM_BASS_NOTES.forEach((freq, i) => {
      const t = startAt + i * barLen;
      const osc = this.ctx!.createOscillator();
      const g = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.6, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t + barLen * 0.9);
      osc.connect(g);
      g.connect(this.bgmGain!);
      osc.start(t);
      osc.stop(t + barLen);

      if (i % 2 === 0) {
        const leadFreq = this.BGM_LEAD_NOTES[(i / 2) % this.BGM_LEAD_NOTES.length];
        const lead = this.ctx!.createOscillator();
        const lg = this.ctx!.createGain();
        lead.type = 'sine';
        lead.frequency.setValueAtTime(leadFreq, t + barLen * 0.5);
        lg.gain.setValueAtTime(0, t + barLen * 0.5);
        lg.gain.linearRampToValueAtTime(0.24, t + barLen * 0.55);
        lg.gain.exponentialRampToValueAtTime(0.001, t + barLen * 1.3);
        lead.connect(lg);
        lg.connect(this.bgmGain!);
        lead.start(t + barLen * 0.5);
        lead.stop(t + barLen * 1.4);
      }
    });

    this.bgmScheduledUntil = startAt + this.BGM_BASS_NOTES.length * barLen;
  }

  private startBgmLoop() {
    if (!this.ctx) return;
    this.ensureBgmGain();
    this.bgmScheduledUntil = this.ctx.currentTime;
    this.scheduleBgmLoop();
    const loopMs = this.BGM_BASS_NOTES.length * this.BGM_BAR_SECONDS * 1000;
    if (this.bgmTimer !== null) window.clearInterval(this.bgmTimer);
    // Re-schedule each cycle a little before the previous one runs out.
    this.bgmTimer = window.setInterval(() => this.scheduleBgmLoop(), loopMs - 60);
    this.isBgmPlaying = true;
  }

  private stopBgmLoop() {
    if (this.bgmTimer !== null) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
    this.isBgmPlaying = false;
  }

  public async enableAudio(): Promise<boolean> {
    const running = await this.ensureRunning();
    if (!running) return false;

    this.isMuted = false;
    this.ensureBgmGain();
    if (this.bgmGain) this.bgmGain.gain.value = this.volume;
    if (!this.isBgmPlaying) this.startBgmLoop();

    localStorage.setItem('spider_sound_muted', 'false');
    this.notify();
    return true;
  }

  public async toggleMute(): Promise<boolean> {
    const running = await this.ensureRunning();
    if (!running) return this.isMuted;

    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.stopBgmLoop();
      if (this.bgmGain) this.bgmGain.gain.value = 0;
    } else {
      this.ensureBgmGain();
      if (this.bgmGain) this.bgmGain.gain.value = this.volume;
      this.startBgmLoop();
    }

    void this.playClick();

    localStorage.setItem('spider_sound_muted', String(this.isMuted));
    this.notify();
    return this.isMuted;
  }

  public async toggleSong(): Promise<boolean> {
    return this.toggleMute();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && !this.isMuted) {
      this.bgmGain.gain.value = this.volume;
    }
    localStorage.setItem('spider_sound_volume', String(this.volume));
    this.notify();
  }

  public getState(): SoundState {
    return {
      isMuted: this.isMuted,
      volume: this.volume,
      isPlaying: !this.isMuted && this.isBgmPlaying,
      song: MILES_SONG,
    };
  }

  public subscribe(cb: (state: SoundState) => void) {
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
  // Every effect below goes through ensureRunning() first so it always
  // schedules against a live, running AudioContext — see the comment on
  // ensureRunning() for why that matters.

  /** Classic retro tactile/mechanical UI click — a dual-transient switch click. */
  public playClick() {
    void this.ensureRunning().then((running) => {
      if (!running || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

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
    });
  }

  /** Iconic Spider-Man "THWIP!" web shooter sound. */
  public playThwip() {
    void this.ensureRunning().then((running) => {
      if (!running || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

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
    });
  }

  /**
   * Elastic web-line snap — a springy double-bounce twang, distinct from
   * the whip-crack of playThwip(). Used when the hanging Spider-Man is
   * pulled down and released.
   */
  public playWebSnap() {
    void this.ensureRunning().then((running) => {
      if (!running || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      const bounces = [
        { start: now, freqFrom: 180, freqTo: 340, dur: 0.09, gain: 0.3 },
        { start: now + 0.09, freqFrom: 140, freqTo: 260, dur: 0.08, gain: 0.2 },
        { start: now + 0.17, freqFrom: 110, freqTo: 200, dur: 0.09, gain: 0.13 },
      ];

      bounces.forEach(({ start, freqFrom, freqTo, dur, gain }) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freqFrom, start);
        osc.frequency.exponentialRampToValueAtTime(freqTo, start + dur * 0.6);
        osc.frequency.exponentialRampToValueAtTime(freqFrom * 0.8, start + dur);
        g.gain.setValueAtTime(0.001, start);
        g.gain.linearRampToValueAtTime(gain, start + dur * 0.15);
        g.gain.exponentialRampToValueAtTime(0.001, start + dur);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(start);
        osc.stop(start + dur + 0.02);
      });
    });
  }

  /** Venom icon button buzz — a harsh, sustained, menacing electric drone. */
  public playVenomBuzz() {
    void this.ensureRunning().then((running) => {
      if (!running || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;

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
    });
  }

  /** Bio-electric Venom zap (Miles' signature electric charge). */
  public playVenomZap() {
    void this.ensureRunning().then((running) => {
      if (!running || !this.ctx || !this.masterGain) return;
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
    });
  }
}

export const sound = new SoundEngine();
