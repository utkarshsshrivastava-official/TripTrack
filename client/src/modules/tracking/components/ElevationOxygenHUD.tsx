import React, { useState, useMemo } from 'react';
import { 
  generateElevationProfile, 
  interpolateRouteAtProgress, 
  RouteProfilePoint 
} from '../services/elevationOxygenService';
import { Activity, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

interface ElevationOxygenHUDProps {
  onScrub?: (point: RouteProfilePoint) => void;
  className?: string;
}

export const ElevationOxygenHUD: React.FC<ElevationOxygenHUDProps> = ({
  onScrub,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [scrubPercent, setScrubPercent] = useState<number>(85); // Default near Badrinath

  const profilePoints = useMemo(() => generateElevationProfile(50), []);
  const currentPoint = useMemo(() => interpolateRouteAtProgress(scrubPercent), [scrubPercent]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setScrubPercent(val);
    const pt = interpolateRouteAtProgress(val);
    if (onScrub) onScrub(pt);
  };

  // SVG Coordinates calculation for elevation gradient curve
  // Width 320, Height 60
  const svgPath = useMemo(() => {
    const minAlt = 300;
    const maxAlt = 3300;
    const width = 320;
    const height = 50;

    const coords = profilePoints.map((pt, idx) => {
      const x = (idx / (profilePoints.length - 1)) * width;
      const y = height - ((pt.altitudeMeters - minAlt) / (maxAlt - minAlt)) * height;
      return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    });

    return coords.join(' ');
  }, [profilePoints]);

  const isExtremeAltitude = currentPoint.altitudeMeters >= 3000;
  const isHighAltitude = currentPoint.altitudeMeters >= 2400;

  return (
    <div className={`glass-panel border border-white/15 rounded-2xl p-3 shadow-2xl backdrop-blur-2xl transition-all ${className || ''}`}>
      {/* Header Bar */}
      <div 
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-temple-gold/20 text-temple-gold border border-temple-gold/30">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div>
            <span className="text-[11px] font-black text-white uppercase tracking-wider block">
              Elevation & O₂ Scrubber
            </span>
            <span className="text-[10px] text-slate-300 font-mono">
              📍 {currentPoint.nearestWaypoint.name} • ⛰️ {currentPoint.altitudeMeters}m
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full font-mono ${
            isExtremeAltitude 
              ? 'bg-rose-950 text-rose-300 border border-rose-800' 
              : isHighAltitude 
                ? 'bg-amber-950 text-amber-300 border border-amber-800' 
                : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
          }`}>
            🫁 {currentPoint.effectiveOxygenPercent}% O₂
          </span>
          <button 
            type="button"
            className="p-1 rounded-md text-slate-400 hover:text-white"
            aria-label="Toggle"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Interactive Slider & Curve */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/10 animate-fade-in">
          {/* Elevation Profile SVG Curve */}
          <div className="relative w-full h-14 bg-slate-950/60 rounded-xl overflow-hidden border border-white/5 mb-2">
            <svg viewBox="0 0 320 50" preserveAspectRatio="none" className="w-full h-full">
              <defs>
                <linearGradient id="elevationGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.3" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.8" />
                </linearGradient>
              </defs>
              <path
                d={`${svgPath} L 320 50 L 0 50 Z`}
                fill="url(#elevationGrad)"
              />
              <path
                d={svgPath}
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Scrubber vertical indicator line */}
            <div 
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_#ffffff] pointer-events-none transition-all"
              style={{ left: `${scrubPercent}%` }}
            />
          </div>

          {/* Range Slider Thumb */}
          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={scrubPercent}
            onChange={handleSliderChange}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-temple-gold"
          />

          {/* Quick scrub labels */}
          <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1 mb-2">
            <span>Haridwar (314m)</span>
            <span>Rudraprayag (895m)</span>
            <span>Joshimath (1,890m)</span>
            <span className="text-rose-400 font-bold">Badrinath (3,130m)</span>
          </div>

          {/* Readout Metrics Grid */}
          <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-950 border border-white/10 rounded-xl text-center font-mono text-[10px]">
            <div>
              <span className="text-slate-500 block text-[9px]">Distance</span>
              <span className="font-bold text-sky-400">{currentPoint.distanceKm} km</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">Altitude</span>
              <span className="font-bold text-amber-400">{currentPoint.altitudeMeters} m</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">Gradient</span>
              <span className="font-bold text-slate-300">+{currentPoint.gradientPercent}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[9px]">Eff. O₂</span>
              <span className={`font-bold ${isExtremeAltitude ? 'text-rose-400' : 'text-emerald-400'}`}>
                {currentPoint.effectiveOxygenPercent}%
              </span>
            </div>
          </div>

          {/* Elder Medical Guidance Banner */}
          {(isHighAltitude || isExtremeAltitude) && (
            <div className={`mt-2 p-2 rounded-xl text-[10px] flex items-start gap-1.5 ${
              isExtremeAltitude 
                ? 'bg-rose-950/70 border border-rose-800/80 text-rose-200' 
                : 'bg-amber-950/70 border border-amber-800/80 text-amber-200'
            }`}>
              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-400" />
              <span>
                <strong>Senior Care:</strong> {currentPoint.elderMedicalNotice}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
