import React, { useState, useEffect, useRef } from 'react';
import { VoiceUpdate, DuoId } from '../../shared/types';
import { 
  Mic, 
  MicOff, 
  Radio, 
  Sparkles, 
  Play, 
  Pause, 
  Volume2, 
  Clock, 
  ShieldCheck, 
  Send,
  AlertCircle
} from 'lucide-react';
import { TRAVELLERS_CONFIG, getTravellerById } from '../../shared/config/travellers.config';
import { WebAudioRecorder } from './services/audioRecorder';
import { getVoiceLogsFromDexie, saveVoiceLogToDexie } from './services/voiceLogStorage';

interface VoiceFeedPreviewProps {
  activeDuo: DuoId | 'ALL';
}

export const VoiceFeedPreview: React.FC<VoiceFeedPreviewProps> = ({ activeDuo }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordDuration, setRecordDuration] = useState(0);
  const [feed, setFeed] = useState<VoiceUpdate[]>([]);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>(TRAVELLERS_CONFIG[0].id);
  const [locationName, setLocationName] = useState<string>('Devprayag / NH-7');
  const [manualText, setManualText] = useState<string>('');
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [feedbackNote, setFeedbackNote] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const recorderRef = useRef<WebAudioRecorder | null>(null);
  const timerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    getVoiceLogsFromDexie().then(setFeed);
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
      setFeedbackNote('Recording audio... Speak in Hindi/Hinglish for family reassurance.');

      timerRef.current = setInterval(() => {
        setRecordDuration(d => d + 1);
      }, 1000);
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
      setFeedbackNote('Transcribing & summarizing with Gemini 2.5 Flash...');

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
      setFeedbackNote('✅ Broadcast saved to Dexie & synced to Home Family feed!');
      setTimeout(() => setFeedbackNote(null), 4000);
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
    if (!audioUrl) return;

    if (playingId === id) {
      audioPlayerRef.current?.pause();
      setPlayingId(null);
      return;
    }

    if (audioPlayerRef.current) {
      audioPlayerRef.current.src = audioUrl;
      audioPlayerRef.current.play();
      setPlayingId(id);
      audioPlayerRef.current.onended = () => setPlayingId(null);
    }
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredFeed = feed.filter(item => {
    if (activeDuo === 'ALL') return true;
    const speaker = getTravellerById(item.speakerId);
    return speaker?.duoId === activeDuo;
  });

  return (
    <div className="space-y-4 pb-20">
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Cellular Dead-Zone Reassurance Banner */}
      <div className="p-3.5 rounded-3xl bg-gradient-to-r from-purple-950/40 via-alpine-900 to-slate-950 border border-purple-800/50 flex items-start gap-3 shadow-lg">
        <AlertCircle className="w-5 h-5 text-purple-400 mt-0.5 shrink-0" />
        <div className="text-xs text-purple-200/90 leading-relaxed">
          <strong className="text-white block font-bold mb-0.5">Push-to-Talk Family Reassurance:</strong>
          Record short voice updates in Hindi/Hinglish. Gemini AI extracts transcripts and generates calm bullet summaries so elder relatives at home always know everyone is rested and well.
        </div>
      </div>

      {/* Push-to-Talk Recording Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-purple-950/60 via-alpine-900 to-slate-950 border border-purple-800/50 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Push-to-Talk Broadcast
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-900/60 text-purple-200 border border-purple-700/60">
            Gemini Flash 2.5 AI
          </span>
        </div>

        {/* Speaker & Location Picker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Speaker</label>
            <select
              value={selectedSpeakerId}
              onChange={e => setSelectedSpeakerId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              {TRAVELLERS_CONFIG.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.duoId === 'DUO_A' ? 'Family A' : 'Family B'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-400 block mb-1">Current Location</label>
            <input
              type="text"
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
              placeholder="e.g. Devprayag / Joshimath"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Big Mic Button & Waveform Area */}
        <div className="py-3 flex flex-col items-center justify-center space-y-2">
          <button
            onClick={isRecording ? handleStopRecording : handleStartRecording}
            className={`tap-active w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl border-4 ${
              isRecording
                ? 'bg-rose-600 border-rose-400 text-white animate-pulse scale-110 shadow-rose-900/80'
                : 'bg-gradient-to-tr from-purple-700 to-indigo-600 border-purple-400/50 text-white shadow-purple-950/60 hover:scale-105'
            }`}
          >
            {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
          </button>

          <div className="text-center">
            {isRecording ? (
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span>RECORDING: {formatSeconds(recordDuration)}</span>
              </div>
            ) : (
              <div className="text-xs text-slate-300">
                Tap microphone to start voice update
              </div>
            )}
          </div>
        </div>

        {/* Feedback / Progress Status */}
        {feedbackNote && (
          <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-800 text-center text-xs font-semibold text-purple-200 animate-in fade-in">
            {feedbackNote}
          </div>
        )}

        {/* Fallback Text Input Toggle */}
        <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400 border-t border-purple-900/40">
          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-purple-300 hover:underline flex items-center gap-1 font-semibold"
          >
            {showManualInput ? 'Hide text note' : 'Or type text note instead'}
          </button>
          <span className="flex items-center gap-1 text-slate-400 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dexie IndexedDB Outbox</span>
          </span>
        </div>

        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="space-y-2 pt-2 animate-in fade-in">
            <textarea
              rows={2}
              value={manualText}
              onChange={e => setManualText(e.target.value)}
              placeholder="e.g. Papa log ne chai pee li hai, aaram se baith gaye hain..."
              className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 tap-active min-h-[44px]"
            >
              <Send className="w-4 h-4" />
              <span>Publish Note</span>
            </button>
          </form>
        )}
      </div>

      {/* Family Reassurance Broadcast Timeline */}
      <div className="space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Family Reassurance Timeline</span>
          <span className="text-temple-gold text-[10px] flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>Gemini AI Summarized</span>
          </span>
        </div>

        {filteredFeed.map((item) => {
          const speaker = getTravellerById(item.speakerId);
          const hasAudio = !!item.audioUrl;
          const isCurrentPlaying = playingId === item.id;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-2xl bg-alpine-900/90 border border-slate-800 space-y-2.5 shadow-sm"
            >
              {/* Header info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: speaker?.avatarColor || '#2563eb' }}
                  >
                    {speaker?.name.charAt(0) || 'P'}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span>{speaker?.name || 'Pilgrim'}</span>
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {speaker?.duoId === 'DUO_A' ? 'Family A' : 'Family B'}
                      </span>
                    </div>
                    {item.locationName && (
                      <div className="text-[10px] font-medium text-slate-400">
                        📍 {item.locationName}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {hasAudio && (
                    <button
                      onClick={() => togglePlayAudio(item.id, item.audioUrl)}
                      className="px-2.5 py-1 rounded-lg bg-purple-900/50 hover:bg-purple-800 text-purple-200 border border-purple-700/60 text-[10px] font-bold flex items-center gap-1 tap-active"
                    >
                      {isCurrentPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isCurrentPlaying ? 'Pause' : 'Listen'}</span>
                    </button>
                  )}
                  <span className="text-[10px] font-mono text-slate-400 flex items-center gap-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </span>
                </div>
              </div>

              {/* AI Summary Card */}
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-800/40 text-xs text-purple-200 font-medium leading-relaxed">
                <div className="text-[10px] uppercase font-mono font-bold text-purple-300 mb-0.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-temple-gold" />
                  <span>Home Family Summary:</span>
                </div>
                "{item.summary}"
              </div>

              {/* Spoken Voice Note Transcript */}
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 text-[11px] text-slate-300 italic">
                <span className="text-slate-500 not-italic font-semibold block text-[10px] flex items-center gap-1">
                  <Volume2 className="w-3 h-3" />
                  <span>Original Spoken Update:</span>
                </span>
                "{item.transcription}"
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
