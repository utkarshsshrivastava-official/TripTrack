import React, { useState } from 'react';
import { useItinerary } from './hooks/useItinerary';
import { LogisticsEditModal } from './components/LogisticsEditModal';
import { DaySelectorStrip } from './components/DaySelectorStrip';
import { TransitHeroCard } from './components/TransitHeroCard';
import { TransitTimelineItem } from './components/TransitTimelineItem';
import { TripSegment, DuoId, SegmentStatus } from '../../shared/types';
import { Luggage, Flame } from 'lucide-react';

interface ItineraryPreviewProps {
  activeDuo: DuoId | 'ALL';
  onOpenPackingChecklist?: () => void;
  onOpenBrahmaKapalGuide?: () => void;
}

export const ItineraryPreview: React.FC<ItineraryPreviewProps> = ({
  activeDuo: _activeDuo,
  onOpenPackingChecklist,
  onOpenBrahmaKapalGuide
}) => {
  const { 
    segments, 
    toggleCheckpoint, 
    updateLogistics, 
    setSegmentStatus 
  } = useItinerary();

  const [selectedDayId, setSelectedDayId] = useState<string>('all');
  const [expandedSegmentId, setExpandedSegmentId] = useState<string>('seg-1');
  const [editingSegment, setEditingSegment] = useState<TripSegment | null>(null);

  // Cycle segment status: UPCOMING -> IN_TRANSIT -> COMPLETED -> UPCOMING
  const cycleStatus = (e: React.MouseEvent, segmentId: string, currentStatus: SegmentStatus) => {
    e.stopPropagation();
    const nextStatus: Record<SegmentStatus, SegmentStatus> = {
      UPCOMING: 'IN_TRANSIT',
      IN_TRANSIT: 'COMPLETED',
      COMPLETED: 'UPCOMING'
    };
    setSegmentStatus(segmentId, nextStatus[currentStatus]);
  };

  // Determine active segment for the Hero Transit Card
  const activeHeroSegment =
    segments.find(s => s.status === 'IN_TRANSIT') ||
    segments.find(s => s.status === 'UPCOMING') ||
    segments[0];

  // Map selected day to relevant segment(s)
  const getFilteredSegments = () => {
    if (selectedDayId === 'all') return segments;
    switch (selectedDayId) {
      case 'day-1': return segments.filter(s => s.id === 'seg-1');
      case 'day-2': return segments.filter(s => s.id === 'seg-2');
      case 'day-3': return segments.filter(s => s.id === 'seg-3');
      case 'day-4':
      case 'day-5': return segments.filter(s => s.id === 'seg-4');
      case 'day-6':
      case 'day-7': return segments.filter(s => s.id === 'seg-5');
      case 'day-8':
      case 'day-9': return segments.filter(s => s.id === 'seg-6');
      default: return segments;
    }
  };

  const filteredSegments = getFilteredSegments();

  return (
    <div className="space-y-4 pb-4">
      {/* 1. Horizontal Day Selector Strip */}
      <DaySelectorStrip
        selectedDayId={selectedDayId}
        onSelectDay={(dayId) => {
          setSelectedDayId(dayId);
          // If a specific day is selected, automatically expand its matching segment
          if (dayId !== 'all') {
            const matched = segments.find(s => {
              if (dayId === 'day-1') return s.id === 'seg-1';
              if (dayId === 'day-2') return s.id === 'seg-2';
              if (dayId === 'day-3') return s.id === 'seg-3';
              if (dayId === 'day-4' || dayId === 'day-5') return s.id === 'seg-4';
              if (dayId === 'day-6' || dayId === 'day-7') return s.id === 'seg-5';
              if (dayId === 'day-8' || dayId === 'day-9') return s.id === 'seg-6';
              return false;
            });
            if (matched) setExpandedSegmentId(matched.id);
          }
        }}
      />

      {/* 2. Flighty-Style Live Transit Hero Card */}
      {activeHeroSegment && (
        <TransitHeroCard
          segment={activeHeroSegment}
          onCycleStatus={cycleStatus}
          onEditLogistics={(seg) => setEditingSegment(seg)}
        />
      )}

      {/* 3. Sacred Preparation Quick Action Pills */}
      <div className="grid grid-cols-2 gap-2">
        {onOpenPackingChecklist && (
          <button
            type="button"
            onClick={onOpenPackingChecklist}
            className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 text-left flex items-center gap-2.5 tap-active shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Luggage className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Packing Checklist</div>
              <div className="text-[10px] text-sky-400">Woollens & Meds</div>
            </div>
          </button>
        )}

        {onOpenBrahmaKapalGuide && (
          <button
            type="button"
            onClick={onOpenBrahmaKapalGuide}
            className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-left flex items-center gap-2.5 tap-active shadow-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">ब्रह्मकपाल तर्पण</div>
              <div className="text-[10px] text-amber-400">Pind Daan Ritual</div>
            </div>
          </button>
        )}
      </div>

      {/* 4. Vertical Route Timeline Segments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-400">
          <span className="uppercase tracking-wider">
            {selectedDayId === 'all'
              ? 'Complete Pilgrimage Circuit (6 Segments)'
              : `Day Schedule (${filteredSegments.length} Segment)`}
          </span>
          {selectedDayId !== 'all' && (
            <button
              onClick={() => setSelectedDayId('all')}
              className="text-amber-400 hover:underline text-[11px]"
            >
              Show All
            </button>
          )}
        </div>

        {filteredSegments.map((segment, index) => (
          <TransitTimelineItem
            key={segment.id}
            segment={segment}
            index={index}
            isExpanded={expandedSegmentId === segment.id}
            onToggleExpand={() =>
              setExpandedSegmentId(expandedSegmentId === segment.id ? '' : segment.id)
            }
            onToggleCheckpoint={toggleCheckpoint}
            onCycleStatus={cycleStatus}
            onEditLogistics={(seg) => setEditingSegment(seg)}
          />
        ))}
      </div>

      {/* 5. Logistics Edit Modal */}
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

export default ItineraryPreview;
