import React from 'react';
import { X, PhoneCall, Hospital, Wind, BedDouble, ShieldCheck } from 'lucide-react';
import { NH7_MEDICAL_POSTS } from '../services/medicalDirectory';

interface MedicalDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalDirectoryModal: React.FC<MedicalDirectoryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto pb-safe shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-100">
                NH-7 Medical Relief Directory
              </h2>
              <p className="text-xs text-stone-400">
                Offline High-Altitude Hospitals & Oxygen Stations
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

        {/* Info Banner */}
        <div className="mt-3.5 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-200 text-xs flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            Verified emergency landlines work even during severe mountain mobile tower blackouts.
          </span>
        </div>

        {/* Hospital Cards List */}
        <div className="mt-4 space-y-3">
          {NH7_MEDICAL_POSTS.map(post => (
            <div
              key={post.id}
              className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-stone-700 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {post.name}
                  </h3>
                  <div className="text-[11px] text-stone-400 flex items-center gap-1.5 mt-0.5">
                    <span>📍 {post.location}</span>
                    <span>•</span>
                    <span className="font-mono text-amber-400 font-bold">{post.altitudeMeters}m</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 shrink-0">
                  +{post.distanceFromRishikeshKm} km
                </span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                {post.hasOxygenCylinders && (
                  <span className="px-2 py-0.5 rounded-md bg-sky-950 text-sky-300 border border-sky-800 flex items-center gap-1 font-bold">
                    <Wind className="w-3 h-3" />
                    O₂ Cylinders Available
                  </span>
                )}
                {post.hasEmergencyBeds && (
                  <span className="px-2 py-0.5 rounded-md bg-teal-950 text-teal-300 border border-teal-800 flex items-center gap-1 font-bold">
                    <BedDouble className="w-3 h-3" />
                    24/7 Emergency Beds
                  </span>
                )}
              </div>

              {/* Notes */}
              <p className="text-[11px] text-stone-300 leading-relaxed bg-stone-900/60 p-2 rounded-xl border border-stone-800/60">
                {post.notes}
              </p>

              {/* Action Dialer Buttons */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${post.primaryPhone.replace(/[^0-9]/g, '')}`}
                  className="flex-1 min-h-[44px] px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md tap-active"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call {post.primaryPhone}</span>
                </a>
                {post.altPhone && (
                  <a
                    href={`tel:${post.altPhone.replace(/[^0-9]/g, '')}`}
                    className="min-h-[44px] px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-semibold text-xs flex items-center justify-center gap-1 tap-active"
                  >
                    <span>Alt: {post.altPhone}</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
