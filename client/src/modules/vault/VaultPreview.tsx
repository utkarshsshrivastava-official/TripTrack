import React, { useState } from 'react';
import { DuoId, TravelDocument } from '../../shared/types';
import { 
  FileText, 
  Download, 
  CheckCircle, 
  UploadCloud, 
  QrCode, 
  Eye, 
  HardDrive,
  Users
} from 'lucide-react';
import { TRAVELLERS_CONFIG } from '../../shared/config/travellers.config';

interface VaultPreviewProps {
  activeDuo: DuoId | 'ALL';
}

const SAMPLE_DOCS: TravelDocument[] = [
  {
    id: 'doc-1',
    title: 'Rajdhani Express e-Ticket (Durg to NDLS)',
    category: 'TRAIN_TICKET',
    fileUrl: '/sample-tickets/rajdhani-pnr.pdf',
    fileType: 'application/pdf',
    passengerId: 'traveller-utkarsh',
    parsedData: {
      docType: 'TRAIN_TICKET',
      pnr: '645-1284920',
      seatNumber: 'B1-21 (Lower Berth), B1-24 (Lower Berth)',
      validDate: '2026-09-24',
      destinationOrHotel: 'New Delhi (NDLS)'
    },
    createdAt: '2026-09-10T10:00:00Z',
    isCachedOffline: true
  },
  {
    id: 'doc-2',
    title: 'Badrinath Yatra Biometric Registration (Duo A)',
    category: 'YATRA_PASS',
    fileUrl: '/sample-tickets/yatra-pass-duo-a.pdf',
    fileType: 'application/pdf',
    passengerId: 'traveller-rajnish',
    parsedData: {
      docType: 'YATRA_PASS',
      yatraRegistrationNo: 'UK-YATRA-2026-BD-88912',
      validDate: '2026-09-27',
      destinationOrHotel: 'Badrinath Dham'
    },
    createdAt: '2026-09-11T12:00:00Z',
    isCachedOffline: true
  },
  {
    id: 'doc-3',
    title: 'Badrinath Yatra Biometric Registration (Duo B)',
    category: 'YATRA_PASS',
    fileUrl: '/sample-tickets/yatra-pass-duo-b.pdf',
    fileType: 'application/pdf',
    passengerId: 'traveller-uncle',
    parsedData: {
      docType: 'YATRA_PASS',
      yatraRegistrationNo: 'UK-YATRA-2026-BD-88913',
      validDate: '2026-09-27',
      destinationOrHotel: 'Badrinath Dham'
    },
    createdAt: '2026-09-11T12:05:00Z',
    isCachedOffline: true
  },
  {
    id: 'doc-4',
    title: 'Joshimath Base Hotel Confirmation Voucher',
    category: 'HOTEL_VOUCHER',
    fileUrl: '/sample-tickets/joshimath-hotel.pdf',
    fileType: 'application/pdf',
    passengerId: 'traveller-cousin',
    parsedData: {
      docType: 'HOTEL_VOUCHER',
      destinationOrHotel: 'Joshimath Heritage Inn (Heated Rooms)',
      validDate: '2026-09-26 to 2026-09-28'
    },
    createdAt: '2026-09-12T09:00:00Z',
    isCachedOffline: true
  },
  {
    id: 'doc-5',
    title: 'Return Air Tickets (Dehradun DED -> Raipur RPR)',
    category: 'FLIGHT_PASS',
    fileUrl: '/sample-tickets/return-flight.pdf',
    fileType: 'application/pdf',
    passengerId: 'traveller-utkarsh',
    parsedData: {
      docType: 'FLIGHT_PASS',
      pnr: '6E-7892 / UK-441',
      validDate: '2026-10-02',
      seatNumber: 'Senior Citizen Priority 4D, 4E, 5D, 5E'
    },
    createdAt: '2026-09-12T11:00:00Z',
    isCachedOffline: true
  }
];

export const VaultPreview: React.FC<VaultPreviewProps> = ({ activeDuo }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Filter docs by duo and category
  const filteredDocs = SAMPLE_DOCS.filter(doc => {
    // Duo filter
    if (activeDuo === 'DUO_A') {
      const passenger = TRAVELLERS_CONFIG.find(t => t.id === doc.passengerId);
      if (passenger?.duoId !== 'DUO_A') return false;
    }
    if (activeDuo === 'DUO_B') {
      const passenger = TRAVELLERS_CONFIG.find(t => t.id === doc.passengerId);
      if (passenger?.duoId !== 'DUO_B') return false;
    }
    // Category filter
    if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) return false;
    return true;
  });

  const getPassengerName = (id: string) => {
    return TRAVELLERS_CONFIG.find(t => t.id === id)?.name || 'General';
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Offline Status Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-950/60 to-slate-900 border border-sky-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-900/60 text-sky-400 border border-sky-700/60">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Offline Dexie Storage</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-sky-300">
              {SAMPLE_DOCS.length} Pass & Ticket Blobs Cached for Zero-Signal Access
            </p>
          </div>
        </div>
        <button className="tap-active px-2.5 py-1.5 rounded-xl bg-sky-600 text-white font-bold text-xs flex items-center gap-1 hover:bg-sky-500">
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {['ALL', 'YATRA_PASS', 'TRAIN_TICKET', 'FLIGHT_PASS', 'HOTEL_VOUCHER'].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`tap-active px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold border transition-all ${
              selectedCategory === cat
                ? 'bg-sky-600 text-white border-sky-500'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat === 'ALL' ? 'All Docs' : cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="p-3.5 rounded-2xl bg-alpine-900/90 border border-slate-800/90 space-y-2.5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-slate-800 text-amber-400 border border-slate-700">
                  {doc.category === 'YATRA_PASS' ? <QrCode className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-snug">
                    {doc.title}
                  </h4>
                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <Users className="w-3 h-3 text-slate-500" />
                    <span>Assigned: <strong className="text-slate-300">{getPassengerName(doc.passengerId)}</strong></span>
                  </div>
                </div>
              </div>

              {/* Cached Offline Tag */}
              {doc.isCachedOffline && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>Cached</span>
                </span>
              )}
            </div>

            {/* Parsed Highlights */}
            {doc.parsedData && (
              <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/70 text-[11px] grid grid-cols-2 gap-1.5">
                {doc.parsedData.pnr && (
                  <div>
                    <span className="text-slate-500 text-[10px] block">PNR / Ref</span>
                    <strong className="text-white font-mono">{doc.parsedData.pnr}</strong>
                  </div>
                )}
                {doc.parsedData.yatraRegistrationNo && (
                  <div>
                    <span className="text-slate-500 text-[10px] block">Yatra Reg. ID</span>
                    <strong className="text-amber-400 font-mono text-[10px]">{doc.parsedData.yatraRegistrationNo}</strong>
                  </div>
                )}
                {doc.parsedData.seatNumber && (
                  <div>
                    <span className="text-slate-500 text-[10px] block">Seat / Berth</span>
                    <span className="text-slate-300 font-medium">{doc.parsedData.seatNumber}</span>
                  </div>
                )}
                {doc.parsedData.validDate && (
                  <div>
                    <span className="text-slate-500 text-[10px] block">Travel Date</span>
                    <span className="text-slate-300 font-medium">{doc.parsedData.validDate}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
              <button className="tap-active flex-1 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-700">
                <Eye className="w-3.5 h-3.5 text-sky-400" />
                <span>View Full Pass</span>
              </button>
              <button className="tap-active px-3 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs flex items-center justify-center hover:text-white">
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
