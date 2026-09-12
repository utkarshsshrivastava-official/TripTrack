import React, { useState, useEffect } from 'react';
import { X, Droplets, Pill, Bell, Check, Clock, Volume2, Sparkles } from 'lucide-react';
import { MedicationSchedule } from '../types/health.types';
import {
  getHydrationCountdown,
  recordHydrationIntake,
  playHydrationChime,
  getMedicationSchedules,
  toggleMedicationTaken
} from '../services/hydrationMedsStorage';
import { useUserProfile } from '../../../shared/hooks/useUserProfile';

interface HydrationMedsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HydrationMedsModal: React.FC<HydrationMedsModalProps> = ({ isOpen, onClose }) => {
  const { activeUser } = useUserProfile();
  const [countdown, setCountdown] = useState(getHydrationCountdown());
  const [medSchedules, setMedSchedules] = useState<MedicationSchedule[]>([]);
  const [justDrank, setJustDrank] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) return;

    loadSchedules();
    const timer = setInterval(() => {
      setCountdown(getHydrationCountdown());
    }, 15000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const loadSchedules = async () => {
    const data = await getMedicationSchedules();
    setMedSchedules(data);
  };

  if (!isOpen) return null;

  const handleDrinkWater = () => {
    recordHydrationIntake();
    setCountdown(getHydrationCountdown());
    setJustDrank(true);
    setTimeout(() => setJustDrank(false), 3000);
  };

  const handleToggleMed = async (travellerId: string, slot: 'MORNING' | 'EVENING') => {
    await toggleMedicationTaken(travellerId, slot, activeUser.name);
    await loadSchedules();
  };

  const progressPercent = Math.max(0, Math.min(100, Math.round(((90 - countdown.minutesRemaining) / 90) * 100)));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto pb-safe shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500/20 to-teal-500/20 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <Droplets className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 flex items-center gap-1.5">
                Hydration & BP Meds Cadence
              </h2>
              <p className="text-xs text-stone-400">
                Mountain Acclimatization Routine for Elders
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="tap-active p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-5">
          {/* Section 1: 90-Minute Hydration Countdown Ring */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-950/40 via-stone-950 to-stone-900 border border-sky-800/40 shadow-inner">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5" />
                  90-Min Water & ORS Rhythm
                </span>
              </div>
              <button
                type="button"
                onClick={() => playHydrationChime()}
                className="text-[10px] text-stone-400 hover:text-sky-300 flex items-center gap-1 tap-active px-2 py-1 rounded-md bg-stone-800/60"
                title="Preview Chime Sound"
              >
                <Volume2 className="w-3 h-3" />
                <span>Play Chime</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-4 py-2">
              <div className="space-y-1 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono tracking-tight text-white">
                    {countdown.minutesRemaining}
                  </span>
                  <span className="text-xs font-bold text-sky-300 uppercase">
                    min remaining
                  </span>
                </div>
                <p className="text-[11px] text-stone-400 leading-tight">
                  Last intake recorded at: <strong className="text-stone-200">{countdown.lastDrinkTimeStr}</strong>
                </p>
              </div>

              {/* Quick Action Drink Button */}
              <button
                type="button"
                onClick={handleDrinkWater}
                className="min-h-[48px] px-4 rounded-xl bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-400 hover:to-teal-400 text-stone-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-sky-500/20 tap-active"
              >
                <Droplets className="w-4 h-4 fill-stone-950" />
                <span>{justDrank ? 'Logged! 🙏' : 'Drank Water Now'}</span>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-stone-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-sky-500 to-teal-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-stone-500 mt-1">
                <span>0m (Fresh Hydration)</span>
                <span>90m (Interval Cadence)</span>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-xl bg-stone-900/80 border border-stone-800 text-[11px] text-stone-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <span>
                <strong>Why 90 minutes?</strong> In thin Himalayan air, respiration rate rises, dehydrating elders 2x faster. Regular 200ml sips keep blood viscosity safe on high passes.
              </span>
            </div>
          </div>

          {/* Section 2: Daily BP Medication Checklist */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Pill className="w-4 h-4 text-amber-400" />
                Senior BP & Daily Meds Tracker
              </h3>
              <span className="text-[10px] font-mono text-stone-400">
                Today: {new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
              </span>
            </div>

            <div className="space-y-3">
              {medSchedules.map(sched => (
                <div
                  key={sched.travellerId}
                  className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-white block">
                        {sched.travellerName}
                      </span>
                      <span className="text-[10px] text-stone-400">
                        Prescribed: {sched.dailyMeds.join(' • ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    {/* Morning Slot */}
                    <button
                      type="button"
                      onClick={() => handleToggleMed(sched.travellerId, 'MORNING')}
                      className={`min-h-[48px] p-2.5 rounded-xl border text-left flex items-center justify-between transition-all tap-active ${
                        sched.morningTaken
                          ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-200'
                          : 'bg-stone-900 border-stone-700/70 text-stone-300 hover:border-stone-600'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>Morning Dose</span>
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {sched.morningTaken ? `Taken at ${sched.morningTakenAt}` : 'Pending intake'}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        sched.morningTaken ? 'bg-emerald-500 text-stone-950' : 'border border-stone-600'
                      }`}>
                        {sched.morningTaken && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>

                    {/* Evening Slot */}
                    <button
                      type="button"
                      onClick={() => handleToggleMed(sched.travellerId, 'EVENING')}
                      className={`min-h-[48px] p-2.5 rounded-xl border text-left flex items-center justify-between transition-all tap-active ${
                        sched.eveningTaken
                          ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-200'
                          : 'bg-stone-900 border-stone-700/70 text-stone-300 hover:border-stone-600'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-sky-400" />
                          <span>Evening Dose</span>
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {sched.eveningTaken ? `Taken at ${sched.eveningTakenAt}` : 'Pending intake'}
                        </div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        sched.eveningTaken ? 'bg-emerald-500 text-stone-950' : 'border border-stone-600'
                      }`}>
                        {sched.eveningTaken && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
