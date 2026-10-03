import React, { useMemo, useState } from 'react';
import { Expense, ExpenseCategory, PaymentMethod } from '../../../shared/types';
import { GullakFinancialSummary } from '../services/expenseStorage';
import { calculateDailySpendSeries, DailySpendPoint } from '../services/expenseExportService';
import { DUO_A_SON, DUO_B_SON } from '../../../shared/config/travellers.config';
import { 
  BarChart3, 
  PieChart, 
  CreditCard, 
  Users, 
  Calendar,
  Utensils,
  Car,
  Hotel,
  ShoppingBag,
  Flame,
  Accessibility,
  HeartPulse,
  MoreHorizontal
} from 'lucide-react';

interface GullakAnalyticsViewProps {
  expenses: Expense[];
  summary: GullakFinancialSummary;
}

const CATEGORY_META: Record<ExpenseCategory, { label: string; color: string; bg: string; icon: React.FC<{ className?: string; style?: React.CSSProperties }> }> = {
  FOOD: { label: 'Food & Tea', color: '#10b981', bg: 'bg-emerald-500', icon: Utensils },
  TOLL_TAXI: { label: 'Cab & Toll', color: '#38bdf8', bg: 'bg-sky-500', icon: Car },
  HOTEL: { label: 'Hotel & Stay', color: '#a855f7', bg: 'bg-purple-500', icon: Hotel },
  SHOPPING: { label: 'Shopping & Woolens', color: '#ec4899', bg: 'bg-pink-500', icon: ShoppingBag },
  RITUAL: { label: 'Pujas & Rituals', color: '#f59e0b', bg: 'bg-amber-500', icon: Flame },
  PORTER_DANDI: { label: 'Porter / Dandi', color: '#f97316', bg: 'bg-orange-500', icon: Accessibility },
  MEDICAL: { label: 'Medical & Vitals', color: '#ef4444', bg: 'bg-rose-500', icon: HeartPulse },
  MISC: { label: 'Misc & Cash', color: '#64748b', bg: 'bg-slate-500', icon: MoreHorizontal }
};

export const GullakAnalyticsView: React.FC<GullakAnalyticsViewProps> = ({
  expenses,
  summary
}) => {
  const dailySeries = useMemo(() => calculateDailySpendSeries(expenses), [expenses]);
  const [selectedPoint, setSelectedPoint] = useState<DailySpendPoint | null>(null);

  const maxDailySpend = useMemo(() => {
    return Math.max(...dailySeries.map(d => d.totalINR), 1);
  }, [dailySeries]);

  const paymentTotals = useMemo(() => {
    const counts: Record<PaymentMethod, number> = {
      UPI: 0,
      CASH: 0,
      CARD: 0,
      NET_BANKING: 0,
      OTHER: 0
    };
    expenses.forEach(exp => {
      const m = exp.paymentMethod || 'UPI';
      counts[m] = (counts[m] || 0) + (Number(exp.amountINR) || 0);
    });
    return counts;
  }, [expenses]);

  const totalSpent = summary.totalSpentINR || 1;

  return (
    <div className="space-y-4 animate-in fade-in">
      {/* 1. Daily Burn Bar Chart */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-temple-gold border border-amber-500/40 flex items-center justify-center">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white">Daily Burn Rate</h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Expenditure progression across pilgrimage dates
              </p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/25">
            Peak: ₹{maxDailySpend.toLocaleString('en-IN')}
          </div>
        </div>

        {dailySeries.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs">
            No expenses recorded yet to generate burn rate.
          </div>
        ) : (
          <div className="space-y-2 pt-2">
            {/* SVG Interactive Bar Graph */}
            <div className="h-44 w-full flex items-end justify-between gap-1.5 px-2 pb-1 bg-slate-950/60 rounded-2xl border border-slate-800/80">
              {dailySeries.map(pt => {
                const heightPct = Math.max(10, Math.round((pt.totalINR / maxDailySpend) * 85));
                const isSelected = selectedPoint?.dateKey === pt.dateKey;
                return (
                  <div
                    key={pt.dateKey}
                    onClick={() => setSelectedPoint(prev => prev?.dateKey === pt.dateKey ? null : pt)}
                    className="flex-1 flex flex-col items-center justify-end h-full cursor-pointer group tap-active"
                  >
                    {/* Amount Tag above bar on hover / select */}
                    <span className={`text-[9px] font-mono transition-opacity mb-1 ${
                      isSelected ? 'text-amber-300 font-bold opacity-100' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                    }`}>
                      ₹{Math.round(pt.totalINR / 1000)}k
                    </span>

                    {/* Bar Pillar */}
                    <div 
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[36px] rounded-t-lg transition-all ${
                        isSelected 
                          ? 'bg-gradient-to-t from-amber-500 to-amber-300 shadow-lg shadow-amber-500/30' 
                          : 'bg-gradient-to-t from-slate-700 via-slate-600 to-slate-400 group-hover:from-amber-600 group-hover:to-amber-400'
                      }`}
                    />

                    {/* Date Label */}
                    <span className={`text-[9px] font-mono mt-1.5 transition-colors truncate max-w-[42px] ${
                      isSelected ? 'text-amber-300 font-bold' : 'text-slate-400 group-hover:text-white'
                    }`}>
                      {pt.displayDate}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Selected Day Details Card */}
            {selectedPoint && (
              <div className="p-2.5 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center justify-between text-xs animate-in fade-in">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-temple-gold" />
                  <span className="font-bold text-white">{selectedPoint.displayDate}:</span>
                  <span className="text-slate-400 font-mono">({selectedPoint.itemCount} bills)</span>
                </div>
                <div className="font-mono font-black text-amber-300 text-sm">
                  ₹{selectedPoint.totalINR.toLocaleString('en-IN')}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Category Distribution */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-white">Category Allocation</h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Spending breakdown by pilgrimage necessity
              </p>
            </div>
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            Total: ₹{summary.totalSpentINR.toLocaleString('en-IN')}
          </div>
        </div>

        {/* Horizontal Progress Bars */}
        <div className="space-y-2.5 pt-1">
          {Object.entries(summary.categoryTotals)
            .filter(([_, amt]) => amt > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([cat, amt]) => {
              const meta = CATEGORY_META[cat as ExpenseCategory] || CATEGORY_META.MISC;
              const Icon = meta.icon;
              const pct = Math.round((amt / totalSpent) * 100);

              return (
                <div key={cat} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-200">
                      <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
                      <span>{meta.label}</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[10px] text-slate-500">{pct}%</span>
                      <span className="text-white font-bold">₹{amt.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.max(4, pct)}%`, 
                        backgroundColor: meta.color 
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* 3. Duo Contribution vs Fair Share Comparison */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/40 flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white">Family Contribution Balance</h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Family A vs Family B out-of-pocket funding
            </p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {/* Progress Split Bar */}
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex border border-slate-800">
            <div 
              style={{ width: `${Math.round((summary.paidByUtkarshINR / totalSpent) * 100)}%` }}
              className="bg-sky-500 h-full transition-all"
              title={`${DUO_A_SON.name}: ₹${summary.paidByUtkarshINR}`}
            />
            <div 
              style={{ width: `${Math.round((summary.paidByShreyasINR / totalSpent) * 100)}%` }}
              className="bg-emerald-500 h-full transition-all"
              title={`${DUO_B_SON.name}: ₹${summary.paidByShreyasINR}`}
            />
          </div>

          <div className="flex items-center justify-between text-xs font-mono pt-1">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
              <span className="text-sky-300 font-bold">{DUO_A_SON.name}:</span>
              <span className="text-white">₹{summary.paidByUtkarshINR.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-500">
                ({Math.round((summary.paidByUtkarshINR / totalSpent) * 100)}%)
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-emerald-300 font-bold">{DUO_B_SON.name}:</span>
              <span className="text-white">₹{summary.paidByShreyasINR.toLocaleString('en-IN')}</span>
              <span className="text-[10px] text-slate-500">
                ({Math.round((summary.paidByShreyasINR / totalSpent) * 100)}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Payment Methods Distribution */}
      <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center">
            <CreditCard className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white">Payment Methods Used</h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Cash vs UPI digital transactions
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-lg block mb-0.5">📱</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">UPI Digital</span>
            <span className="text-xs font-mono font-black text-sky-400">
              ₹{paymentTotals.UPI.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-lg block mb-0.5">💵</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Hard Cash</span>
            <span className="text-xs font-mono font-black text-emerald-400">
              ₹{paymentTotals.CASH.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-lg block mb-0.5">💳</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Card & Other</span>
            <span className="text-xs font-mono font-black text-amber-400">
              ₹{(paymentTotals.CARD + paymentTotals.NET_BANKING + paymentTotals.OTHER).toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
