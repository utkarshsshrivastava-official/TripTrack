import { X, PhoneCall, HeartPulse, ShieldAlert, Mountain, Hospital, Smartphone } from 'lucide-react';
import { useTravellers } from '../shared/hooks/useTravellers';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMedicalDirectory?: () => void;
  onOpenOfflineSms?: () => void;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  onOpenMedicalDirectory,
  onOpenOfflineSms
}) => {
  const { elders } = useTravellers();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-alpine-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto pb-safe shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-950 border border-rose-600 text-rose-400">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">
                Elder Emergency & SOS
              </h2>
              <p className="text-xs text-rose-400 font-semibold">
                High-Altitude Pilgrimage Safety Protocols
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="tap-active p-2 rounded-full bg-slate-800 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Speed Dials */}
        <div className="mt-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Instant Dial — Uttarakhand Hill Responders
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="tel:108"
              className="tap-active flex items-center gap-2 p-3 rounded-xl bg-rose-900/60 border border-rose-600/80 text-rose-100 hover:bg-rose-900"
            >
              <PhoneCall className="w-4 h-4 text-rose-300 shrink-0" />
              <div>
                <div className="text-xs font-black">108 Ambulance</div>
                <div className="text-[10px] text-rose-300">Hill Disaster Rescue</div>
              </div>
            </a>
            <a
              href="tel:112"
              className="tap-active flex items-center gap-2 p-3 rounded-xl bg-amber-950/80 border border-amber-600/80 text-amber-100 hover:bg-amber-900"
            >
              <PhoneCall className="w-4 h-4 text-amber-300 shrink-0" />
              <div>
                <div className="text-xs font-black">112 Police / SDRF</div>
                <div className="text-[10px] text-amber-300">Chamoli Police Control</div>
              </div>
            </a>
            <a
              href="tel:1364"
              className="tap-active flex items-center gap-2 p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200"
            >
              <PhoneCall className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="text-xs font-black">1364 Yatra Helpline</div>
                <div className="text-[10px] text-slate-400">Roads & Weather State</div>
              </div>
            </a>
            <a
              href="tel:01372252102"
              className="tap-active flex items-center gap-2 p-3 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-200"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-xs font-black">Joshimath Base Hosp</div>
                <div className="text-[10px] text-slate-400">Civil Hospital Line</div>
              </div>
            </a>
          </div>

          {/* Quick Relief Directory & 2G SMS Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2.5">
            {onOpenMedicalDirectory && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenMedicalDirectory();
                }}
                className="min-h-[44px] p-2.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-700/80 text-emerald-200 text-xs font-bold flex items-center gap-2 tap-active shadow-sm"
              >
                <Hospital className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">NH-7 Hospital & O₂ Directory</span>
              </button>
            )}

            {onOpenOfflineSms && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenOfflineSms();
                }}
                className="min-h-[44px] p-2.5 rounded-xl bg-amber-950/70 hover:bg-amber-900/80 border border-amber-700/80 text-amber-200 text-xs font-bold flex items-center gap-2 tap-active shadow-sm"
              >
                <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
                <span className="truncate">Zero-Signal 2G SMS Dispatcher</span>
              </button>
            )}
          </div>
        </div>

        {/* Elder Medical Dossiers */}
        <div className="mt-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span>Senior Pilgrims Medical Dossier</span>
          </h3>

          <div className="space-y-3">
            {elders.map((elder) => (
              <div 
                key={elder.id}
                className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: elder.avatarColor }}
                    />
                    <span className="text-sm font-bold text-white">{elder.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono font-bold">
                      Age {elder.age}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                    Blood: {elder.bloodGroup}
                  </span>
                </div>

                {elder.elderCareNotes && (
                  <div className="text-xs space-y-1 text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <div className="text-amber-300 font-medium">
                      💊 <strong className="text-white">Daily Medication:</strong>{' '}
                      {elder.elderCareNotes.dailyMeds.join(', ')}
                    </div>
                    <div className="text-sky-300 font-medium">
                      🏔️ <strong className="text-white">Altitude Threshold:</strong>{' '}
                      {elder.elderCareNotes.altitudeAlertThresholdMeters}m (Alert on breathlessness)
                    </div>
                    <div className="text-slate-300 text-[11px] italic mt-1 pt-1 border-t border-slate-800">
                      ⚠️ {elder.elderCareNotes.specialCare}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* High-Altitude Rule Reminder */}
        <div className="mt-4 p-3 rounded-xl bg-sky-950/40 border border-sky-800/60 text-xs text-sky-200 flex items-start gap-2">
          <Mountain className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
          <div>
            <strong className="text-white">High-Altitude Rule (Badrinath 3,130m):</strong>{' '}
            Do not exert or climb steps quickly. Maintain warm hydration with ginger/clove water. If headache or dizziness occurs, descend immediately towards Joshimath (1,890m).
          </div>
        </div>

        {/* Close button */}
        <div className="mt-5">
          <button
            onClick={onClose}
            className="tap-active w-full py-3 rounded-xl bg-slate-800 text-white font-bold text-sm hover:bg-slate-700 transition-colors"
          >
            Close Emergency Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
