import React, { useState, useEffect, useCallback } from 'react';
import { DuoId, TravelDocument } from '../../shared/types';
import { 
  FileText, 
  CheckCircle, 
  UploadCloud, 
  QrCode, 
  Eye, 
  HardDrive,
  Users,
  Copy,
  Check,
  Trash2
} from 'lucide-react';
import { TRAVELLERS_CONFIG } from '../../shared/config/travellers.config';
import { 
  getVaultDocuments, 
  getVaultStorageMetrics, 
  deleteDocumentFromDexie 
} from './services/vaultStorage';
import { DocumentViewerModal } from './components/DocumentViewerModal';
import { UploadDocDialog } from './components/UploadDocDialog';

interface VaultPreviewProps {
  activeDuo: DuoId | 'ALL';
}

export const VaultPreview: React.FC<VaultPreviewProps> = ({ activeDuo }) => {
  const [documents, setDocuments] = useState<TravelDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [storageMetrics, setStorageMetrics] = useState<{ cachedCount: number; formattedSize: string }>({
    cachedCount: 0,
    formattedSize: '0 KB'
  });
  const [selectedDoc, setSelectedDoc] = useState<TravelDocument | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    try {
      const docs = await getVaultDocuments(activeDuo, selectedCategory);
      setDocuments(docs);
      const metrics = await getVaultStorageMetrics();
      setStorageMetrics({
        cachedCount: metrics.cachedCount,
        formattedSize: metrics.formattedSize
      });
    } catch (err) {
      console.error('Failed to load vault documents', err);
    }
  }, [activeDuo, selectedCategory]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this cached pass from phone storage?')) {
      await deleteDocumentFromDexie(id);
      await loadDocuments();
    }
  };

  const handleCopy = (e: React.MouseEvent, text: string, id: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const getPassengerName = (id: string) => {
    return TRAVELLERS_CONFIG.find(t => t.id === id)?.name || 'General';
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Offline Storage Status Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-950/70 via-alpine-900 to-slate-900 border border-sky-800/60 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-sky-900/60 text-sky-400 border border-sky-700/60">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Zero-Signal Dexie Vault</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-sky-300 font-mono">
              {storageMetrics.cachedCount} Passes Cached • {storageMetrics.formattedSize}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="tap-active px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-temple-saffron text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/40 hover:brightness-110"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload</span>
        </button>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'ALL', label: 'All Passes' },
          { id: 'YATRA_PASS', label: 'Yatra Pass (QR)' },
          { id: 'TRAIN_TICKET', label: 'Train Ticket' },
          { id: 'FLIGHT_PASS', label: 'Flight Pass' },
          { id: 'HOTEL_VOUCHER', label: 'Hotels' },
          { id: 'ID_CARD', label: 'Aadhaar / ID' }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`tap-active px-3 py-1.5 rounded-xl whitespace-nowrap font-semibold border transition-all ${
              selectedCategory === cat.id
                ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {documents.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-400 text-xs">
            No passes found in this category. Tap <strong>Upload</strong> to add one!
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => setSelectedDoc(doc)}
              className="p-3.5 rounded-2xl bg-alpine-900/90 border border-slate-800/90 space-y-2.5 shadow-sm tap-active cursor-pointer hover:border-slate-700"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl border ${doc.category === 'YATRA_PASS' ? 'bg-amber-950/70 border-amber-600/70 text-amber-400' : 'bg-slate-800 border-slate-700 text-sky-400'}`}>
                    {doc.category === 'YATRA_PASS' ? <QrCode className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-snug">
                      {doc.title}
                    </h4>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Users className="w-3 h-3 text-slate-500" />
                      <span>Pilgrim: <strong className="text-slate-300">{getPassengerName(doc.passengerId)}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Cached Offline Tag */}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 shrink-0">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>100% Offline</span>
                </span>
              </div>

              {/* Parsed Highlights Table */}
              {doc.parsedData && (
                <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/70 text-[11px] grid grid-cols-2 gap-2">
                  {doc.parsedData.pnr && (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-slate-500 text-[10px] block">PNR</span>
                        <strong className="text-white font-mono">{doc.parsedData.pnr}</strong>
                      </div>
                      <button
                        onClick={(e) => handleCopy(e, doc.parsedData!.pnr!, `pnr-${doc.id}`)}
                        className="p-1 text-slate-400 hover:text-white"
                      >
                        {copiedId === `pnr-${doc.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  {doc.parsedData.yatraRegistrationNo && (
                    <div className="col-span-2 flex items-center justify-between bg-amber-950/30 p-1.5 rounded-lg border border-amber-800/40">
                      <div>
                        <span className="text-amber-400 text-[9px] uppercase font-mono font-bold block">
                          Biometric Registration ID
                        </span>
                        <strong className="text-white font-mono text-xs">
                          {doc.parsedData.yatraRegistrationNo}
                        </strong>
                      </div>
                      <button
                        onClick={(e) => handleCopy(e, doc.parsedData!.yatraRegistrationNo!, `yatra-${doc.id}`)}
                        className="p-1 text-amber-400 hover:text-white"
                      >
                        {copiedId === `yatra-${doc.id}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  )}

                  {doc.parsedData.seatNumber && (
                    <div>
                      <span className="text-slate-500 text-[10px] block">Coach / Seat</span>
                      <span className="text-slate-200 font-medium">{doc.parsedData.seatNumber}</span>
                    </div>
                  )}

                  {doc.parsedData.validDate && (
                    <div>
                      <span className="text-slate-500 text-[10px] block">Travel Date</span>
                      <span className="text-slate-200 font-medium">{doc.parsedData.validDate}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                <button
                  onClick={() => setSelectedDoc(doc)}
                  className="tap-active flex-1 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-700"
                >
                  <Eye className="w-3.5 h-3.5 text-sky-400" />
                  <span>{doc.category === 'YATRA_PASS' ? 'Present Biometric QR' : 'Open Pass View'}</span>
                </button>

                <button
                  onClick={(e) => handleDelete(e, doc.id)}
                  className="tap-active p-2 rounded-xl bg-slate-800/70 text-slate-400 hover:text-rose-400"
                  title="Delete from local storage"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Document Fullscreen Viewer Modal */}
      <DocumentViewerModal
        document={selectedDoc}
        onClose={() => setSelectedDoc(null)}
      />

      {/* Upload / Camera Dialog */}
      <UploadDocDialog
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onUploadSuccess={loadDocuments}
      />
    </div>
  );
};
