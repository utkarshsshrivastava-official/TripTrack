import React, { useState, useEffect } from 'react';
import {
  X,
  Train,
  Clock,
  MapPin,
  Zap,
  Phone,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  Utensils,
  Moon,
  Coffee
} from 'lucide-react';
import {
  RAJDHANI_TICKET_DATA,
  RAJDHANI_12441_STATIONS,
  computeTrainStatus,
  LiveTrainStatus
} from '../../../shared/config/rajdhani12441';

interface RajdhaniTrackerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RajdhaniTrackerDrawer: React.FC<RajdhaniTrackerDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const [delayMinutes, setDelayMinutes] = useState<number>(0);
  const [copiedPnr, setCopiedPnr] = useState(false);
  const [trainStatus, setTrainStatus] = useState<LiveTrainStatus>(() => computeTrainStatus(undefined, 0));
  const [isUpdatingDelay, setIsUpdatingDelay] = useState(false);

  // Fetch initial delay from server
  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/train/12441/status')
      .then(res => res.json())
      .then(data => {
        if (data.success && typeof data.delayMinutes === 'number') {
          setDelayMinutes(data.delayMinutes);
          setTrainStatus(computeTrainStatus(undefined, data.delayMinutes));
        }
      })
      .catch(() => {
        // Fallback to local computation
        setTrainStatus(computeTrainStatus(undefined, 0));
      });
  }, [isOpen]);

  // Recalculate status when delay changes
  useEffect(() => {
    setTrainStatus(computeTrainStatus(undefined, delayMinutes));
  }, [delayMinutes]);

  if (!isOpen) return null;

  const handleCopyPnr = () => {
    navigator.clipboard.writeText(RAJDHANI_TICKET_DATA.pnr);
    setCopiedPnr(true);
    setTimeout(() => setCopiedPnr(false), 2000);
  };

  const handleSetDelay = async (minutes: number) => {
    setDelayMinutes(minutes);
    setIsUpdatingDelay(true);
    try {
      await fetch('/api/train/12441/delay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delayMinutes: minutes, reportedBy: 'TripTrack Coordinator' })
      });
    } catch {
      // Offline fallback: state already updated locally
    } finally {
      setIsUpdatingDelay(false);
    }
  };

  const isDelayed = delayMinutes > 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md h-full bg-stone-900 border-l border-stone-800 flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Rajdhani 12441 Live Transit Tracker"
      >
        {/* Drawer Header */}
        <div className="shrink-0 px-4 py-3 bg-stone-900/95 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Train className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-white text-base tracking-wide">
                  {RAJDHANI_TICKET_DATA.trainNo}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {RAJDHANI_TICKET_DATA.serviceClass}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium">
                {RAJDHANI_TICKET_DATA.trainName} • Bilaspur Rajdhani
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-stone-800 text-stone-300 flex items-center justify-center hover:bg-stone-700 active:scale-95 transition-all"
            aria-label="Close Rajdhani Tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Live Telemetry Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-800/90 via-stone-800/60 to-stone-900 border border-stone-700/60 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`flex h-2.5 w-2.5 rounded-full ${
                    isDelayed ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'
                  }`}
                />
                <span
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isDelayed ? 'text-amber-300' : 'text-emerald-400'
                  }`}
                >
                  {isDelayed ? `Running ${delayMinutes}m Late` : 'Right on Time (0m)'}
                </span>
              </div>

              <span className="text-[11px] font-mono text-stone-400 bg-stone-900/80 px-2 py-0.5 rounded-md border border-stone-700/50">
                1362 KM Corridor
              </span>
            </div>

            {/* Route & ETA Grid */}
            <div className="grid grid-cols-2 gap-3 py-2 border-y border-stone-700/50 my-2">
              <div>
                <span className="text-[10px] text-stone-400 font-mono uppercase block">Boarding Point</span>
                <span className="text-sm font-bold text-white block">Durg Jn (DURG)</span>
                <span className="text-xs font-mono text-stone-300">24 Sep • 16:30 IST</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 font-mono uppercase block">Arrival at Capital</span>
                <span className="text-sm font-bold text-white block">New Delhi (NDLS)</span>
                <span className={`text-xs font-mono font-bold ${isDelayed ? 'text-amber-400' : 'text-emerald-400'}`}>
                  25 Sep • {trainStatus.estimatedArrivalNdls}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] text-stone-400 mb-1">
                <span>{trainStatus.currentStretchDescription}</span>
                <span className="font-mono font-bold text-amber-400">{trainStatus.progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-950/80 overflow-hidden border border-stone-700/40">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 transition-all duration-500 rounded-full"
                  style={{ width: `${Math.max(4, trainStatus.progressPercent)}%` }}
                />
              </div>
            </div>

            {/* Cruising speed pill */}
            <div className="flex items-center justify-between mt-3 text-[11px] text-stone-400 font-mono pt-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
                Speed: {trainStatus.speedKmh > 0 ? `${trainStatus.speedKmh} km/h` : 'At Station'}
              </span>
              <span>Next: {trainStatus.nextStation.stationName}</span>
            </div>
          </div>

          {/* Official Confirmed Bay Card (Coach A2) */}
          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/70 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-200">
                  Confirmed Bay • Coach A2
                </span>
              </div>
              <button
                onClick={handleCopyPnr}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-stone-700 text-stone-200 text-xs font-mono hover:bg-stone-600 transition-all"
                title="Copy PNR"
              >
                {copiedPnr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>PNR: {RAJDHANI_TICKET_DATA.pnr}</span>
              </button>
            </div>

            <p className="text-[11px] text-stone-400 mb-3">
              All 4 family members confirmed together in one private 4-berth cabin.
            </p>

            {/* Passenger Grid */}
            <div className="grid grid-cols-2 gap-2">
              {RAJDHANI_TICKET_DATA.passengers.map((pax) => {
                const isElder = pax.role === 'Elder';
                return (
                  <div
                    key={pax.id}
                    className={`p-2.5 rounded-xl border ${
                      isElder
                        ? 'bg-amber-500/10 border-amber-500/40 text-stone-200'
                        : 'bg-stone-900/80 border-stone-700/60 text-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold truncate">{pax.name.split(' ')[0]}</span>
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        pax.berthType === 'LOWER' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-stone-800 text-stone-300'
                      }`}>
                        {pax.berthNo} {pax.berthType === 'LOWER' ? 'LB' : 'UB'}
                      </span>
                    </div>

                    <div className="text-[10px] text-stone-400 flex items-center justify-between">
                      <span>Age {pax.age}</span>
                      <span className="text-[9px] font-medium text-amber-300/90">{pax.catering}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 p-2 rounded-lg bg-stone-900/60 border border-stone-800 text-[11px] text-stone-400 flex items-center gap-2">
              <span className="text-amber-400 font-bold">ℹ️ Catering:</span>
              <span>Jain Meal auto-routed for Rajnish Ji; Veg for all others.</span>
            </div>
          </div>

          {/* Family Delay Sync Controller */}
          <div className="p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Family Delay Sync
              </span>
              <span className="text-[10px] text-stone-400">
                Syncs with family phones & Delhi cab
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {[0, 15, 30, 60].map((mins) => {
                const isActive = delayMinutes === mins;
                return (
                  <button
                    key={mins}
                    onClick={() => handleSetDelay(mins)}
                    disabled={isUpdatingDelay}
                    className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 shadow-md scale-102'
                        : 'bg-stone-700/70 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {mins === 0 ? 'On Time' : `+${mins}m`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Station Journey Timeline */}
          <div className="p-4 rounded-2xl bg-stone-800/50 border border-stone-700/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              Transit Stations ({RAJDHANI_12441_STATIONS.length})
            </h4>

            <div className="relative pl-4 space-y-3.5 border-l-2 border-stone-700 ml-2">
              {RAJDHANI_12441_STATIONS.map((station) => {
                const isBoarding = station.isBoardingPoint;
                const isDest = station.isDestination;
                const isPast = station.distanceFromDurgKm < trainStatus.distanceCoveredKm;
                const isCurrent = station.stationCode === trainStatus.lastStation.stationCode;

                return (
                  <div key={station.stationCode} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div
                      className={`absolute -left-[21px] top-1 w-3.5 h-3.5 rounded-full border-2 transition-all ${
                        isCurrent
                          ? 'bg-amber-400 border-white ring-4 ring-amber-500/30'
                          : isPast
                          ? 'bg-emerald-500 border-stone-900'
                          : isBoarding || isDest
                          ? 'bg-stone-900 border-amber-400'
                          : 'bg-stone-800 border-stone-600'
                      }`}
                    />

                    <div className={`flex items-start justify-between ${isPast ? 'opacity-50' : 'opacity-100'}`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-stone-200">
                            {station.stationName}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-stone-800 text-stone-400 border border-stone-700">
                            {station.stationCode}
                          </span>
                          {isBoarding && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              BOARDING
                            </span>
                          )}
                        </div>

                        {station.elderNote && (
                          <p className="text-[11px] text-amber-400/90 mt-0.5 font-medium leading-tight flex items-center gap-1">
                            {station.stationCode === 'NGP' && <Utensils className="w-3 h-3 inline shrink-0" />}
                            {station.stationCode === 'BPL' && <Moon className="w-3 h-3 inline shrink-0" />}
                            {station.stationCode === 'AGC' && <Coffee className="w-3 h-3 inline shrink-0" />}
                            {station.elderNote}
                          </p>
                        )}
                      </div>

                      <div className="text-right font-mono text-xs text-stone-400 shrink-0">
                        {station.scheduledArrival && <span>Arr: {station.scheduledArrival}</span>}
                        <span className="block font-bold text-stone-300">
                          Dep: {station.scheduledDeparture}
                        </span>
                        {station.distanceFromDurgKm > 0 && (
                          <span className="text-[10px] text-stone-500 block">
                            +{station.distanceFromDurgKm} km
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Emergency & Railway Help Links */}
          <div className="grid grid-cols-2 gap-2 pt-1 pb-4">
            <a
              href="tel:139"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-700 active:scale-95 transition-all border border-stone-700"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call 139 (RailMadad)</span>
            </a>

            <a
              href="https://enquiry.indianrail.gov.in/mntes/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-700 active:scale-95 transition-all border border-stone-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Official NTES Live</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
