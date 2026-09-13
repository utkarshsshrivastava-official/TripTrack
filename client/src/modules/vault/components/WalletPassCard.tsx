import React, { useState } from 'react';
import { TravelDocument, DocumentCategory } from '../../../shared/types';
import { TRAVELLERS_CONFIG } from '../../../shared/config/travellers.config';
import {
  QrCode,
  Train,
  Plane,
  Building,
  Shield,
  Copy,
  Check,
  Trash2,
  CheckCircle2,
  Barcode
} from 'lucide-react';

interface WalletPassCardProps {
  document: TravelDocument;
  onOpenViewer: (doc: TravelDocument) => void;
  onDelete: (e: React.MouseEvent, docId: string) => void;
}

export const WalletPassCard: React.FC<WalletPassCardProps> = ({
  document: doc,
  onOpenViewer,
  onDelete
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const traveller = TRAVELLERS_CONFIG.find(t => t.id === doc.passengerId);

  const handleCopy = (e: React.MouseEvent, text: string, key: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Category-specific luxury styles & icons
  const getCategoryConfig = (category: DocumentCategory) => {
    switch (category) {
      case 'YATRA_PASS':
        return {
          gradient: 'from-amber-500/15 via-amber-950/30 to-slate-950',
          border: 'border-amber-500/50 hover:border-amber-400',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
          accentText: 'text-amber-400',
          icon: QrCode,
          label: 'Sacred Yatra Pass'
        };
      case 'TRAIN_TICKET':
        return {
          gradient: 'from-indigo-500/15 via-indigo-950/30 to-slate-950',
          border: 'border-indigo-500/50 hover:border-indigo-400',
          badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          accentText: 'text-indigo-400',
          icon: Train,
          label: 'Rajdhani Express'
        };
      case 'FLIGHT_PASS':
        return {
          gradient: 'from-sky-500/15 via-sky-950/30 to-slate-950',
          border: 'border-sky-500/50 hover:border-sky-400',
          badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          accentText: 'text-sky-400',
          icon: Plane,
          label: 'Flight Boarding Pass'
        };
      case 'HOTEL_VOUCHER':
        return {
          gradient: 'from-emerald-500/15 via-emerald-950/30 to-slate-950',
          border: 'border-emerald-500/50 hover:border-emerald-400',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          accentText: 'text-emerald-400',
          icon: Building,
          label: 'Hotel Lodge Voucher'
        };
      case 'ID_CARD':
      default:
        return {
          gradient: 'from-slate-700/15 via-slate-900 to-slate-950',
          border: 'border-slate-700 hover:border-slate-600',
          badgeBg: 'bg-slate-800 text-slate-300 border-slate-700',
          accentText: 'text-slate-300',
          icon: Shield,
          label: 'Government ID'
        };
    }
  };

  const config = getCategoryConfig(doc.category);
  const Icon = config.icon;

  const primaryIdentifier = doc.parsedData?.yatraRegistrationNo || doc.parsedData?.pnr;
  const identifierLabel = doc.parsedData?.yatraRegistrationNo ? 'REGISTRATION ID' : doc.parsedData?.pnr ? 'PNR NUMBER' : null;

  return (
    <div
      onClick={() => onOpenViewer(doc)}
      className={`tap-active relative rounded-3xl border bg-gradient-to-b ${config.gradient} ${config.border} shadow-xl transition-all cursor-pointer overflow-hidden group`}
    >
      {/* Top Pass Header */}
      <div className="p-4 pb-3">
        <div className="flex items-center justify-between gap-2">
          {/* Category Chip */}
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider ${config.badgeBg}`}>
            <Icon className="w-3 h-3" />
            <span>{config.label}</span>
          </span>

          {/* 100% Offline Dexie Pill */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-700/70">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
            <span>Dexie Cached</span>
          </span>
        </div>

        {/* Pass Title */}
        <h3 className="text-sm font-black text-white mt-2.5 line-clamp-1 leading-snug">
          {doc.title}
        </h3>

        {/* Pilgrim Identity Chip */}
        <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-300">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] text-white shadow-xs"
            style={{ backgroundColor: traveller?.avatarColor || '#64748B' }}
          >
            {traveller?.name?.charAt(0) || 'P'}
          </div>
          <span className="font-semibold text-white">
            {traveller?.name || 'General Pass'}
          </span>
          {traveller?.role === 'ELDER' && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-300 border border-rose-800/60">
              Elder
            </span>
          )}
          <span className="text-slate-500">•</span>
          <span className="text-[10px] text-slate-400 font-medium">
            {traveller?.duoId === 'DUO_A' ? 'Family A' : traveller?.duoId === 'DUO_B' ? 'Family B' : 'Home'}
          </span>
        </div>
      </div>

      {/* Scalloped Perforation Tear Line (Apple Wallet Aesthetic) */}
      <div className="relative flex items-center justify-between my-1">
        {/* Left Circular Scallop Cutout */}
        <div className="absolute -left-3 w-6 h-6 rounded-full bg-slate-950 border border-slate-800 shadow-inner" />
        {/* Perforated Dashed Line */}
        <div className="w-full border-b border-dashed border-slate-700/60 mx-4" />
        {/* Right Circular Scallop Cutout */}
        <div className="absolute -right-3 w-6 h-6 rounded-full bg-slate-950 border border-slate-800 shadow-inner" />
      </div>

      {/* Lower Ticket Stub (Biometric / Transit Details) */}
      <div className="p-4 pt-3 space-y-3 bg-slate-950/40">
        {/* Primary Identifier Box (PNR or Yatra Reg No) */}
        {primaryIdentifier && identifierLabel ? (
          <div className="p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-2 shadow-inner">
            <div>
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                {identifierLabel}
              </span>
              <strong className="text-sm font-mono font-black text-white tracking-wider block">
                {primaryIdentifier}
              </strong>
            </div>
            <button
              onClick={(e) => handleCopy(e, primaryIdentifier, `id-${doc.id}`)}
              className="tap-active p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all border border-slate-700/80"
              title="Copy to clipboard"
            >
              {copiedKey === `id-${doc.id}` ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400" />
              )}
            </button>
          </div>
        ) : null}

        {/* Secondary Specs: Coach/Seat, Date, Destination */}
        {doc.parsedData && (
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            {doc.parsedData.seatNumber && (
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-[9px] text-slate-500 uppercase font-mono block">COACH / BERTH</span>
                <span className="text-slate-200 font-bold">{doc.parsedData.seatNumber}</span>
              </div>
            )}
            {doc.parsedData.validDate && (
              <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
                <span className="text-[9px] text-slate-500 uppercase font-mono block">DATE OF TRAVEL</span>
                <span className="text-slate-200 font-bold">{doc.parsedData.validDate}</span>
              </div>
            )}
          </div>
        )}

        {/* Stub Action Bar */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => onOpenViewer(doc)}
            className="tap-active flex-1 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all border border-slate-700"
          >
            {doc.category === 'YATRA_PASS' ? (
              <>
                <QrCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Present Turnstile QR</span>
              </>
            ) : (
              <>
                <Barcode className="w-3.5 h-3.5 text-sky-400" />
                <span>View Digital Pass</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => onDelete(e, doc.id)}
            className="tap-active p-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 border border-slate-800 hover:border-rose-800/60 transition-all"
            title="Delete pass from phone storage"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalletPassCard;
