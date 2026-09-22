/**
 * Sacred Audio Guide & Web Speech Narration Service
 * 100% offline-compatible voice narrator for confluences, shrines, and sacred history along NH-7.
 */

import { PilgrimageWaypoint } from '../../../shared/config/pilgrimageRoute.config';

export interface AudioPlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  currentWaypointId: string | null;
  progressPercent: number;
}

class SacredAudioGuideService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private stateListeners: ((state: AudioPlaybackState) => void)[] = [];
  private state: AudioPlaybackState = {
    isPlaying: false,
    isPaused: false,
    currentWaypointId: null,
    progressPercent: 0
  };

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public subscribe(listener: (state: AudioPlaybackState) => void): () => void {
    this.stateListeners.push(listener);
    listener(this.state);
    return () => {
      this.stateListeners = this.stateListeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.stateListeners.forEach(l => l({ ...this.state }));
  }

  /**
   * Find suitable Hindi or Indian English voice
   */
  private getBestVoice(preferHindi = true): SpeechSynthesisVoice | null {
    if (!this.synth) return null;
    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    if (preferHindi) {
      const hiVoice = voices.find(v => v.lang.startsWith('hi') || v.lang.includes('IN') && v.name.toLowerCase().includes('hindi'));
      if (hiVoice) return hiVoice;
    }

    // Fallback: Indian English
    const inVoice = voices.find(v => v.lang === 'en-IN');
    if (inVoice) return inVoice;

    // Fallback to first available English
    return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
  }

  /**
   * Play narration for a waypoint
   */
  public playWaypointNarration(
    waypoint: PilgrimageWaypoint,
    preferHindi = true,
    rate = 0.95
  ) {
    if (!this.synth) return;

    this.stop();

    const narrationText = preferHindi
      ? `${waypoint.hindiName}। ऊँचाई ${waypoint.altitudeMeters} मीटर। ${waypoint.desc} पौराणिक महत्व: ${waypoint.sacredSignificance} बुजुर्गों के लिए सुझाव: ${waypoint.elderCareTip}`
      : `${waypoint.name}. Altitude ${waypoint.altitudeMeters} meters. ${waypoint.desc} Sacred Significance: ${waypoint.sacredSignificance} Elder Care Tip: ${waypoint.elderCareTip}`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    const voice = this.getBestVoice(preferHindi);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = preferHindi ? 'hi-IN' : 'en-IN';
    }

    utterance.rate = rate; // Slightly slower for senior dignity and clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      this.state = {
        isPlaying: true,
        isPaused: false,
        currentWaypointId: waypoint.id,
        progressPercent: 0
      };
      this.notify();
    };

    utterance.onend = () => {
      this.state = {
        isPlaying: false,
        isPaused: false,
        currentWaypointId: null,
        progressPercent: 100
      };
      this.notify();
      this.currentUtterance = null;
    };

    utterance.onerror = () => {
      this.state = {
        isPlaying: false,
        isPaused: false,
        currentWaypointId: null,
        progressPercent: 0
      };
      this.notify();
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  public pause() {
    if (this.synth && this.state.isPlaying && !this.state.isPaused) {
      this.synth.pause();
      this.state.isPaused = true;
      this.notify();
    }
  }

  public resume() {
    if (this.synth && this.state.isPaused) {
      this.synth.resume();
      this.state.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
      this.state = {
        isPlaying: false,
        isPaused: false,
        currentWaypointId: null,
        progressPercent: 0
      };
      this.notify();
      this.currentUtterance = null;
    }
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getActiveUtterance(): SpeechSynthesisUtterance | null {
    return this.currentUtterance;
  }
}

export const sacredAudioGuideService = new SacredAudioGuideService();
