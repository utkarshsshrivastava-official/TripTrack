import React, { useState } from 'react';
import { Expense } from '../../../shared/types';
import { GullakFinancialSummary } from '../services/expenseStorage';
import { generateWhatsAppSummary, exportExpensesToCSV } from '../services/expenseExportService';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Printer, 
  FileSpreadsheet, 
  Send,
  FileText
} from 'lucide-react';

interface GullakExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
  summary: GullakFinancialSummary;
  onOpenPrintReport: () => void;
}

export const GullakExportModal: React.FC<GullakExportModalProps> = ({
  isOpen,
  onClose,
  expenses,
  summary,
  onOpenPrintReport
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const whatsappText = generateWhatsAppSummary(expenses, summary);

  const handleCopyWhatsApp = async () => {
    try {
      await navigator.clipboard.writeText(whatsappText);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.warn('Clipboard write failed, fallbacking:', err);
    }
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(whatsappText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleDownloadCSV = () => {
    exportExpensesToCSV(expenses);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div 
        className="w-full max-w-lg lg:max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-5 lg:p-6 space-y-4 max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-amber-500/20 text-temple-gold border border-amber-500/40 flex items-center justify-center">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Export & Share Financials</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {expenses.length} receipts • ₹{summary.totalSpentINR.toLocaleString('en-IN')} total spend
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white tap-active"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Core Export Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* 1. WhatsApp Share */}
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-400 text-left transition-all tap-active flex flex-col justify-between space-y-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white group-hover:text-emerald-300 block">
                Share to WhatsApp
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                Send report to Family Group
              </span>
            </div>
          </button>

          {/* 2. Print / PDF Statement */}
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenPrintReport();
            }}
            className="p-3 rounded-2xl bg-sky-950/40 border border-sky-500/30 hover:border-sky-400 text-left transition-all tap-active flex flex-col justify-between space-y-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white group-hover:text-sky-300 block">
                Print / Save PDF
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                Formal printable settlement
              </span>
            </div>
          </button>

          {/* 3. CSV Spreadsheet */}
          <button
            type="button"
            onClick={handleDownloadCSV}
            className="p-3 rounded-2xl bg-amber-950/40 border border-amber-500/30 hover:border-amber-400 text-left transition-all tap-active flex flex-col justify-between space-y-2 group"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-temple-gold flex items-center justify-center">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-white group-hover:text-amber-300 block">
                Download CSV
              </span>
              <span className="text-[10px] text-slate-400 block leading-tight">
                Raw data for Excel/Sheets
              </span>
            </div>
          </button>
        </div>

        {/* WhatsApp Formatted Text Preview & Copy */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-temple-gold" />
              <span>WhatsApp Message Preview</span>
            </label>
            <button
              type="button"
              onClick={handleCopyWhatsApp}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1 border transition-all tap-active ${
                copied
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800 text-amber-300 border-slate-700 hover:border-amber-400'
              }`}
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
            </button>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-56 overflow-y-auto leading-relaxed shadow-inner">
            {whatsappText}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tap-active min-h-touch min-w-touch flex items-center justify-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
