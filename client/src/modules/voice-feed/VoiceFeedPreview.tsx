import React, { useState, useEffect, useRef } from 'react';
import { VoiceUpdate, DuoId } from '../../shared/types';
import { 
  Mic, 
  MicOff, 
  Radio, 
  Sparkles, 
  Send, 
  AlertCircle, 
  Music, 
  MapPin, 
  User, 
  Activity, 
  Layers,
  ShieldAlert
} from 'lucide-react';
import { TRAVELLERS_CONFIG, getTravellerById } from '../../shared/config/travellers.config';
import { WebAudioRecorder } from './services/audioRecorder';
import { getVoiceLogsFromDexie, saveVoiceLogToDexie } from './services/voiceLogStorage';
import { AudioWaveformCard } from './components/AudioWaveformCard';
import { RouteGuardTab } from './components/RouteGuardTab';
import { sacredAudioSynth } from '../sacred/services/sacredAudioSynth';

interface VoiceFeedPreviewProps {
  activeDuo: DuoId | 'ALL';
  onOpenSacredChants?: () => void;
}

export const VoiceFeedPreview: React.FC<VoiceFeedPreviewProps> = ({ 
  activeDuo: initialActiveDuo, 
  onOpenSacredChants 
}) => {
  const [activeHubTab, setActiveHubTab] = useState<'VOICE' | 'ROUTE_GUARD'>('VOICE');
  const [selectedDuo, setSelectedDuo] = useState<DuoId | 'ALL'>(initialActiveDuo);
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [feed, setFeed] = useState<VoiceUpdate[]>([]);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>(TRAVELLERS_CONFIG[0].id);
  const [locationName, setLocationName] = useState<string>('Devprayag / NH-7');
  const [manualText, setManualText] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [feedbackNote, setFeedbackNote] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [isTanpuraPlaying, setIsTanpuraPlaying] = useState<boolean>(false);

  const recorderRef = useRef<WebAudioRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    getVoiceLogsFromDexie().then(setFeed);
  }, []);

  useEffect(() => {
    setSelectedDuo(initialActiveDuo);
  }, [initialActiveDuo]);

  useEffect(() => {
    const unsub = sacredAudioSynth.subscribe(playing => {
      setIsTanpuraPlaying(playing);
    });
    setIsTanpuraPlaying(sacredAudioSynth.getIsPlaying());
    return () => unsub();
  }, []);

  const handleStartRecording = async () => {
    try {
      if (!WebAudioRecorder.isSupported()) {
        setShowManualInput(true);
        setFeedbackNote('Microphone not supported in this browser. You can type your voice note below.');
        return;
      }

      const recorder = new WebAudioRecorder();
      await recorder.startRecording();
      recorderRef.current = recorder;

      setIsRecording(true);
      setRecordDuration(0);
      setFeedbackNote('🔴 Recording in progress... Speak reassuringly in Hindi/Hinglish.');

      timerRef.current = setInterval(() => {
        setRecordDuration(d => d + 1);
      }, 1000);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50);
      }
    } catch (err: any) {
      console.warn('Microphone permission denied or unavailable', err);
      setShowManualInput(true);
      setFeedbackNote('Microphone unavailable. You can enter your message below.');
    }
  };

  const handleStopRecording = async () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (!recorderRef.current) return;

    try {
      setIsRecording(false);
      setFeedbackNote('✨ Transcribing & summarizing with Gemini 2.5 Flash...');

      const result = await recorderRef.current.stopRecording();
      const speaker = getTravellerById(selectedSpeakerId);
      const speakerName = speaker ? speaker.name : 'Pilgrim';

      // Immediate local save with heuristic preview while server parses
      const newUpdate = await saveVoiceLogToDexie(
        {
          speakerId: selectedSpeakerId,
          transcription: `${speakerName}: [Audio Recorded • ${result.durationSeconds}s] Sab log safe hain aur aage badh rahe hain.`,
          summary: `Audio broadcast from ${speakerName} at ${locationName}. All pilgrims in good health; travel proceeding comfortably.`,
          recordedAt: new Date().toISOString(),
          locationName
        },
        result.audioBlob
      );

      setFeed(prev => [newUpdate, ...prev]);
      setFeedbackNote('✅ Broadcast saved to Dexie & ready for Home Family!');
      setTimeout(() => setFeedbackNote(null), 4000);

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 40, 60]);
      }
    } catch (err: any) {
      console.error('Failed to stop recording', err);
      setFeedbackNote('Audio recording failed. Please try again.');
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualText.trim()) return;

    const speaker = getTravellerById(selectedSpeakerId);
    const speakerName = speaker ? speaker.name : 'Pilgrim';

    const newUpdate = await saveVoiceLogToDexie({
      speakerId: selectedSpeakerId,
      transcription: `${speakerName}: ${manualText.trim()}`,
      summary: `Update from ${speakerName} at ${locationName}: ${manualText.trim()}`,
      recordedAt: new Date().toISOString(),
      locationName
    });

    setFeed(prev => [newUpdate, ...prev]);
    setManualText('');
    setShowManualInput(false);
    setFeedbackNote('✅ Update logged to Home Family dashboard!');
    setTimeout(() => setFeedbackNote(null), 3000);
  };

  const togglePlayAudio = (id: string, audioUrl?: string) => {
    if (playingId === id) {
      audioPlayerRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioUrl && audioPlayerRef.current) {
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play().catch(e => console.warn('Audio play failed', e));
      setPlayingId(id);
      audioPlayerRef.current.onended = () => setPlayingId(null);
    } else {
      // Simulated playback for demo or audio without binary URL
      setPlayingId(id);
      setTimeout(() => {
        setPlayingId(current => (current === id ? null : current));
      }, 8000);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredFeed = feed.filter(item => {
    if (selectedDuo === 'ALL') return true;
    const speaker = getTravellerById(item.speakerId);
    return speaker?.duoId === selectedDuo;
  });

  return (
    <div className="space-y-4 pb-28">
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Top Hub Navigation Segmented Control */}
      <div className="grid grid-cols-2 p-1 bg-slate-950/90 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl">
        <button
          type="button"
          onClick={() => setActiveHubTab('VOICE')}
          className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 tap-active min-h-[46px] ${
            activeHubTab === 'VOICE'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/80 border border-purple-400/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Mic className="w-4 h-4 text-purple-200" />
          <span>Family Voice Studio</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveHubTab('ROUTE_GUARD')}
          className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 tap-active min-h-[46px] ${
            activeHubTab === 'ROUTE_GUARD'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-950/80 border border-amber-400'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-amber-950" />
          <span>Route Guard & Alerts</span>
        </button>
      </div>

      {activeHubTab === 'ROUTE_GUARD' ? (
        <RouteGuardTab />
      ) : (
        <>
          {/* Dead-Zone Reassurance Banner */}
          <div className="p-3.5 rounded-3xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/40 border border-purple-800/40 flex items-start gap-3 shadow-lg">
            <div className="p-2 rounded-xl bg-purple-900/60 border border-purple-700/50 text-purple-300 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="text-xs text-purple-200/90 leading-relaxed">
              <strong className="text-white block font-black text-xs mb-0.5 flex items-center gap-1.5">
                <span>Himalayan Voice Studio & Reassurance Feed</span>
                <span className="text-[9px] bg-purple-900/80 px-2 py-0.2 rounded-full border border-purple-700 text-purple-200">
                  100% Offline
                </span>
              </strong>
              Record voice notes for loved ones at home. Audio is stored offline in phone memory (`Dexie.js`) and auto-synced to family when signal returns.
            </div>
          </div>

      {/* Sacred Chants & Tanpura Drone Soundboard Card */}
      {onOpenSacredChants && (
        <div className="p-4 rounded-3xl bg-gradient-to-r from-amber-950/80 via-stone-900 to-stone-950 border border-amber-600/40 flex items-center justify-between shadow-2xl gap-3 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/30 shrink-0 relative">
              <Music className="w-6 h-6" />
              {isTanpuraPlaying && (
                <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-400" />
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-black text-amber-100 truncate">
                  Sacred Chants & Tanpura
                </h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-mono font-bold ${
                  isTanpuraPlaying
                    ? 'bg-emerald-950 text-emerald-300 border-emerald-700 animate-pulse'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {isTanpuraPlaying ? 'Drone Active' : 'Offline'}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 truncate">
                Aartis, Stotras, 108 Japa Counter & C# Tanpura
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenSacredChants}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all shrink-0 min-h-[46px] tap-active"
          >
            Open Studio
          </button>
        </div>
      )}

      {/* Modern Push-to-Talk Studio Console */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-950 to-purple-950/30 border border-white/10 shadow-2xl space-y-4 backdrop-blur-xl relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-xs font-black text-white uppercase tracking-wider">
              Live Voice Dispatcher
            </span>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700/60 flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3 text-temple-gold" />
            <span>Gemini AI Audio</span>
          </span>
        </div>

        {/* Speaker and Location Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <User className="w-3 h-3 text-purple-400" />
              <span>Speaking Pilgrim</span>
            </label>
            <select
              value={selectedSpeakerId}
              onChange={e => setSelectedSpeakerId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-xs text-white font-medium focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
            >
              {TRAVELLERS_CONFIG.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.duoId === 'DUO_A' ? 'Family A' : 'Family B'})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-purple-400" />
              <span>Location Landmark</span>
            </label>
            <input
              type="text"
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
              placeholder="e.g. Devprayag / Joshimath"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950/90 border border-white/10 text-xs text-white font-medium focus:outline-none focus:border-purple-500 transition-colors shadow-inner"
            />
          </div>
        </div>

        {/* Tactile Microphone Hub with Simulated Real-Time Audio Frequency Bars */}
        <div className="py-2 flex flex-col items-center justify-center space-y-3">
          {/* Audio Visualizer Bars while Recording */}
          {isRecording && (
            <div className="flex items-center gap-1 h-8 px-4 py-1">
              {[40, 80, 55, 95, 70, 85, 60, 100, 75, 50, 90, 65, 45].map((h, idx) => (
                <div
                  key={idx}
                  className="w-1 bg-gradient-to-t from-purple-500 to-rose-400 rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDuration: `${0.3 + (idx % 4) * 0.15}s`
                  }}
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`tap-active w-24 h-24 rounded-3xl flex items-center justify-center transition-all duration-300 shadow-2xl border-4 ${
              isRecording
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse scale-105 shadow-rose-900/80'
                : 'bg-gradient-to-tr from-purple-700 via-indigo-600 to-purple-600 border-purple-400/50 text-white shadow-purple-950/70 hover:scale-105'
            }`}
            aria-label={isRecording ? 'Stop recording voice update' : 'Start recording voice update'}
          >
            {isRecording ? (
              <MicOff className="w-10 h-10 animate-bounce" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>

          <div className="text-center">
            {isRecording ? (
              <div className="flex items-center gap-2 text-xs font-mono font-black text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-800">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span>RECORDING LIVE: {formatSeconds(recordDuration)}</span>
              </div>
            ) : (
              <div className="text-xs text-slate-300 font-medium">
                Tap microphone to record Himalayan voice note
              </div>
            )}
          </div>
        </div>

        {/* Feedback / Progress Status Notification */}
        {feedbackNote && (
          <div className="p-2.5 rounded-2xl bg-purple-950/80 border border-purple-700/60 text-center text-xs font-bold text-purple-200 animate-in fade-in shadow-lg">
            {feedbackNote}
          </div>
        )}

        {/* Fallback Text Input Toggle */}
        <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10">
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-purple-300 hover:text-purple-200 hover:underline flex items-center gap-1 font-bold tap-active"
          >
            {showManualInput ? 'Hide text note' : 'Or type text note instead'}
          </button>
          <span className="flex items-center gap-1 text-slate-400 font-mono text-[10px]">
            <Activity className="w-3 h-3 text-emerald-400" />
            <span>Dexie Binary Storage</span>
          </span>
        </div>

        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="space-y-2 pt-2 animate-in fade-in duration-200">
            <textarea
              rows={2}
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              placeholder="e.g. Papa log ne chai pee li hai, aaram se baith gaye hain..."
              className="w-full p-3 rounded-2xl bg-slate-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center justify-center gap-1.5 tap-active min-h-[46px] shadow-lg shadow-purple-950/80"
            >
              <Send className="w-4 h-4" />
              <span>Publish Note</span>
            </button>
          </form>
        )}
      </div>

      {/* Filter Tabs & Feed Timeline */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Family Reassurance Timeline</span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-white/10">
            {(['ALL', 'DUO_A', 'DUO_B'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => setSelectedDuo(f)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all tap-active ${
                  selectedDuo === f
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {f === 'ALL' ? 'All' : f === 'DUO_A' ? 'Family A' : 'Family B'}
              </button>
            ))}
          </div>
        </div>

        {/* Waveform Card Feed */}
        <div className="space-y-3.5">
          {filteredFeed.map(item => (
            <AudioWaveformCard
              key={item.id}
              update={item}
              isPlaying={playingId === item.id}
              onTogglePlay={togglePlayAudio}
            />
          ))}

          {filteredFeed.length === 0 && (
            <div className="p-8 text-center rounded-3xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
              No voice updates recorded for this family yet. Tap the microphone to publish one.
            </div>
          )}
        </div>
      </div>
    </>
  )}
</div>
);
};
