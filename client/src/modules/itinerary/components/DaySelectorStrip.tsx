import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';

export interface DayOption {
  id: string; // 'all' or 'day-1', 'day-2', etc.
  dayNumber: number | null;
  dateStr: string;
  dayOfWeek: string;
  destination: string;
  isPeak?: boolean;
}

export const PILGRIMAGE_DAYS: DayOption[] = [
  { id: 'all', dayNumber: null, dateStr: 'Circuit', dayOfWeek: 'ALL', destination: 'Full 9-Day Yatra' },
  { id: 'day-1', dayNumber: 1, dateStr: 'Sep 24', dayOfWeek: 'Thu', destination: 'Durg Dep' },
  { id: 'day-2', dayNumber: 2, dateStr: 'Sep 25', dayOfWeek: 'Fri', destination: 'Delhi → HW' },
  { id: 'day-3', dayNumber: 3, dateStr: 'Sep 26', dayOfWeek: 'Sat', destination: 'HW → Joshimath' },
  { id: 'day-4', dayNumber: 4, dateStr: 'Sep 27', dayOfWeek: 'Sun', destination: 'Badrinath Dham', isPeak: true },
  { id: 'day-5', dayNumber: 5, dateStr: 'Sep 28', dayOfWeek: 'Mon', destination: 'Mana Village', isPeak: true },
  { id: 'day-6', dayNumber: 6, dateStr: 'Sep 29', dayOfWeek: 'Tue', destination: 'Rudraprayag' },
  { id: 'day-7', dayNumber: 7, dateStr: 'Sep 30', dayOfWeek: 'Wed', destination: 'Rishikesh' },
  { id: 'day-8', dayNumber: 8, dateStr: 'Oct 01', dayOfWeek: 'Thu', destination: 'Return Train' },
  { id: 'day-9', dayNumber: 9, dateStr: 'Oct 02', dayOfWeek: 'Fri', destination: 'Homecoming' },
];

interface DaySelectorStripProps {
  selectedDayId: string;
  onSelectDay: (dayId: string) => void;
}

export const DaySelectorStrip: React.FC<DaySelectorStripProps> = ({
  selectedDayId,
  onSelectDay
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between px-1 mb-1.5 text-[11px] font-bold text-slate-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-amber-400" />
          <span className="uppercase tracking-wider">Pilgrimage Timeline</span>
        </div>
        <span className="font-mono text-[10px] text-amber-400">Sep 24 – Oct 02</span>
      </div>

      {/* Horizontal Scrolling Pill Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 pt-0.5 no-scrollbar -mx-1 px-1">
        {PILGRIMAGE_DAYS.map((day) => {
          const isSelected = selectedDayId === day.id;

          return (
            <button
              key={day.id}
              onClick={() => onSelectDay(day.id)}
              className={`tap-active shrink-0 flex flex-col items-center justify-center min-w-[72px] px-2.5 py-1.5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-gradient-to-b from-amber-500/20 to-amber-600/10 border-amber-500/80 text-white shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-1">
                <span className={`text-[10px] font-mono font-bold uppercase ${isSelected ? 'text-amber-400' : 'text-slate-500'}`}>
                  {day.dayOfWeek}
                </span>
                {day.isPeak && (
                  <Sparkles className="w-2.5 h-2.5 text-amber-400 inline" />
                )}
              </div>
              <span className={`text-xs font-black tracking-tight leading-tight ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                {day.dateStr}
              </span>
              <span className={`text-[9px] font-medium truncate max-w-[65px] ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                {day.destination}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DaySelectorStrip;
