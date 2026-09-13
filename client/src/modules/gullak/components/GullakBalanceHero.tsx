import React from 'react';
import { GullakFinancialSummary } from '../services/expenseStorage';
import { DUO_A_SON, DUO_B_SON } from '../../../shared/config/travellers.config';
import { Wallet, ShieldCheck, Car, Flame, Utensils, Hotel, Accessibility, MoreHorizontal } from 'lucide-react';
import { ExpenseCategory } from '../../../shared/types';

interface GullakBalanceHeroProps {
  summary: GullakFinancialSummary;
  onOpenAddModal?: () => void;
}

const CATEGORY_COLORS: Record<ExpenseCategory, { name: string; color: string; bg: string; icon: React.FC<{ className?: string }> }> = {
  TOLL_TAXI: { name: 'Cab & Toll', color: '#38bdf8', bg: 'bg-sky-500', icon: Car },
  FOOD: { name: 'Food & Tea', color: '#10b981', bg: 'bg-emerald-500', icon: Utensils },
  RITUAL: { name: 'Rituals & Pujas', color: '#f59e0b', bg: 'bg-amber-500', icon: Flame },
  HOTEL: { name: 'Hotels & Stay', color: '#a855f7', bg: 'bg-purple-500', icon: Hotel },
  PORTER_DANDI: { name: 'Porters & Dandi', color: '#f97316', bg: 'bg-orange-500', icon: Accessibility },
  MISC: { name: 'Medical & Misc', color: '#64748b', bg: 'bg-slate-500', icon: MoreHorizontal }
};

export const GullakBalanceHero: React.FC<GullakBalanceHeroProps> = ({ summary }) => {
  const total = summary.totalSpentINR || 1; // Avoid divide by 0

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-amber-950/50 border border-amber-500/30 p-5 shadow-2xl space-y-4">
      {/* Decorative Radial Gold Glow */}
      <div 
        className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #f59e0b 0%, transparent 70%)' }}
      />

      {/* Header Crest */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-temple-gold flex items-center justify-center shadow-inner">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400/90 block leading-tight font-extrabold">
              Badrinath 2026 Shared Pool
            </span>
            <h2 className="text-sm font-black text-white tracking-wide">
              Yatra Gullak (50/50 Pool)
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/10 text-[10px] font-mono text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Balanced</span>
        </div>
      </div>

      {/* Central Big Typography Total Outlay */}
      <div className="py-2 text-center relative z-10">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
          Total Pilgrimage Outlay
        </span>
        <div className="text-4xl sm:text-5xl font-black font-mono text-white mt-1 tracking-tight drop-shadow-md">
          ₹{summary.totalSpentINR.toLocaleString('en-IN')}
        </div>
        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
          <span>Equal Coordinator Fair Share:</span>
          <strong>₹{summary.fairSharePerCoordinatorINR.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      {/* 50/50 Individual Coordinator Contribution Tiles */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        {/* Utkarsh (Family A) */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-sky-500/20 shadow-inner flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center font-black text-sm shrink-0">
            {DUO_A_SON.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-sky-400 truncate">
              {DUO_A_SON.name} (Fam A)
            </div>
            <div className="text-base font-black font-mono text-white leading-tight">
              ₹{summary.paidByUtkarshINR.toLocaleString('en-IN')}
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              {Math.round((summary.paidByUtkarshINR / total) * 100)}% of pool
            </div>
          </div>
        </div>

        {/* Shreyas (Family B) */}
        <div className="p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/20 shadow-inner flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-black text-sm shrink-0">
            {DUO_B_SON.name.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-emerald-400 truncate">
              {DUO_B_SON.name} (Fam B)
            </div>
            <div className="text-base font-black font-mono text-white leading-tight">
              ₹{summary.paidByShreyasINR.toLocaleString('en-IN')}
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              {Math.round((summary.paidByShreyasINR / total) * 100)}% of pool
            </div>
          </div>
        </div>
      </div>

      {/* Category Spending Distribution Bar */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-slate-300">Category Spending Mix</span>
          <span className="text-[10px] font-mono text-slate-400">
            {Object.values(summary.categoryTotals).filter(v => v > 0).length} Categories active
          </span>
        </div>

        {/* Proportional Segmented Progress Bar */}
        <div className="h-3 w-full rounded-full bg-slate-950 p-0.5 border border-slate-800 flex overflow-hidden gap-0.5">
          {(Object.entries(summary.categoryTotals) as [ExpenseCategory, number][]).map(([cat, amount]) => {
            if (amount <= 0) return null;
            const pct = Math.max(2, Math.round((amount / total) * 100));
            const meta = CATEGORY_COLORS[cat];
            return (
              <div
                key={cat}
                style={{ width: `${pct}%`, backgroundColor: meta.color }}
                className="h-full first:rounded-l-full last:rounded-r-full transition-all duration-500"
                title={`${meta.name}: ₹${amount} (${pct}%)`}
              />
            );
          })}
        </div>

        {/* Legend Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {(Object.entries(summary.categoryTotals) as [ExpenseCategory, number][]).map(([cat, amount]) => {
            if (amount <= 0) return null;
            const meta = CATEGORY_COLORS[cat];
            return (
              <div
                key={cat}
                className="px-2 py-0.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[9px] font-mono text-slate-300 flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: meta.color }} />
                <span>{meta.name}:</span>
                <strong className="text-white font-bold">₹{amount.toLocaleString('en-IN')}</strong>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
