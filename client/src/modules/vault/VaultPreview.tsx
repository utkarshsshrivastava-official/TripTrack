import React, { useState, useEffect, useCallback } from 'react';
import { DuoId, TravelDocument } from '../../shared/types';
import { 
  Plus, 
  UploadCloud, 
  HardDrive,
  Sparkles
} from 'lucide-react';
import { 
  getVaultDocuments, 
  getVaultStorageMetrics, 
  deleteVaultDocument,
  syncVaultWithCloud 
} from './services/vaultStorage';
import { WalletPassCard } from './components/WalletPassCard';
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

    const handleUpdate = () => {
      loadDocuments();
    };

    window.addEventListener('triptrack_vault_update', handleUpdate);

    // Initial background sync with cloud if online
    if (navigator.onLine) {
      syncVaultWithCloud()
        .then(() => loadDocuments())
        .catch(err => console.warn('Vault cloud sync deferred:', err));
    }

    return () => {
      window.removeEventListener('triptrack_vault_update', handleUpdate);
    };
  }, [loadDocuments]);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this travel pass from vault?')) {
      await deleteVaultDocument(id);
      await loadDocuments();
    }
  };

  const categories = [
    { id: 'ALL', label: 'All Passes' },
    { id: 'YATRA_PASS', label: 'Yatra Pass (QR)' },
    { id: 'TRAIN_TICKET', label: 'Train Ticket' },
    { id: 'FLIGHT_PASS', label: 'Flight Pass' },
    { id: 'HOTEL_VOUCHER', label: 'Hotels' },
    { id: 'ID_CARD', label: 'Aadhaar / ID' }
  ];

  return (
    <div className="space-y-4 pb-24 relative">
      {/* 1. Offline Storage Status Bar */}
      <div className="p-3 rounded-2xl glass-panel flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-950/80 text-sky-400 border border-sky-800/60 flex items-center justify-center shrink-0">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Apple Wallet Dexie Vault</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              {storageMetrics.cachedCount} Passes Cached • {storageMetrics.formattedSize} Local Storage
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="tap-active px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 shadow-md shadow-amber-950/40"
        >
          <UploadCloud className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>
      </div>

      {/* 2. Category Filter Pill Strip */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`tap-active px-3 py-1.5 rounded-xl whitespace-nowrap font-bold border transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 border-amber-500/80 shadow-sm'
                : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* 3. Apple Wallet-Style Passbook Stack */}
      <div className="space-y-3.5">
        {documents.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 text-xs space-y-2">
            <Sparkles className="w-6 h-6 text-amber-400 mx-auto animate-pulse" />
            <p>No passes found in this category.</p>
            <button
              onClick={() => setIsUploadOpen(true)}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-800 text-white font-bold text-xs hover:bg-slate-700 tap-active inline-flex items-center gap-1.5 border border-slate-700"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Your First Pass</span>
            </button>
          </div>
        ) : (
          documents.map((doc) => (
            <WalletPassCard
              key={doc.id}
              document={doc}
              onOpenViewer={(d) => setSelectedDoc(d)}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* 4. Floating Action Button (FAB) for Mobile Scan & Upload */}
      <div className="fixed bottom-20 right-4 z-30 pointer-events-none">
        <button
          onClick={() => setIsUploadOpen(true)}
          className="tap-active pointer-events-auto p-3 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 font-black text-xs shadow-2xl shadow-amber-900/80 flex items-center gap-1.5 border border-amber-300 hover:scale-105 transition-transform"
          title="Scan or Upload New Travel Document / Pass"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
          <span className="pr-1 text-xs tracking-tight">Scan Pass</span>
        </button>
      </div>

      {/* Document Fullscreen / Turnstile Presenter Modal */}
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

export default VaultPreview;
