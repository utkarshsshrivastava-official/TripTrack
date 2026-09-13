import React from 'react';
import { TripSegment, SegmentStatus, TransitMode } from '../../../shared/types';
import {
  Train,
  Car,
  Mountain,
  Plane,
  CheckCircle2,
  Circle,
  HeartHandshake,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Phone,
  Edit3,
  Clock,
  Navigation
} from 'lucide-react';

interface TransitTimelineItemProps {
  segment: TripSegment;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleCheckpoint: (segmentId: string, checkpointId: string) => void;
  onCycleStatus: (e: React.MouseEvent, segmentId: string, currentStatus: SegmentStatus) => void;
  onEditLogistics: (segment: TripSegment) => void;
}

export const TransitTimelineItem: React.FC<TransitTimelineItemProps> = ({
  segment,
  index,
  isExpanded,
  onToggleExpand,
  onToggleCheckpoint,
  onCycleStatus,
  onEditLogistics
}) => {
  const getModeIcon = (mode: TransitMode) => {
    switch (mode) {
      case 'TRAIN': return <Train className="w-4 h-4 text-emerald-400" />;
      case 'CAB_PLAINS': return <Car className="w-4 h-4 text-sky-400" />;
      case 'CAB_HILLS': return <Mountain className="w-4 h-4 text-amber-400" />;
      case 'FLIGHT': return <Plane className="w-4 h-4 text-purple-400" />;
    }
  };

  const getModeLabel = (mode: TransitMode) => {
    switch (mode) {
      case 'TRAIN': return 'Rajdhani Transit';
      case 'CAB_PLAINS': return 'Expressway Cab';
      case 'CAB_HILLS': return 'Mountain Hill Ascent';
      case 'FLIGHT': return 'Return Flight';
    }
  };

  const completedCount = segment.checkpoints.filter(cp => cp.done).length;
  const totalCount = segment.checkpoints.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const cleanPhone = segment.logistics.driverPhone?.replace(/[^0-9+]/g, '');
  const canCall = cleanPhone && cleanPhone.length >= 10;

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 overflow-hidden ${
        segment.status === 'IN_TRANSIT'
          ? 'border-amber-500/80 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-950 shadow-xl shadow-amber-950/30 ring-1 ring-amber-500/30'
          : segment.isHighAltitude
          ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-sky-600/40 shadow-lg shadow-sky-950/20'
          : 'bg-slate-900/90 border-slate-800/80 shadow-md'
      }`}
    >
      {/* Clickable Segment Header */}
      <div
        onClick={onToggleExpand}
        className="p-4 tap-active cursor-pointer select-none"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2.5">
            {/* Segment Number Pill */}
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center font-mono text-xs font-black shrink-0 border ${
                segment.status === 'IN_TRANSIT'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              {index + 1}
            </div>

            <div>
              {/* Mode, High Altitude & Status Badges */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800/80 text-slate-300 border border-slate-700">
                  {getModeIcon(segment.mode)}
                  <span>{getModeLabel(segment.mode)}</span>
                </span>

                {/* Status Cycle Button */}
                <button
                  onClick={(e) => onCycleStatus(e, segment.id, segment.status)}
                  className="tap-active"
                  title="Advance segment status"
                >
                  {segment.status === 'IN_TRANSIT' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-950 text-amber-300 border border-amber-500 animate-pulse">
                      In Transit
                    </span>
                  ) : segment.status === 'COMPLETED' ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                      Done
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                      Upcoming
                    </span>
                  )}
                </button>

                {segment.isHighAltitude && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/90 text-rose-300 border border-rose-800/80">
                    <AlertTriangle className="w-2.5 h-2.5 text-rose-400" />
                    <span>{segment.elevationMeters}m</span>
                  </span>
                )}
              </div>

              {/* Title & Route Points */}
              <h3 className="text-sm font-extrabold text-white mt-1.5 leading-tight">
                {segment.title}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-300 font-medium mt-1">
                <span className="text-white font-semibold">{segment.origin}</span>
                <span className="text-slate-500">→</span>
                <span className="text-white font-semibold">{segment.destination}</span>
              </div>
            </div>
          </div>

          <button className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/50 border border-slate-700/50 shrink-0">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        {/* Route Progress Mini Bar */}
        <div className="mt-3 pl-9 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
          <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">
            {completedCount}/{totalCount}
          </span>
        </div>
      </div>

      {/* Expanded Details & Vertical Glowing Route Timeline */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-4 bg-slate-950/60">
          {/* Driver & Transit Logistics Card */}
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 space-y-2.5 shadow-inner">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                <Navigation className="w-3.5 h-3.5" />
                <span>Transit Pilot & Vehicle</span>
              </div>
              <button
                onClick={() => onEditLogistics(segment)}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 tap-active border border-slate-700"
              >
                <Edit3 className="w-3 h-3 text-amber-400" />
                <span>Edit</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-500 block text-[10px]">SERVICE</span>
                <strong className="text-white font-bold">{segment.logistics.serviceName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PLATE / PNR</span>
                <span className="font-mono text-amber-300 font-bold">{segment.logistics.identifier}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">DRIVER PILOT</span>
                <span className="text-slate-200 font-medium">{segment.logistics.driverName || 'Designated Driver'}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">PICKUP POINT</span>
                <span className="text-slate-200 truncate block">{segment.logistics.pickupLocation}</span>
              </div>
            </div>

            {/* Quick Call Action if valid phone exists */}
            {canCall && (
              <div className="pt-2 flex items-center justify-between bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-800/50">
                <div className="text-xs font-mono text-emerald-300 font-bold">
                  📞 {segment.logistics.driverPhone}
                </div>
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 tap-active shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Pilot</span>
                </a>
              </div>
            )}
          </div>

          {/* Vertical Glowing Route Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              <span>Route Milestones & Checkpoints</span>
              <span className="font-mono text-amber-400">{percent}% Passed</span>
            </div>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-emerald-400 before:to-sky-500">
              {segment.checkpoints.map((cp) => (
                <div
                  key={cp.id}
                  onClick={() => onToggleCheckpoint(segment.id, cp.id)}
                  className={`tap-active relative p-3 rounded-2xl border transition-all cursor-pointer select-none ${
                    cp.done
                      ? 'bg-emerald-950/30 border-emerald-800/60 text-slate-300 shadow-sm'
                      : 'bg-slate-900/80 border-slate-800 text-white hover:border-slate-700 shadow-sm'
                  }`}
                >
                  {/* Glowing Node Indicator on the timeline track */}
                  <div className="absolute -left-6 top-4 -translate-x-1/2">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        cp.done
                          ? 'bg-emerald-500 border-slate-950 text-slate-950 shadow-md shadow-emerald-500/50'
                          : 'bg-slate-900 border-amber-400 shadow-sm'
                      }`}
                    >
                      {cp.done ? (
                        <CheckCircle2 className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Circle className="w-2.5 h-2.5 text-amber-400 fill-amber-400/50" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-xs font-bold leading-snug block ${cp.done ? 'line-through text-slate-400' : 'text-white'}`}>
                        {cp.name}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 font-semibold shrink-0 flex items-center gap-1 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">
                      <Clock className="w-2.5 h-2.5 text-amber-400" />
                      <span>{cp.estimatedTime}</span>
                    </span>
                  </div>

                  {/* Elder Comfort & Safety Callout Card */}
                  {cp.elderComfortNote && (
                    <div className="mt-2 flex items-start gap-2 p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-[11px] text-amber-200">
                      <HeartHandshake className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                      <div>
                        <strong className="text-amber-300 font-bold">Elder Comfort Note:</strong>{' '}
                        <span>{cp.elderComfortNote}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransitTimelineItem;
