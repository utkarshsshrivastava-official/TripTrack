import React, { useState } from 'react';
import { 
  X, 
  Banknote, 
  Wifi, 
  WifiOff, 
  MapPin, 
  Coins 
} from 'lucide-react';
import { DAILY_CASH_UPI_GUIDANCE } from '../../../shared/config/trip.config';
import { PILGRIMAGE_DAYS } from './DaySelectorStrip';

interface CashVsUpiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDayId: string;
}

export const CashVsUpiAdvisorModal: React.FC<CashVsUpiAdvisorModalProps> = ({
  isOpen,
  onClose,
  selectedDayId
}) => {
  const [activeDayId, setActiveDayId] = useState<string>(() => {
    return selectedDayId !== 'all' ? selectedDayId : 'day-4';
  });

  if (!isOpen) return null;

  const currentGuidance = DAILY_CASH_UPI_GUIDANCE.find(g => g.dayId === activeDayId) || DAILY_CASH_UPI_GUIDANCE[3];
  const dayDef = PILGRIMAGE_DAYS.find(d => d.id === activeDayId) || PILGRIMAGE_DAYS[4];

  const getUpiStatusBadge = (status: 'FULL_UPI' | 'INTERMITTENT' | 'CASH_MANDATORY') => {
    switch (status) {
      case 'FULL_UPI':
        return {
          icon: <Wifi className="w-4 h-4 text-emerald-400" />,
          label: 'UPI Working 100%',
          bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
        };
      case 'INTERMITTENT':
        return {
          icon: <Wifi className="w-4 h-4 text-amber-400" />,
          label: 'Patchy Signal • UPI Unreliable',
          bg: 'bg-amber-500/15 border-amber-500/40 text-amber-300'
        };
      case 'CASH_MANDATORY':
        return {
          icon: <WifiOff className="w-4 h-4 text-rose-400" />,
          label: 'Zero Signal • Hard Cash Mandatory',
          bg: 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse'
        };
    }
  };

  const statusBadge = getUpiStatusBadge(currentGuidance.upiReliability);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-emerald-950/40 to-slate-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
              <Banknote className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <span>Daily Hard Cash vs UPI Advisor</span>
              </h3>
              <p className="text-[11px] text-emerald-400 font-medium">
                Dead-Zone Connectivity & Dakshina Cash Forecaster
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
              const g = DAILY_CASH_UPI_GUIDANCE.find(guidance => guidance.dayId === d.id);
              const isCashHeavy = g?.upiReliability === 'CASH_MANDATORY';

              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setActiveDayId(d.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all border flex items-center gap-1.5 tap-active ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md font-black'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <span>{d.badgeIcon}</span>
                  <span>Day {d.dayNumber}</span>
                  {isCashHeavy && (
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Cash Recommendation Hero Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Day {dayDef.dayNumber}: {dayDef.destination}
                </span>
                <span className="text-xl font-black text-white font-mono">
                  {currentGuidance.recommendedCashINR}
                </span>
                <span className="text-[10px] text-emerald-400 block font-bold">
                  Recommended Physical Cash in Pocket
                </span>
              </div>

              {/* Status Badge */}
              <div className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-black flex items-center gap-1.5 ${statusBadge.bg}`}>
                {statusBadge.icon}
                <span>{statusBadge.label}</span>
              </div>
            </div>

            {/* Last Reliable ATM Warning */}
            <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 text-[11px] space-y-1">
              <div className="text-amber-400 font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Last Reliable ATM / Cash Point:</span>
              </div>
              <p className="text-slate-200 pl-4 font-medium leading-snug">
                {currentGuidance.lastAtmLocation}
              </p>
            </div>
          </div>

          {/* Primary Cash Expenses List */}
          <div className="space-y-2">
            <div className="text-xs font-black text-white uppercase tracking-wider px-1 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Where You Will Need Physical Cash</span>
            </div>

            <div className="space-y-1.5">
              {currentGuidance.primaryCashExpenses.map((exp, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 flex items-start gap-2"
                >
                  <span className="text-amber-400 font-bold shrink-0">•</span>
                  <span>{exp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Small Change / Denominations Tip */}
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black text-sky-400 uppercase tracking-wide">
              <Banknote className="w-4 h-4" />
              <span>Denomination & Change Advice</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentGuidance.denominationTip}
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
            Close Cash Advisor
          </button>
        </div>
      </div>
    </div>
  );
};

export default CashVsUpiAdvisorModal;
