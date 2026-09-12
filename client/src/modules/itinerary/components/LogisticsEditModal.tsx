import React, { useState } from 'react';
import { TripSegment, LogisticsInfo } from '../../../shared/types';
import { 
  X, 
  Phone, 
  Car, 
  MapPin, 
  User, 
  Save, 
  Check, 
  Copy,
  AlertCircle
} from 'lucide-react';

interface LogisticsEditModalProps {
  segment: TripSegment;
  isOpen: boolean;
  onClose: () => void;
  onSave: (segmentId: string, updatedLogistics: Partial<LogisticsInfo>) => Promise<void>;
}

export const LogisticsEditModal: React.FC<LogisticsEditModalProps> = ({
  segment,
  isOpen,
  onClose,
  onSave
}) => {
  const [driverName, setDriverName] = useState(segment.logistics.driverName || '');
  const [driverPhone, setDriverPhone] = useState(segment.logistics.driverPhone || '');
  const [identifier, setIdentifier] = useState(segment.logistics.identifier || '');
  const [pickupLocation, setPickupLocation] = useState(segment.logistics.pickupLocation || '');
  const [serviceName, setServiceName] = useState(segment.logistics.serviceName || '');
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(segment.id, {
        driverName: driverName.trim(),
        driverPhone: driverPhone.trim(),
        identifier: identifier.trim(),
        pickupLocation: pickupLocation.trim(),
        serviceName: serviceName.trim()
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = () => {
    const text = `TripTrack Cab Logistics (${segment.origin} -> ${segment.destination})\nService: ${serviceName}\nVehicle: ${identifier}\nDriver: ${driverName || 'Assigned'}\nPhone: ${driverPhone || 'N/A'}\nPickup: ${pickupLocation}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cleanPhone = driverPhone.replace(/[^0-9+]/g, '');
  const hasValidPhone = cleanPhone.length >= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Update Logistics & Cab Details
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {segment.origin} → {segment.destination}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 tap-active"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Call Action if Phone exists */}
        {hasValidPhone && (
          <div className="mx-4 mt-4 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-300">Driver on standby</div>
                <div className="text-xs font-mono font-bold text-white">{driverPhone}</div>
              </div>
            </div>
            <a
              href={`tel:${cleanPhone}`}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-900/40 tap-active min-h-[44px]"
            >
              <Phone className="w-4 h-4" />
              <span>Call Now</span>
            </a>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 space-y-3.5 overflow-y-auto">
          {/* Service / Agency Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Service / Agency Name
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={e => setServiceName(e.target.value)}
              placeholder="e.g. Dedicated Mountain Crysta / Savaari"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Vehicle Plate / Identifier */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Vehicle Plate / Identifier
            </label>
            <div className="relative">
              <Car className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                placeholder="e.g. UK-08-PA-4421 (Commercial Yellow Plate)"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Driver Name */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Driver Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={driverName}
                  onChange={e => setDriverName(e.target.value)}
                  placeholder="e.g. Virender Rawat"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Driver Phone */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Driver Phone (Tap to Call)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="tel"
                  value={driverPhone}
                  onChange={e => setDriverPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Pickup Location / Bay */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Pickup Point / Gate Bay
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                value={pickupLocation}
                onChange={e => setPickupLocation(e.target.value)}
                placeholder="e.g. Haridwar Hotel Porch / NDLS Ajmeri Gate"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Changes save to phone storage (<strong className="text-slate-200">Dexie IndexedDB</strong>) immediately so you can dial drivers even in complete cellular dead zones on NH-7.
            </span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={copyToClipboard}
              className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 tap-active min-h-[48px]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-temple-saffron to-amber-600 hover:from-orange-600 hover:to-amber-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 tap-active min-h-[48px]"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Logistics to Phone'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
