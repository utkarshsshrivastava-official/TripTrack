import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  Bell, 
  Volume2, 
  RotateCcw, 
  Sparkles, 
  Type, 
  Music,
  Sliders,
  ChevronDown
} from 'lucide-react';
import { SACRED_STOTRAS } from '../data/stotrasData';
import { sacredAudioSynth, TANPURA_SCALES, TanpuraScale } from '../services/sacredAudioSynth';

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
  const [selectedScale, setSelectedScale] = useState<TanpuraScale>('C_SHARP');
  const [japaCount, setJapaCount] = useState<number>(0);
  const [isElderFont, setIsElderFont] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.55);
  const [autoScroll, setAutoScroll] = useState<boolean>(false);
  const [autoScrollSpeed, setAutoScrollSpeed] = useState<'slow' | 'medium'>('slow');
  const [showTuningDrawer, setShowTuningDrawer] = useState<boolean>(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const scrollIntervalRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = sacredAudioSynth.subscribe(playing => {
      setIsPlaying(playing);
    });
    return () => {
      unsubscribe();
      sacredAudioSynth.stopDrone();
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, []);

  // Handle Auto-Scroll Teleprompter
  useEffect(() => {
    if (autoScroll && isOpen) {
      const stepMs = autoScrollSpeed === 'slow' ? 60 : 35;
      scrollIntervalRef.current = setInterval(() => {
        if (scrollContainerRef.current) {
          scrollContainerRef.current.scrollBy({ top: 1, behavior: 'auto' });
        }
      }, stepMs);
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
        scrollIntervalRef.current = null;
      }
    }
    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [autoScroll, autoScrollSpeed, isOpen]);

  if (!isOpen) return null;

  const currentStotra = SACRED_STOTRAS.find(s => s.id === selectedStotraId) || SACRED_STOTRAS[0];
  const activeScalePreset = TANPURA_SCALES[selectedScale];

  const togglePlayback = () => {
    if (isPlaying) {
      sacredAudioSynth.stopDrone();
    } else {
      sacredAudioSynth.startDrone();
      sacredAudioSynth.strikeTempleBell();
    }
  };

  const handleSelectScale = (scale: TanpuraScale) => {
    setSelectedScale(scale);
    sacredAudioSynth.setScale(scale);
  };

  const handleStrikeBell = () => {
    sacredAudioSynth.strikeTempleBell();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    sacredAudioSynth.setVolume(val);
  };

  const incrementJapa = () => {
    const next = (japaCount + 1) % 109;
    setJapaCount(next);

    // Haptic and bell milestones: 27 (quarter), 54 (half), 81 (three quarters), 108 (full mala!)
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      if (next === 108) {
        navigator.vibrate([100, 60, 100, 60, 250]);
        sacredAudioSynth.strikeTempleBell();
      } else if (next === 27 || next === 54 || next === 81) {
        navigator.vibrate([70, 40, 70]);
      } else {
        navigator.vibrate(30);
      }
    } else {
      if (next === 108) {
        sacredAudioSynth.strikeTempleBell();
      }
    }
  };

  const malaPercentage = Math.round((japaCount / 108) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 border border-amber-500/20 rounded-t-[32px] sm:rounded-3xl p-4 sm:p-6 max-h-[94vh] flex flex-col shadow-2xl relative overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-500/20 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-stone-950 shadow-lg shadow-amber-500/20 font-black">
              <Music className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-amber-100 flex items-center gap-1.5">
                <span>Sacred Chants & Tanpura Studio</span>
              </h2>
              <p className="text-[11px] text-amber-400/80 font-medium">
                100% Offline Vedic Acoustics & Live Teleprompter
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              sacredAudioSynth.stopDrone();
              onClose();
            }}
            className="tap-active p-2.5 rounded-full bg-stone-800/80 text-stone-300 hover:text-white border border-stone-700/60 min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close sacred player"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stotra Selector Strip */}
        <div className="flex items-center gap-2 overflow-x-auto py-3 shrink-0 scrollbar-none">
          {SACRED_STOTRAS.map(stotra => (
            <button
              key={stotra.id}
              type="button"
              onClick={() => {
                setSelectedStotraId(stotra.id);
                setJapaCount(0);
                if (scrollContainerRef.current) {
                  scrollContainerRef.current.scrollTop = 0;
                }
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all tap-active min-h-[40px] ${
                selectedStotraId === stotra.id
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-500/30'
                  : 'bg-stone-900/90 text-stone-300 border border-stone-800 hover:text-white hover:border-amber-500/40'
              }`}
            >
              {stotra.titleHindi}
            </button>
          ))}
        </div>

        {/* Himalayan Tanpura Soundboard Deck */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/50 via-stone-950 to-stone-900 border border-amber-600/30 shadow-xl space-y-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Himalayan Tanpura Drone
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isPlaying
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700 animate-pulse'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}>
                {isPlaying ? `Resonating: ${activeScalePreset.name}` : 'Stopped'}
              </span>
              <button
                type="button"
                onClick={() => setShowTuningDrawer(!showTuningDrawer)}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700/80 tap-active"
                title="Soundboard Tuning"
              >
                <Sliders className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Scale Selector Tabs (if drawer expanded or inline) */}
          {showTuningDrawer && (
            <div className="p-2.5 rounded-xl bg-black/60 border border-amber-500/20 space-y-2 animate-in fade-in duration-150">
              <span className="text-[10px] font-bold text-amber-400/90 uppercase tracking-widest block">
                Scale Tuning Presets
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(TANPURA_SCALES) as TanpuraScale[]).map(scaleKey => {
                  const preset = TANPURA_SCALES[scaleKey];
                  const isCur = selectedScale === scaleKey;
                  return (
                    <button
                      key={scaleKey}
                      type="button"
                      onClick={() => handleSelectScale(scaleKey)}
                      className={`p-2 rounded-xl text-center transition-all tap-active ${
                        isCur
                          ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                          : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-amber-500/40 text-xs'
                      }`}
                    >
                      <div className="font-bold text-[11px] truncate">{preset.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Controls: Play, Bell, Elder Font */}
          <div className="flex items-center justify-between gap-2.5">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlayback}
              className={`flex-1 min-h-[48px] px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-lg transition-all tap-active ${
                isPlaying
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/60 animate-pulse'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-stone-950 shadow-amber-500/30'
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 fill-white" />
                  <span>Pause Tanpura</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-stone-950" />
                  <span>Play Tanpura Drone</span>
                </>
              )}
            </button>

            {/* Temple Bell */}
            <button
              type="button"
              onClick={handleStrikeBell}
              className="min-h-[48px] px-3.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-amber-500/30 text-amber-300 font-bold text-xs flex items-center gap-1.5 tap-active shrink-0 shadow-md"
              title="Strike Temple Bell"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Temple Bell</span>
            </button>

            {/* Elder Font Toggle */}
            <button
              type="button"
              onClick={() => setIsElderFont(!isElderFont)}
              className={`min-h-[48px] px-3 rounded-xl border font-bold text-xs flex items-center gap-1 tap-active shrink-0 ${
                isElderFont
                  ? 'bg-amber-500/20 border-amber-500 text-amber-300 shadow-inner'
                  : 'bg-stone-800 border-stone-700 text-stone-400'
              }`}
              title="Toggle Large Elder Font"
            >
              <Type className="w-4 h-4" />
              <span>{isElderFont ? 'Elder A+' : 'Normal'}</span>
            </button>
          </div>

          {/* Volume Slider & Auto-scroll Quick Toggle */}
          <div className="flex items-center justify-between gap-3 pt-1 border-t border-amber-500/10 text-stone-400">
            <div className="flex items-center gap-2 flex-1">
              <Volume2 className="w-3.5 h-3.5 shrink-0 text-amber-400" />
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={volume}
                onChange={handleVolumeChange}
                className="w-full accent-amber-500 cursor-pointer h-1.5"
                aria-label="Tanpura Volume"
              />
              <span className="text-[10px] font-mono text-stone-300 w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Teleprompter Auto-Scroll Pill & Speed Toggle */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setAutoScroll(!autoScroll)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 border transition-all tap-active ${
                  autoScroll
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 animate-pulse'
                    : 'bg-stone-800/80 border-stone-700 text-stone-400'
                }`}
              >
                <ChevronDown className={`w-3 h-3 ${autoScroll ? 'animate-bounce' : ''}`} />
                <span>{autoScroll ? 'Scroll ON' : 'Auto-Scroll'}</span>
              </button>

              {autoScroll && (
                <button
                  type="button"
                  onClick={() => setAutoScrollSpeed(s => s === 'slow' ? 'medium' : 'slow')}
                  className="px-2 py-1 rounded-lg text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 tap-active"
                >
                  {autoScrollSpeed === 'slow' ? '1x' : '2x'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 108 Japa Mala Counter Card */}
        <div className="my-2.5 p-3 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Circular Progress Ring */}
            <div className="relative w-11 h-11 flex items-center justify-center">
              <svg className="w-11 h-11 -rotate-90">
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  className="stroke-stone-800"
                  strokeWidth="3"
                  fill="transparent"
                />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  className="stroke-amber-400 transition-all duration-300"
                  strokeWidth="3"
                  strokeDasharray={113}
                  strokeDashoffset={113 - (113 * malaPercentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute text-[11px] font-mono font-black text-amber-300">
                {japaCount}
              </span>
            </div>

            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-sm font-bold text-white">108 Japa Mala</span>
                <span className="text-[10px] font-mono text-amber-400 font-bold">
                  ({malaPercentage}%)
                </span>
              </div>
              <p className="text-[10px] text-stone-400">
                {japaCount === 108 
                  ? '🎉 1 Mala Complete! Har Har Gange!' 
                  : `Milestones at 27, 54, 81 & 108 counts`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={incrementJapa}
              className="min-h-[46px] px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs flex items-center gap-1 tap-active shadow-md shadow-amber-500/20"
            >
              <span>+1 Bead</span>
            </button>
            <button
              type="button"
              onClick={() => setJapaCount(0)}
              className="min-h-[46px] min-w-[40px] p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white border border-stone-700 flex items-center justify-center tap-active"
              title="Reset Counter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Verses Teleprompter Area */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto space-y-3 pr-1 pb-4 scroll-smooth"
        >
          <div className="border-b border-stone-800 pb-2">
            <h3 className="text-base font-black text-amber-200">
              {currentStotra.titleHindi}
            </h3>
            <p className="text-xs text-amber-400/90 font-medium">
              {currentStotra.significance}
            </p>
          </div>

          {currentStotra.verses.map(verse => (
            <div
              key={verse.verseNumber}
              className="p-4 rounded-2xl bg-stone-950/90 border border-stone-800/80 space-y-2.5 shadow-sm"
            >
              <div className="text-[10px] font-mono font-bold text-amber-500 uppercase tracking-widest flex items-center justify-between">
                <span>श्लोक {verse.verseNumber}</span>
                <span className="text-stone-500 text-[9px]">Sanskrit & Hindi</span>
              </div>

              {/* Sanskrit Verse with Elder High-Contrast Readability */}
              <div className={`font-serif font-black text-amber-100 whitespace-pre-line leading-relaxed ${
                isElderFont ? 'text-xl tracking-wide' : 'text-base'
              }`}>
                {verse.sanskrit}
              </div>

              {/* Hindi Meaning */}
              <div className={`text-stone-300 leading-relaxed border-t border-stone-800/80 pt-2 ${
                isElderFont ? 'text-sm font-medium' : 'text-xs'
              }`}>
                <span className="font-bold text-amber-400">भावार्थ: </span>
                {verse.hindiMeaning}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
