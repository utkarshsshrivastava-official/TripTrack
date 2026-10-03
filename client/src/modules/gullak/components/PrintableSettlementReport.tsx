import React from 'react';
import { Expense } from '../../../shared/types';
import { GullakFinancialSummary } from '../services/expenseStorage';
import { DUO_A_SON, DUO_B_SON, DUO_A_ELDER, DUO_B_ELDER } from '../../../shared/config/travellers.config';
import { Printer, X, ShieldCheck } from 'lucide-react';

interface PrintableSettlementReportProps {
  expenses: Expense[];
  summary: GullakFinancialSummary;
  onClose: () => void;
}

export const PrintableSettlementReport: React.FC<PrintableSettlementReportProps> = ({
  expenses,
  summary,
  onClose
}) => {
  const handlePrint = () => {
    window.print();
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
  });

  const net = summary.netSettlement;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-md p-2 sm:p-6 print:p-0 print:bg-white print:static animate-in fade-in">
      {/* Top Floating Control Bar (Hidden when Printing) */}
      <div className="max-w-4xl mx-auto mb-4 flex items-center justify-between p-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl print:hidden">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-temple-gold" />
          <div>
            <h3 className="text-xs font-black text-white">Printable Trip Statement & PDF</h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Ready for physical printing, accounting archival, or saving as PDF
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-temple-saffron via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow flex items-center gap-1.5 hover:brightness-110 tap-active min-h-touch"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 tap-active min-h-touch min-w-touch flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* The Printable Document Paper */}
      <div className="max-w-4xl mx-auto bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-2xl print:shadow-none print:p-0 print:rounded-none font-sans text-xs">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-slate-900 text-white">
                Official Financial Statement
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight">
              TripTrack — Badrinath Dham 2026
            </h1>
            <p className="text-xs text-slate-600 font-medium">
              Pilgrimage Financial Reconciliation & 50/50 Shared Pool Audit
            </p>
          </div>
          <div className="text-left sm:text-right font-mono text-[11px] text-slate-700">
            <p><span className="font-bold">Trip Dates:</span> 24 Sep – 02 Oct, 2026</p>
            <p><span className="font-bold">Family A:</span> {DUO_A_SON.name} & {DUO_A_ELDER.name}</p>
            <p><span className="font-bold">Family B:</span> {DUO_B_SON.name} & {DUO_B_ELDER.name}</p>
          </div>
        </div>

        {/* Financial Executive Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-300">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Spend</span>
            <span className="text-base font-black font-mono text-slate-950">
              ₹{summary.totalSpentINR.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-600 block mt-0.5">{expenses.length} receipts logged</span>
          </div>

          <div className="p-3 rounded-xl bg-sky-50 border border-sky-200">
            <span className="text-[10px] uppercase font-bold text-sky-800 block">Paid by {DUO_A_SON.name}</span>
            <span className="text-base font-black font-mono text-sky-950">
              ₹{summary.paidByUtkarshINR.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-sky-700 block mt-0.5">Family A Out-of-Pocket</span>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
            <span className="text-[10px] uppercase font-bold text-emerald-800 block">Paid by {DUO_B_SON.name}</span>
            <span className="text-base font-black font-mono text-emerald-950">
              ₹{summary.paidByShreyasINR.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-emerald-700 block mt-0.5">Family B Out-of-Pocket</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
            <span className="text-[10px] uppercase font-bold text-amber-800 block">50/50 Target</span>
            <span className="text-base font-black font-mono text-amber-950">
              ₹{summary.fairSharePerCoordinatorINR.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-amber-700 block mt-0.5">Equal Share Each</span>
          </div>
        </div>

        {/* Final Settlement Math Box */}
        <div className={`p-4 rounded-xl border mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          net.isSettled 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
            : 'bg-amber-50 border-amber-300 text-amber-950'
        }`}>
          <div>
            <span className="text-[10px] uppercase font-black tracking-wider block">
              {net.isSettled ? '✅ Account Status: Balanced' : '⚖️ Final Inter-Family Settlement'}
            </span>
            <p className="text-sm font-black mt-0.5">
              {net.isSettled 
                ? 'All shared trip expenses are fully balanced. Neither family owes any outstanding debt.' 
                : `${net.debtorName} transfers ₹${net.amountINR.toLocaleString('en-IN')} to ${net.creditorName} to achieve 50/50 equality.`
              }
            </p>
          </div>
          {!net.isSettled && (
            <div className="px-3 py-1.5 rounded-lg bg-amber-200/60 border border-amber-400 font-mono text-xs font-black shrink-0">
              Due: ₹{net.amountINR.toLocaleString('en-IN')}
            </div>
          )}
        </div>

        {/* Category Breakdown Table */}
        <div className="mb-6">
          <h3 className="text-xs font-black uppercase tracking-wide text-slate-800 mb-2">
            Spending by Category
          </h3>
          <table className="w-full text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 border-b border-slate-300">
                <th className="p-2 border-r border-slate-300">Category</th>
                <th className="p-2 border-r border-slate-300 text-right">Amount (₹)</th>
                <th className="p-2 text-right">Share (%)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary.categoryTotals)
                .filter(([_, amt]) => amt > 0)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, amt]) => {
                  const pct = summary.totalSpentINR > 0 ? Math.round((amt / summary.totalSpentINR) * 100) : 0;
                  return (
                    <tr key={cat} className="border-b border-slate-200">
                      <td className="p-2 border-r border-slate-200 font-medium">{cat.replace('_', ' ')}</td>
                      <td className="p-2 border-r border-slate-200 font-mono font-bold text-right">
                        ₹{amt.toLocaleString('en-IN')}
                      </td>
                      <td className="p-2 font-mono text-right text-slate-600">{pct}%</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        {/* Itemized Transaction Ledger */}
        <div className="mb-8">
          <h3 className="text-xs font-black uppercase tracking-wide text-slate-800 mb-2">
            Complete Itemized Transaction Ledger ({sortedExpenses.length} Records)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse border border-slate-300 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-[10px] uppercase font-bold text-slate-600 border-b border-slate-300">
                  <th className="p-2 border-r border-slate-300 w-8">#</th>
                  <th className="p-2 border-r border-slate-300 w-24">Date</th>
                  <th className="p-2 border-r border-slate-300">Description & Venue</th>
                  <th className="p-2 border-r border-slate-300">Category</th>
                  <th className="p-2 border-r border-slate-300">Paid By</th>
                  <th className="p-2 border-r border-slate-300">Method</th>
                  <th className="p-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                {sortedExpenses.map((exp, idx) => {
                  const d = new Date(exp.createdAt || 0);
                  const dateFormatted = !isNaN(d.getTime()) 
                    ? d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) 
                    : '';
                  
                  return (
                    <tr key={exp.id} className="border-b border-slate-200 even:bg-slate-50">
                      <td className="p-2 border-r border-slate-200 font-mono text-slate-500 text-[10px]">{idx + 1}</td>
                      <td className="p-2 border-r border-slate-200 font-mono">{dateFormatted}</td>
                      <td className="p-2 border-r border-slate-200 font-medium">
                        <div>{exp.title}</div>
                        {(exp.venueName || exp.venueLocation) && (
                          <div className="text-[10px] text-slate-500">
                            {exp.venueName}{exp.venueName && exp.venueLocation ? ' • ' : ''}{exp.venueLocation}
                          </div>
                        )}
                      </td>
                      <td className="p-2 border-r border-slate-200 text-slate-600">{exp.category.replace('_', ' ')}</td>
                      <td className="p-2 border-r border-slate-200 font-medium">
                        {exp.paidBy === 'Multiple' && exp.paymentSplits 
                          ? `U: ₹${exp.paymentSplits.utkarshPaidINR}, S: ₹${exp.paymentSplits.shreyasPaidINR}`
                          : exp.paidBy
                        }
                      </td>
                      <td className="p-2 border-r border-slate-200 font-mono text-[10px] text-slate-600">
                        {exp.paymentMethod || 'UPI'}
                      </td>
                      <td className="p-2 font-mono font-bold text-right">
                        ₹{exp.amountINR.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-slate-900 text-white font-bold">
                  <td colSpan={6} className="p-2.5 text-right uppercase text-[10px] tracking-wider">
                    Total Pilgrimage Spend:
                  </td>
                  <td className="p-2.5 text-right font-mono font-black text-sm">
                    ₹{summary.totalSpentINR.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Verification Signatures Box */}
        <div className="border-t-2 border-slate-300 pt-6 mt-8">
          <p className="text-[10px] text-slate-500 font-mono mb-6">
            Both coordinator families have reviewed and approved all documented expenditures for the 2026 Badrinath Dham Yatra.
          </p>
          <div className="grid grid-cols-2 gap-8 text-center">
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-xs">{DUO_A_SON.name} (Son / Coordinator)</p>
              <p className="text-[10px] text-slate-500 font-mono">Family A Representative</p>
            </div>
            <div className="border-t border-slate-400 pt-2">
              <p className="font-bold text-xs">{DUO_B_SON.name} (Son / Coordinator)</p>
              <p className="text-[10px] text-slate-500 font-mono">Family B Representative</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
