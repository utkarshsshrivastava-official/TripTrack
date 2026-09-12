import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Bell, Volume2, RotateCcw, Sparkles, Type, Music } from 'lucide-react';
import { SACRED_STOTRAS } from '../data/stotrasData';
import { sacredAudioSynth } from '../services/sacredAudioSynth';

interface OfflineStotraPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStotraId?: string;
}

export const OfflineStotraPlayer: React.FC<OfflineStotraPlayerProps> = ({
  isOpen,
  onClose,
  defaultStotraId
}) => {
  const [selectedStotraId, setSelectedStotraId] = useState<string>(
    defaultStotraId || SACRED_STOTRAS[0].id
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [japaCount, setJapaCount] = useState<number>(0);
  const [isElderFont, setIsElderFont] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.5);

  useEffect(() => {
    return () => {
      sacredAudioSynth.stopDrone();
    };
  }, []);

  if (!isOpen) return null;

  const currentStotra = SACRED_STOTRAS.find(s => s.id === selectedStotraId) || SACRED_STOTRAS[0];

  const togglePlayback = () => {
    if (isPlaying) {
      sacredAudioSynth.stopDrone();
      setIsPlaying(false);
    } else {
      sacredAudioSynth.startDrone();
      sacredAudioSynth.strikeTempleBell();
      setIsPlaying(true);
    }
  };

  const handleStrikeBell = () => {
    sacredAudioSynth.strikeTempleBell();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sacredAudioSynth.setVolume(val);
  };

  const incrementJapa = () => {
    setJapaCount(prev => (prev + 1) % 109);
    sacredAudioSynth.strikeTempleBell();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto pb-safe shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 flex items-center gap-1.5">
                Sacred Stotras & Chants
              </h2>
              <p className="text-xs text-stone-400">
                100% Offline Tanpura Drone & Devotional Liturgy
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sacredAudioSynth.stopDrone();
              setIsPlaying(false);
              onClose();
            }}
            className="tap-active p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stotra Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-none">
          {SACRED_STOTRAS.map(stotra => (
            <button
              key={stotra.id}
              type="button"
              onClick={() => {
                setSelectedStotraId(stotra.id);
                setJapaCount(0);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all tap-active ${
                selectedStotraId === stotra.id
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
              }`}
            >
              {stotra.titleHindi}
            </button>
          ))}
        </div>

        {/* Audio Synthesizer Control Deck */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/40 via-stone-950 to-stone-900 border border-amber-800/40 shadow-inner space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Himalayan Tanpura Drone (C# Scale)
              </span>
            </div>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              isPlaying
                ? 'bg-emerald-950 text-emerald-300 border-emerald-800 animate-pulse'
                : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}>
              {isPlaying ? 'Resonating Live' : 'Stopped'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            {/* Play/Stop Toggle */}
            <button
              type="button"
              onClick={togglePlayback}
              className={`min-h-[48px] px-5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-all tap-active ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/50'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-amber-500/20'
              }`}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-stone-950" />}
              <span>{isPlaying ? 'Pause Tanpura' : 'Play Tanpura Drone'}</span>
            </button>

            {/* Temple Bell Strike */}
            <button
              type="button"
              onClick={handleStrikeBell}
              className="min-h-[48px] px-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-amber-300 font-bold text-xs flex items-center gap-1.5 tap-active"
              title="Strike Temple Bell"
            >
              <Bell className="w-4 h-4" />
              <span>Temple Bell</span>
            </button>

            {/* Elder Font Toggle */}
            <button
              type="button"
              onClick={() => setIsElderFont(!isElderFont)}
              className={`min-h-[48px] px-3 rounded-xl border font-bold text-xs flex items-center gap-1 tap-active ${
                isElderFont
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
              title="Elder Large Font"
            >
              <Type className="w-4 h-4" />
              <span>{isElderFont ? 'Elder A+' : 'Font'}</span>
            </button>
          </div>

          {/* Volume Slider */}
          <div className="flex items-center gap-2 pt-1 text-stone-400">
            <Volume2 className="w-3.5 h-3.5 shrink-0" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={handleVolumeChange}
              className="w-full accent-amber-500 cursor-pointer h-1.5"
            />
            <span className="text-[10px] font-mono w-8 text-right">{Math.round(volume * 100)}%</span>
          </div>
        </div>

        {/* 108 Japa Counter Section */}
        <div className="mt-3 p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-amber-400">{japaCount}</span>
            <span className="text-xs font-semibold text-stone-400">/ 108 Japa Counts</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={incrementJapa}
              className="min-h-[42px] px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1 tap-active shadow-md"
            >
              <span>+1 Japa</span>
            </button>
            <button
              type="button"
              onClick={() => setJapaCount(0)}
              className="p-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 tap-active"
              title="Reset Count"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Verses & Meaning Scroll Area */}
        <div className="mt-4 space-y-3.5">
          <div className="border-b border-stone-800 pb-2">
            <h3 className="text-base font-bold text-white">
              {currentStotra.titleHindi}
            </h3>
            <p className="text-xs text-amber-400">
              {currentStotra.significance}
            </p>
          </div>

          {currentStotra.verses.map(verse => (
            <div
              key={verse.verseNumber}
              className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2.5"
            >
              <div className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                Verse {verse.verseNumber}
              </div>

              {/* Sanskrit Stanza */}
              <div className={`font-serif font-bold text-amber-200 whitespace-pre-line leading-relaxed ${
                isElderFont ? 'text-lg' : 'text-base'
              }`}>
                {verse.sanskrit}
              </div>

              {/* Hindi Meaning */}
              <div className={`text-stone-400 leading-relaxed border-t border-stone-800/80 pt-2 ${
                isElderFont ? 'text-sm' : 'text-xs'
              }`}>
                <span className="font-semibold text-stone-300">भावार्थ: </span>
                {verse.hindiMeaning}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
