import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Sparkles, 
  Clock, 
  Volume2, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  Radio
} from 'lucide-react';
import { VoiceUpdate } from '../../../shared/types';
import { getTravellerById } from '../../../shared/config/travellers.config';

interface AudioWaveformCardProps {
  update: VoiceUpdate;
  isPlaying: boolean;
  onTogglePlay: (id: string, audioUrl?: string) => void;
}

// Deterministic seed-based pseudo-random waveform bar heights (so same message has consistent waveform)
const generateWaveformBars = (id: string, count: number = 32): number[] => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    const pseudo = Math.abs(Math.sin((hash + i * 37) * 0.1));
    // Heights between 20% and 100%
    const height = Math.round(20 + pseudo * 80);
    bars.push(height);
  }
  return bars;
};

export const AudioWaveformCard: React.FC<AudioWaveformCardProps> = ({
  update,
  isPlaying,
  onTogglePlay
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0);
  const durationSec = 24; // standard estimated recording duration in seconds

  const progressIntervalRef = useRef<any>(null);
  const speaker = getTravellerById(update.speakerId);
  const waveformBars = React.useMemo(() => generateWaveformBars(update.id, 32), [update.id]);

  // Simulate or track playback progress when isPlaying is active
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setProgressPercent(prev => {
          if (prev >= 100) {
            setCurrentTimeSec(0);
            return 0;
          }
          const step = (100 / (durationSec * 10)) * playbackSpeed;
          const next = prev + step;
          setCurrentTimeSec(Math.floor((next / 100) * durationSec));
          return Math.min(next, 100);
        });
      }, 100);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [isPlaying, durationSec, playbackSpeed]);

  const handleCycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    const speeds = [1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  const handleWaveformClick = (index: number) => {
    const targetPercent = Math.round((index / waveformBars.length) * 100);
    setProgressPercent(targetPercent);
    setCurrentTimeSec(Math.round((targetPercent / 100) * durationSec));
    if (!isPlaying) {
      onTogglePlay(update.id, update.audioUrl);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isFamilyA = speaker?.duoId === 'DUO_A';

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-950/95 to-purple-950/25 border border-white/10 shadow-2xl p-4 sm:p-5 space-y-4 backdrop-blur-xl relative overflow-hidden group hover:border-purple-500/40 transition-all duration-300">
      {/* Subtle background ambient pulse glow if playing */}
      {isPlaying && (
        <div className="absolute -top-16 -right-16 w-36 h-36 rounded-full bg-purple-600/20 blur-3xl pointer-events-none animate-pulse" />
      )}

      {/* Top Bar: Speaker Avatar, Family Badge, Timestamp & Reassurance Tag */}
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar with dynamic ring */}
          <div className="relative shrink-0">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-md border border-white/20"
              style={{ backgroundColor: speaker?.avatarColor || '#7c3aed' }}
            >
              {speaker?.name.charAt(0) || 'P'}
            </div>
            {isPlaying && (
              <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-500 items-center justify-center">
                  <Radio className="w-2.5 h-2.5 text-white animate-spin" />
                </span>
              </span>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-black text-white truncate">
                {speaker?.name || 'Pilgrim'}
              </h4>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                isFamilyA 
                  ? 'bg-blue-950/70 text-blue-300 border-blue-700/60' 
                  : 'bg-emerald-950/70 text-emerald-300 border-emerald-700/60'
              }`}>
                {isFamilyA ? 'Family A' : 'Family B'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-medium">
              <span>📍 {update.locationName || 'NH-7 Alaknanda Corridor'}</span>
              <span>•</span>
              <span className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                <Clock className="w-3 h-3 text-slate-400" />
                {new Date(update.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>

        {/* Reassurance Status Pill */}
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Safe & Rested</span>
          </span>
          <span className="text-[9px] font-mono text-purple-300/80 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-purple-400" />
            <span>Offline Blob</span>
          </span>
        </div>
      </div>

      {/* Modern Waveform Player Deck */}
      <div className="p-3.5 rounded-2xl bg-black/60 border border-white/10 shadow-inner space-y-2.5">
        <div className="flex items-center gap-3">
          {/* Big Tactile Play / Pause Button */}
          <button
            type="button"
            onClick={() => onTogglePlay(update.id, update.audioUrl)}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-200 tap-active shadow-xl ${
              isPlaying
                ? 'bg-gradient-to-tr from-purple-600 to-pink-600 text-white shadow-purple-900/60 scale-95'
                : 'bg-gradient-to-tr from-purple-700 to-indigo-600 hover:from-purple-600 hover:to-indigo-500 text-white shadow-purple-950/80'
            }`}
            aria-label={isPlaying ? 'Pause voice message' : 'Play voice message'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            )}
          </button>

          {/* Dynamic Interactive Waveform Bars */}
          <div className="flex-1 flex items-center gap-[3px] h-10 px-1 cursor-pointer overflow-hidden py-1">
            {waveformBars.map((height, idx) => {
              const barPercent = (idx / waveformBars.length) * 100;
              const isPast = barPercent <= progressPercent;

              return (
                <div
                  key={idx}
                  onClick={() => handleWaveformClick(idx)}
                  className="flex-1 min-w-[2px] max-w-[4px] rounded-full transition-all duration-150 flex items-center"
                  style={{ height: '100%' }}
                >
                  <div
                    className={`w-full rounded-full transition-all duration-150 ${
                      isPast
                        ? 'bg-gradient-to-t from-purple-500 to-pink-400 shadow-sm shadow-purple-500/50'
                        : 'bg-slate-700/60 hover:bg-slate-500/70'
                    } ${isPlaying && isPast ? 'animate-pulse' : ''}`}
                    style={{
                      height: `${height}%`,
                      margin: 'auto 0'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Speed Toggle Chip */}
          <button
            type="button"
            onClick={handleCycleSpeed}
            className="shrink-0 px-2 py-1 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 text-[10px] font-mono font-black text-purple-300 transition-all tap-active"
            title="Cycle Playback Speed"
          >
            {playbackSpeed}x
          </button>
        </div>

        {/* Duration & Live Progress Indicator */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1">
          <span className="text-purple-300 font-bold">
            {formatSeconds(currentTimeSec)}
          </span>
          <span className="text-slate-500">
            {formatSeconds(durationSec)}
          </span>
        </div>
      </div>

      {/* Gemini AI Reassurance Summary (High Contrast & Elder-Readable) */}
      <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-purple-950/30 border border-purple-500/20 shadow-sm space-y-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-temple-gold" />
            <span>Home Family Reassurance:</span>
          </div>
          <span className="text-[9px] font-mono text-purple-300/70">Gemini 2.5 Flash</span>
        </div>
        <p className="text-xs text-slate-200 font-medium leading-relaxed italic">
          "{update.summary}"
        </p>
      </div>

      {/* Spoken Transcript Accordion */}
      <div className="border-t border-white/5 pt-2">
        <button
          type="button"
          onClick={() => setShowTranscript(!showTranscript)}
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-slate-200 font-medium py-1 transition-colors tap-active"
        >
          <span className="flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Spoken Hindi/Hinglish Transcript</span>
          </span>
          {showTranscript ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showTranscript && (
          <div className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 leading-relaxed font-sans animate-in fade-in duration-200">
            <p className="whitespace-pre-wrap">
              {update.transcription}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
