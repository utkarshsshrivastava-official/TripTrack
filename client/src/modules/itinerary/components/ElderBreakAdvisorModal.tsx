import React, { useState, useEffect } from 'react';
import { 
  X, 
  Coffee, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  RotateCcw,
  ShieldCheck
} from 'lucide-react';
import { HIMALAYAN_ROADSIDE_STOPS } from '../../../shared/config/trip.config';

interface ElderBreakAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDayId: string;
  onLogBreak?: (stopName: string) => void;
}

export const ElderBreakAdvisorModal: React.FC<ElderBreakAdvisorModalProps> = ({
  isOpen,
  onClose,
  selectedDayId,
  onLogBreak
}) => {
  // Determine default highway filter based on selected day
  const defaultHighway = selectedDayId === 'day-2' ? 'DELHI_HW' : 'NH7';
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'NH7' | 'DELHI_HW'>(defaultHighway);

  // Last break timestamp stored in localStorage
  const [lastBreakTime, setLastBreakTime] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('triptrack_last_break_time');
      if (stored) return parseInt(stored, 10);
    } catch {}
    return Date.now() - 45 * 60 * 1000; // default 45 mins ago
  });

  const [elapsedMinutes, setElapsedMinutes] = useState<number>(0);

  // Update elapsed minutes every 10 seconds
  useEffect(() => {
    const calcElapsed = () => {
      const diffMs = Math.max(0, Date.now() - lastBreakTime);
      setElapsedMinutes(Math.floor(diffMs / (60 * 1000)));
    };
    calcElapsed();
    const interval = setInterval(calcElapsed, 10000);
    return () => clearInterval(interval);
  }, [lastBreakTime]);

  if (!isOpen) return null;

  // Format elapsed time string
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  const remainingMins = elapsedMinutes % 60;
  const elapsedStr = `${elapsedHours > 0 ? `${elapsedHours}h ` : ''}${remainingMins}m`;

  // Status level: SAFE (<2h), DUE (2h-2.5h), OVERDUE (>2.5h)
  const isOverdue = elapsedMinutes >= 150; // >2.5 hrs
  const isDueSoon = elapsedMinutes >= 120 && elapsedMinutes < 150; // 2h - 2.5h

  // Reset break timer
  const handleResetTimer = (stopName?: string) => {
    const now = Date.now();
    setLastBreakTime(now);
    try {
      localStorage.setItem('triptrack_last_break_time', now.toString());
    } catch {}
    if (stopName && onLogBreak) {
      onLogBreak(stopName);
    }
  };

  // Filter stops
  const filteredStops = HIMALAYAN_ROADSIDE_STOPS.filter(stop => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'DELHI_HW') return stop.highway === 'DELHI_HARIDWAR_EXPRESSWAY';
    return stop.highway === 'NH7_HIMALAYAN_HIGHWAY';
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-amber-950/30 to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Coffee className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <span>Elder-Care Meal & Bio-Break Advisor</span>
              </h3>
              <p className="text-[11px] text-amber-400 font-medium">
                Mandatory &le; 2.5h Highway Intervals for Senior Fathers
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center tap-active"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 no-scrollbar">
          {/* Active Drive Timer Banner */}
          <div className={`p-4 rounded-2xl border shadow-lg space-y-3 transition-all ${
            isOverdue
              ? 'bg-rose-950/40 border-rose-500/50 shadow-rose-950/30'
              : isDueSoon
              ? 'bg-amber-950/40 border-amber-500/50 shadow-amber-950/30'
              : 'bg-emerald-950/40 border-emerald-500/50 shadow-emerald-950/30'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isOverdue ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-rose-400" />
                    <span>Bio-Break Overdue (&gt;2.5h)</span>
                  </span>
                ) : isDueSoon ? (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Break Recommended Soon</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Drive Time Healthy</span>
                  </span>
                )}
              </div>

              <div className="text-right">
                <span className="text-lg font-black font-mono text-white">
                  {elapsedStr}
                </span>
                <span className="text-[10px] text-slate-400 block font-medium">on the road</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isOverdue
                ? "⚠️ Senior fathers have been traveling for over 2.5 hours without a leg stretch. Stop at the nearest verified roadside halt immediately to prevent nausea and back stiffness."
                : isDueSoon
                ? "⏱️ 2 hours elapsed since last halt. Plan to pull into one of the upcoming rest stops below within the next 20-30 minutes."
                : "✅ Gentle driving pace. Ensure Rajnish Ji & Sanjay Ji remain hydrated with warm water or lemon soda."}
            </p>

            {/* Reset Button */}
            <button
              type="button"
              onClick={() => handleResetTimer()}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 tap-active flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Just Took a Break? Reset 2.5h Timer</span>
            </button>
          </div>

          {/* Highway Filter Selector */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveFilter('NH7')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all tap-active ${
                activeFilter === 'NH7'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              NH-7 Mountain Ghat (6 Stops)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('DELHI_HW')}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all tap-active ${
                activeFilter === 'DELHI_HW'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Delhi-HW Expressway (2 Stops)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all tap-active ${
                activeFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
          </div>

          {/* Verified Stops List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-black text-white px-1">
              <span>Verified Stops along Route</span>
              <span className="text-[10px] text-amber-400 font-mono">
                {filteredStops.length} Elder-Checked Halts
              </span>
            </div>

            {filteredStops.map((stop) => (
              <div
                key={stop.id}
                className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all space-y-2.5"
              >
                {/* Title & ETA */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{stop.name}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {stop.landmark}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-800 text-amber-400 shrink-0">
                    {stop.approxDriveTimeFromOrigin}
                  </span>
                </div>

                {/* Hygiene & Food Badges */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    <span>Clean WC: {'★'.repeat(Math.floor(stop.cleanToiletRating))} ({stop.cleanToiletRating}/5)</span>
                  </span>
                  {stop.hasWesternWC && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-500/15 border border-sky-500/30 text-sky-300">
                      Western WC Available
                    </span>
                  )}
                  {stop.isWheelchairFriendly && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-500/30 text-purple-300">
                      Ramp / Flat Ground
                    </span>
                  )}
                </div>

                {/* Signature Treat / Recommended Item */}
                <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800/80 text-[11px] space-y-1">
                  <div className="text-amber-400 font-bold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Recommended for Seniors: {stop.recommendedTreat}</span>
                  </div>
                  <div className="text-slate-300 text-[11px] leading-snug">
                    {stop.elderComfortNotes}
                  </div>
                </div>

                {/* 1-Tap Log Stop Action */}
                <button
                  type="button"
                  onClick={() => {
                    handleResetTimer(stop.name);
                    onClose();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-black text-xs tap-active flex items-center justify-center gap-1.5 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Stopped Here: Reset 2.5h Interval</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tap-active"
          >
            Close Advisor
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElderBreakAdvisorModal;
