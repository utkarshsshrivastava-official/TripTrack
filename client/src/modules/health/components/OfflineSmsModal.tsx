import React, { useState } from 'react';
import { X, MessageSquare, Copy, Check, Send, Smartphone, ShieldCheck } from 'lucide-react';
import { useUserProfile } from '../../../shared/hooks/useUserProfile';
import { DUO_CONFIG } from '../../../shared/config/travellers.config';

interface OfflineSmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLandmark?: string;
  currentAltitude?: number;
  latitude?: number;
  longitude?: number;
  batteryLevel?: number;
}

export const OfflineSmsModal: React.FC<OfflineSmsModalProps> = ({
  isOpen,
  onClose,
  currentLandmark = 'Joshimath (Alaknanda Gorge)',
  currentAltitude = 1890,
  latitude = 30.5564,
  longitude = 79.5661,
  batteryLevel = 82
}) => {
  const { activeUser } = useUserProfile();
  const [elderStatus, setElderStatus] = useState<string>('All well, resting comfortably & well-hydrated 🙏');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const familyName = activeUser.duoId ? DUO_CONFIG[activeUser.duoId].name : 'Family';
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Generate standardized, cellular-safe SMS body
  const smsBody = `TripTrack Reassurance Update (${timeStr})
From: ${activeUser.name} (${familyName})
Location: ${currentLandmark} (~${currentAltitude}m)
GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}
Battery: ${batteryLevel}%
Elder Health: ${elderStatus}
(Sent via 2G SMS from NH-7 mountain dead zone — All safe!)`;

  const encodedBody = encodeURIComponent(smsBody);
  const smsUri = `sms:?body=${encodedBody}`;
  const whatsappUri = `https://api.whatsapp.com/send?text=${encodedBody}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(smsBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const statusPresets = [
    'All well, resting comfortably & well-hydrated 🙏',
    'Tea & lunch break. Blood pressure & SpO₂ normal ☕',
    'Reaching night halt soon. Mobile signals intermittent 👍',
    'Taking short rest to acclimatize. No symptoms, all fine 😊'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto pb-safe shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100 flex items-center gap-1.5">
                Zero-Signal 2G SMS Dispatcher
              </h2>
              <p className="text-xs text-stone-400">
                Send Reassurance to Home Family Without Mobile Data
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

        {/* Explain Banner */}
        <div className="mt-3.5 p-3 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-xs flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Dead-Zone Resilience:</strong> In deep Himalayan gorges where 4G/5G mobile internet fails, plain cellular SMS still goes through over faint 2G signal towers.
          </span>
        </div>

        <div className="mt-4 space-y-4">
          {/* Quick Elder Status Selector */}
          <div>
            <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
              Elder Well-Being Status
            </label>
            <div className="space-y-1.5">
              {statusPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setElderStatus(preset)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all tap-active ${
                    elderStatus === preset
                      ? 'bg-amber-500/20 border-amber-500 text-white font-semibold'
                      : 'bg-stone-950/80 border-stone-800 text-stone-300 hover:border-stone-700'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Message Preview */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                SMS Preview
              </label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 tap-active"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 text-xs font-mono text-stone-300 whitespace-pre-line leading-relaxed shadow-inner">
              {smsBody}
            </div>
          </div>

          {/* Action Triggers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <a
              href={smsUri}
              className="min-h-[48px] px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 tap-active"
            >
              <Send className="w-4 h-4" />
              <span>Launch 2G Mobile SMS</span>
            </a>

            <a
              href={whatsappUri}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[48px] px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 tap-active"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp (If Signal Available)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
