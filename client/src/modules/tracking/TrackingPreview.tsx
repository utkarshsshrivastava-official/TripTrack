import React, { useState, useEffect, useMemo } from 'react';
import { DuoId } from '../../shared/types';
import { FamilyMap } from './components/FamilyMap';
import { MountainNavigationHUD } from './components/MountainNavigationHUD';
import { ElevationOxygenHUD } from './components/ElevationOxygenHUD';
import { SacredLandmarkDrawer } from './components/SacredLandmarkDrawer';
import { broadcastPilgrimBeacon } from './services/telemetry';
import { 
  watchDeviceLocation, 
  checkWaypointProximity, 
  calculateDistanceKm,
  DetectedLocation 
} from '../../shared/services/locationService';
import { RouteProfilePoint } from './services/elevationOxygenService';
import { 
  downloadCorridorOfflineTiles, 
  getOfflineTileCacheStatus, 
  DownloadProgress 
} from './services/offlineTileCacheService';
import { 
  PILGRIMAGE_WAYPOINTS, 
  PilgrimageWaypoint 
} from '../../shared/config/pilgrimageRoute.config';
import { TRAVELLERS_CONFIG } from '../../shared/config/travellers.config';
import { useUserProfile } from '../../shared/hooks/useUserProfile';
import { 
  Send, 
  Mountain, 
  AlertCircle, 
  Check, 
  Radio,
  UserCheck,
  ChevronUp,
  ChevronDown,
  Smartphone,
  Hospital,
  HeartPulse,
  X,
  DownloadCloud,
  CheckCircle2
} from 'lucide-react';

interface TrackingPreviewProps {
  activeDuo: DuoId | 'ALL';
  isOnline: boolean;
  onOpenOfflineSms?: () => void;
  onOpenMedicalDirectory?: () => void;
  onOpenOximeter?: () => void;
  onDuoChange?: (duo: DuoId | 'ALL') => void;
}

export const TrackingPreview: React.FC<TrackingPreviewProps> = ({
  activeDuo,
  isOnline,
  onOpenOfflineSms,
  onOpenMedicalDirectory,
  onOpenOximeter,
  onDuoChange
}) => {
  const { activeUser } = useUserProfile();
  const defaultTravellerId = TRAVELLERS_CONFIG.some(t => t.id === activeUser.id)
    ? activeUser.id
    : (activeUser.duoId === 'DUO_B' ? 'traveller-shreyas' : 'traveller-utkarsh');

  // Real-Time Hardware GPS & Follow-Me Navigation state
  const [currentLocation, setCurrentLocation] = useState<DetectedLocation | null>(null);
  const [isFollowMe, setIsFollowMe] = useState<boolean>(false);
  const [proximityAlertWaypoint, setProximityAlertWaypoint] = useState<PilgrimageWaypoint | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<PilgrimageWaypoint | null>(null);
  const [scrubbedPoint, setScrubbedPoint] = useState<RouteProfilePoint | null>(null);

  // Offline Tile Cache state
  const [tileCacheStatus, setTileCacheStatus] = useState<{ isCached: boolean; tileCount: number }>({ isCached: false, tileCount: 0 });
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null);
  const [isDownloadingTiles, setIsDownloadingTiles] = useState<boolean>(false);

  // Telemetry Beacon state
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [lastPingTime, setLastPingTime] = useState<string>('Just now');
  const [selectedTravellerId, setSelectedTravellerId] = useState<string>(defaultTravellerId);
  const [checkpointName, setCheckpointName] = useState<string>('Badrinath Temple Valley');
  const [vitalNote, setVitalNote] = useState<string>('Both fathers comfortable; sipping warm water; normal BP');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastAltitude, setLastAltitude] = useState<number>(3130);
  const [lastBattery, setLastBattery] = useState<number>(85);
  
  // Collapsible Bottom Sheet state: false = slim pill, true = expanded elevation + beacon
  const [isSheetExpanded, setIsSheetExpanded] = useState<boolean>(false);
  // Mountain Shadow Guard details modal
  const [showShadowInfo, setShowShadowInfo] = useState<boolean>(false);

  // Watch hardware GPS continuously
  useEffect(() => {
    const unwatch = watchDeviceLocation((loc) => {
      setCurrentLocation(loc);
      if (loc.altitudeMeters) setLastAltitude(loc.altitudeMeters);

      // Check proximity to landmarks (<2km)
      const proximity = checkWaypointProximity(loc.latitude, loc.longitude, 2.0);
      if (proximity.isInsideThreshold && proximity.waypoint) {
        setProximityAlertWaypoint(proximity.waypoint);
      } else {
        setProximityAlertWaypoint(null);
      }
    });

    // Check offline tile status
    getOfflineTileCacheStatus().then(setTileCacheStatus);

    return () => {
      unwatch();
    };
  }, []);

  useEffect(() => {
    setSelectedTravellerId(defaultTravellerId);
  }, [defaultTravellerId]);

  // Compute Next Upcoming Waypoint from GPS coordinates
  const { nextWaypoint, distanceToNextKm } = useMemo(() => {
    if (!currentLocation) {
      return { nextWaypoint: PILGRIMAGE_WAYPOINTS[2], distanceToNextKm: 18 }; // Default: Devprayag
    }

    const lat = currentLocation.latitude;
    const lon = currentLocation.longitude;

    // Find first waypoint along route whose distance from Haridwar is greater than current position
    let candidate: PilgrimageWaypoint | null = null;
    let minDist = Infinity;

    for (const wp of PILGRIMAGE_WAYPOINTS) {
      const d = calculateDistanceKm(lat, lon, wp.coords[0], wp.coords[1]);
      if (d > 0.8 && d < minDist) {
        minDist = d;
        candidate = wp;
      }
    }

    return {
      nextWaypoint: candidate || PILGRIMAGE_WAYPOINTS[PILGRIMAGE_WAYPOINTS.length - 2],
      distanceToNextKm: minDist !== Infinity ? Math.round(minDist * 10) / 10 : null
    };
  }, [currentLocation]);

  const availableTravellers = TRAVELLERS_CONFIG.filter(
    t => activeDuo === 'ALL' || t.duoId === activeDuo
  );

  const handlePingLocation = async () => {
    setIsPinging(true);
    setSuccessMessage(null);

    try {
      const ping = await broadcastPilgrimBeacon(
        selectedTravellerId,
        checkpointName,
        vitalNote,
        isOnline
      );

      setLastAltitude(ping.altitudeMeters || 3130);
      setLastBattery(ping.batteryLevel ?? 85);
      setLastPingTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSuccessMessage(
        isOnline 
          ? '🛰️ Live Telemetry broadcasted to Home Family dashboard!' 
          : '📦 Beacon safely queued in Dexie (Dead-Zone Mode: auto-flushes on signal)'
      );
    } catch (err) {
      console.error('Failed to trigger beacon', err);
    } finally {
      setIsPinging(false);
      setTimeout(() => setSuccessMessage(null), 4500);
    }
  };

  const handleDownloadTiles = async () => {
    setIsDownloadingTiles(true);
    try {
      await downloadCorridorOfflineTiles((progress) => {
        setDownloadProgress(progress);
      });
      const updatedStatus = await getOfflineTileCacheStatus();
      setTileCacheStatus(updatedStatus);
    } catch (err) {
      console.error('Failed to pre-cache tiles', err);
    } finally {
      setIsDownloadingTiles(false);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[580px] bg-slate-950 overflow-hidden flex flex-col">
      {/* 1. Immersive Full-Bleed Map Canvas with Satellite & Topo Layers */}
      <div className="absolute inset-0 z-0">
        <FamilyMap 
          activeDuo={activeDuo} 
          onDuoChange={onDuoChange}
          liveLocation={currentLocation}
          isFollowMe={isFollowMe}
          onSelectWaypoint={(wp) => setSelectedWaypoint(wp)}
          scrubbedPoint={scrubbedPoint}
        />
      </div>

      {/* 2. Top Mountain Navigation HUD & Cockpit Telemetry */}
      <div className="absolute top-16 left-3 right-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <MountainNavigationHUD
          currentLocation={currentLocation}
          isFollowMe={isFollowMe}
          onToggleFollowMe={() => setIsFollowMe(!isFollowMe)}
          nextWaypoint={nextWaypoint}
          distanceToNextKm={distanceToNextKm}
          proximityAlertWaypoint={proximityAlertWaypoint}
          onOpenSacredGuide={(wp) => setSelectedWaypoint(wp)}
        />
      </div>

      {/* 3. Mountain Shadow Guard Details Modal */}
      {showShadowInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-amber-500/40 p-5 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-2xl bg-amber-500/20 text-amber-400">
                  <Mountain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-white">Mountain Cellular Shadow</h3>
                  <p className="text-[11px] text-amber-300/80 font-mono">NH-7 Srinagar to Joshimath Gorges</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowShadowInfo(false)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white tap-active"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Between Srinagar and Joshimath, steep Himalayan gorges create natural cellular dead-zones. The home dashboard automatically reassures family members that silence up to <strong>2.5 hours</strong> is expected terrain shadow.
            </p>

            {/* Offline Tile Pre-Download Action */}
            <div className="p-3 rounded-2xl bg-slate-950 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-white flex items-center gap-1.5">
                  <DownloadCloud className="w-4 h-4 text-sky-400" />
                  <span>Offline Map Pack</span>
                </span>
                {tileCacheStatus.isCached ? (
                  <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Downloaded ({tileCacheStatus.tileCount} tiles)</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-300 font-mono">Not Cached</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleDownloadTiles}
                disabled={isDownloadingTiles}
                className="tap-active w-full py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1.5 min-h-touch shadow"
              >
                {isDownloadingTiles ? (
                  <>
                    <div className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    <span>Downloading ({downloadProgress?.percent ?? 0}%)...</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-3.5 h-3.5" />
                    <span>{tileCacheStatus.isCached ? 'Re-Download Offline Map Tiles' : 'Pre-Download NH-7 Map for Offline'}</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 block">
                Offline Relief & Health Launchers:
              </span>

              {onOpenOfflineSms && (
                <button
                  type="button"
                  onClick={() => { setShowShadowInfo(false); onOpenOfflineSms(); }}
                  className="tap-active w-full py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs flex items-center justify-between shadow-md min-h-touch"
                >
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>Generate 2G Dead-Zone SMS</span>
                  </div>
                  <span className="text-[10px] bg-amber-600/30 px-2 py-0.5 rounded font-mono">No Data Req.</span>
                </button>
              )}

              {onOpenMedicalDirectory && (
                <button
                  type="button"
                  onClick={() => { setShowShadowInfo(false); onOpenMedicalDirectory(); }}
                  className="tap-active w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-between min-h-touch"
                >
                  <div className="flex items-center gap-2">
                    <Hospital className="w-4 h-4 text-emerald-400" />
                    <span>NH-7 Medical Relief Directory</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">5 Relief Posts</span>
                </button>
              )}

              {onOpenOximeter && (
                <button
                  type="button"
                  onClick={() => { setShowShadowInfo(false); onOpenOximeter(); }}
                  className="tap-active w-full py-2.5 px-3 rounded-xl bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800 font-bold text-xs flex items-center justify-between min-h-touch"
                >
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-rose-400" />
                    <span>Elder SpO₂ Pulse Oximeter</span>
                  </div>
                  <span className="text-[10px] text-rose-400 font-mono">&gt;2,000m Guard</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowShadowInfo(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white text-xs font-bold tap-active min-h-touch"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* 4. Bottom Elevation & Oxygen Scrubber HUD */}
      <div className="absolute bottom-[calc(max(0.75rem,env(safe-area-inset-bottom,0px))+4.25rem)] left-3 right-3 z-30 pointer-events-auto flex flex-col gap-2">
        <ElevationOxygenHUD
          onScrub={(pt) => setScrubbedPoint(pt)}
        />

        {/* Collapsible Beacon & Profile Sheet */}
        {!isSheetExpanded ? (
          <div className="glass-dock rounded-2xl p-2 px-3 shadow-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-temple-gold/20 text-temple-gold">
                <Mountain className="w-3.5 h-3.5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-white">
                  Telemetry Beacon • {lastAltitude}m
                </span>
                <span className="text-[9px] text-slate-400 block font-mono">
                  {checkpointName.split(' ')[0]} • Battery {lastBattery}% • {lastPingTime}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setShowShadowInfo(true)}
                className="tap-active px-2 py-1 rounded-xl bg-amber-950/80 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>Dead-Zone</span>
              </button>

              <button
                type="button"
                onClick={() => setIsSheetExpanded(true)}
                className="tap-active px-2.5 py-1 rounded-xl bg-slate-800 text-white text-[10px] font-bold flex items-center gap-1 border border-white/10"
              >
                <span>Beacon</span>
                <ChevronUp className="w-3.5 h-3.5 text-temple-gold" />
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-dock rounded-3xl p-4 shadow-2xl border border-white/15 max-h-[55vh] overflow-y-auto space-y-3 animate-in slide-in-from-bottom-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-temple-gold animate-pulse" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Broadcast Pilgrim Telemetry
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSheetExpanded(false)}
                className="tap-active p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-xs font-bold"
              >
                <span>Collapse</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Pilgrim Selector */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <UserCheck className="w-3 h-3 text-amber-400" />
                <span>Broadcasting as Pilgrim:</span>
              </label>
              <select
                value={selectedTravellerId}
                onChange={(e) => setSelectedTravellerId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-temple-gold"
              >
                {availableTravellers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.duoId === 'DUO_A' ? 'Family A' : 'Family B'} — {t.relation}){t.id === defaultTravellerId ? ' — You' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Landmark Checkpoint Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 block">
                Current Mountain Checkpoint
              </label>
              <input
                type="text"
                value={checkpointName}
                onChange={(e) => setCheckpointName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-temple-gold"
                placeholder="e.g. Devprayag / Joshimath"
              />
            </div>

            {/* Vital Note Input */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 block">
                Elder Vitals & Reassurance Note
              </label>
              <input
                type="text"
                value={vitalNote}
                onChange={(e) => setVitalNote(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-temple-gold"
                placeholder="e.g. Fathers comfortable; tea halt near Devprayag..."
              />
            </div>

            {/* Broadcast Action Button */}
            <button
              type="button"
              onClick={handlePingLocation}
              disabled={isPinging}
              className="tap-active w-full py-3 rounded-xl bg-gradient-to-r from-temple-saffron via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-950/40 border border-amber-300/40 flex items-center justify-center gap-2 hover:brightness-110 transition-all min-h-touch"
            >
              {isPinging ? (
                <>
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
                  <span>Acquiring GPS & Telemetry...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Broadcast Checkpoint Beacon</span>
                </>
              )}
            </button>

            {successMessage && (
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4 shrink-0" />
                <span className="text-[11px] leading-tight">{successMessage}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 5. Sacred Landmark Drawer for Puranic Lore & Voice Audio */}
      <SacredLandmarkDrawer
        waypoint={selectedWaypoint}
        onClose={() => setSelectedWaypoint(null)}
      />
    </div>
  );
};
