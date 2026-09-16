export interface SongInfo {
  title: string;
  artist: string;
  soundtrack: string;
  src: string;
}

/**
 * Background music.
 *
 * `src` points at a file you supply yourself — drop a track at
 * `frontend/public/assets/audio/theme.mp3` and it plays on loop with the
 * title/artist below shown in the HUD. No audio file ships with this repo.
 *
 * If the file is missing (or the browser refuses it), the engine silently
 * falls back to the original short procedural loop synthesized with the Web
 * Audio API, so the BGM button always does something.
 */
export const BGM_TRACK: SongInfo = {
  title: 'Closer',
  artist: 'The Chainsmokers ft. Halsey',
  soundtrack: 'Drop your own licensed copy in to play it',
  src: '/assets/audio/theme.mp3',
};

/** Back-compat alias — older imports used MILES_SONG. */
export const MILES_SONG = BGM_TRACK;

type SoundState = {
  isMuted: boolean;
  volume: number;
  isPlaying: boolean;
  song: SongInfo;
  /** True when the real audio file is playing, false when on the procedural fallback. */
  usingFile: boolean;
};

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

  // File-based BGM (optional — see BGM_TRACK above)
  private audioEl: HTMLAudioElement | null = null;
  private usingFile: boolean = false;

  // Continuous web-stretch tone
  private stretchOsc: OscillatorNode | null = null;
  private stretchSub: OscillatorNode | null = null;
  private stretchNoise: AudioBufferSourceNode | null = null;
  private stretchFilter: BiquadFilterNode | null = null;
  private stretchGain: GainNode | null = null;
  private stretchWanted: boolean = false;

  // Click de-duplication: App.tsx has a global click listener AND individual
  // components call playClick(), so the same tap could fire the sound 2-3
  // times and read as a smeared/delayed click.
  private lastClickAt: number = 0;

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

  /**
   * Tries the real audio file first. Resolves false if there's no file at
   * BGM_TRACK.src (404s reject play()), so the caller can fall back.
   */
  private async tryStartFile(): Promise<boolean> {
    if (!BGM_TRACK.src) return false;
    if (typeof Audio === 'undefined') return false;

    if (!this.audioEl) {
      this.audioEl = new Audio(BGM_TRACK.src);
      this.audioEl.loop = true;
      this.audioEl.preload = 'auto';
    }
    this.audioEl.volume = this.volume;

    try {
      await this.audioEl.play();
      this.usingFile = true;
      return true;
    } catch {
      this.usingFile = false;
      return false;
    }
  }

  private stopFile() {
    if (this.audioEl) {
      this.audioEl.pause();
    }
    this.usingFile = false;
  }

  /** Starts the file track if available, else the procedural loop. */
  private async startBgm() {
    const fileOk = await this.tryStartFile();
    if (!fileOk && !this.isBgmPlaying) {
      this.startBgmLoop();
    }
    this.isBgmPlaying = true;
    this.notify();
  }

  private stopBgm() {
    this.stopFile();
    this.stopBgmLoop();
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
    void this.startBgm();

    localStorage.setItem('spider_sound_muted', 'false');
    this.notify();
    return true;
  }

  public async toggleMute(): Promise<boolean> {
    const running = await this.ensureRunning();
    if (!running) return this.isMuted;

    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.stopBgm();
      if (this.bgmGain) this.bgmGain.gain.value = 0;
    } else {
      this.ensureBgmGain();
      if (this.bgmGain) this.bgmGain.gain.value = this.volume;
      void this.startBgm();
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
    if (this.audioEl) {
      this.audioEl.volume = this.volume;
    }
    localStorage.setItem('spider_sound_volume', String(this.volume));
    this.notify();
  }

  public getState(): SoundState {
    return {
      isMuted: this.isMuted,
      volume: this.volume,
      isPlaying: !this.isMuted && this.isBgmPlaying,
      song: BGM_TRACK,
      usingFile: this.usingFile,
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


  // --- Continuous web-stretch tone -------------------------------------
  // Held for the whole duration of a drag: a creaking silk strand whose
  // pitch, brightness and loudness all climb with tension. startStretch()
  // on pointerdown, updateStretch(0..1) on every move, stopStretch() on
  // release (playWebSnap() then covers the release itself).

  public startStretch() {
    this.stretchWanted = true;
    void this.ensureRunning().then((running) => {
      // A release may have landed while the context was still resuming.
      if (!running || !this.stretchWanted || !this.ctx || !this.masterGain) return;
      if (this.stretchOsc) return; // already running

      const now = this.ctx.currentTime;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.0001, now);
      gain.connect(this.masterGain);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.Q.setValueAtTime(4, now);
      filter.connect(gain);

      // Strand tone: sawtooth through the bandpass reads as taut fibre.
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.connect(filter);
      osc.start(now);

      // Sub layer gives the pull some body at low tension.
      const sub = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(70, now);
      subGain.gain.setValueAtTime(0.35, now);
      sub.connect(subGain);
      subGain.connect(gain);
      sub.start(now);

      // Looping noise bed = the creak/fray as the silk is pulled.
      const bufSize = Math.floor(this.ctx.sampleRate * 0.5);
      const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.5;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      noise.loop = true;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noise.connect(noiseGain);
      noiseGain.connect(filter);
      noise.start(now);

      this.stretchOsc = osc;
      this.stretchSub = sub;
      this.stretchNoise = noise;
      this.stretchFilter = filter;
      this.stretchGain = gain;

      // Fade in so grabbing doesn't click
      gain.gain.exponentialRampToValueAtTime(0.02, now + 0.08);
    });
  }

  /** tension: 0 (slack) .. 1 (fully stretched). Safe to call every frame. */
  public updateStretch(tension: number) {
    if (!this.ctx || !this.stretchOsc || !this.stretchGain || !this.stretchFilter) return;
    const t = Math.max(0, Math.min(1, tension));
    const now = this.ctx.currentTime;
    const ramp = 0.06; // short glide keeps it smooth instead of zippering

    // Pitch climbs roughly an octave and a half as the strand goes taut.
    this.stretchOsc.frequency.setTargetAtTime(110 + t * 290, now, ramp);
    if (this.stretchSub) {
      this.stretchSub.frequency.setTargetAtTime(62 + t * 70, now, ramp);
    }
    // Brighter and louder under load.
    this.stretchFilter.frequency.setTargetAtTime(520 + t * 2200, now, ramp);
    this.stretchFilter.Q.setTargetAtTime(3 + t * 7, now, ramp);
    this.stretchGain.gain.setTargetAtTime(0.02 + t * 0.16, now, ramp);
  }

  public stopStretch() {
    this.stretchWanted = false;
    if (!this.ctx || !this.stretchGain) {
      this.stretchOsc = null;
      this.stretchSub = null;
      this.stretchNoise = null;
      this.stretchFilter = null;
      this.stretchGain = null;
      return;
    }

    const now = this.ctx.currentTime;
    const gain = this.stretchGain;
    const osc = this.stretchOsc;
    const sub = this.stretchSub;
    const noise = this.stretchNoise;

    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(gain.gain.value, 0.0001), now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    const stopAt = now + 0.15;
    try {
      osc?.stop(stopAt);
      sub?.stop(stopAt);
      noise?.stop(stopAt);
    } catch {
      /* already stopped */
    }

    this.stretchOsc = null;
    this.stretchSub = null;
    this.stretchNoise = null;
    this.stretchFilter = null;
    this.stretchGain = null;
  }

  /** Classic retro tactile/mechanical UI click — a dual-transient switch click. */
  public playClick() {
    const stamp = typeof performance !== 'undefined' ? performance.now() : Date.now();
    if (stamp - this.lastClickAt < 70) return;
    this.lastClickAt = stamp;

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
