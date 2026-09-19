import React, { useState, useEffect } from 'react';
import { 
  X, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  Send, 
  ShieldAlert,
  Car,
  Waves,
  Mountain,
  CheckCircle2
} from 'lucide-react';
import { 
  CORRIDOR_STRETCHES, 
  RouteAlert, 
  submitFamilySpotterReport 
} from '../services/routeAlertStorage';
import { TRAVELLERS_CONFIG } from '../../../shared/config/travellers.config';
import { useUserProfile } from '../../../shared/hooks/useUserProfile';

interface ReportObstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted: (report: RouteAlert) => void;
}

export const ReportObstructionModal: React.FC<ReportObstructionModalProps> = ({
  isOpen,
  onClose,
  onReportSubmitted
}) => {
  const { activeUser } = useUserProfile();
  const defaultReporterId = (activeUser.id === 'traveller-shreyas' || activeUser.id === 'traveller-sanjay' || activeUser.duoId === 'DUO_B')
    ? 'traveller-shreyas'
    : 'traveller-utkarsh';

  const [selectedStretch, setSelectedStretch] = useState<string>(CORRIDOR_STRETCHES[2]); // Devprayag - Rudraprayag
  const [locationName, setLocationName] = useState<string>('Near Sirobagarh (NH-7 Km 92)');
  const [eventType, setEventType] = useState<RouteAlert['eventType']>('LANDSLIDE');
  const [severity, setSeverity] = useState<RouteAlert['severity']>('MODERATE');
  const [delayEstimate, setDelayEstimate] = useState<string>('+30 min');
  const [note, setNote] = useState<string>('');
  const [reportingTravellerId, setReportingTravellerId] = useState<string>(defaultReporterId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setReportingTravellerId(defaultReporterId);
    }
  }, [isOpen, defaultReporterId]);

  if (!isOpen) return null;

  const eventTypes: Array<{
    type: RouteAlert['eventType'];
    label: string;
    icon: any;
    defaultSeverity: RouteAlert['severity'];
  }> = [
    { type: 'LANDSLIDE', label: 'Landslide / Rocks', icon: Mountain, defaultSeverity: 'CRITICAL' },
    { type: 'HEAVY_JAM', label: 'Traffic Jam', icon: Car, defaultSeverity: 'MODERATE' },
    { type: 'FLASH_FLOOD', label: 'Water / Mud', icon: Waves, defaultSeverity: 'CRITICAL' },
    { type: 'ROAD_BLOCKED', label: 'Police / BRO Halt', icon: ShieldAlert, defaultSeverity: 'MODERATE' },
    { type: 'CLEAR', label: 'Cleared / Moving', icon: CheckCircle2, defaultSeverity: 'NORMAL' }
  ];

  const delayPresets = ['+15 min', '+30 min', '+1 hour', '+2 hours', 'Indefinite / Halt'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName.trim()) return;

    setIsSubmitting(true);
    const reporter = TRAVELLERS_CONFIG.find(t => t.id === reportingTravellerId);
    const reporterName = reporter ? reporter.name : 'Pilgrim Spotter';

    let headline = '';
    if (eventType === 'CLEAR') {
      headline = `🟢 Road cleared at ${locationName}; Traffic resuming`;
    } else if (eventType === 'LANDSLIDE') {
      headline = `🪨 Landslide / Falling stones reported at ${locationName}`;
    } else if (eventType === 'HEAVY_JAM') {
      headline = `🚗 Heavy traffic queue at ${locationName} (~${delayEstimate})`;
    } else {
      headline = `⚠️ Obstruction logged at ${locationName} (~${delayEstimate})`;
    }

    const summaryText = note.trim()
      ? `${note.trim()} (Reported by ${reporterName}, estimated delay: ${delayEstimate})`
      : `Reported by ${reporterName} on the road. Estimated delay: ${delayEstimate}. Caution advised for approaching vehicles.`;

    try {
      const savedReport = await submitFamilySpotterReport({
        stretch: selectedStretch,
        location: locationName.trim(),
        eventType,
        severity,
        status: eventType === 'CLEAR' ? 'ALL_CLEAR' : severity === 'CRITICAL' ? 'ACTIVE_BLOCK' : 'OPEN_CAUTION',
        headline,
        summary: summaryText,
        broClearanceETA: `Delay est: ${delayEstimate}`,
        source: `Family Spotter (${reporterName})`,
        reportedBy: reporterName
      });

      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([40, 60, 40]);
      }

      onReportSubmitted(savedReport);
      onClose();
    } catch (err) {
      console.error('Failed to submit report', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl bg-slate-950 border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in slide-in-from-bottom-8 duration-300"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-amber-950/60 via-slate-900 to-rose-950/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span>Family Road Spotter</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Offline Sync
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Log mountain highway blockages to alert the family
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors tap-active"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Reporter Selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Who is Reporting?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {TRAVELLERS_CONFIG.filter(t => t.role === 'COORDINATOR').map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setReportingTravellerId(t.id)}
                  className={`p-2.5 rounded-xl border text-left font-bold transition-all tap-active flex items-center gap-2 ${
                    reportingTravellerId === t.id
                      ? 'bg-purple-600/30 border-purple-500 text-white'
                      : 'bg-slate-900 border-white/10 text-slate-300 hover:border-white/20'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: t.avatarColor }} />
                  <span className="truncate">{t.name}</span>
                  {t.id === defaultReporterId && (
                    <span className="text-[9px] px-1 rounded bg-purple-500/30 text-purple-200 font-extrabold ml-auto">
                      You
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Obstruction Type Chips */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Obstruction Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {eventTypes.map(item => {
                const Icon = item.icon;
                const isSelected = eventType === item.type;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => {
                      setEventType(item.type);
                      setSeverity(item.defaultSeverity);
                    }}
                    className={`p-2.5 rounded-xl border font-bold transition-all tap-active flex items-center gap-2 ${
                      isSelected
                        ? 'bg-amber-500/30 border-amber-400 text-amber-100 shadow-md shadow-amber-950'
                        : 'bg-slate-900 border-white/10 text-slate-300 hover:border-white/20'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 text-amber-400" />
                    <span className="text-[11px] truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Highway Stretch Dropdown */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-amber-400" />
              <span>Corridor Stretch (NH-7)</span>
            </label>
            <select
              value={selectedStretch}
              onChange={e => setSelectedStretch(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-medium focus:outline-none focus:border-amber-500"
            >
              {CORRIDOR_STRETCHES.map(stretch => (
                <option key={stretch} value={stretch}>
                  {stretch}
                </option>
              ))}
            </select>
          </div>

          {/* Location Landmark Text */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Specific Landmark / Milestone
            </label>
            <input
              type="text"
              value={locationName}
              onChange={e => setLocationName(e.target.value)}
              placeholder="e.g. Near Sirobagarh / Patalganga / Govindghat"
              className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-medium focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          {/* Estimated Delay Chips */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Estimated Delay</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
              {delayPresets.map(preset => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setDelayEstimate(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all tap-active ${
                    delayEstimate === preset
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-slate-900 border border-white/10 text-slate-300 hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Optional Note */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Observation Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Single lane moving slowly, JCB active on left side..."
              className="w-full p-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !locationName.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-950/60 transition-all tap-active disabled:opacity-50 min-h-[48px]"
          >
            <Send className="w-4 h-4" />
            <span>{isSubmitting ? 'Logging to Dexie...' : 'Publish Highway Alert'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
