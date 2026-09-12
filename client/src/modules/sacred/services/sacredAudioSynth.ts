/**
 * Offline Himalayan Tanpura & Bell Audio Synthesizer (Web Audio API)
 * Zero external audio files required — functions 100% offline in dead zones.
 */

class SacredAudioSynth {
  private ctx: AudioContext | null = null;
  private isPlaying: boolean = false;
  private intervalId: number | null = null;
  private masterGain: GainNode | null = null;

  // Tanpura Strings (Pa - Sa - Sa - Sa in C# scale)
  private readonly tanpuraFreqs = [
    196.00, // Pa (Pancham)
    261.63, // Sa (Madhya)
    261.63, // Sa (Madhya)
    130.81  // Kharaj Sa (Mandra)
  ];

  private initContext(): void {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
  }

  /**
   * Pluck a single acoustic string with rich harmonics
   */
  private pluckString(freq: number, delaySec: number = 0): void {
    if (!this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime + delaySec;
    const duration = 3.5; // Natural string resonance decay

    // Fundamental note
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth'; // Rich in natural overtones like a real gourd Tanpura
    osc.frequency.setValueAtTime(freq, startTime);

    // Warm Low-Pass Filter to remove electronic harshness
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, startTime);
    filter.frequency.exponentialRampToValueAtTime(300, startTime + duration);

    // Envelope: Gentle attack, long resonant decay
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.linearRampToValueAtTime(0.3, startTime + 0.12);
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
    if (this.isPlaying || !this.ctx) return;

    this.isPlaying = true;

    // Pluck cycle (Pa, Sa, Sa, Kharaj Sa spaced by 0.75s each = 3s total cycle)
    const cycleStrings = () => {
      if (!this.isPlaying) return;
      this.tanpuraFreqs.forEach((freq, index) => {
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
  }

  /**
   * Play an authentic brass temple bell chime
   */
  public strikeTempleBell(): void {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    const startTime = this.ctx.currentTime;
    const bellFrequencies = [587.33, 880, 1174.66, 1760]; // D5, A5, D6, A6 harmonics

    bellFrequencies.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq + (Math.random() * 2 - 1), startTime);

      const amp = 0.2 / (idx + 1);
      gain.gain.setValueAtTime(amp, startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 2.5 + idx * 0.5);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(startTime);
      osc.stop(startTime + 3.5);
    });
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public setVolume(val: number): void {
    if (this.masterGain && this.ctx) {
      const clamped = Math.max(0, Math.min(1, val));
      this.masterGain.gain.setValueAtTime(clamped * 0.4, this.ctx.currentTime);
    }
  }
}

export const sacredAudioSynth = new SacredAudioSynth();
