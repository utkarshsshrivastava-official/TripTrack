import React from 'react';
import { TripSegment, SegmentStatus, TransitMode } from '../../../shared/types';
import {
  Train,
  Car,
  Mountain,
  Plane,
  PlayCircle,
  CheckCircle,
  Clock,
  Phone,
  Edit3,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

interface TransitHeroCardProps {
  segment: TripSegment;
  onCycleStatus: (e: React.MouseEvent, segmentId: string, currentStatus: SegmentStatus) => void;
  onEditLogistics: (segment: TripSegment) => void;
}

export const TransitHeroCard: React.FC<TransitHeroCardProps> = ({
  segment,
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

  // Generate 3-4 letter airport/station code heuristic from city name
  const getCityCode = (cityName: string) => {
    if (cityName.includes('Durg')) return 'DURG';
    if (cityName.includes('Delhi')) return 'NDLS';
    if (cityName.includes('Haridwar')) return 'HW';
    if (cityName.includes('Joshimath')) return 'JOSH';
    if (cityName.includes('Badrinath')) return 'BADRI';
    if (cityName.includes('Rudraprayag')) return 'RPRG';
    if (cityName.includes('Rishikesh')) return 'RKSH';
    return cityName.substring(0, 4).toUpperCase();
  };

  const completedCheckpoints = segment.checkpoints.filter(cp => cp.done).length;
  const totalCheckpoints = segment.checkpoints.length;
  const progressPercent = totalCheckpoints > 0 ? Math.round((completedCheckpoints / totalCheckpoints) * 100) : 0;
  const cleanPhone = segment.logistics.driverPhone?.replace(/[^0-9+]/g, '');
  const canCall = cleanPhone && cleanPhone.length >= 10;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 shadow-2xl p-4 transition-all">
      {/* Background ambient gradient glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header: Mode, Title, and Tap-to-Cycle Status */}
      <div className="relative flex items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-center shadow-inner">
            {getModeIcon(segment.mode)}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                {getModeLabel(segment.mode)}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-mono text-slate-400">
                Segment {segment.id.replace('seg-', '')}
              </span>
            </div>
            <h3 className="text-sm font-black text-white leading-tight">
              {segment.title}
            </h3>
          </div>
        </div>

        {/* Status Pill (Interactive) */}
        <button
          onClick={(e) => onCycleStatus(e, segment.id, segment.status)}
          className="tap-active shrink-0"
          title="Tap to cycle status (Upcoming -> In Transit -> Completed)"
        >
          {segment.status === 'IN_TRANSIT' ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black bg-amber-950/80 text-amber-300 border border-amber-500/80 shadow-sm shadow-amber-500/30 animate-pulse">
              <PlayCircle className="w-3.5 h-3.5" />
              <span>IN TRANSIT</span>
            </span>
          ) : segment.status === 'COMPLETED' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>COMPLETED</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800/90 text-slate-400 border border-slate-700">
              <Clock className="w-3.5 h-3.5" />
              <span>UPCOMING</span>
            </span>
          )}
        </button>
      </div>

      {/* Flighty Station-to-Station Departure / Arrival Node */}
      <div className="relative py-4 grid grid-cols-5 items-center gap-1">
        {/* Origin */}
        <div className="col-span-2 text-left">
          <span className="text-2xl font-black text-white tracking-tight font-mono block">
            {getCityCode(segment.origin)}
          </span>
          <span className="text-xs font-bold text-slate-300 block truncate">
            {segment.origin}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
            {segment.departureTime}
          </span>
        </div>

        {/* Connecting Vector */}
        <div className="col-span-1 flex flex-col items-center justify-center">
          <div className="w-full flex items-center justify-center relative">
            <div className="w-full h-0.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-sky-500 rounded-full" />
            <div className="absolute w-6 h-6 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center shadow-xs">
              <ArrowRight className="w-3 h-3 text-amber-400" />
            </div>
          </div>
          {segment.isHighAltitude && (
            <span className="mt-2 text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60 whitespace-nowrap flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" />
              <span>{segment.elevationMeters}m</span>
            </span>
          )}
        </div>

        {/* Destination */}
        <div className="col-span-2 text-right">
          <span className="text-2xl font-black text-white tracking-tight font-mono block">
            {getCityCode(segment.destination)}
          </span>
          <span className="text-xs font-bold text-slate-300 block truncate">
            {segment.destination}
          </span>
          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
            {segment.arrivalTime}
          </span>
        </div>
      </div>

      {/* Checkpoint Progress Track */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] font-mono">
          <span className="text-slate-400">
            Route Progress ({completedCheckpoints}/{totalCheckpoints} Milestones)
          </span>
          <span className="text-amber-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-temple-saffron via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Driver Pilot & Logistics Quick-Action Pill */}
      <div className="mt-3 p-2.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-2 shadow-inner">
        <div className="min-w-0 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shrink-0">
            <Car className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-white truncate">
                {segment.logistics.serviceName}
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {segment.logistics.identifier}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 truncate">
              Pilot: <strong className="text-slate-200">{segment.logistics.driverName || 'Designated Driver'}</strong> • {segment.logistics.pickupLocation}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {canCall && (
            <a
              href={`tel:${cleanPhone}`}
              className="tap-active p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-sm"
              title={`Call driver ${segment.logistics.driverName || ''}`}
            >
              <Phone className="w-4 h-4" />
            </a>
          )}
          <button
            onClick={() => onEditLogistics(segment)}
            className="tap-active p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700"
            title="Edit cab/train logistics"
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransitHeroCard;
