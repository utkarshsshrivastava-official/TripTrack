/**
 * Sacred Temple Bell Chime Synthesizer
 * Uses Web Audio API to synthesize a pure bronze temple bell resonance
 * 100% offline, zero-network, zero-cost audio synthesizer.
 */

class SacredBellAudioService {
  private ctx: AudioContext | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Plays an auspicious Tibetan / Himalayan temple bell chime with natural harmonic decay
   */
  public playTempleBell(durationSec = 3.5) {
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;

      // Bell fundamental frequency (528 Hz - Sacred transformation frequency)
      const fundamental = 528;
      // Harmonics characteristic of a cast bronze bell
      const harmonics = [
        { freq: fundamental, gain: 0.45, decay: durationSec },
        { freq: fundamental * 1.5, gain: 0.25, decay: durationSec * 0.8 },
        { freq: fundamental * 2.0, gain: 0.20, decay: durationSec * 0.7 },
        { freq: fundamental * 2.76, gain: 0.12, decay: durationSec * 0.5 },
        { freq: fundamental * 3.42, gain: 0.08, decay: durationSec * 0.4 }
      ];

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.7, now);
      masterGain.connect(ctx.destination);

      harmonics.forEach(h => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(h.freq, now);

        // Bell strike attack: instantaneous strike then exponential decay
        gainNode.gain.setValueAtTime(0.001, now);
        gainNode.gain.linearRampToValueAtTime(h.gain, now + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + h.decay);

        osc.connect(gainNode);
        gainNode.connect(masterGain);

        osc.start(now);
        osc.stop(now + h.decay + 0.1);
      });
    } catch (e) {
      console.warn('Sacred bell audio play skipped:', e);
    }
  }
}

export const sacredBellAudio = new SacredBellAudioService();
