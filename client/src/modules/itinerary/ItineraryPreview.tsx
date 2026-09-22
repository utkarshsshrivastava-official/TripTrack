import React, { useState, useEffect, useCallback } from 'react';
import { useItinerary } from './hooks/useItinerary';
import { LogisticsEditModal } from './components/LogisticsEditModal';
import { DaySelectorStrip, PILGRIMAGE_DAYS } from './components/DaySelectorStrip';
import { TransitHeroCard } from './components/TransitHeroCard';
import { TransitTimelineItem } from './components/TransitTimelineItem';
import { RajdhaniTrackerDrawer } from './components/RajdhaniTrackerDrawer';
import { FlightTrackerDrawer } from './components/FlightTrackerDrawer';
import { DaySightseeingCard } from './components/DaySightseeingCard';
import { AddCustomActivityModal } from './components/AddCustomActivityModal';
import { RouteContingencyModal } from './components/RouteContingencyModal';
import { HaridwarCabHubModal } from './components/HaridwarCabHubModal';
import { ElderBreakAdvisorModal } from './components/ElderBreakAdvisorModal';
import { SacredAartiTimekeeperModal } from './components/SacredAartiTimekeeperModal';
import { OutfitWeatherAdvisorModal } from './components/OutfitWeatherAdvisorModal';
import { CashVsUpiAdvisorModal } from './components/CashVsUpiAdvisorModal';
import { DriverVoicePhrasebookModal } from './components/DriverVoicePhrasebookModal';
import { DayItineraryExportModal } from './components/DayItineraryExportModal';
import { TodayAtAGlanceCard } from './components/TodayAtAGlanceCard';
import { useAutoPilot } from './hooks/useAutoPilot';
import { SIGHTSEEING_RECOMMENDATIONS_POOL } from '../../shared/config/trip.config';
import { 
  getCustomActivitiesFromDexie, 
  addCustomActivityInDexie, 
  deleteCustomActivityInDexie 
} from './services/itineraryStorage';
import { TripSegment, DuoId, SegmentStatus, SightseeingSpot, CustomActivity } from '../../shared/types';
import { 
  Luggage, 
  Flame, 
  Sparkles, 
  Compass, 
  PlusCircle, 
  Trash2, 
  Clock, 
  HeartHandshake,
  Car,
  Coffee,
  Bell,
  Shirt,
  Banknote,
  Volume2,
  Share2
} from 'lucide-react';

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
    setSegmentStatus,
    addCheckpoint
  } = useItinerary();

  const {
    status: autoPilotStatus,
    isAutoPilotActive,
    toggleAutoPilot,
    setSimulation
  } = useAutoPilot();

  const [selectedDayId, setSelectedDayId] = useState<string>('day-1');
  const [hasInitializedDay, setHasInitializedDay] = useState<boolean>(false);
  const [activeViewMode, setActiveViewMode] = useState<'timeline' | 'sightseeing'>('timeline');
  const [expandedSegmentId, setExpandedSegmentId] = useState<string>('seg-1');
  const [editingSegment, setEditingSegment] = useState<TripSegment | null>(null);
  const [isRajdhaniDrawerOpen, setIsRajdhaniDrawerOpen] = useState<boolean>(false);
  const [isFlightDrawerOpen, setIsFlightDrawerOpen] = useState<boolean>(false);
  const [isAddActivityModalOpen, setIsAddActivityModalOpen] = useState<boolean>(false);
  const [isRouteContingencyOpen, setIsRouteContingencyOpen] = useState<boolean>(false);
  const [isCabHubModalOpen, setIsCabHubModalOpen] = useState<boolean>(false);
  const [isBreakAdvisorOpen, setIsBreakAdvisorOpen] = useState<boolean>(false);
  const [isAartiTimekeeperOpen, setIsAartiTimekeeperOpen] = useState<boolean>(false);
  const [isOutfitAdvisorOpen, setIsOutfitAdvisorOpen] = useState<boolean>(false);
  const [isCashAdvisorOpen, setIsCashAdvisorOpen] = useState<boolean>(false);
  const [isPhrasebookOpen, setIsPhrasebookOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [customActivities, setCustomActivities] = useState<CustomActivity[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-align selectedDayId with active day on initial mount
  useEffect(() => {
    if (!hasInitializedDay && autoPilotStatus.todayDayId) {
      setSelectedDayId(autoPilotStatus.todayDayId);
      const segId = getSegmentIdForDay(autoPilotStatus.todayDayId);
      setExpandedSegmentId(segId);
      setHasInitializedDay(true);
    }
  }, [autoPilotStatus.todayDayId, hasInitializedDay]);

  // Handle setting/clearing simulation day
  const handleSetSimulation = (simId: string | null) => {
    setSimulation(simId);
    if (simId) {
      setSelectedDayId(simId);
      const segId = getSegmentIdForDay(simId);
      setExpandedSegmentId(segId);
      showToast(`🧪 Switched to Day ${PILGRIMAGE_DAYS.find(d => d.id === simId)?.dayNumber || ''} Simulation!`);
    } else {
      setSelectedDayId(autoPilotStatus.todayDayId);
      const segId = getSegmentIdForDay(autoPilotStatus.todayDayId);
      setExpandedSegmentId(segId);
      showToast('🔄 Reset to live calendar date');
    }
  };

  // Load custom activities for the selected day
  const loadCustomActivities = useCallback(async () => {
    try {
      const list = await getCustomActivitiesFromDexie(selectedDayId);
      setCustomActivities(list);
    } catch (err) {
      console.warn('Failed to load custom activities:', err);
    }
  }, [selectedDayId]);

  useEffect(() => {
    loadCustomActivities();

    const handleUpdate = () => {
      loadCustomActivities();
    };

    window.addEventListener('triptrack_custom_activities_update', handleUpdate);
    return () => {
      window.removeEventListener('triptrack_custom_activities_update', handleUpdate);
    };
  }, [loadCustomActivities]);

  // Show transient toast notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

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

  // Find active day definition
  const selectedDay = PILGRIMAGE_DAYS.find(d => d.id === selectedDayId) || PILGRIMAGE_DAYS[0];

  // Map day IDs cleanly 1:1 to segments (seg-1 to seg-9)
  const getSegmentIdForDay = (dayId: string): string => {
    switch (dayId) {
      case 'day-1': return 'seg-1';
      case 'day-2': return 'seg-2';
      case 'day-3': return 'seg-3';
      case 'day-4': return 'seg-4';
      case 'day-5': return 'seg-5';
      case 'day-6': return 'seg-6';
      case 'day-7': return 'seg-7';
      case 'day-8': return 'seg-8';
      case 'day-9': return 'seg-9';
      default: return 'seg-1';
    }
  };

  // Map selected day to relevant segment(s)
  const getFilteredSegments = () => {
    if (selectedDayId === 'all') return segments;
    const segId = getSegmentIdForDay(selectedDayId);
    return segments.filter(s => s.id === segId);
  };

  const filteredSegments = getFilteredSegments();
  const currentDaySegment = filteredSegments[0] || segments[0];

  // Determine active segment for Hero Card:
  // If specific day selected, use that day's segment. Otherwise use in-transit or upcoming segment.
  const activeHeroSegment = selectedDayId !== 'all'
    ? currentDaySegment
    : (segments.find(s => s.status === 'IN_TRANSIT') || segments.find(s => s.status === 'UPCOMING') || segments[0]);

  // Curated Sightseeing Recommendations for this day's location
  const dayRecommendations = SIGHTSEEING_RECOMMENDATIONS_POOL.filter(spot => {
    if (selectedDayId === 'all') return true;
    return spot.location === selectedDay.location;
  });

  // Handle adding a recommended spot to today's active segment checkpoints
  const handleAddSpotToCheckpoint = async (spot: SightseeingSpot) => {
    if (!currentDaySegment) return;
    
    await addCheckpoint(currentDaySegment.id, {
      id: `cp-rec-${spot.id}-${Date.now()}`,
      name: `${spot.name}`,
      estimatedTime: spot.recommendedTimeSlot === 'MORNING' ? '10:00' : spot.recommendedTimeSlot === 'AFTERNOON' ? '14:00' : '17:30',
      elderComfortNote: spot.elderComfortTip
    });

    showToast(`✨ Added "${spot.name}" to Day ${selectedDay.dayNumber || ''} Timeline!`);
  };

  // Handle saving a manual custom activity
  const handleSaveCustomActivity = async (activity: CustomActivity, addToTimeline: boolean) => {
    await addCustomActivityInDexie(activity);

    if (addToTimeline && currentDaySegment) {
      await addCheckpoint(currentDaySegment.id, {
        id: `cp-custom-${activity.id}`,
        name: activity.title,
        estimatedTime: activity.timeSlot === 'MORNING' ? '10:30' : activity.timeSlot === 'AFTERNOON' ? '14:30' : '18:00',
        elderComfortNote: activity.elderComfortNote
      });
    }

    await loadCustomActivities();
    showToast(`➕ Added "${activity.title}" to Day ${selectedDay.dayNumber || ''}!`);
  };

  // Handle deleting a custom activity
  const handleDeleteCustomActivity = async (activityId: string) => {
    await deleteCustomActivityInDexie(activityId);
    await loadCustomActivities();
    showToast('Activity removed.');
  };

  // Sync confirmed hill cab driver logistics across Days 2, 3, 4 and 5
  const handleSyncDriverLogistics = async (driverInfo: {
    driverName: string;
    driverPhone: string;
    vehiclePlate: string;
    vehicleModel: string;
    pickupLocation: string;
  }) => {
    const hillSegments = ['seg-2', 'seg-3', 'seg-4', 'seg-5'];
    for (const segId of hillSegments) {
      await updateLogistics(segId, {
        driverName: driverInfo.driverName,
        driverPhone: driverInfo.driverPhone,
        identifier: driverInfo.vehiclePlate,
        serviceName: `Dedicated Hill Cab (${driverInfo.vehicleModel})`,
        vehicleType: driverInfo.vehicleModel,
        pickupLocation: driverInfo.pickupLocation
      });
    }
    showToast(`🚕 Hill Cab (${driverInfo.vehiclePlate}) synced across Days 2, 3, 4 & 5!`);
  };

  const todaySegment = segments.find(s => s.id === getSegmentIdForDay(autoPilotStatus.todayDayId)) || segments[0];

  return (
    <div className="space-y-4 pb-6">
      {/* Toast Feedback Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Horizontal Day Selector Strip with Contextual Status Bar */}
      <DaySelectorStrip
        selectedDayId={selectedDayId}
        onSelectDay={(dayId) => {
          setSelectedDayId(dayId);
          // If switching to an exploration day, default to timeline view while keeping sightseeing available
          if (dayId !== 'all') {
            const segId = getSegmentIdForDay(dayId);
            setExpandedSegmentId(segId);
          }
        }}
        activeViewMode={activeViewMode}
        onViewModeChange={(mode) => setActiveViewMode(mode)}
        onOpenAddActivity={() => setIsAddActivityModalOpen(true)}
        onOpenRouteContingency={() => setIsRouteContingencyOpen(true)}
        todayDayId={autoPilotStatus.todayDayId}
      />

      {/* 2. Today at a Glance: Live Auto-Pilot & Next-Up Milestone Ticker */}
      <TodayAtAGlanceCard
        status={autoPilotStatus}
        isAutoPilotActive={isAutoPilotActive}
        onToggleAutoPilot={toggleAutoPilot}
        selectedDayId={selectedDayId}
        onSelectDay={(dayId) => {
          setSelectedDayId(dayId);
          if (dayId !== 'all') {
            const segId = getSegmentIdForDay(dayId);
            setExpandedSegmentId(segId);
          }
        }}
        activeSegment={todaySegment}
        onToggleCheckpoint={toggleCheckpoint}
        onSetSimulation={handleSetSimulation}
      />

      {/* 3. Hero Transit Card for Transit & Sacred Darshan Days */}
      {activeHeroSegment && activeViewMode === 'timeline' && (
        <TransitHeroCard
          segment={activeHeroSegment}
          onCycleStatus={cycleStatus}
          onEditLogistics={(seg) => setEditingSegment(seg)}
          onOpenTrainTracker={() => setIsRajdhaniDrawerOpen(true)}
          onOpenFlightTracker={() => setIsFlightDrawerOpen(true)}
        />
      )}

      {/* 3. Sacred Preparation & Road Guidance Action Pills */}
      <div className="grid grid-cols-3 gap-2">
        {onOpenPackingChecklist && (
          <button
            type="button"
            onClick={onOpenPackingChecklist}
            className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 text-left flex items-center gap-2 tap-active shadow-sm min-h-touch"
          >
            <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
              <Luggage className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">Packing</div>
              <div className="text-[9px] text-sky-400 truncate">Meds & Warm</div>
            </div>
          </button>
        )}

        {onOpenBrahmaKapalGuide && (
          <button
            type="button"
            onClick={onOpenBrahmaKapalGuide}
            className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 text-left flex items-center gap-2 tap-active shadow-sm min-h-touch"
          >
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">ब्रह्मकपाल</div>
              <div className="text-[9px] text-amber-400 truncate">Pind Daan</div>
            </div>
          </button>
        )}

        <button
          type="button"
          onClick={() => setIsCabHubModalOpen(true)}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 text-left flex items-center gap-2 tap-active shadow-sm min-h-touch"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Car className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Hill Cab Hub</div>
            <div className="text-[9px] text-emerald-400 truncate">7 Agencies & Check</div>
          </div>
        </button>
      </div>

      {/* Row 2: Elder Bio-Breaks & Aarti Timekeeper Pills */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setIsBreakAdvisorOpen(true)}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400 text-left flex items-center gap-2 tap-active shadow-sm min-h-touch"
        >
          <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Coffee className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Elder Bio-Breaks</div>
            <div className="text-[9px] text-amber-400 truncate">2.5h Highway Interval</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsAartiTimekeeperOpen(true)}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-400 text-left flex items-center gap-2 tap-active shadow-sm min-h-touch"
        >
          <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
            <Bell className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Aarti Timekeeper</div>
            <div className="text-[9px] text-purple-300 truncate">Muhurtas & Bell Chime</div>
          </div>
        </button>
      </div>

      {/* Row 3: Outfit & Weather Dress-Code Advisor + Hard Cash vs UPI Advisor */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setIsOutfitAdvisorOpen(true)}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-sky-500/30 hover:border-sky-400 text-left flex items-center gap-2 tap-active shadow-sm min-h-touch"
        >
          <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <Shirt className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Dress & Weather</div>
            <div className="text-[9px] text-sky-300 truncate">Thermals, Woollens & Attire</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsCashAdvisorOpen(true)}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400 text-left flex items-center gap-2 tap-active shadow-sm min-h-touch"
        >
          <div className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Banknote className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Cash vs UPI</div>
            <div className="text-[9px] text-emerald-300 truncate">ATMs & Offline Dakshina</div>
          </div>
        </button>
      </div>

      {/* Row 4: Driver Voice Phrasebook + Itinerary WhatsApp Export & Print */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setIsPhrasebookOpen(true)}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-teal-500/30 hover:border-teal-400 text-left flex items-center gap-2 tap-active shadow-sm min-h-touch"
        >
          <div className="w-7 h-7 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <Volume2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Voice Phrasebook</div>
            <div className="text-[9px] text-teal-300 truncate">Hindi & Garhwali Audio</div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setIsExportModalOpen(true)}
          className="p-2.5 rounded-2xl bg-slate-900/90 border border-sky-500/30 hover:border-sky-400 text-left flex items-center gap-2 tap-active shadow-sm min-h-touch"
        >
          <div className="w-7 h-7 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0">
            <Share2 className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Export & WhatsApp</div>
            <div className="text-[9px] text-sky-300 truncate">Print Sheet & Briefing</div>
          </div>
        </button>
      </div>

      {/* Mountain Drive Elder Bio-Break Callout Card */}
      {(selectedDayId === 'day-3' || selectedDayId === 'day-5') && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 flex items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Coffee className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-white truncate">
                NH-7 Mountain Highway Rest Stops
              </div>
              <div className="text-[10px] text-amber-300 truncate">
                Teen Dhara, Srinagar & Pipalkoti • ≤2.5h pacing for elders
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsBreakAdvisorOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] tap-active shrink-0 shadow-md"
          >
            Open Halts
          </button>
        </div>
      )}

      {/* Sacred Aarti Timekeeper Callout Card */}
      {(selectedDayId === 'day-4' || selectedDayId === 'day-6' || selectedDayId === 'day-7') && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/40 flex items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
              <Flame className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-white truncate">
                Sacred Aarti & Darshan Schedule
              </div>
              <div className="text-[10px] text-purple-300 truncate">
                Badrinath & Har Ki Pauri • Queue cutoffs & elder seating
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAartiTimekeeperOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-black text-[11px] tap-active shrink-0 shadow-md"
          >
            Aarti Slots
          </button>
        </div>
      )}

      {/* Haridwar Day 2 Cab Booking Callout Card */}
      {selectedDayId === 'day-2' && (
        <div className="p-4 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-xl space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
                <Car className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                  <span>Haridwar Hill Cab Desk</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Day 2 Mission
                  </span>
                </h4>
                <p className="text-[11px] text-slate-300 leading-tight">
                  Pre-screen 7 Haridwar agencies for the 3-day Badrinath ascent. Inspect commercial plate & captain seats before advance.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800">
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Ertiga Benchmark</div>
              <div className="font-bold text-emerald-400">₹16,000 – ₹19,000</div>
              <div className="text-[9px] text-slate-400">All-incl. (Tolls, DA, Green Card)</div>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              <div className="text-slate-400 text-[10px]">Innova Crysta Benchmark</div>
              <div className="font-bold text-amber-400">₹22,000 – ₹26,000</div>
              <div className="text-[9px] text-slate-400">Captain seats (Elder comfort)</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCabHubModalOpen(true)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-xs tap-active flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Car className="w-4 h-4 stroke-[2.5]" />
            <span>Open Cab Directory, Safety Check & Driver Handover</span>
          </button>
        </div>
      )}

      {/* 4. Dynamic Body: Sightseeing Recommendations View vs Timeline View */}
      {activeViewMode === 'sightseeing' ? (
        /* --- SIGHTSEEING & CUSTOM ACTIVITIES VIEW --- */
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black text-white uppercase tracking-wider">
                {selectedDayId === 'all' ? 'All Yatra Sightseeing' : `${selectedDay.destination} Recommendations`}
              </span>
            </div>
            <span className="text-[11px] font-mono text-amber-400 font-bold">
              {dayRecommendations.length} Curated Spots
            </span>
          </div>

          {/* User Added Custom Activities for This Day */}
          {customActivities.length > 0 && (
            <div className="space-y-2">
              <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider px-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Your Custom Stops for Today ({customActivities.length})</span>
              </div>
              <div className="space-y-2">
                {customActivities.map((act) => (
                  <div
                    key={act.id}
                    className="p-3 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex items-start justify-between gap-2 shadow-sm"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-bold">
                          {act.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          {act.timeSlot}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mt-1">{act.title}</h4>
                      {act.elderComfortNote && (
                        <p className="text-xs text-amber-300/90 mt-1 flex items-start gap-1">
                          <HeartHandshake className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{act.elderComfortNote}</span>
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCustomActivity(act.id)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors tap-active"
                      title="Remove custom activity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Curated Recommendations Cards */}
          {dayRecommendations.length === 0 ? (
            <div className="rounded-2xl bg-slate-900/60 border border-slate-800 p-6 text-center space-y-2">
              <Compass className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs text-slate-400">
                This is a transit day. Use the "+ Add Activity" button to schedule a custom stop or rest pause.
              </p>
              <button
                type="button"
                onClick={() => setIsAddActivityModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs tap-active mt-2"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Add Custom Activity</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayRecommendations.map((spot) => {
                // Check if this spot is already added in the day's checkpoints
                const isAlreadyAdded = currentDaySegment?.checkpoints.some(
                  cp => cp.name.toLowerCase().includes(spot.name.toLowerCase())
                );

                return (
                  <DaySightseeingCard
                    key={spot.id}
                    spot={spot}
                    isAlreadyAdded={isAlreadyAdded}
                    onAdd={handleAddSpotToCheckpoint}
                  />
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* --- TIMELINE VIEW --- */
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1 text-xs font-bold text-slate-400">
            <span className="uppercase tracking-wider">
              {selectedDayId === 'all'
                ? `Complete Pilgrimage Circuit (${segments.length} Segments)`
                : `Day ${selectedDay.dayNumber || ''} Schedule (${filteredSegments.length} Segment)`}
            </span>
            {selectedDayId !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedDayId('all')}
                className="text-amber-400 hover:underline text-[11px]"
              >
                Show All 9 Days
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
              onOpenTrainTracker={() => setIsRajdhaniDrawerOpen(true)}
              onOpenFlightTracker={() => setIsFlightDrawerOpen(true)}
            />
          ))}
        </div>
      )}

      {/* 5. Add Custom Activity Modal */}
      <AddCustomActivityModal
        isOpen={isAddActivityModalOpen}
        dayId={selectedDayId === 'all' ? 'day-1' : selectedDayId}
        dayTitle={selectedDay.destination}
        onClose={() => setIsAddActivityModalOpen(false)}
        onSave={handleSaveCustomActivity}
      />

      {/* 6. Route Contingency ("Plan B") & Himalayan Rebalancer Modal */}
      <RouteContingencyModal
        isOpen={isRouteContingencyOpen}
        onClose={() => setIsRouteContingencyOpen(false)}
        onApplyPreset={(presetKey) => {
          showToast(`⚠️ Switched to ${presetKey.toUpperCase()}! Oct 02 flight remains 100% safe.`);
        }}
      />

      {/* 7. Logistics Edit Modal */}
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

      {/* 8. Live 12441 Rajdhani & IRCTC Confirmed Bay Tracker Drawer */}
      <RajdhaniTrackerDrawer
        isOpen={isRajdhaniDrawerOpen}
        onClose={() => setIsRajdhaniDrawerOpen(false)}
      />

      {/* 9. Live IndiGo Return Flight & Dual-PNR Connection Tracker Drawer */}
      <FlightTrackerDrawer
        isOpen={isFlightDrawerOpen}
        onClose={() => setIsFlightDrawerOpen(false)}
      />

      {/* 10. Haridwar Hill Cab Agency Directory, Safety Inspection & Handover Modal */}
      <HaridwarCabHubModal
        isOpen={isCabHubModalOpen}
        onClose={() => setIsCabHubModalOpen(false)}
        onSyncDriverLogistics={handleSyncDriverLogistics}
        currentLogistics={currentDaySegment?.logistics}
      />

      {/* 11. Elder-Care Meal & Bio-Break Interval Advisor Modal */}
      <ElderBreakAdvisorModal
        isOpen={isBreakAdvisorOpen}
        onClose={() => setIsBreakAdvisorOpen(false)}
        selectedDayId={selectedDayId}
        onLogBreak={(stopName) => showToast(`🍵 Rest break logged at ${stopName}!`)}
      />

      {/* 12. Temple Darshan & Aarti Timekeeper Modal */}
      <SacredAartiTimekeeperModal
        isOpen={isAartiTimekeeperOpen}
        onClose={() => setIsAartiTimekeeperOpen(false)}
        selectedDayId={selectedDayId}
      />

      {/* 13. Outfit & Weather Dress-Code Advisor Modal */}
      <OutfitWeatherAdvisorModal
        isOpen={isOutfitAdvisorOpen}
        onClose={() => setIsOutfitAdvisorOpen(false)}
        selectedDayId={selectedDayId}
      />

      {/* 14. Daily Hard Cash vs UPI Advisor Modal */}
      <CashVsUpiAdvisorModal
        isOpen={isCashAdvisorOpen}
        onClose={() => setIsCashAdvisorOpen(false)}
        selectedDayId={selectedDayId}
      />

      {/* 15. Bilingual Driver & Local Voice Phrasebook Modal */}
      <DriverVoicePhrasebookModal
        isOpen={isPhrasebookOpen}
        onClose={() => setIsPhrasebookOpen(false)}
      />

      {/* 16. Day Itinerary Export & WhatsApp Briefing Modal */}
      <DayItineraryExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        selectedDayId={selectedDayId}
      />
    </div>
  );
};

export default ItineraryPreview;
