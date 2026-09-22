import React, { useState, useEffect } from 'react';
import { DuoId } from '../../shared/types';
import { FamilyMap } from './components/FamilyMap';
import { broadcastPilgrimBeacon } from './services/telemetry';
import { TRAVELLERS_CONFIG } from '../../shared/config/travellers.config';
import { useUserProfile } from '../../shared/hooks/useUserProfile';
import { 
  Send, 
  Mountain, 
  AlertCircle, 
  Check, 
  Radio,
  Battery,
  ShieldCheck,
  UserCheck,
  ChevronUp,
  ChevronDown,
  Smartphone,
  Hospital,
  HeartPulse,
  Info,
  X
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

  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [lastPingTime, setLastPingTime] = useState<string>('Just now');
  const [selectedTravellerId, setSelectedTravellerId] = useState<string>(defaultTravellerId);

  useEffect(() => {
    setSelectedTravellerId(defaultTravellerId);
  }, [defaultTravellerId]);

  const [checkpointName, setCheckpointName] = useState<string>('Badrinath Temple Valley');
  const [vitalNote, setVitalNote] = useState<string>('Both fathers comfortable; sipping warm water; normal BP');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastAltitude, setLastAltitude] = useState<number>(3130);
  const [lastBattery, setLastBattery] = useState<number>(85);
  
  // Collapsible Bottom Sheet state: false = slim pill, true = expanded elevation + beacon
  const [isSheetExpanded, setIsSheetExpanded] = useState<boolean>(false);
  // Mountain Shadow Guard details modal
  const [showShadowInfo, setShowShadowInfo] = useState<boolean>(false);

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

  const isHighAltitudeZone = lastAltitude >= 2000;

  return (
    <div className="relative w-full h-[calc(100vh-64px)] min-h-[580px] bg-slate-950 overflow-hidden flex flex-col">
      {/* 1. Immersive Full-Bleed Map Canvas */}
      <div className="absolute inset-0 z-0">
        <FamilyMap activeDuo={activeDuo} onDuoChange={onDuoChange} />
      </div>

      {/* 2. Floating Mountain Cellular Shadow Guard Pill (Top-Center) */}
      <div className="absolute top-16 left-3 right-3 z-20 flex justify-center pointer-events-auto">
        <button
          type="button"
          onClick={() => setShowShadowInfo(true)}
          className="tap-active flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-950/85 hover:bg-amber-900/90 text-amber-200 border border-amber-500/50 shadow-2xl backdrop-blur-xl transition-all"
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
          <span className="text-[11px] font-bold truncate">
            Alaknanda Gorge Dead-Zone Active
          </span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 font-mono">
            NH-7
          </span>
        </button>
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

      {/* 4. Collapsible Elevation & Telemetry Bottom Sheet */}
      <div className="absolute bottom-[calc(max(0.75rem,env(safe-area-inset-bottom,0px))+4.25rem)] left-3 right-3 z-30 pointer-events-auto">
        {!isSheetExpanded ? (
          /* Slim Floating Bar (Collapsed Mode) */
          <div className="glass-dock rounded-2xl p-2.5 px-3.5 shadow-2xl border border-white/10 flex items-center justify-between animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-xl bg-temple-gold/20 text-temple-gold">
                <Mountain className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-white">
                    {lastAltitude}m
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">•</span>
                  <span className="text-[11px] font-medium text-slate-300">
                    {checkpointName.split(' ')[0]}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <span className={`inline-block w-1.5 h-1.5 rounded-full ${isHighAltitudeZone ? 'bg-rose-500 animate-pulse' : 'bg-sky-400'}`} />
                  <span className="font-mono text-[9px]">
                    {isHighAltitudeZone ? 'High-Altitude Cold Zone' : 'Valley Acclimatized'}
                  </span>
                </div>
              </div>
            </div>

            {/* Tap to Expand Button */}
            <button
              type="button"
              onClick={() => setIsSheetExpanded(true)}
              className="tap-active min-h-touch px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 text-white font-bold text-xs flex items-center gap-1.5 border border-white/10 shadow-md"
            >
              <span>Beacon & Profile</span>
              <ChevronUp className="w-4 h-4 text-temple-gold" />
            </button>
          </div>
        ) : (
          /* Expanded Full-Elevation & Telemetry Sheet */
          <div className="glass-dock rounded-3xl p-4 shadow-2xl border border-white/15 max-h-[62vh] overflow-y-auto space-y-4 animate-in slide-in-from-bottom-4">
            {/* Sheet Header with Collapse Toggle */}
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-temple-gold" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-white">
                  Route Elevation & Pilgrim Telemetry
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsSheetExpanded(false)}
                className="tap-active p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white flex items-center gap-1 text-xs font-bold"
              >
                <span>Collapse</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* NH-7 Elevation Profile Chart */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-300">
                  NH-7 Himalayan Ascent Gradient
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  isHighAltitudeZone
                    ? 'bg-rose-950 text-rose-300 border-rose-700/80 animate-pulse'
                    : 'bg-sky-950 text-sky-300 border-sky-800'
                }`}>
                  Current: {lastAltitude}m
                </span>
              </div>

              {/* Elevation Step Bar Visualization */}
              <div className="h-20 w-full rounded-xl bg-slate-900/60 p-2 relative flex items-end justify-between border border-slate-800/80">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 bg-emerald-600 rounded-t h-3" />
                  <span className="text-[8px] text-slate-400 font-mono">Durg 216m</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 bg-sky-600 rounded-t h-4" />
                  <span className="text-[8px] text-slate-400 font-mono">HW 314m</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 bg-amber-500 rounded-t h-7" />
                  <span className="text-[8px] text-slate-400 font-mono">Rudra 895m</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 bg-amber-600 rounded-t h-10" />
                  <span className="text-[8px] text-amber-300 font-mono">Joshi 1890m</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 bg-rose-500 rounded-t h-14 relative animate-pulse">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[7px] text-rose-300 font-black">Dham</span>
                  </div>
                  <span className="text-[8px] text-rose-300 font-mono font-bold">Badri 3130m</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-6 bg-purple-500 rounded-t h-15" />
                  <span className="text-[8px] text-purple-300 font-mono">Mana 3200m</span>
                </div>
              </div>

              {isHighAltitudeZone && (
                <div className="p-2 rounded-xl bg-rose-950/40 border border-rose-800/60 text-[10px] text-rose-200 flex items-start gap-1.5">
                  <Info className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>High Altitude Warning (&gt;2,000m):</strong> Pacing required for senior fathers. Hydrate with warm water every 90 mins.
                  </span>
                </div>
              )}
            </div>

            {/* One-Tap Checkpoint Telemetry Beacon Broadcaster */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Broadcast Vital Beacon
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <Battery className="w-3 h-3" />
                    <span>{lastBattery}%</span>
                  </span>
                  <span>•</span>
                  <span>{lastPingTime}</span>
                </div>
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
                  placeholder="e.g. Joshimath Acclimatization Camp / Badrinath"
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

              {/* Action Button */}
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

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Local-First: Telemetry stored in Dexie even with zero signal</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
