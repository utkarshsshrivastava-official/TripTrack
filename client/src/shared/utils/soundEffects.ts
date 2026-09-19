/**
 * TripTrack Zero-Dependency Web Audio Synthesizer & Haptic Generator
 * Generates an elegant, high-clarity notification chime directly via Web Audio API.
 * Works 100% offline in Himalayan cellular dead zones with 0 asset downloads.
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioCtx) {
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (err) {
    console.warn('⚠️ [Audio] Web Audio API unavailable:', err);
    return null;
  }
}

/**
 * Plays an authentic, gentle two-tone chime (D5 -> A5 harmonious bell)
 */
export function playChatChime(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.18, now);
    masterGain.connect(ctx.destination);

    // Tone 1: Fundamental D5 (587.33 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.7, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc1.connect(gain1);
    gain1.connect(masterGain);

    // Tone 2: Harmonic A5 (880.00 Hz) - slightly delayed for bell bounce
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880.0, now + 0.08);
    gain2.gain.setValueAtTime(0.001, now);
    gain2.gain.setValueAtTime(0.85, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc2.connect(gain2);
    gain2.connect(masterGain);

    // Start & Stop Oscillators
    osc1.start(now);
    osc1.stop(now + 0.4);

    osc2.start(now + 0.08);
    osc2.stop(now + 0.6);
  } catch (err) {
    console.warn('⚠️ [Audio] Could not play notification chime:', err);
  }
}

/**
 * Triggers dual tactile pulses for elder-first tactile notice
 */
export function triggerChatHaptic(): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      // 120ms pulse, 60ms pause, 120ms pulse
      navigator.vibrate([120, 60, 120]);
    } catch {
      // Ignore unsupported platforms
    }
  }
}
