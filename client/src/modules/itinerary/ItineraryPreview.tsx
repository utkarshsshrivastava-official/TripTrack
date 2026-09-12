import React, { useState } from 'react';
import { useItinerary } from './hooks/useItinerary';
import { LogisticsEditModal } from './components/LogisticsEditModal';
import { TripSegment, TransitMode, DuoId, SegmentStatus } from '../../shared/types';
import { 
  Train, 
  Car, 
  Plane, 
  Mountain, 
  CheckCircle2, 
  Circle, 
  HeartHandshake, 
  ChevronDown, 
  ChevronUp,
  AlertTriangle,
  Phone,
  Edit3,
  CheckCircle,
  PlayCircle
} from 'lucide-react';

interface ItineraryPreviewProps {
  activeDuo: DuoId | 'ALL';
}

export const ItineraryPreview: React.FC<ItineraryPreviewProps> = ({ activeDuo: _activeDuo }) => {
  const { 
    segments, 
    toggleCheckpoint, 
    updateLogistics, 
    setSegmentStatus 
  } = useItinerary();

  const [expandedSegmentId, setExpandedSegmentId] = useState<string>('seg-1');
  const [editingSegment, setEditingSegment] = useState<TripSegment | null>(null);

  const getModeIcon = (mode: TransitMode) => {
    switch (mode) {
      case 'TRAIN': return <Train className="w-4 h-4 text-emerald-400" />;
      case 'CAB_PLAINS': return <Car className="w-4 h-4 text-sky-400" />;
      case 'CAB_HILLS': return <Mountain className="w-4 h-4 text-amber-400" />;
      case 'FLIGHT': return <Plane className="w-4 h-4 text-purple-400" />;
    }
  };

  const formatModeLabel = (mode: TransitMode) => {
    switch (mode) {
      case 'TRAIN': return 'Rajdhani Express';
      case 'CAB_PLAINS': return 'Expressway Cab';
      case 'CAB_HILLS': return 'Mountain Hill Cab';
      case 'FLIGHT': return 'Return Flight';
    }
  };

  const getStatusBadge = (status: SegmentStatus) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/80">
            <CheckCircle className="w-3 h-3" />
            <span>Completed</span>
          </span>
        );
      case 'IN_TRANSIT':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600 animate-pulse">
            <PlayCircle className="w-3 h-3" />
            <span>In Transit Now</span>
          </span>
        );
      case 'UPCOMING':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
            <span>Upcoming</span>
          </span>
        );
    }
  };

  const cycleStatus = (e: React.MouseEvent, segmentId: string, currentStatus: SegmentStatus) => {
    e.stopPropagation();
    const nextStatus: Record<SegmentStatus, SegmentStatus> = {
      UPCOMING: 'IN_TRANSIT',
      IN_TRANSIT: 'COMPLETED',
      COMPLETED: 'UPCOMING'
    };
    setSegmentStatus(segmentId, nextStatus[currentStatus]);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Route Hero Status Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-alpine-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-temple-saffron animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-temple-gold">
              Pilgrimage Circuit Plan
            </span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            6 Segments • 9 Days
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
          <div>
            <div className="text-slate-400 text-[10px] font-bold">START</div>
            <div className="font-bold text-white text-sm">Durg Jn (DURG)</div>
            <div className="text-[10px] text-slate-400">Sep 24 • 16:30</div>
          </div>
          <div className="flex flex-col items-center px-2">
            <span className="text-[10px] font-mono text-amber-400 font-bold">NH-7 / Badrinath</span>
            <div className="w-24 h-0.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-purple-500 my-1 relative">
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-400 border border-slate-900" />
            </div>
            <span className="text-[9px] text-slate-400">Peak: 3,130m</span>
          </div>
          <div className="text-right">
            <div className="text-slate-400 text-[10px] font-bold">RETURN</div>
            <div className="font-bold text-white text-sm">Raipur / Durg</div>
            <div className="text-[10px] text-slate-400">Oct 02 • 18:00</div>
          </div>
        </div>
      </div>

      {/* Segments List */}
      <div className="space-y-3">
        {segments.map((segment, index) => {
          const isExpanded = expandedSegmentId === segment.id;
          const completedCount = segment.checkpoints.filter(cp => cp.done).length;
          const totalCount = segment.checkpoints.length;
          const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
          const cleanPhone = segment.logistics.driverPhone?.replace(/[^0-9+]/g, '');
          const canCall = cleanPhone && cleanPhone.length >= 10;

          return (
            <div
              key={segment.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                segment.status === 'IN_TRANSIT'
                  ? 'border-amber-500/80 bg-gradient-to-b from-amber-950/20 via-alpine-900 to-slate-950 shadow-lg shadow-amber-950/20'
                  : segment.isHighAltitude
                  ? 'bg-gradient-to-b from-sky-950/30 via-alpine-900 to-slate-950 border-sky-600/50 shadow-md shadow-sky-950/30'
                  : 'bg-alpine-900/90 border-slate-800/90'
              }`}
            >
              {/* Segment Header Card */}
              <div
                onClick={() => setExpandedSegmentId(isExpanded ? '' : segment.id)}
                className="p-3.5 tap-active cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 font-mono text-xs font-bold flex items-center justify-center border border-slate-700">
                      {index + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                          {getModeIcon(segment.mode)}
                          {formatModeLabel(segment.mode)}
                        </span>

                        {/* Interactive Status Cycle Pill */}
                        <button
                          onClick={(e) => cycleStatus(e, segment.id, segment.status)}
                          className="tap-active"
                          title="Tap to advance status"
                        >
                          {getStatusBadge(segment.status)}
                        </button>

                        {segment.isHighAltitude && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-700/80 animate-pulse">
                            <AlertTriangle className="w-3 h-3" />
                            <span>Altitude ({segment.elevationMeters}m)</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-white mt-1 leading-snug">
                        {segment.title}
                      </h3>
                    </div>
                  </div>

                  <button className="p-1 text-slate-400 hover:text-white">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {/* Route points */}
                <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-300 font-medium pl-8">
                  <span className="text-white font-semibold">{segment.origin}</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-white font-semibold">{segment.destination}</span>
                </div>

                {/* Progress bar */}
                <div className="mt-3 pl-8 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-temple-saffron to-amber-400 transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 font-bold shrink-0">
                    {completedCount}/{totalCount}
                  </span>
                </div>
              </div>

              {/* Collapsible Details & Checkpoints */}
              {isExpanded && (
                <div className="px-3.5 pb-4 pt-1 border-t border-slate-800/80 space-y-3 pl-8 bg-slate-950/40">
                  {/* Logistics Card with Edit & Call actions */}
                  <div className="p-3 rounded-2xl bg-slate-900/95 border border-slate-800 text-xs text-slate-300 space-y-2 shadow-inner">
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                        <Car className="w-3.5 h-3.5" />
                        <span>Transit & Cab Logistics</span>
                      </div>
                      <button
                        onClick={() => setEditingSegment(segment)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold flex items-center gap-1 tap-active"
                      >
                        <Edit3 className="w-3 h-3 text-amber-400" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-1 text-[11px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Service / Vehicle:</span>
                        <strong className="text-white">{segment.logistics.serviceName}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Plate / Identifier:</span>
                        <span className="font-mono text-amber-300 font-bold">{segment.logistics.identifier}</span>
                      </div>
                      {segment.logistics.driverName && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Driver Pilot:</span>
                          <span className="text-white font-medium">{segment.logistics.driverName}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Boarding Point:</span>
                        <span className="text-slate-200 text-right max-w-[200px] truncate">{segment.logistics.pickupLocation}</span>
                      </div>
                    </div>

                    {/* Quick Call Button if driverPhone is valid */}
                    {canCall && (
                      <div className="pt-1 flex items-center justify-between bg-emerald-950/30 p-2 rounded-xl border border-emerald-800/40">
                        <div className="text-[11px] font-mono text-emerald-300 font-bold">
                          📞 {segment.logistics.driverPhone}
                        </div>
                        <a
                          href={`tel:${cleanPhone}`}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 tap-active shadow-sm"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Driver</span>
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Milestone Checkpoints with Elder notes */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                      <span>Milestone Checkpoints (Tap to Check)</span>
                      <span className="text-[10px] font-mono text-temple-gold">{percent}% Done</span>
                    </div>

                    {segment.checkpoints.map((cp) => (
                      <div
                        key={cp.id}
                        onClick={() => toggleCheckpoint(segment.id, cp.id)}
                        className={`tap-active p-2.5 rounded-xl border transition-all cursor-pointer ${
                          cp.done
                            ? 'bg-emerald-950/40 border-emerald-800/60 text-slate-300'
                            : 'bg-slate-900/80 border-slate-800 text-white hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <button className="mt-0.5 shrink-0 text-emerald-400">
                            {cp.done ? (
                              <CheckCircle2 className="w-4 h-4 fill-emerald-500 text-slate-950" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-500" />
                            )}
                          </button>

                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className={`text-xs font-semibold ${cp.done ? 'line-through text-slate-400' : 'text-white'}`}>
                                {cp.name}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 font-semibold shrink-0">
                                {cp.estimatedTime}
                              </span>
                            </div>

                            {/* Elder Comfort Note */}
                            {cp.elderComfortNote && (
                              <div className="mt-1.5 flex items-start gap-1.5 p-2 rounded-lg bg-amber-950/50 border border-amber-800/40 text-[11px] text-amber-200">
                                <HeartHandshake className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                                <div>
                                  <strong className="text-amber-300">Elder Comfort:</strong>{' '}
                                  {cp.elderComfortNote}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Logistics Edit Modal */}
      {editingSegment && (
        <LogisticsEditModal
          segment={editingSegment}
          isOpen={true}
          onClose={() => setEditingSegment(null)}
          onSave={async (id, logisticsUpdate) => {
            await updateLogistics(id, logisticsUpdate);
          }}
        />
      )}
    </div>
  );
};
