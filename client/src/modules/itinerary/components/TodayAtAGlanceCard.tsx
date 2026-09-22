import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw, 
  Zap, 
  Check, 
  ChevronRight 
} from 'lucide-react';
import { TripSegment } from '../../../shared/types';
import { AutoPilotStatus } from '../hooks/useAutoPilot';
import { PILGRIMAGE_DAYS } from './DaySelectorStrip';

interface TodayAtAGlanceCardProps {
  status: AutoPilotStatus;
  isAutoPilotActive: boolean;
  onToggleAutoPilot: () => void;
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
  activeSegment?: TripSegment;
  onToggleCheckpoint: (segmentId: string, checkpointId: string) => void;
  onSetSimulation: (dayId: string | null) => void;
}

export const TodayAtAGlanceCard: React.FC<TodayAtAGlanceCardProps> = ({
  status,
  isAutoPilotActive,
  onToggleAutoPilot,
  selectedDayId,
  onSelectDay,
  activeSegment,
  onToggleCheckpoint,
  onSetSimulation
}) => {
  const [isSimulatorMenuOpen, setIsSimulatorMenuOpen] = useState(false);

  const activeOrUpcomingDayId = status.todayDayId || status.upcomingDayId || 'day-1';
  const todayDayDef = PILGRIMAGE_DAYS.find(d => d.id === activeOrUpcomingDayId) || PILGRIMAGE_DAYS[1];
  const targetReferenceDayId = status.todayDayId || (status.phase === 'PRE_TRIP' ? 'day-1' : null);
  const isViewingDifferentDay = selectedDayId !== 'all' && targetReferenceDayId !== null && selectedDayId !== targetReferenceDayId;
  const viewingDayDef = PILGRIMAGE_DAYS.find(d => d.id === selectedDayId);

  // Calculate checkpoint progress
  const checkpoints = activeSegment?.checkpoints || [];
  const completedCount = checkpoints.filter(cp => cp.done).length;
  const totalCount = checkpoints.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Find next uncompleted milestone
  const nextCheckpoint = checkpoints.find(cp => !cp.done);
  const allCompleted = totalCount > 0 && completedCount === totalCount;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-slate-950 border border-amber-500/30 shadow-2xl p-4 space-y-3.5 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-64 h-32 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />

      {/* Header Row: Auto-Pilot Status & Live Time */}
      <div className="flex items-center justify-between gap-2 relative z-10">
        <div className="flex items-center gap-2 flex-wrap">
          {status.isSimulated ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-[11px] font-black">
              <span>🧪</span>
              <span className="uppercase tracking-wider">Demo: Day {todayDayDef.dayNumber}</span>
              <button
                type="button"
                onClick={() => onSetSimulation(null)}
                className="ml-1 hover:text-white underline text-[10px]"
                title="Reset simulation"
              >
                Reset
              </button>
            </div>
          ) : status.phase === 'PRE_TRIP' ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[11px] font-black">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="uppercase tracking-wider">Live Real-Time • Pre-Trip (Today: {status.currentDateFormatted})</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-black">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="uppercase tracking-wider">Live Today • Day {todayDayDef.dayNumber}</span>
            </div>
          )}

          {/* Simulation Dropdown Toggle */}
          <button
            type="button"
            onClick={() => setIsSimulatorMenuOpen(!isSimulatorMenuOpen)}
            className="text-[10px] font-semibold text-slate-400 hover:text-amber-300 px-2 py-0.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-950/60 transition-all"
          >
            {status.isSimulated ? 'Change Day' : 'Test Days'}
          </button>
        </div>

        {/* Right: Live IST Clock & Auto-Pilot Mode Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onToggleAutoPilot}
            className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all ${
              isAutoPilotActive
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title="Auto-Pilot automatically tracks current day"
          >
            <Zap className={`w-3 h-3 ${isAutoPilotActive ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span>{isAutoPilotActive ? 'Auto-Pilot' : 'Manual'}</span>
          </button>

          <div className="flex items-center gap-1 text-xs font-mono font-bold text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{status.currentTimeFormatted}</span>
          </div>
        </div>
      </div>

      {/* Simulation Selector Menu */}
      {isSimulatorMenuOpen && (
        <div className="p-3 rounded-2xl bg-slate-950 border border-purple-500/30 shadow-xl space-y-2 relative z-20">
          <div className="flex items-center justify-between text-xs font-bold text-purple-300">
            <span>Select Day to Simulate:</span>
            {status.isSimulated && (
              <button
                type="button"
                onClick={() => {
                  onSetSimulation(null);
                  setIsSimulatorMenuOpen(false);
                }}
                className="text-[10px] text-slate-400 hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset to Real Date</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {PILGRIMAGE_DAYS.filter(d => d.id !== 'all').map(day => (
              <button
                key={day.id}
                type="button"
                onClick={() => {
                  onSetSimulation(day.id);
                  onSelectDay(day.id);
                  setIsSimulatorMenuOpen(false);
                }}
                className={`px-2 py-1.5 rounded-xl text-left border text-[11px] font-bold transition-all ${
                  status.todayDayId === day.id
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="text-[10px] text-purple-300">{day.dateStr}</div>
                <div className="truncate font-black">{day.destination}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PRE-TRIP PHASE: Digital Departure Countdown */}
      {status.phase === 'PRE_TRIP' && !status.isSimulated && status.preTripCountdown && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-950/80 to-slate-950 border border-amber-500/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wide flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Yatra Departure Countdown</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Sep 24, 16:30</span>
          </div>

          {/* Digital Timer Blocks */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl py-2 px-1">
              <div className="text-xl font-black text-white font-mono leading-none">
                {String(status.preTripCountdown.days).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase font-bold text-amber-400 mt-1">Days</div>
            </div>
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl py-2 px-1">
              <div className="text-xl font-black text-white font-mono leading-none">
                {String(status.preTripCountdown.hours).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase font-bold text-amber-400 mt-1">Hours</div>
            </div>
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl py-2 px-1">
              <div className="text-xl font-black text-white font-mono leading-none">
                {String(status.preTripCountdown.minutes).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase font-bold text-amber-400 mt-1">Mins</div>
            </div>
            <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl py-2 px-1">
              <div className="text-xl font-black text-amber-300 font-mono leading-none">
                {String(status.preTripCountdown.seconds).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase font-bold text-amber-400 mt-1">Secs</div>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 leading-snug flex items-start gap-1.5 pt-0.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>Train 12441 Bilaspur Rajdhani Express</strong> departs Durg Junction Platform 1. 2AC Coach A2 confirmed for all 4 pilgrims.
            </span>
          </div>
        </div>
      )}

      {/* DURING-TRIP OR SIMULATED: Next-Up Milestone Ticker */}
      {(status.phase === 'DURING_TRIP' || status.isSimulated) && (
        <div className="space-y-3">
          {/* Day Destination & Highlight */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>{todayDayDef.badgeIcon}</span>
                <span>Day {todayDayDef.dayNumber}: {todayDayDef.destination}</span>
              </h3>
              <p className="text-[11px] text-slate-400 line-clamp-1">
                {todayDayDef.highlight}
              </p>
            </div>

            {/* Overall Day Completion Badge */}
            <div className="shrink-0 text-right">
              <span className="text-xs font-mono font-black text-amber-400">
                {completedCount}/{totalCount}
              </span>
              <div className="text-[9px] text-slate-400 font-bold uppercase">Milestones</div>
            </div>
          </div>

          {/* Next Up Focus Box */}
          {nextCheckpoint ? (
            <div className="p-3 rounded-2xl bg-slate-950/90 border border-amber-500/40 space-y-2.5 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>Next Milestone</span>
                </span>
                <span className="text-xs font-mono font-bold text-amber-400">
                  Target: {nextCheckpoint.estimatedTime}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-black text-white leading-tight">
                  {nextCheckpoint.name}
                </h4>
                {nextCheckpoint.elderComfortNote && (
                  <p className="text-[11px] text-sky-300 mt-1 flex items-start gap-1 leading-snug">
                    <span className="text-sky-400 shrink-0">💡</span>
                    <span>{nextCheckpoint.elderComfortNote}</span>
                  </p>
                )}
              </div>

              {/* 1-Tap Mark Complete Action Button */}
              {activeSegment && (
                <button
                  type="button"
                  onClick={() => onToggleCheckpoint(activeSegment.id, nextCheckpoint.id)}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs tap-active flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 min-h-[44px]"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Mark Done: "{nextCheckpoint.name}"</span>
                </button>
              )}
            </div>
          ) : allCompleted ? (
            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center space-y-1">
              <div className="text-base">🎉</div>
              <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wide">
                All Milestones Complete for Today!
              </h4>
              <p className="text-[11px] text-slate-300">
                Fathers and sons are all checked in. Rest well for tomorrow's sacred journey.
              </p>
            </div>
          ) : null}

          {/* Progress Bar with Checkpoint Ticks */}
          <div className="space-y-1 pt-0.5">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
              <span>Today's Progress</span>
              <span className="text-amber-400 font-mono">{progressPercent}%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Viewing Different Day Notice / Jump to Today / Departure Button */}
      {isViewingDifferentDay && viewingDayDef && targetReferenceDayId && (
        <div className="p-2.5 rounded-2xl bg-sky-950/40 border border-sky-500/30 flex items-center justify-between gap-2 text-xs">
          <div className="min-w-0">
            <div className="text-[10px] text-sky-400 font-bold uppercase">
              Previewing: Day {viewingDayDef.dayNumber || viewingDayDef.destination}
            </div>
            <div className="text-[11px] text-slate-200 truncate">
              Currently looking ahead on the calendar
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelectDay(targetReferenceDayId)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] tap-active shrink-0 flex items-center gap-1 shadow-md"
          >
            <span>{status.todayDayId ? 'Jump to Today' : 'Jump to Day 1'}</span>
            <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TodayAtAGlanceCard;
