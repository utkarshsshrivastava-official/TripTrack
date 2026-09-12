import React, { useState, useRef } from 'react';
import { Camera, Upload, X, Check, Loader2, Sparkles } from 'lucide-react';
import { DocumentCategory, TravelDocument } from '../../../shared/types';
import { TRAVELLERS_CONFIG } from '../../../shared/config/travellers.config';
import { compressImageFile } from '../services/imageCompression';
import { saveDocumentToDexie } from '../services/vaultStorage';

interface UploadDocDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
}

export const UploadDocDialog: React.FC<UploadDocDialogProps> = ({
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [title, setTitle] = useState('');
  const [passengerId, setPassengerId] = useState(TRAVELLERS_CONFIG[0].id);
  const [category, setCategory] = useState<DocumentCategory>('YATRA_PASS');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;

    setIsProcessing(true);
    setStatusMessage('Compressing and caching in offline IndexedDB...');

    try {
      let finalBlob: Blob | undefined = selectedFile || undefined;

      // 1. Client-Side Image Compression if image
      if (selectedFile && selectedFile.type.startsWith('image/')) {
        finalBlob = await compressImageFile(selectedFile, { maxWidth: 1600, quality: 0.8 });
      }

      const docId = `doc-${Date.now()}`;
      const newDoc: TravelDocument = {
        id: docId,
        title,
        category,
        fileUrl: '',
        fileType: selectedFile ? selectedFile.type : 'application/pdf',
        passengerId,
        createdAt: new Date().toISOString(),
        isCachedOffline: true,
        parsedData: {
          docType: category,
          validDate: '2026-09-27',
          yatraRegistrationNo: category === 'YATRA_PASS' ? `UK-LOCAL-${Math.floor(10000 + Math.random() * 90000)}` : undefined
        }
      };

      // 2. Immediate Local-First Save to Dexie
      await saveDocumentToDexie(newDoc, finalBlob);

      // 3. Attempt Server Gemini Ingest if Online
      if (navigator.onLine && selectedFile) {
        setStatusMessage('Transmitting to Gemini 2.5 Flash for optical parsing...');
        try {
          const formData = new FormData();
          formData.append('document', selectedFile);
          formData.append('title', title);
          formData.append('passengerId', passengerId);
          formData.append('category', category);

          const res = await fetch('/api/documents/upload', {
            method: 'POST',
            headers: {
              'x-family-pin': '2026'
            },
            body: formData
          });

          if (res.ok) {
            const apiResult = await res.json();
            if (apiResult.document?.parsedData) {
              newDoc.parsedData = apiResult.document.parsedData;
              await saveDocumentToDexie(newDoc, finalBlob);
            }
          }
        } catch {
          console.warn('Backend sync deferred; pass safely retained in Dexie');
        }
      }

      setStatusMessage('Pass saved! 100% offline accessible.');
      setTimeout(() => {
        setIsProcessing(false);
        onUploadSuccess();
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Failed to store document', err);
      setStatusMessage(`Error: ${err.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-alpine-900 border border-slate-700 rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto shadow-2xl pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-black text-white">Add Travel Pass / Ticket</h3>
            <p className="text-xs text-sky-400 font-semibold">Local-First Vault Ingest (Camera / PDF)</p>
          </div>
          <button onClick={onClose} className="tap-active p-2 rounded-full bg-slate-800 text-slate-300">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {/* File Picker & Camera Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="tap-active p-3 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-amber-500 text-slate-200 flex flex-col items-center justify-center gap-1.5"
            >
              <Camera className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold">Snap Camera</span>
              <span className="text-[10px] text-slate-400">Scan physical ticket</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="tap-active p-3 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-sky-500 text-slate-200 flex flex-col items-center justify-center gap-1.5"
            >
              <Upload className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-bold">Upload PDF/Image</span>
              <span className="text-[10px] text-slate-400">From phone files</span>
            </button>

            <input
              type="file"
              ref={cameraInputRef}
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={handleFileChange}
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="application/pdf,image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {selectedFile && (
            <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs flex items-center justify-between">
              <span className="truncate font-semibold">{selectedFile.name}</span>
              <span className="text-[10px] font-mono shrink-0">
                {(selectedFile.size / 1024).toFixed(0)} KB
              </span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Haridwar Cab Slip, Uncle Yatra Pass"
              required
              className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Category */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="YATRA_PASS">Badrinath Yatra Pass</option>
                <option value="TRAIN_TICKET">Train Ticket (Rajdhani)</option>
                <option value="FLIGHT_PASS">Flight Boarding Pass</option>
                <option value="HOTEL_VOUCHER">Hotel Voucher</option>
                <option value="ID_CARD">Aadhaar / ID Card</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                Assigned Pilgrim
              </label>
              <select
                value={passengerId}
                onChange={(e) => setPassengerId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                {TRAVELLERS_CONFIG.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.duoId === 'DUO_A' ? 'Duo A' : 'Duo B'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gemini AI info pill */}
          <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-temple-gold mt-0.5 shrink-0" />
            <span>
              Google AI Studio <strong>Gemini 2.5 Flash</strong> automatically extracts PNR, coach number, and biometric IDs when online.
            </span>
          </div>

          {statusMessage && (
            <div className="p-2 rounded-xl bg-sky-950/80 border border-sky-800 text-sky-200 text-xs text-center font-medium animate-in fade-in">
              {statusMessage}
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="tap-active flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-temple-saffron text-slate-950 font-black text-xs flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save to Offline Vault</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="tap-active px-4 py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
