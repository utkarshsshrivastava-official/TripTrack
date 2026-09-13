import React, { useState, useEffect } from 'react';
import {
  X,
  Plane,
  Clock,
  Phone,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Bus,
  CheckCircle2,
  Users
} from 'lucide-react';
import {
  INDIGO_FLIGHT_DATA,
  computeFlightStatus,
  evaluateConnection,
  LiveFlightStatus
} from '../../../shared/config/flight6E';

interface FlightTrackerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FlightTrackerDrawer: React.FC<FlightTrackerDrawerProps> = ({
  isOpen,
  onClose
}) => {
  const [leg1Delay, setLeg1Delay] = useState<number>(0);
  const [leg2Delay, setLeg2Delay] = useState<number>(0);
  const [copiedSonPnr, setCopiedSonPnr] = useState(false);
  const [copiedElderPnr, setCopiedElderPnr] = useState(false);
  const [isUpdatingDelay, setIsUpdatingDelay] = useState(false);
  const [flightStatus, setFlightStatus] = useState<LiveFlightStatus>(() =>
    computeFlightStatus(undefined, 0, 0)
  );

  // Fetch initial delay from server
  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/flight/6e/status')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const l1 = typeof data.leg1?.delayMinutes === 'number' ? data.leg1.delayMinutes : 0;
          const l2 = typeof data.leg2?.delayMinutes === 'number' ? data.leg2.delayMinutes : 0;
          setLeg1Delay(l1);
          setLeg2Delay(l2);
          setFlightStatus(computeFlightStatus(undefined, l1, l2));
        }
      })
      .catch(() => {
        setFlightStatus(computeFlightStatus(undefined, 0, 0));
      });
  }, [isOpen]);

  useEffect(() => {
    setFlightStatus(computeFlightStatus(undefined, leg1Delay, leg2Delay));
  }, [leg1Delay, leg2Delay]);

  if (!isOpen) return null;

  const handleCopySonPnr = () => {
    navigator.clipboard.writeText(INDIGO_FLIGHT_DATA.sonPnr);
    setCopiedSonPnr(true);
    setTimeout(() => setCopiedSonPnr(false), 2000);
  };

  const handleCopyElderPnr = () => {
    navigator.clipboard.writeText(INDIGO_FLIGHT_DATA.elderPnr);
    setCopiedElderPnr(true);
    setTimeout(() => setCopiedElderPnr(false), 2000);
  };

  const handleSetLeg1Delay = async (mins: number) => {
    setLeg1Delay(mins);
    setIsUpdatingDelay(true);
    try {
      await fetch('/api/flight/6e/delay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leg1DelayMinutes: mins,
          leg2DelayMinutes: leg2Delay,
          reportedBy: 'TripTrack Flight Coordinator'
        })
      });
    } catch {
      // Offline fallback
    } finally {
      setIsUpdatingDelay(false);
    }
  };

  const connection = evaluateConnection(leg1Delay);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md h-full bg-stone-900 border-l border-stone-800 flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-label="IndiGo Return Flight Transit Tracker"
      >
        {/* Drawer Header */}
        <div className="shrink-0 px-4 py-3 bg-stone-900/95 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-inner">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-white text-base tracking-wide">
                  6E 2476 → 6E 734
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40">
                  Airbus A320
                </span>
              </div>
              <p className="text-xs text-stone-400 font-medium">
                IndiGo Connecting Return • 02 Oct 2026
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-stone-800 text-stone-300 flex items-center justify-center hover:bg-stone-700 active:scale-95 transition-all"
            aria-label="Close Flight Tracker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Dual PNR Fast Action Bar */}
          <div className="grid grid-cols-2 gap-2">
            {/* Sons PNR */}
            <div className="p-3 rounded-2xl bg-stone-800/80 border border-stone-700/70 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-mono block">
                  Sons PNR (Utkarsh & Shreyas)
                </span>
                <span className="font-mono text-base font-black text-white tracking-wide block">
                  {INDIGO_FLIGHT_DATA.sonPnr}
                </span>
              </div>
              <button
                onClick={handleCopySonPnr}
                className="mt-2 w-full py-1.5 px-2 rounded-xl bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-all tap-active"
              >
                {copiedSonPnr ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-stone-400" />
                    <span>Copy PNR</span>
                  </>
                )}
              </button>
            </div>

            {/* Elders PNR */}
            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-mono block">
                    Fathers PNR (Senior)
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                    Sr. Citizen
                  </span>
                </div>
                <span className="font-mono text-base font-black text-amber-200 tracking-wide block">
                  {INDIGO_FLIGHT_DATA.elderPnr}
                </span>
              </div>
              <button
                onClick={handleCopyElderPnr}
                className="mt-2 w-full py-1.5 px-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-mono flex items-center justify-center gap-1.5 transition-all tap-active border border-amber-500/40"
              >
                {copiedElderPnr ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Copy PNR</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Delhi T2 -> T1 Connection Health Evaluator Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-stone-800/95 via-stone-800/70 to-stone-900 border border-stone-700/60 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-200 uppercase tracking-wider flex items-center gap-1.5">
                <Bus className="w-4 h-4 text-sky-400" />
                Delhi Transit (T2 → T1)
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${connection.badgeColor}`}>
                {connection.badgeLabel}
              </span>
            </div>

            {/* Layover Clock Metric */}
            <div className="flex items-center justify-between py-2 border-y border-stone-700/50 my-2">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Scheduled Layover</span>
                <span className="text-sm font-bold text-stone-200 font-mono">130 mins (2h 10m)</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase font-mono block">Remaining After Leg 1</span>
                <span className={`text-sm font-bold font-mono ${
                  connection.health === 'HEALTHY' ? 'text-emerald-400' : connection.health === 'CAUTION' ? 'text-amber-400' : 'text-rose-400 animate-pulse'
                }`}>
                  {connection.actualLayoverRemainingMinutes} mins
                </span>
              </div>
            </div>

            {/* Guidance Alert */}
            <div className={`p-2.5 rounded-xl border text-xs leading-relaxed mt-2 ${
              connection.health === 'HEALTHY'
                ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                : connection.health === 'CAUTION'
                ? 'bg-amber-950/20 border-amber-800/40 text-amber-300'
                : 'bg-rose-950/30 border-rose-800/60 text-rose-200 font-medium'
            }`}>
              <p className="flex items-start gap-1.5">
                {connection.health === 'CRITICAL' ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                )}
                <span>{connection.actionGuidance}</span>
              </p>
            </div>

            {/* Live Flight Telemetry Status */}
            <div className="mt-2.5 pt-2 border-t border-stone-700/50 flex items-center justify-between text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-stone-300">
                <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                <span>{flightStatus.statusText}</span>
              </span>
              <span className="text-sky-400 font-bold">{flightStatus.progressPercent}%</span>
            </div>
          </div>

          {/* 2-Leg Flight Details */}
          <div className="space-y-3">
            {/* Leg 1 Card */}
            <div className="p-3.5 rounded-2xl bg-stone-800/70 border border-stone-700/60 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/40 font-mono">
                    LEG 1 • 6E 2476
                  </span>
                  <span className="text-xs font-bold text-stone-200">Dehradun → Delhi</span>
                </div>
                <span className="text-[11px] font-mono text-stone-400">55 mins</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-1.5 border-y border-stone-700/40 font-mono">
                <div>
                  <span className="text-[10px] text-stone-500 block">DED DEPARTURE</span>
                  <strong className="text-white text-sm">13:15</strong>
                  <span className="text-[10px] text-amber-400 block mt-0.5">Bag drop: 12:15</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 block">DELHI ARRIVAL</span>
                  <strong className="text-white text-sm">14:10</strong>
                  <span className="text-[10px] text-sky-400 block mt-0.5">Terminal 2 (T2)</span>
                </div>
              </div>
            </div>

            {/* Leg 2 Card */}
            <div className="p-3.5 rounded-2xl bg-stone-800/70 border border-stone-700/60 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono">
                    LEG 2 • 6E 734
                  </span>
                  <span className="text-xs font-bold text-stone-200">Delhi → Raipur</span>
                </div>
                <span className="text-[11px] font-mono text-stone-400">1h 50m</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs py-1.5 border-y border-stone-700/40 font-mono">
                <div>
                  <span className="text-[10px] text-stone-500 block">DELHI DEPARTURE</span>
                  <strong className="text-white text-sm">16:20</strong>
                  <span className="text-[10px] text-amber-400 block mt-0.5">Terminal 1 (T1)</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-500 block">RAIPUR ARRIVAL</span>
                  <strong className="text-white text-sm">18:10</strong>
                  <span className="text-[10px] text-emerald-400 block mt-0.5">Swami Vivekananda (RPR)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmed Seating Matrix (Row 27 & Row 28) */}
          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700/70 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-stone-200">
                  Confirmed Seats • Rows 27 & 28
                </span>
              </div>
              <span className="text-[10px] font-mono text-stone-400">
                A320 Cabin Layout
              </span>
            </div>

            <p className="text-[11px] text-stone-400 mb-3 leading-tight">
              Fathers seated in Row 27 with Senior Citizen priority; sons seated directly behind in Row 28.
            </p>

            {/* Passenger Grid */}
            <div className="grid grid-cols-2 gap-2">
              {INDIGO_FLIGHT_DATA.passengers.map((pax) => {
                const isElder = pax.category === 'Senior Citizen';
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
                        isElder ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-stone-800 text-stone-300'
                      }`}>
                        {isElder ? 'Sr. Citizen' : 'Son'}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono text-stone-400 space-y-0.5">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Leg 1:</span>
                        <strong className="text-white">{pax.leg1Seat}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Leg 2:</span>
                        <strong className="text-white">{pax.leg2Seat}</strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Family Layover & Delay Simulator */}
          <div className="p-3.5 rounded-2xl bg-stone-800/60 border border-stone-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-200 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                Leg 1 Delay Simulator (DED Departure)
              </span>
              <span className="text-[10px] text-stone-400">
                Recalculates Delhi Layover
              </span>
            </div>

            <div className="grid grid-cols-5 gap-1.5">
              {[0, 15, 30, 45, 75].map((mins) => {
                const isActive = leg1Delay === mins;
                return (
                  <button
                    key={mins}
                    onClick={() => handleSetLeg1Delay(mins)}
                    disabled={isUpdatingDelay}
                    className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      isActive
                        ? 'bg-sky-500 text-stone-950 shadow-md scale-102'
                        : 'bg-stone-700/70 text-stone-300 hover:bg-stone-700'
                    }`}
                  >
                    {mins === 0 ? 'On Time' : `+${mins}m`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Airline Support & Web Check-in */}
          <div className="grid grid-cols-2 gap-2 pt-1 pb-4">
            <a
              href="tel:9910383838"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-700 active:scale-95 transition-all border border-stone-700"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Call IndiGo Support</span>
            </a>

            <a
              href="https://www.goindigo.in/web-check-in.html"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-700 active:scale-95 transition-all border border-stone-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              <span>Web Check-in</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
