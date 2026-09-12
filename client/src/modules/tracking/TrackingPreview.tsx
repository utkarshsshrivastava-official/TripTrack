import React, { useState } from 'react';
import { DuoId, LocationPing } from '../../shared/types';
import { 
  Send, 
  Mountain, 
  AlertCircle, 
  Check, 
  Radio
} from 'lucide-react';
import { localDB } from '../../shared/db/dexie';

interface TrackingPreviewProps {
  activeDuo: DuoId | 'ALL';
  isOnline: boolean;
}

export const TrackingPreview: React.FC<TrackingPreviewProps> = ({ isOnline }) => {
  const [isPinging, setIsPinging] = useState<boolean>(false);
  const [lastPingTime, setLastPingTime] = useState<string>('Just now');
  const [vitalNote, setVitalNote] = useState<string>('Both fathers comfortable; sipping warm tea');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Trigger one-tap location beacon
  const handlePingLocation = async () => {
    setIsPinging(true);
    setSuccessMessage(null);

    try {
      let latitude = 30.7447; // Badrinath coords default
      let longitude = 79.4930;
      let altitude = 3130;
      let battery = 84;

      if (typeof navigator !== 'undefined' && 'geolocation' in navigator) {
        try {
          const pos = await new Promise<GeolocationPosition>((res, rej) => {
            navigator.geolocation.getCurrentPosition(res, rej, { timeout: 4000 });
          });
          latitude = pos.coords.latitude;
          longitude = pos.coords.longitude;
          altitude = pos.coords.altitude || 3130;
        } catch {
          // fallback to preset coordinates
        }
      }

      if ('getBattery' in navigator) {
        try {
          const batt: any = await (navigator as any).getBattery();
          battery = Math.round(batt.level * 100);
        } catch {}
      }

      const ping: LocationPing = {
        passengerId: 'traveller-utkarsh',
        latitude,
        longitude,
        altitudeMeters: altitude,
        batteryLevel: battery,
        checkpointName: 'Badrinath Temple Valley',
        elderVitalsNote: vitalNote,
        deviceTimestamp: new Date().toISOString(),
        isSynced: isOnline
      };

      // Always persist to local Dexie outbox
      await localDB.queuedPings.add({
        passengerId: ping.passengerId,
        latitude: ping.latitude,
        longitude: ping.longitude,
        altitudeMeters: ping.altitudeMeters,
        batteryLevel: ping.batteryLevel,
        checkpointName: ping.checkpointName,
        elderVitalsNote: ping.elderVitalsNote,
        deviceTimestamp: ping.deviceTimestamp
      });

      setLastPingTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSuccessMessage(isOnline ? 'Beacon broadcasted to Home Family!' : 'Saved to Dexie Queue (Dead-Zone Mode)');
    } catch (err) {
      console.error('Failed to trigger beacon', err);
    } finally {
      setIsPinging(false);
      setTimeout(() => setSuccessMessage(null), 4000);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Cellular Dead-Zone Reassurance Banner */}
      <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/60 flex items-start gap-2.5">
        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <strong className="text-white block font-bold">Mountain Cellular Shadow Guard Active:</strong>
          In gorges between Srinagar and Joshimath, mobile networks drop. The home dashboard automatically reassures family that delays under 2.5 hours are expected terrain shadows.
        </div>
      </div>

      {/* One-Tap Beacon Trigger Box */}
      <div className="p-4 rounded-3xl bg-gradient-to-b from-alpine-900 to-slate-950 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Low-Power Location Beacon
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Last: {lastPingTime}
          </span>
        </div>

        {/* Vital Quick Note Input */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 block mb-1">
            Elder Vitals & Check-in Note (For Home Family)
          </label>
          <input
            type="text"
            value={vitalNote}
            onChange={(e) => setVitalNote(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            placeholder="e.g., Dad BP normal, tea halt near Devprayag..."
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handlePingLocation}
          disabled={isPinging}
          className="tap-active w-full py-3.5 rounded-2xl bg-gradient-to-r from-temple-saffron via-amber-500 to-amber-600 text-slate-950 font-black text-sm shadow-lg shadow-amber-950/40 border border-amber-300/40 flex items-center justify-center gap-2 hover:brightness-110 transition-all"
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
          <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
        )}
      </div>

      {/* Altitude Profile & Elevation Pill */}
      <div className="p-4 rounded-2xl bg-alpine-900/90 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mountain className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold text-white">Route Elevation Profile</span>
          </div>
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-sky-950 text-sky-300 border border-sky-800">
            Current: 3,130m
          </span>
        </div>

        {/* Visual Elevation Curve Mockup */}
        <div className="h-16 w-full rounded-xl bg-slate-950 p-2 relative flex items-end justify-between border border-slate-800/80">
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 bg-emerald-600 rounded-t h-3" />
            <span className="text-[9px] text-slate-400 font-mono">Durg 216m</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 bg-sky-600 rounded-t h-4" />
            <span className="text-[9px] text-slate-400 font-mono">Haridwar 314m</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 bg-amber-500 rounded-t h-8" />
            <span className="text-[9px] text-slate-400 font-mono">Joshimath 1890m</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 bg-rose-500 rounded-t h-12 relative animate-pulse">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[8px] text-rose-300 font-bold">Dham</span>
            </div>
            <span className="text-[9px] text-rose-300 font-mono font-bold">Badrinath 3130m</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="w-8 bg-purple-500 rounded-t h-4" />
            <span className="text-[9px] text-slate-400 font-mono">Rishikesh 372m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
