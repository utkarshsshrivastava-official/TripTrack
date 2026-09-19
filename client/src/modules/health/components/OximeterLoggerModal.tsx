import React, { useState, useEffect } from 'react';
import { X, HeartPulse, Activity, AlertTriangle, CheckCircle2, History, Plus } from 'lucide-react';
import { TRAVELLERS_CONFIG, getTravellerById } from '../../../shared/config/travellers.config';
import { useUserProfile } from '../../../shared/hooks/useUserProfile';
import { OximeterReading } from '../types/health.types';
import { 
  getOximeterReadings, 
  saveOximeterReading 
} from '../services/oximeterStorage';

interface OximeterLoggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTravellerId?: string;
  currentAltitude?: number;
  currentLocationName?: string;
}

export const OximeterLoggerModal: React.FC<OximeterLoggerModalProps> = ({
  isOpen,
  onClose,
  defaultTravellerId,
  currentAltitude = 1890,
  currentLocationName = 'Joshimath (Acclimatization Hub)'
}) => {
  const { activeUser } = useUserProfile();
  const isDuoB = activeUser.id === 'traveller-shreyas' || activeUser.id === 'traveller-sanjay' || activeUser.duoId === 'DUO_B';
  const preferredElder = isDuoB ? 'traveller-sanjay' : 'traveller-rajnish';
  const initialTraveller = defaultTravellerId || (activeUser.isElder ? activeUser.id : preferredElder);

  const [selectedTravellerId, setSelectedTravellerId] = useState<string>(initialTraveller);

  useEffect(() => {
    if (isOpen) {
      setSelectedTravellerId(defaultTravellerId || (activeUser.isElder ? activeUser.id : preferredElder));
    }
  }, [isOpen, defaultTravellerId, activeUser.id, preferredElder, activeUser.isElder]);

  const [spo2, setSpo2] = useState<number>(95);
  const [pulseBpm, setPulseBpm] = useState<number>(76);
  const [notes, setNotes] = useState<string>('');
  const [readings, setReadings] = useState<OximeterReading[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadReadings();
    }
  }, [isOpen, selectedTravellerId]);

  const loadReadings = async () => {
    const list = await getOximeterReadings(selectedTravellerId);
    setReadings(list);
  };

  if (!isOpen) return null;

  const selectedTraveller = getTravellerById(selectedTravellerId);

  // Status calculation
  const isHighAltitude = currentAltitude >= 2500;
  let status: 'NORMAL' | 'BORDERLINE' | 'WARNING' = 'NORMAL';
  if (isHighAltitude) {
    if (spo2 < 85) status = 'WARNING';
    else if (spo2 < 90) status = 'BORDERLINE';
  } else {
    if (spo2 < 89) status = 'WARNING';
    else if (spo2 < 94) status = 'BORDERLINE';
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveOximeterReading({
        travellerId: selectedTravellerId,
        spo2,
        pulseBpm,
        altitudeMeters: currentAltitude,
        locationName: currentLocationName,
        notes
      });
      setNotes('');
      await loadReadings();
      setShowHistory(true);
    } catch (err) {
      console.error('Failed to save oximeter reading:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto pb-safe shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <HeartPulse className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 flex items-center gap-2">
                Pulse Oximeter & SpO₂
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                  {currentAltitude}m
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Altitude Oxygen Monitor for Senior Pilgrims
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

        {/* Tab Switcher: Log Reading vs Recent History */}
        <div className="grid grid-cols-2 p-1 bg-stone-950 rounded-xl border border-stone-800 mt-3 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setShowHistory(false)}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              !showHistory
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>New Reading</span>
          </button>
          <button
            type="button"
            onClick={() => setShowHistory(true)}
            className={`py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              showHistory
                ? 'bg-amber-500 text-stone-950 font-bold shadow-md'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History ({readings.length})</span>
          </button>
        </div>

        {!showHistory ? (
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            {/* Pilgrim Selection */}
            <div>
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                Pilgrim / Family Member
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TRAVELLERS_CONFIG.map(t => {
                  const isSelected = t.id === selectedTravellerId;
                  return (
                    <button
                      type="button"
                      key={t.id}
                      onClick={() => setSelectedTravellerId(t.id)}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all tap-active ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-white font-bold ring-1 ring-amber-500/50'
                          : 'bg-stone-800/60 border-stone-700/60 text-stone-300'
                      }`}
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-white text-xs shrink-0"
                        style={{ backgroundColor: t.avatarColor }}
                      >
                        {t.name.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs truncate font-semibold flex items-center gap-1">
                          <span>{t.name}</span>
                          {t.id === activeUser.id && (
                            <span className="text-[9px] px-1 rounded bg-amber-500/30 text-amber-300 font-extrabold">You</span>
                          )}
                          {t.id === preferredElder && t.id !== activeUser.id && (
                            <span className="text-[9px] px-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold">Your Elder</span>
                          )}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {t.isSeniorCitizen ? 'Senior Elder' : 'Coordinator'}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Visual Oxygen Gauge Card */}
            <div className={`p-4 rounded-2xl border text-center transition-all ${
              status === 'NORMAL'
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                : status === 'BORDERLINE'
                ? 'bg-amber-950/40 border-amber-700/60 text-amber-200'
                : 'bg-rose-950/50 border-rose-600 text-rose-100 animate-pulse'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                {status === 'NORMAL' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {status === 'BORDERLINE' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {status === 'WARNING' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                <span className="text-xs font-bold uppercase tracking-wider">
                  {status === 'NORMAL' && 'Optimal Mountain Oxygenation'}
                  {status === 'BORDERLINE' && 'Borderline — Sip Water & Rest 10 Min'}
                  {status === 'WARNING' && 'Low SpO₂ Warning — Stop & Rest, Alert Team'}
                </span>
              </div>

              <div className="flex items-baseline justify-center gap-6 my-2">
                <div>
                  <div className="text-4xl font-black font-mono tracking-tight text-white">
                    {spo2}%
                  </div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase mt-0.5">SpO₂ Oxygen</div>
                </div>
                <div className="w-px h-10 bg-stone-700/60"></div>
                <div>
                  <div className="text-4xl font-black font-mono tracking-tight text-white">
                    {pulseBpm}
                  </div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase mt-0.5">Heart Rate BPM</div>
                </div>
              </div>

              <p className="text-[11px] opacity-80 mt-1">
                {isHighAltitude 
                  ? `At ${currentAltitude}m (above 2,500m), SpO₂ naturally sits between 90-95%.` 
                  : 'Normal plains resting SpO₂ is 95-99%.'}
              </p>
            </div>

            {/* Quick Increment Steppers */}
            <div className="grid grid-cols-2 gap-3">
              {/* SpO2 Control */}
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <span className="text-[11px] font-bold text-stone-300 block">SpO₂ Finger Reading</span>
                <div className="flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => setSpo2(prev => Math.max(75, prev - 1))}
                    className="tap-active w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-black text-lg flex items-center justify-center border border-stone-700"
                  >
                    -
                  </button>
                  <span className="text-xl font-mono font-black text-white">{spo2}%</span>
                  <button
                    type="button"
                    onClick={() => setSpo2(prev => Math.min(100, prev + 1))}
                    className="tap-active w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-black text-lg flex items-center justify-center border border-stone-700"
                  >
                    +
                  </button>
                </div>
                <input
                  type="range"
                  min={75}
                  max={100}
                  value={spo2}
                  onChange={e => setSpo2(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Pulse BPM Control */}
              <div className="p-3 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <span className="text-[11px] font-bold text-stone-300 block">Pulse Rate (BPM)</span>
                <div className="flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => setPulseBpm(prev => Math.max(45, prev - 2))}
                    className="tap-active w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-black text-lg flex items-center justify-center border border-stone-700"
                  >
                    -
                  </button>
                  <span className="text-xl font-mono font-black text-white">{pulseBpm}</span>
                  <button
                    type="button"
                    onClick={() => setPulseBpm(prev => Math.min(160, prev + 2))}
                    className="tap-active w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-black text-lg flex items-center justify-center border border-stone-700"
                  >
                    +
                  </button>
                </div>
                <input
                  type="range"
                  min={45}
                  max={160}
                  value={pulseBpm}
                  onChange={e => setPulseBpm(Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Elder Context & Notes */}
            <div>
              <label className="text-[11px] font-bold text-stone-400 block mb-1">
                Elder Observations & Symptoms (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="e.g. Mild headache, took ORS, rested 15 mins"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Save Reading Button */}
            <button
              type="submit"
              disabled={isSaving}
              className="w-full tap-active min-h-[48px] rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Activity className="w-4 h-4 stroke-[2.5]" />
              <span>{isSaving ? 'Logging Reading...' : `Save SpO₂ for ${selectedTraveller?.name || 'Elder'}`}</span>
            </button>
          </form>
        ) : (
          /* Recent History List */
          <div className="mt-4 space-y-2.5">
            {readings.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs">
                No logs recorded yet for {selectedTraveller?.name}. Tap "New Reading" to begin.
              </div>
            ) : (
              readings.map(r => (
                <div
                  key={r.id}
                  className="p-3 rounded-2xl bg-stone-950/80 border border-stone-800/80 flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-100 text-sm">{r.travellerName}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        r.status === 'NORMAL'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                          : r.status === 'BORDERLINE'
                          ? 'bg-amber-950 text-amber-300 border-amber-800'
                          : 'bg-rose-950 text-rose-300 border-rose-800'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 flex items-center gap-2">
                      <span>📍 {r.locationName || 'En route'}</span>
                      {r.altitudeMeters && (
                        <span>• ⛰️ {r.altitudeMeters}m</span>
                      )}
                    </div>
                    {r.notes && (
                      <p className="text-[11px] text-stone-300 italic">"{r.notes}"</p>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black font-mono text-white">
                      {r.spo2}%
                    </div>
                    <div className="text-[10px] font-mono text-stone-400">
                      Pulse: {r.pulseBpm} bpm
                    </div>
                    <div className="text-[9px] text-stone-500">
                      {new Date(r.recordedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
