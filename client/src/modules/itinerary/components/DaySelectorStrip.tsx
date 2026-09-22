import React from 'react';
import { 
  Calendar, 
  Sparkles, 
  Mountain, 
  Compass, 
  PlusCircle, 
  AlertTriangle,
  Layers
} from 'lucide-react';
import { DayOption } from '../../../shared/types';

export const PILGRIMAGE_DAYS: DayOption[] = [
  {
    id: 'all',
    dayNumber: null,
    dateStr: 'Circuit',
    dayOfWeek: 'ALL',
    destination: 'Full Circuit',
    archetype: 'TRANSIT',
    elevationMeters: 3133,
    badgeIcon: '🗺️',
    weatherOverview: '9-Day Himalayan Pilgrimage',
    highlight: 'Comprehensive overview of all 9 days & 23 checkpoints',
    location: 'CIRCUIT'
  },
  {
    id: 'day-1',
    dayNumber: 1,
    dateStr: 'Sep 24',
    dayOfWeek: 'Thu',
    destination: 'Durg Dep',
    archetype: 'TRANSIT',
    elevationMeters: 216,
    badgeIcon: '🚆',
    weatherOverview: 'Plains 31°C • AC Coach A2',
    highlight: '16:30 Train 12441 Bilaspur Rajdhani Express Departure',
    location: 'DURG_NDLS'
  },
  {
    id: 'day-2',
    dayNumber: 2,
    dateStr: 'Sep 25',
    dayOfWeek: 'Fri',
    destination: 'Delhi → HW',
    archetype: 'TRANSIT',
    elevationMeters: 314,
    badgeIcon: '🚗',
    weatherOverview: 'Plains 28°C • Express Highway',
    highlight: '10:40 NDLS Arrival → Expressway Cab to Haridwar & Local Agency Badrinath Booking',
    location: 'HARIDWAR'
  },
  {
    id: 'day-3',
    dayNumber: 3,
    dateStr: 'Sep 26',
    dayOfWeek: 'Sat',
    destination: 'HW → Hills',
    archetype: 'TRANSIT',
    elevationMeters: 1890,
    badgeIcon: '🏔️',
    weatherOverview: 'Hills 18°C • Mountain Highway',
    highlight: '05:30 Early Departure via NH-7 (Devprayag, Srinagar, Rudraprayag, Joshimath)',
    location: 'ENROUTE'
  },
  {
    id: 'day-4',
    dayNumber: 4,
    dateStr: 'Sep 27',
    dayOfWeek: 'Sun',
    destination: 'Badrinath & Mana',
    archetype: 'SACRED_DARSHAN',
    elevationMeters: 3133,
    isPeak: true,
    badgeIcon: '🛕',
    weatherOverview: 'Chilly 8°C – 14°C • High Altitude',
    highlight: 'Badrinath Dham Darshan, Brahma Kapal Pitru Tarpan & Mana Village (Vyas Gufa)',
    location: 'BADRINATH_MANA'
  },
  {
    id: 'day-5',
    dayNumber: 5,
    dateStr: 'Sep 28',
    dayOfWeek: 'Mon',
    destination: 'Dhari Devi Return',
    archetype: 'SIGHTSEEING_EXPLORE',
    elevationMeters: 314,
    badgeIcon: '🌊',
    weatherOverview: 'Pleasant 24°C • River Valley',
    highlight: 'Descent to Haridwar via Panch Prayags & Maa Dhari Devi Temple Shaktipeeth',
    location: 'ENROUTE'
  },
  {
    id: 'day-6',
    dayNumber: 6,
    dateStr: 'Sep 29',
    dayOfWeek: 'Tue',
    destination: 'Haridwar Explore',
    archetype: 'SIGHTSEEING_EXPLORE',
    elevationMeters: 314,
    badgeIcon: '🏛️',
    weatherOverview: 'Sunny 27°C • Sacred City',
    highlight: 'Full Day: Har Ki Pauri Sandhya Aarti, Mansa Devi & Chandi Devi Ropeways, Moti Bazaar',
    location: 'HARIDWAR'
  },
  {
    id: 'day-7',
    dayNumber: 7,
    dateStr: 'Sep 30',
    dayOfWeek: 'Wed',
    destination: 'Rishikesh Explore',
    archetype: 'SIGHTSEEING_EXPLORE',
    elevationMeters: 372,
    badgeIcon: '🌿',
    weatherOverview: 'Pleasant 26°C • River Ghats',
    highlight: 'Ram Jhula, Janki Setu, Parmarth Niketan Ganga Aarti, Beatles Ashram / Haridwar spillover',
    location: 'RISHIKESH'
  },
  {
    id: 'day-8',
    dayNumber: 8,
    dateStr: 'Oct 01',
    dayOfWeek: 'Thu',
    destination: 'Buffer / Mussoorie',
    archetype: 'FLEXIBLE_BUFFER',
    elevationMeters: 450,
    badgeIcon: '⛰️',
    weatherOverview: 'Cool 22°C • Flexible Day',
    highlight: 'Mussoorie Kempty Falls OR Dehradun Nature Tour OR Relaxed Ghats → Night near Airport',
    location: 'DEHRADUN_MUSSOORIE'
  },
  {
    id: 'day-9',
    dayNumber: 9,
    dateStr: 'Oct 02',
    dayOfWeek: 'Fri',
    destination: 'IndiGo Flight',
    archetype: 'TRANSIT',
    elevationMeters: 298,
    badgeIcon: '✈️',
    weatherOverview: 'Clear 29°C • Homecoming',
    highlight: '13:15 IndiGo Flight (DED → DEL → RPR 2-Leg) & Cab Home to Durg',
    location: 'DURG_NDLS'
  }
];

interface DaySelectorStripProps {
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
  activeViewMode: 'timeline' | 'sightseeing';
  onViewModeChange: (mode: 'timeline' | 'sightseeing') => void;
  onOpenAddActivity?: () => void;
  onOpenRouteContingency?: () => void;
  todayDayId?: string;
}

export const DaySelectorStrip: React.FC<DaySelectorStripProps> = ({
  selectedDayId,
  onSelectDay,
  activeViewMode,
  onViewModeChange,
  onOpenAddActivity,
  onOpenRouteContingency,
  todayDayId
}) => {
  const selectedDay = PILGRIMAGE_DAYS.find(d => d.id === selectedDayId) || PILGRIMAGE_DAYS[0];

  // Helper for Archetype display text and color
  const getArchetypeBadge = (archetype: DayOption['archetype']) => {
    switch (archetype) {
      case 'TRANSIT':
        return { label: 'Transit & Travel', color: 'bg-sky-500/15 text-sky-400 border-sky-500/30' };
      case 'SACRED_DARSHAN':
        return { label: 'Sacred Darshan', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
      case 'SIGHTSEEING_EXPLORE':
        return { label: 'Sightseeing & Explore', color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
      case 'FLEXIBLE_BUFFER':
        return { label: 'Flexible Buffer', color: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
    }
  };

  const archetypeBadge = getArchetypeBadge(selectedDay.archetype);

  // Ref map to auto-scroll active day button into view
  const dayButtonRefs = React.useRef<{ [key: string]: HTMLButtonElement | null }>({});

  React.useEffect(() => {
    const activeEl = dayButtonRefs.current[selectedDayId];
    if (activeEl) {
      activeEl.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest'
      });
    }
  }, [selectedDayId]);

  return (
    <div className="w-full space-y-2">
      {/* Top Header Row */}
      <div className="flex items-center justify-between px-1 text-[11px] font-bold text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span className="uppercase tracking-wider">Pilgrimage Timeline</span>
        </div>
        
        {/* Actions: Live Day Jump & Highway Contingency 'Plan B' */}
        <div className="flex items-center gap-1.5">
          {todayDayId && (
            <button
              type="button"
              onClick={() => onSelectDay(todayDayId)}
              className={`flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 min-h-[32px] rounded-full border transition-all tap-active ${
                selectedDayId === todayDayId
                  ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-sm'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-emerald-500/40'
              }`}
              title="Jump to Today's Active Schedule"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Today</span>
            </button>
          )}

          {onOpenRouteContingency && (
            <button
              type="button"
              onClick={onOpenRouteContingency}
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 min-h-[32px] rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 transition-all tap-active"
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              <span>Plan B</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Scrolling Pill Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar -mx-1 px-1 scroll-smooth">
        {PILGRIMAGE_DAYS.map((day) => {
          const isSelected = selectedDayId === day.id;
          const isToday = todayDayId === day.id;

          return (
            <button
              key={day.id}
              ref={(el) => {
                dayButtonRefs.current[day.id] = el;
              }}
              onClick={() => onSelectDay(day.id)}
              className={`tap-active shrink-0 flex flex-col items-center justify-center min-w-[78px] min-h-[52px] px-2.5 py-1.5 rounded-2xl border transition-all relative ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-500/25 via-amber-500/15 to-slate-900 border-amber-500/90 text-white shadow-lg shadow-amber-500/15 ring-1 ring-amber-500/50'
                  : 'bg-slate-900/90 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              {/* Today Indicator Tag */}
              {isToday && (
                <span className="absolute -top-1.5 right-1 px-1 py-0.2 rounded-full text-[8px] font-black bg-emerald-500 text-slate-950 shadow-sm leading-tight">
                  TODAY
                </span>
              )}

              <div className="flex items-center gap-1">
                <span className="text-xs">{day.badgeIcon}</span>
                <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                  {day.dayOfWeek}
                </span>
                {day.isPeak && (
                  <Sparkles className="w-2.5 h-2.5 text-amber-400 inline" />
                )}
              </div>
              <span className={`text-xs font-black tracking-tight leading-tight mt-0.5 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                {day.dateStr}
              </span>
              <span className={`text-[9px] font-medium truncate max-w-[70px] mt-0.5 ${isSelected ? 'text-amber-300 font-semibold' : 'text-slate-500'}`}>
                {day.destination}
              </span>
            </button>
          );
        })}
      </div>

      {/* Contextual Day Status & Quick Action Bar */}
      {selectedDayId !== 'all' && (
        <div className="rounded-2xl bg-gradient-to-r from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-800/90 p-3 shadow-md space-y-2.5">
          {/* Day Title & Archetype Pill */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-black text-white">
                  {selectedDay.dayNumber ? `Day ${selectedDay.dayNumber}:` : ''} {selectedDay.destination}
                </span>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full border ${archetypeBadge.color}`}>
                  {archetypeBadge.label}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                {selectedDay.highlight}
              </div>
            </div>

            {/* Altitude Badge */}
            <div className="shrink-0 flex flex-col items-end">
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                selectedDay.elevationMeters > 2500
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300'
              }`}>
                <Mountain className="w-3 h-3" />
                {selectedDay.elevationMeters.toLocaleString()}m
              </span>
              <span className="text-[9px] text-slate-400 font-mono mt-0.5">
                {selectedDay.weatherOverview.split('•')[0]}
              </span>
            </div>
          </div>

          {/* Action Tabs: Timeline vs Recommendations + Add Activity */}
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-800/80">
            {/* View Mode Toggle: Timeline vs Sightseeing */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => onViewModeChange('timeline')}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all tap-active flex items-center gap-1.5 ${
                  activeViewMode === 'timeline'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Timeline</span>
              </button>

              <button
                type="button"
                onClick={() => onViewModeChange('sightseeing')}
                className={`text-[11px] font-bold px-3 py-1 rounded-lg transition-all tap-active flex items-center gap-1.5 ${
                  activeViewMode === 'sightseeing'
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Sightseeing</span>
              </button>
            </div>

            {/* Quick Add Custom Activity Button */}
            {onOpenAddActivity && (
              <button
                type="button"
                onClick={onOpenAddActivity}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-xs font-bold border border-slate-700 tap-active shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>+ Activity</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DaySelectorStrip;
