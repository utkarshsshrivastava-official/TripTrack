import React, { useState, useEffect } from 'react';
import { PilgrimageWaypoint } from '../../../shared/config/pilgrimageRoute.config';
import { sacredAudioGuideService, AudioPlaybackState } from '../services/sacredAudioGuideService';
import { fetchLiveMicroclimate, WaypointWeather } from '../services/mountainWeatherService';
import { 
  X, 
  Volume2, 
  Square, 
  HeartHandshake, 
  Compass, 
  Languages,
  Wind,
  Droplets,
  Sparkles
} from 'lucide-react';

interface SacredLandmarkDrawerProps {
  waypoint: PilgrimageWaypoint | null;
  onClose: () => void;
}

export const SacredLandmarkDrawer: React.FC<SacredLandmarkDrawerProps> = ({
  waypoint,
  onClose
}) => {
  const [preferHindi, setPreferHindi] = useState<boolean>(true);
  const [audioState, setAudioState] = useState<AudioPlaybackState>({
    isPlaying: false,
    isPaused: false,
    currentWaypointId: null,
    progressPercent: 0
  });
  const [weather, setWeather] = useState<WaypointWeather | null>(null);

  useEffect(() => {
    const unsub = sacredAudioGuideService.subscribe(setAudioState);
    return unsub;
  }, []);

  useEffect(() => {
    if (!waypoint) {
      setWeather(null);
      return;
    }

    let isMounted = true;

    fetchLiveMicroclimate(waypoint.coords[0], waypoint.coords[1], waypoint.altitudeMeters)
      .then(w => {
        if (isMounted) {
          setWeather(w);
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
      sacredAudioGuideService.stop();
    };
  }, [waypoint]);

  if (!waypoint) return null;

  const isCurrentPlaying = audioState.isPlaying && audioState.currentWaypointId === waypoint.id;
  const isHighAltitude = waypoint.altitudeMeters >= 2000;
  const isAlpineSanctum = waypoint.altitudeMeters >= 3000;

  const handleToggleAudio = () => {
    if (isCurrentPlaying) {
      sacredAudioGuideService.stop();
    } else {
      sacredAudioGuideService.playWaypointNarration(waypoint, preferHindi);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-slate-900 border-t border-white/15 rounded-t-3xl shadow-2xl p-5 pb-8 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto mb-4" />

        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isAlpineSanctum 
                  ? 'bg-rose-950 text-rose-300 border border-rose-800' 
                  : isHighAltitude 
                    ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
              }`}>
                {isAlpineSanctum ? 'Alpine Sanctum' : isHighAltitude ? 'High Altitude' : 'Valley Confluence'}
              </span>
              {waypoint.isPrayag && (
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-temple-gold/20 text-temple-gold border border-temple-gold/30">
                  Panch Prayag
                </span>
              )}
            </div>
            <h2 className="text-xl font-black text-white tracking-tight">
              {preferHindi ? waypoint.hindiName : waypoint.name}
            </h2>
            <p className="text-xs text-slate-400">
              {preferHindi ? waypoint.name : waypoint.hindiName}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white tap-active"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950/70 border border-white/10 rounded-2xl mb-4 font-mono">
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block">Altitude</span>
            <span className={`text-sm font-black ${isAlpineSanctum ? 'text-rose-400' : isHighAltitude ? 'text-amber-400' : 'text-emerald-400'}`}>
              ⛰️ {waypoint.altitudeMeters}m
            </span>
          </div>
          <div className="text-center border-x border-white/10">
            <span className="text-[10px] text-slate-400 block">From Haridwar</span>
            <span className="text-sm font-black text-sky-400">
              📍 {waypoint.distanceFromHaridwarKm} km
            </span>
          </div>
          <div className="text-center">
            <span className="text-[10px] text-slate-400 block">Effective O₂</span>
            <span className={`text-sm font-black ${isAlpineSanctum ? 'text-rose-400' : 'text-emerald-400'}`}>
              🫁 {Math.round(Math.exp(-waypoint.altitudeMeters / 8400) * 100)}%
            </span>
          </div>
        </div>

        {/* Live Mountain Weather Pill */}
        {weather && (
          <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-sky-950/50 to-slate-900 border border-sky-800/30 mb-4">
            <div className="flex items-center gap-2.5">
              <span className="text-2xl">{weather.conditionIcon}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-extrabold text-white">{weather.temperatureC}°C</span>
                  <span className="text-[11px] text-sky-300 font-medium">Feels like {weather.feelsLikeC}°C</span>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">{weather.conditionLabel}</span>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400 font-mono space-y-0.5">
              <div className="flex items-center justify-end gap-1 text-slate-300">
                <Wind className="w-3 h-3 text-sky-400" />
                <span>{weather.windSpeedKmh} km/h</span>
              </div>
              <div className="flex items-center justify-end gap-1 text-slate-300">
                <Droplets className="w-3 h-3 text-emerald-400" />
                <span>{weather.relativeHumidity}% humidity</span>
              </div>
            </div>
          </div>
        )}

        {/* Audio Player Action Bar */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-950 border border-temple-gold/30 mb-4 shadow-lg">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <div className={`p-2 rounded-xl ${isCurrentPlaying ? 'bg-temple-gold text-slate-950' : 'bg-slate-800 text-temple-gold'}`}>
                <Sparkles className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-wider">
                  Sacred Voice Audio Guide
                </h4>
                <p className="text-[10px] text-slate-400">
                  {preferHindi ? 'पवित्र पौराणिक कथा एवं तीर्थ इतिहास' : 'Puranic lore & sacred history'}
                </p>
              </div>
            </div>

            {/* Language toggle */}
            <button
              type="button"
              onClick={() => setPreferHindi(!preferHindi)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-800 text-[11px] font-bold text-amber-300 hover:text-white border border-white/10 tap-active"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{preferHindi ? 'हिन्दी' : 'English'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleToggleAudio}
            className={`w-full min-h-touch py-3 px-4 rounded-xl font-black text-xs flex items-center justify-center gap-2 transition-all tap-active shadow-md ${
              isCurrentPlaying
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-gradient-to-r from-temple-gold to-amber-500 text-slate-950 hover:brightness-110'
            }`}
          >
            {isCurrentPlaying ? (
              <>
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Sacred Audio Story</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Listen to Sacred Story ({preferHindi ? 'हिन्दी में सुनें' : 'In English'})</span>
              </>
            )}
          </button>
        </div>

        {/* Sacred Significance Section */}
        <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/10 mb-3.5">
          <div className="flex items-center gap-1.5 text-xs font-black text-temple-gold mb-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Sacred Puranic Significance</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {waypoint.sacredSignificance}
          </p>
        </div>

        {/* Elder Comfort & Walking Guide */}
        <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-800/40">
          <div className="flex items-center gap-1.5 text-xs font-black text-amber-300 mb-1.5">
            <HeartHandshake className="w-3.5 h-3.5 text-amber-400" />
            <span>Senior Elder Comfort & Accessibility Guide</span>
          </div>
          <p className="text-xs text-amber-100/90 leading-relaxed font-medium">
            {waypoint.elderCareTip}
          </p>
        </div>
      </div>
    </div>
  );
};
