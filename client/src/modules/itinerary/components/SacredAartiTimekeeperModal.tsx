import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Clock, 
  Sparkles, 
  MapPin, 
  Volume2, 
  Flame 
} from 'lucide-react';
import { SACRED_RITUAL_SLOTS } from '../../../shared/config/trip.config';
import { sacredBellAudio } from '../../../shared/services/sacredBellAudio';
import { PILGRIMAGE_DAYS } from './DaySelectorStrip';

interface SacredAartiTimekeeperModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDayId: string;
}

export const SacredAartiTimekeeperModal: React.FC<SacredAartiTimekeeperModalProps> = ({
  isOpen,
  onClose,
  selectedDayId
}) => {
  const [activeFilter, setActiveFilter] = useState<'TODAY' | 'ALL'>('TODAY');
  const [isPlayingChime, setIsPlayingChime] = useState(false);

  if (!isOpen) return null;

  const handlePlayChime = () => {
    setIsPlayingChime(true);
    sacredBellAudio.playTempleBell(4.0);
    setTimeout(() => {
      setIsPlayingChime(false);
    }, 3500);
  };

  const selectedDayDef = PILGRIMAGE_DAYS.find(d => d.id === selectedDayId);

  // Filter slots
  const filteredSlots = SACRED_RITUAL_SLOTS.filter(slot => {
    if (activeFilter === 'TODAY') {
      if (selectedDayId === 'all') return true;
      return slot.dayId === selectedDayId;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
              <Flame className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>Temple Darshan & Aarti Timekeeper</span>
              </h3>
              <p className="text-[11px] text-amber-400 font-medium">
                Sacred Muhurtas, Queue Cutoffs & Senior Seating Slots
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
          {/* Sacred Temple Bell Audio Synthesizer Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-950 to-slate-950 border border-amber-500/40 flex items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/30 text-amber-300 flex items-center justify-center shrink-0 border border-amber-500/50">
                <Bell className={`w-5 h-5 ${isPlayingChime ? 'animate-bounce text-amber-200' : ''}`} />
              </div>
              <div>
                <div className="text-xs font-black text-white flex items-center gap-1.5">
                  <span>Sacred Temple Bell Chime</span>
                  <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400">
                    528Hz Ohm
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Offline acoustic synthesizer for darshan reminder bells
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlayChime}
              className={`px-3 py-2 rounded-xl text-xs font-black tap-active shrink-0 flex items-center gap-1.5 transition-all ${
                isPlayingChime
                  ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/30'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
              }`}
            >
              <Volume2 className="w-4 h-4" />
              <span>{isPlayingChime ? 'Chiming...' : 'Ring Bell'}</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveFilter('TODAY')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all tap-active ${
                activeFilter === 'TODAY'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {selectedDayDef?.destination ? `Day ${selectedDayDef.dayNumber || ''} Rituals` : 'Selected Day Rituals'}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all tap-active ${
                activeFilter === 'ALL'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All Pilgrimage Rituals (7 Slots)
            </button>
          </div>

          {/* Ritual Cards */}
          <div className="space-y-3">
            {filteredSlots.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1.5">
                <Sparkles className="w-6 h-6 text-amber-400 mx-auto" />
                <div className="text-xs font-bold text-white">No major aartis scheduled for this day</div>
                <div className="text-[11px] text-slate-400">
                  Switch to "All Pilgrimage Rituals" above to see the complete sacred calendar.
                </div>
              </div>
            ) : (
              filteredSlots.map((slot) => {
                const dayDef = PILGRIMAGE_DAYS.find(d => d.id === slot.dayId);

                return (
                  <div
                    key={slot.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all space-y-2.5"
                  >
                    {/* Top Row: Temple, Ritual, Day Tag */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{slot.templeName}</span>
                          {dayDef && (
                            <span className="text-slate-500 font-mono">
                              • Day {dayDef.dayNumber} ({dayDef.dateStr})
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-black text-white mt-0.5">
                          {slot.ritualName}
                        </h4>
                      </div>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 font-mono">
                        {slot.timeWindow}
                      </span>
                    </div>

                    {/* Arrive By & Queue Warning */}
                    <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                        <div>
                          <div className="text-xs font-black text-white">
                            Arrive by: {slot.arriveByTime}
                          </div>
                          <div className="text-[10px] text-amber-300">
                            Avoid peak crowd surge & secure senior seats
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handlePlayChime}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 tap-active"
                        title="Ring sacred bell"
                      >
                        <Bell className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Elder Seating & Comfort Notes */}
                    <div className="space-y-1.5 text-[11px]">
                      <div className="p-2 rounded-xl bg-sky-950/30 border border-sky-500/20 text-sky-200 leading-snug">
                        <strong className="text-sky-300">Elder Seating Advice:</strong> {slot.elderSeatingAdvice}
                      </div>

                      <div className="p-2 rounded-xl bg-purple-950/30 border border-purple-500/20 text-purple-200 leading-snug">
                        <strong className="text-purple-300">Recommended Attire:</strong> {slot.dressCodeAdvice}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tap-active"
          >
            Close Timekeeper
          </button>
        </div>
      </div>
    </div>
  );
};

export default SacredAartiTimekeeperModal;
