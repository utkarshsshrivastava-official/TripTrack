/**
 * Offline Himalayan Tanpura & Bell Audio Synthesizer (Web Audio API)
 * Zero external audio files required — functions 100% offline in dead zones.
 */

export type TanpuraScale = 'C_SHARP' | 'D' | 'B_DEEP';

export interface ScalePreset {
  id: TanpuraScale;
  name: string;
  subtext: string;
  saFreq: number;
  strings: number[]; // [Pa, Sa, Sa, Kharaj Sa]
}

export const TANPURA_SCALES: Record<TanpuraScale, ScalePreset> = {
  C_SHARP: {
    id: 'C_SHARP',
    name: 'C# (Traditional)',
    subtext: 'Classic Himalayan Meditative Drone',
    saFreq: 277.18,
    strings: [207.65, 277.18, 277.18, 138.59]
  },
  D: {
    id: 'D',
    name: 'D (Uplifting)',
    subtext: 'Bright Morning Aarti Resonance',
    saFreq: 293.66,
    strings: [220.00, 293.66, 293.66, 146.83]
  },
  B_DEEP: {
    id: 'B_DEEP',
    name: 'B (Deep Om)',
    subtext: 'Resonant Low-Pitch Grounding Drone',
    saFreq: 246.94,
    strings: [185.00, 246.94, 246.94, 123.47]
  }
};

class SacredAudioSynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: number | null = null;
  private masterGain: GainNode | null = null;
  private currentScale: TanpuraScale = 'C_SHARP';
  private listeners: Set<(playing: boolean) => void> = new Set();

  private initContext(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.28, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  public subscribe(listener: (playing: boolean) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    this.listeners.forEach(fn => fn(this.isPlaying));
  }

  /**
   * Pluck a single acoustic string with rich gourd resonance harmonics
   */
  private pluckString(freq: number, delaySec: number = 0): void {
    if (!this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime + delaySec;
    const duration = 3.6; // Natural string resonance decay

    // Fundamental note oscillator
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth'; // Rich in natural overtones like a real gourd Tanpura
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm Low-Pass Filter to remove electronic harshness and simulate wooden body
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, startTime);
    filter.frequency.exponentialRampToValueAtTime(280, startTime + duration);
    filter.Q.setValueAtTime(2.2, startTime); // Subtle bridge resonance (Javari)

    // Envelope: Soft attack, long blooming resonant decay
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.32, startTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   * Start the continuous meditative Tanpura drone cycle
   */
  public startDrone(): void {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying || !this.ctx) return;

    this.isPlaying = true;
    this.notifyListeners();

    const scale = TANPURA_SCALES[this.currentScale];
    const strings = scale.strings;

    // Pluck cycle (Pa, Sa, Sa, Kharaj Sa spaced by 0.75s each = 3s cycle)
    const cycleStrings = () => {
      if (!this.isPlaying) return;
      strings.forEach((freq, index) => {
        this.pluckString(freq, index * 0.75);
      });
    };

    cycleStrings();
    this.intervalId = window.setInterval(cycleStrings, 3200);
  }

  /**
   * Stop the Tanpura drone
   */
  public stopDrone(): void {
    this.isPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.notifyListeners();
  }

  public setScale(scale: TanpuraScale): void {
    this.currentScale = scale;
    if (this.isPlaying) {
      this.stopDrone();
      this.startDrone();
    }
  }

  public getScale(): TanpuraScale {
    return this.currentScale;
  }

  /**
   * Play an authentic brass temple bell chime with shimmering metallic decay
   */
  public strikeTempleBell(): void {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (!this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime;
    const bellFrequencies = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6 harmonics

    bellFrequencies.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (Math.random() * 2 - 1), startTime);

      const amp = 0.22 / (idx + 1);
      gain.gain.setValueAtTime(amp, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.8 + idx * 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + 3.8);
    });
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(val: number): void {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, val));
      this.masterGain.gain.setValueAtTime(clamped * 0.45, this.ctx.currentTime);
    }
  }
}

export const sacredAudioSynth = new SacredAudioSynth();
