import React, { useState, useEffect } from 'react';
import { X, Printer, Award, CheckCircle } from 'lucide-react';
import { DUO_A_MEMBERS, DUO_B_MEMBERS, DUO_A_SON, DUO_B_SON } from '../../../shared/config/travellers.config';
import { 
  getExpensesFromDexie, 
  calculateGullakSummary, 
  GullakFinancialSummary 
} from '../../gullak/services/expenseStorage';

interface YatraMemorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const YatraMemorialModal: React.FC<YatraMemorialModalProps> = ({ isOpen, onClose }) => {
  const [summary, setSummary] = useState<GullakFinancialSummary | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadGullakSummary();
    }
  }, [isOpen]);

  const loadGullakSummary = async () => {
    try {
      const expenses = await getExpensesFromDexie();
      const data = calculateGullakSummary(expenses);
      setSummary(data);
    } catch (err) {
      console.warn('Using default settlement summary for memorial:', err);
    }
  };

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-sm p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-stone-900 border border-stone-800 rounded-t-3xl sm:rounded-2xl p-4 sm:p-6 max-h-[92vh] overflow-y-auto pb-safe shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Dialog Bar */}
        <div className="flex items-center justify-between pb-3.5 border-b border-stone-800 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Pilgrimage Memorial & Gullak Settlement
              </h2>
              <p className="text-[11px] text-stone-400">
                Official Badrinath Dham 2026 Keepsake Certificate
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="tap-active min-h-[40px] px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="tap-active p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Frame */}
        <div className="mt-4 p-6 rounded-3xl bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 border-2 border-amber-500/50 shadow-2xl relative overflow-hidden print:border-stone-900 print:bg-white print:text-black print:m-0 print:p-8">
          {/* Decorative Corner Borders */}
          <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-amber-400/80 pointer-events-none"></div>
          <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-amber-400/80 pointer-events-none"></div>
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-amber-400/80 pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-amber-400/80 pointer-events-none"></div>

          {/* Certificate Header */}
          <div className="text-center space-y-1.5 pb-4 border-b border-amber-500/30">
            <div className="text-xs font-serif font-bold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5">
              <span>॥ ॐ नमो भगवते वासुदेवाय ॥</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black font-serif text-white print:text-stone-950 tracking-tight">
              श्री बद्रीनाथ धाम महायात्रा संस्मरण
            </h1>
            <p className="text-xs font-medium text-amber-200/90 print:text-stone-600">
              Devbhoomi Uttarakhand Pilgrimage Certificate • Sep 24 – Oct 02, 2026
            </p>
          </div>

          {/* The Families */}
          <div className="grid grid-cols-2 gap-3 my-4 py-2 border-b border-stone-800/80 print:border-stone-300">
            <div className="p-3 rounded-2xl bg-stone-950/80 border border-blue-900/40 text-left print:bg-stone-50">
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                Family A (परिवार क)
              </span>
              <div className="font-bold text-sm text-stone-100 print:text-stone-950 mt-1">
                {DUO_A_MEMBERS.map(m => m.name).join(' & ')}
              </div>
              <span className="text-[10px] text-stone-400">Coordinator: {DUO_A_SON.name}</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-950/80 border border-emerald-900/40 text-left print:bg-stone-50">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Family B (परिवार ख)
              </span>
              <div className="font-bold text-sm text-stone-100 print:text-stone-950 mt-1">
                {DUO_B_MEMBERS.map(m => m.name).join(' & ')}
              </div>
              <span className="text-[10px] text-stone-400">Coordinator: {DUO_B_SON.name}</span>
            </div>
          </div>

          {/* Pilgrimage Milestones Completed */}
          <div className="my-3 space-y-1.5">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block text-center">
              Sacred Valley Progression (NH-7 Alaknanda Corridor)
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs">
              {[
                'Haridwar Ghats (314m)',
                'Devprayag Sangam (475m)',
                'Srinagar Garhwal',
                'Rudraprayag',
                'Joshimath (1,890m)',
                'Badrinath Sanctum (3,133m)',
                'Brahma Kapal Ghat',
                'Mana Village (Last Post)'
              ].map((m, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-full bg-stone-900 print:bg-stone-100 text-amber-300 print:text-stone-900 font-semibold text-[10px] border border-stone-800 print:border-stone-300 flex items-center gap-1"
                >
                  <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
                  <span>{m}</span>
                </span>
              ))}
            </div>
          </div>

          {/* 50/50 Gullak Shared Settlement Card */}
          <div className="mt-4 p-4 rounded-2xl bg-stone-950 border border-amber-500/40 text-center space-y-2 print:border-stone-400">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
              Gullak Shared Expense Audit (50/50 Coordinator Settlement)
            </span>

            <div className="grid grid-cols-3 gap-2 py-1">
              <div>
                <span className="text-[9px] text-stone-400 block">Total Collective Outlay</span>
                <span className="text-base font-black font-mono text-white print:text-black">
                  ₹{(summary?.totalSpentINR ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-stone-400 block">Paid by {DUO_A_SON.name}</span>
                <span className="text-base font-black font-mono text-blue-400 print:text-black">
                  ₹{(summary?.paidByUtkarshINR ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div>
                <span className="text-[9px] text-stone-400 block">Paid by {DUO_B_SON.name}</span>
                <span className="text-base font-black font-mono text-emerald-400 print:text-black">
                  ₹{(summary?.paidByShreyasINR ?? 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/40 print:bg-stone-100 border border-amber-700/60 print:border-stone-300 text-xs text-amber-200 print:text-stone-900 font-bold">
              {summary?.netSettlement.isSettled ? (
                <span>⚖️ Accounts Fully Balanced — ₹0 Settlement Required</span>
              ) : (
                <span>
                  🤝 Final Settlement: {summary?.netSettlement.debtorName} will pay ₹{(summary?.netSettlement.amountINR ?? 0).toLocaleString('en-IN')} to {summary?.netSettlement.creditorName}
                </span>
              )}
            </div>
          </div>

          {/* Elder Blessing Footer */}
          <div className="mt-5 pt-3 border-t border-stone-800 text-center space-y-1">
            <p className="text-xs font-serif italic text-stone-300 print:text-stone-700">
              "माता-पिता के साथ श्री बद्री विशाल की यात्रा सुगमता और भक्ति से संपन्न हुई। प्रभु का आशीर्वाद सदैव दोनों परिवारों पर बना रहे।"
            </p>
            <div className="text-[10px] font-mono text-stone-500 pt-1">
              TripTrack by Ut-tech • Authenticated Offline Pilgrimage Record #TT-2026-BD-FINAL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
