import React from 'react';
import { DetectedLocation } from '../../../shared/services/locationService';
import { PilgrimageWaypoint } from '../../../shared/config/pilgrimageRoute.config';
import { 
  Navigation, 
  Compass, 
  MapPin, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface MountainNavigationHUDProps {
  currentLocation: DetectedLocation | null;
  isFollowMe: boolean;
  onToggleFollowMe: () => void;
  nextWaypoint: PilgrimageWaypoint | null;
  distanceToNextKm: number | null;
  proximityAlertWaypoint: PilgrimageWaypoint | null;
  onOpenSacredGuide: (waypoint: PilgrimageWaypoint) => void;
  onDismissProximityAlert?: () => void;
}

export const MountainNavigationHUD: React.FC<MountainNavigationHUDProps> = ({
  currentLocation,
  isFollowMe,
  onToggleFollowMe,
  nextWaypoint,
  distanceToNextKm,
  proximityAlertWaypoint,
  onOpenSacredGuide
}) => {
  const speed = currentLocation?.speedKmH ?? null;
  const altitude = currentLocation?.altitudeMeters ?? null;

  // Approximate mountain driving duration at ~35 km/h average ghat pace
  const estimatedMinutes = distanceToNextKm !== null && distanceToNextKm > 0
    ? Math.round((distanceToNextKm / 35) * 60)
    : null;

  return (
    <div className="flex flex-col gap-2 pointer-events-auto">
      {/* Proximity Milestone Arrival Banner */}
      {proximityAlertWaypoint && (
        <div className="glass-panel p-2.5 rounded-2xl border border-temple-gold/40 shadow-2xl bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-slate-950/90 animate-slide-down flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-1.5 rounded-xl bg-temple-gold text-slate-950 shrink-0">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <div className="truncate">
              <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider block">
                📍 Entering Sacred Landmark
              </span>
              <span className="text-xs font-black text-white truncate block">
                {proximityAlertWaypoint.hindiName} ({proximityAlertWaypoint.altitudeMeters}m)
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onOpenSacredGuide(proximityAlertWaypoint)}
            className="px-2.5 py-1.5 rounded-xl bg-temple-gold text-slate-950 text-[11px] font-extrabold flex items-center gap-1 shadow-md hover:brightness-110 shrink-0 tap-active"
          >
            <span>Story</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Cockpit Telemetry Bar */}
      <div className="glass-panel p-2 rounded-2xl shadow-xl border border-white/10 flex items-center justify-between gap-2 backdrop-blur-2xl">
        {/* Left: Speedometer & Altitude */}
        <div className="flex items-center gap-3 pl-1 font-mono">
          <div className="flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-temple-gold animate-pulse" />
            <div>
              <span className="text-xs font-black text-white">
                {speed !== null ? `${speed}` : '--'}
              </span>
              <span className="text-[9px] text-slate-400 font-bold ml-0.5">km/h</span>
            </div>
          </div>

          {altitude !== null && (
            <div className="border-l border-white/10 pl-2">
              <span className="text-xs font-black text-sky-400">
                ⛰️ {altitude}m
              </span>
            </div>
          )}
        </div>

        {/* Center: Next Milestone Ticker */}
        {nextWaypoint && (
          <div 
            className="flex-1 max-w-[190px] truncate text-center cursor-pointer hover:opacity-80"
            onClick={() => onOpenSacredGuide(nextWaypoint)}
          >
            <div className="flex items-center justify-center gap-1 text-[10px] font-bold text-slate-300 truncate">
              <MapPin className="w-3 h-3 text-temple-gold shrink-0" />
              <span className="truncate">{nextWaypoint.name}</span>
            </div>
            {distanceToNextKm !== null && (
              <span className="text-[9px] font-mono text-amber-300 block">
                {distanceToNextKm} km {estimatedMinutes ? `• ~${estimatedMinutes}m` : ''}
              </span>
            )}
          </div>
        )}

        {/* Right: Follow-Me Auto-Pan Lock Button */}
        <button
          type="button"
          onClick={onToggleFollowMe}
          className={`min-h-[38px] px-3 py-1 rounded-xl text-[11px] font-extrabold flex items-center gap-1.5 transition-all tap-active shadow-md ${
            isFollowMe
              ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-300 hover:text-white border border-white/10'
          }`}
          title="Toggle Auto-Center on Vehicle"
        >
          <Compass className={`w-3.5 h-3.5 ${isFollowMe ? 'animate-spin-slow' : ''}`} />
          <span>{isFollowMe ? 'Follow' : 'Free'}</span>
        </button>
      </div>
    </div>
  );
};
