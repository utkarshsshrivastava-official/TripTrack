import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Sun, 
  CloudSnow, 
  Luggage, 
  Check, 
  HeartHandshake,
  Shirt
} from 'lucide-react';
import { DAILY_OUTFIT_GUIDANCE } from '../../../shared/config/trip.config';
import { PILGRIMAGE_DAYS } from './DaySelectorStrip';

interface OutfitWeatherAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDayId: string;
}

export const OutfitWeatherAdvisorModal: React.FC<OutfitWeatherAdvisorModalProps> = ({
  isOpen,
  onClose,
  selectedDayId
}) => {
  const [activeDayId, setActiveDayId] = useState<string>(() => {
    return selectedDayId !== 'all' ? selectedDayId : 'day-4';
  });

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const currentGuidance = DAILY_OUTFIT_GUIDANCE.find(g => g.dayId === activeDayId) || DAILY_OUTFIT_GUIDANCE[3];
  const dayDef = PILGRIMAGE_DAYS.find(d => d.id === activeDayId) || PILGRIMAGE_DAYS[4];

  const toggleCheck = (item: string) => {
    const key = `${activeDayId}_${item}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isColdDay = activeDayId === 'day-3' || activeDayId === 'day-4' || activeDayId === 'day-5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-sky-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-sky-950/40 to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400 flex items-center justify-center">
              <Shirt className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>Outfit & Weather Dress-Code Advisor</span>
              </h3>
              <p className="text-[11px] text-sky-400 font-medium">
                Daily Clothing, Elder Warmth & Sacred Dress Etiquette
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
          {/* Day Pills Scroller */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            {PILGRIMAGE_DAYS.filter(d => d.id !== 'all').map((d) => {
              const isSelected = activeDayId === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveDayId(d.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1.5 tap-active ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-md font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{d.badgeIcon}</span>
                  <span>Day {d.dayNumber}: {d.dateStr}</span>
                </button>
              );
            })}
          </div>

          {/* Weather & Climate Overview Card */}
          <div className={`p-4 rounded-2xl border shadow-lg space-y-2 ${
            isColdDay
              ? 'bg-gradient-to-br from-sky-950/50 via-slate-900 to-slate-950 border-sky-500/40 shadow-sky-950/20'
              : 'bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border-amber-500/30 shadow-amber-950/20'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isColdDay ? (
                  <CloudSnow className="w-5 h-5 text-sky-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
                <div>
                  <h4 className="text-sm font-black text-white">
                    Day {dayDef.dayNumber}: {dayDef.destination}
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {dayDef.weatherOverview}
                  </p>
                </div>
              </div>

              <span className={`text-xs font-mono font-black px-2.5 py-1 rounded-xl border ${
                isColdDay
                  ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                  : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
              }`}>
                {currentGuidance.tempRange}
              </span>
            </div>

            {currentGuidance.specialNote && (
              <div className="text-[11px] text-amber-300 pt-1.5 border-t border-slate-800/80 flex items-start gap-1.5 leading-snug">
                <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{currentGuidance.specialNote}</span>
              </div>
            )}
          </div>

          {/* Elder Father Guidance Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-wide">
              <HeartHandshake className="w-4 h-4" />
              <span>For Fathers (Rajnish Ji & Sanjay Ji)</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {currentGuidance.elderWear}
            </p>
          </div>

          {/* Sons Guidance Card */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-sky-400 uppercase tracking-wide">
              <Shirt className="w-4 h-4" />
              <span>For Sons (Utkarsh & Shreyas)</span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              {currentGuidance.sonsWear}
            </p>
          </div>

          {/* Day Bag Essentials Checklist */}
          <div className="space-y-2">
            <div className="text-xs font-black text-white uppercase tracking-wider px-1 flex items-center gap-1.5">
              <Luggage className="w-3.5 h-3.5 text-purple-400" />
              <span>In Hand-Bag / Day Pouch</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentGuidance.dayBagEssentials.map((item, idx) => {
                const key = `${activeDayId}_${item}`;
                const isChecked = !!checkedItems[key];

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => toggleCheck(item)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between gap-2 transition-all tap-active ${
                      isChecked
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{item}</span>
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footwear Guide */}
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-1">
            <strong className="text-white block font-bold">Recommended Footwear:</strong>
            <p className="text-slate-300 leading-snug">
              {currentGuidance.footwear}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tap-active"
          >
            Close Outfit Advisor
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutfitWeatherAdvisorModal;
