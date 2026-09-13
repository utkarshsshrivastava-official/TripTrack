import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { TravelDocument } from '../../../shared/types';
import { TRAVELLERS_CONFIG } from '../../../shared/config/travellers.config';
import { 
  getDocumentBlobUrl, 
  revokeDocumentBlobUrl, 
  getDocumentBlob 
} from '../services/vaultStorage';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Download, 
  QrCode, 
  FileText, 
  ShieldCheck,
  Sun
} from 'lucide-react';

interface DocumentViewerModalProps {
  document: TravelDocument | null;
  onClose: () => void;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  document: doc,
  onClose
}) => {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isTurnstileMode, setIsTurnstileMode] = useState<boolean>(false);

  useEffect(() => {
    if (!doc) {
      setBlobUrl(null);
      setQrDataUrl(null);
      setIsTurnstileMode(false);
      return;
    }

    // Default to turnstile mode if it's a Yatra Pass
    if (doc.category === 'YATRA_PASS') {
      setIsTurnstileMode(true);
    } else {
      setIsTurnstileMode(false);
    }

    // 1. Fetch binary object URL from IndexedDB
    getDocumentBlobUrl(doc.id).then((url) => {
      setBlobUrl(url);
    });

    // 2. If Yatra Pass or has Registration/PNR, generate offline QR code
    const qrPayload = doc.parsedData?.yatraRegistrationNo || doc.parsedData?.pnr || doc.title;
    QRCode.toDataURL(qrPayload, {
      width: 360,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
      .then((dataUrl) => setQrDataUrl(dataUrl))
      .catch((err) => console.error('Failed to generate offline QR', err));

    return () => {
      if (doc) {
        revokeDocumentBlobUrl(doc.id);
      }
    };
  }, [doc]);

  if (!doc) return null;

  const traveller = TRAVELLERS_CONFIG.find(t => t.id === doc.passengerId);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleShare = async () => {
    const blobData = await getDocumentBlob(doc.id);
    if (!blobData || !navigator.share) return;

    try {
      const file = new File([blobData.blob], `${doc.title}.pdf`, { type: blobData.mimeType });
      await navigator.share({
        title: doc.title,
        text: `TripTrack Badrinath Pass for ${traveller?.name || 'Pilgrim'}`,
        files: [file]
      });
    } catch {
      // User cancelled or unsupported
    }
  };

  const isYatraPass = doc.category === 'YATRA_PASS';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-slate-950 border border-slate-700 rounded-t-3xl sm:rounded-2xl flex flex-col max-h-[95vh] shadow-2xl overflow-hidden pb-safe"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top App Header */}
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-slate-800 text-amber-400 border border-slate-700">
              {isYatraPass ? <QrCode className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </div>
            <div>
              <h3 className="text-xs font-black text-white line-clamp-1 leading-snug">
                {doc.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span>Pilgrim: <strong className="text-slate-200">{traveller?.name || 'All'}</strong></span>
                <span>•</span>
                <span className="font-mono text-emerald-400 font-bold">Offline Dexie</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Turnstile High-Contrast Boost Toggle */}
            <button
              onClick={() => setIsTurnstileMode(!isTurnstileMode)}
              className={`tap-active px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all border ${
                isTurnstileMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm shadow-amber-500/30'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
              title="Toggle Turnstile Gate Optical Scanner Mode"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="text-[10px]">Turnstile Mode</span>
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleShare}
                className="tap-active p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                title="Share Pass"
              >
                <Share2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="tap-active p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Biometric Turnstile Presenter Mode */}
          {isTurnstileMode ? (
            <div className="p-5 rounded-3xl bg-white text-slate-950 shadow-2xl text-center space-y-4 border-4 border-amber-400">
              <div className="flex items-center justify-center gap-1.5 text-xs font-black text-amber-700 uppercase tracking-widest bg-amber-100 py-1 px-3 rounded-full inline-flex mx-auto border border-amber-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Uttarakhand Temple & Police Gate Verification</span>
              </div>

              {/* High-Contrast Large Optical QR Frame */}
              <div className="p-3 bg-white rounded-2xl inline-block mx-auto">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="Turnstile Biometric QR Code"
                    className="w-56 h-56 mx-auto object-contain"
                  />
                ) : (
                  <div className="w-56 h-56 flex items-center justify-center text-slate-800 font-mono text-xs">
                    Generating Offline QR...
                  </div>
                )}
              </div>

              {/* Biometric ID / PNR Display */}
              {doc.parsedData?.yatraRegistrationNo && (
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-600 uppercase font-mono font-bold block">
                    BIOMETRIC REGISTRATION NUMBER
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xl font-black font-mono text-slate-950 tracking-widest bg-slate-100 px-4 py-2 rounded-xl border border-slate-300">
                      {doc.parsedData.yatraRegistrationNo}
                    </span>
                    <button
                      onClick={() => handleCopy(doc.parsedData!.yatraRegistrationNo!, 'yatra-no')}
                      className="tap-active p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-sm"
                    >
                      {copiedKey === 'yatra-no' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {doc.parsedData?.pnr && (
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-600 uppercase font-mono font-bold block">
                    RAILWAY PNR
                  </span>
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-black font-mono text-slate-950 tracking-widest bg-slate-100 px-4 py-1.5 rounded-xl border border-slate-300">
                      {doc.parsedData.pnr}
                    </span>
                    <button
                      onClick={() => handleCopy(doc.parsedData!.pnr!, 'pnr')}
                      className="tap-active p-2.5 rounded-xl bg-slate-900 text-white font-black"
                    >
                      {copiedKey === 'pnr' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              <p className="text-xs font-semibold text-slate-600 bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                Hold phone facing the turnstile camera / barcode reader at <strong>Joshimath or Badrinath Gate</strong>. Works 100% offline.
              </p>
            </div>
          ) : (
            <>
              {/* Key Logistics Data Table */}
              {doc.parsedData && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-2.5 shadow-md">
                  <div className="font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center justify-between">
                    <span>Pass Specifications</span>
                    <span className="text-sky-400 font-mono font-bold">{doc.parsedData.docType || doc.category}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    {doc.parsedData.pnr && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase font-mono block">PNR Number</span>
                          <strong className="text-white font-mono text-sm">{doc.parsedData.pnr}</strong>
                        </div>
                        <button
                          onClick={() => handleCopy(doc.parsedData!.pnr!, 'pnr')}
                          className="tap-active p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                        >
                          {copiedKey === 'pnr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    )}

                    {doc.parsedData.seatNumber && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Coach / Berth</span>
                        <strong className="text-amber-300 text-sm font-medium">{doc.parsedData.seatNumber}</strong>
                      </div>
                    )}

                    {doc.parsedData.validDate && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Valid Date</span>
                        <span className="text-slate-200 font-medium">{doc.parsedData.validDate}</span>
                      </div>
                    )}

                    {doc.parsedData.destinationOrHotel && (
                      <div className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
                        <span className="text-[10px] text-slate-500 uppercase font-mono block">Destination</span>
                        <span className="text-slate-200 font-medium truncate block">{doc.parsedData.destinationOrHotel}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Embedded PDF / Document Viewport */}
              <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-inner">
                <div className="p-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px] font-semibold">
                    Cached Document Canvas
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setZoomLevel(prev => Math.min(prev + 25, 175))}
                      className="tap-active px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold"
                    >
                      Zoom +
                    </button>
                    <button
                      onClick={() => setZoomLevel(prev => Math.max(prev - 25, 75))}
                      className="tap-active px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white text-[10px] font-bold"
                    >
                      Zoom -
                    </button>
                  </div>
                </div>

                {blobUrl ? (
                  <div className="h-64 w-full overflow-auto p-2 bg-slate-950 flex justify-center">
                    <iframe
                      src={`${blobUrl}#toolbar=0&navpanes=0`}
                      title={doc.title}
                      className="w-full h-full rounded-xl border border-slate-800 bg-white"
                      style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
                    />
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center text-slate-500 text-xs">
                    Loading binary document blob from IndexedDB...
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          {blobUrl && (
            <a
              href={blobUrl}
              download={`${doc.title}.pdf`}
              className="tap-active flex-1 py-3 rounded-xl bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-slate-700 border border-slate-700"
            >
              <Download className="w-4 h-4" />
              <span>Download Copy</span>
            </a>
          )}
          <button
            onClick={onClose}
            className="tap-active flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs hover:brightness-110 shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewerModal;
