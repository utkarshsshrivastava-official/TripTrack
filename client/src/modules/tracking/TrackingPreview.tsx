import React, { useState } from 'react';
import { DuoId } from '../../shared/types';
import { FamilyMap } from './components/FamilyMap';
import { broadcastPilgrimBeacon } from './services/telemetry';
import { TRAVELLERS_CONFIG } from '../../shared/config/travellers.config';
import { 
  Send, 
  Mountain, 
  AlertCircle, 
  Check, 
  Radio,
  Battery,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface TrackingPreviewProps {
  activeDuo: DuoId | 'ALL';
  isOnline: boolean;
}

export const TrackingPreview: React.FC<TrackingPreviewProps> = ({ activeDuo, isOnline }) => {
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [lastPingTime, setLastPingTime] = useState<string>('Just now');
  const [selectedTravellerId, setSelectedTravellerId] = useState<string>(TRAVELLERS_CONFIG[0].id);
  const [checkpointName, setCheckpointName] = useState<string>('Badrinath Temple Valley');
  const [vitalNote, setVitalNote] = useState<string>('Both fathers comfortable; sipping warm water; normal BP');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [lastAltitude, setLastAltitude] = useState<number>(3130);
  const [lastBattery, setLastBattery] = useState<number>(85);

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
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  const isHighAltitudeZone = lastAltitude >= 2000;

  return (
    <div className="space-y-4 pb-20">
      {/* Cellular Dead-Zone Reassurance Banner */}
      <div className="p-3.5 rounded-3xl bg-gradient-to-r from-amber-950/40 via-alpine-900 to-slate-950 border border-amber-800/50 flex items-start gap-3 shadow-lg">
        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-200/90 leading-relaxed">
          <strong className="text-white block font-bold mb-0.5">Mountain Cellular Shadow Guard Active:</strong>
          In gorges between Srinagar and Joshimath, mobile networks drop completely. The home dashboard automatically reassures family that delays under 2.5 hours are expected terrain shadows.
        </div>
      </div>

      {/* Interactive Leaflet Pilgrimage Map */}
      <FamilyMap activeDuo={activeDuo} />

      {/* One-Tap Beacon Trigger Box */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-alpine-900 to-slate-950 border border-slate-800 shadow-xl space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Pilgrim Telemetry & Vital Beacon
            </span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400">
              <Battery className="w-3.5 h-3.5" />
              <span>{lastBattery}%</span>
            </span>
            <span>•</span>
            <span>Last: {lastPingTime}</span>
          </div>
        </div>

        {/* Pilgrim Selector */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Broadcasting as Pilgrim</span>
          </label>
          <select
            value={selectedTravellerId}
            onChange={(e) => setSelectedTravellerId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {availableTravellers.map(t => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.duoId === 'DUO_A' ? 'Family A' : 'Family B'} — {t.relation})
              </option>
            ))}
          </select>
        </div>

        {/* Checkpoint Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 block">
            Current Landmark / Mountain Checkpoint
          </label>
          <input
            type="text"
            value={checkpointName}
            onChange={(e) => setCheckpointName(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            placeholder="e.g. Joshimath Acclimatization Camp / Badrinath"
          />
        </div>

        {/* Vital Quick Note Input */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-400 block">
            Elder Vitals & Check-in Note (For Home Family)
          </label>
          <input
            type="text"
            value={vitalNote}
            onChange={(e) => setVitalNote(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            placeholder="e.g. Fathers comfortable; tea halt near Devprayag..."
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handlePingLocation}
          disabled={isPinging}
          className="tap-active w-full py-3.5 rounded-2xl bg-gradient-to-r from-temple-saffron via-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-950/40 border border-amber-300/40 flex items-center justify-center gap-2 hover:brightness-110 transition-all min-h-[48px]"
        >
          {isPinging ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              <span>Acquiring GPS & Battery Snapshot...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Broadcast Checkpoint Beacon</span>
            </>
          )}
        </button>

        {successMessage && (
          <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Local-First: Pings stored in Dexie IndexedDB even if completely offline</span>
        </div>
      </div>

      {/* Altitude Profile & High-Altitude Acclimatization Alert */}
      <div className="p-4 rounded-3xl bg-alpine-900/90 border border-slate-800 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-white">Route Elevation Profile</span>
          </div>
          <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
            isHighAltitudeZone 
              ? 'bg-rose-950 text-rose-300 border-rose-700/80 animate-pulse' 
              : 'bg-sky-950 text-sky-300 border-sky-800'
          }`}>
            Current: {lastAltitude}m
          </span>
        </div>

        {isHighAltitudeZone && (
          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-[11px] text-rose-200">
            <strong>⚠️ High-Altitude Zone (&gt;2,000m):</strong> Pacing required for senior fathers. Hydrate with warm water every 90 mins and avoid abrupt steps.
          </div>
        )}

        {/* Visual Elevation Curve Mockup */}
        <div className="h-20 w-full rounded-2xl bg-slate-950 p-2.5 relative flex items-end justify-between border border-slate-800/80">
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 bg-emerald-600 rounded-t h-3" />
            <span className="text-[9px] text-slate-400 font-mono">Durg 216m</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 bg-sky-600 rounded-t h-4" />
            <span className="text-[9px] text-slate-400 font-mono">Haridwar 314m</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 bg-amber-500 rounded-t h-7" />
            <span className="text-[9px] text-slate-400 font-mono">Rudraprayag 895m</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 bg-amber-600 rounded-t h-10" />
            <span className="text-[9px] text-amber-300 font-mono">Joshimath 1890m</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 bg-rose-500 rounded-t h-14 relative animate-pulse">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-rose-300 font-bold">Dham</span>
            </div>
            <span className="text-[9px] text-rose-300 font-mono font-bold">Badrinath 3130m</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-7 bg-purple-500 rounded-t h-15" />
            <span className="text-[9px] text-purple-300 font-mono">Mana 3200m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
