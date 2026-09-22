import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, ExpenseSplitMode, DuoId } from '../../shared/types';
import { 
  Plus, 
  Car, 
  Flame, 
  Utensils, 
  Hotel, 
  Accessibility, 
  MoreHorizontal,
  Trash2,
  Award,
  ReceiptText,
  ExternalLink,
  X
} from 'lucide-react';
import { 
  DUO_A_SON, 
  DUO_B_SON 
} from '../../shared/config/travellers.config';
import { 
  getExpensesFromDexie, 
  saveExpenseToDexie, 
  deleteExpenseFromDexie, 
  calculateGullakSummary 
} from './services/expenseStorage';
import { GullakBalanceHero } from './components/GullakBalanceHero';
import { SettlementGauge } from './components/SettlementGauge';
import { AddExpenseSheet } from './components/AddExpenseSheet';

interface GullakPreviewProps {
  activeDuo: DuoId | 'ALL';
  onOpenMemorial?: () => void;
}

export const GullakPreview: React.FC<GullakPreviewProps> = ({ activeDuo, onOpenMemorial }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'ALL'>('ALL');
  const [viewingReceipt, setViewingReceipt] = useState<{
    url: string;
    title: string;
    amount: number;
    paidBy?: string;
  } | null>(null);

  useEffect(() => {
    getExpensesFromDexie().then(setExpenses);

    const handleUpdate = () => {
      getExpensesFromDexie().then(setExpenses);
    };
    window.addEventListener('triptrack_expense_update', handleUpdate);
    return () => window.removeEventListener('triptrack_expense_update', handleUpdate);
  }, []);

  const summary = calculateGullakSummary(expenses);

  const handleAddExpense = async (data: {
    title: string;
    amountINR: number;
    paidBy: string;
    category: ExpenseCategory;
    receiptUrl?: string;
    paymentSplits?: {
      utkarshPaidINR: number;
      shreyasPaidINR: number;
    };
    splitMode?: ExpenseSplitMode;
    owedSplits?: {
      utkarshOwesINR: number;
      shreyasOwesINR: number;
    };
  }) => {
    const added = await saveExpenseToDexie({
      title: data.title,
      amountINR: data.amountINR,
      paidBy: data.paidBy,
      category: data.category,
      receiptUrl: data.receiptUrl,
      paymentSplits: data.paymentSplits,
      splitMode: data.splitMode,
      owedSplits: data.owedSplits,
      createdAt: new Date().toISOString()
    });

    setExpenses(prev => [added, ...prev]);
  };

  const handleDeleteExpense = async (id: string) => {
    await deleteExpenseFromDexie(id);
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case 'TOLL_TAXI': return <Car className="w-4 h-4 text-sky-400" />;
      case 'RITUAL': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'FOOD': return <Utensils className="w-4 h-4 text-emerald-400" />;
      case 'HOTEL': return <Hotel className="w-4 h-4 text-purple-400" />;
      case 'PORTER_DANDI': return <Accessibility className="w-4 h-4 text-orange-400" />;
      case 'MISC': default: return <MoreHorizontal className="w-4 h-4 text-slate-400" />;
    }
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
    if (!matchesCategory) return false;

    if (activeDuo === 'DUO_A') {
      if (e.paidBy === DUO_A_SON.name) return true;
      if (e.paidBy === 'Multiple' && (e.paymentSplits?.utkarshPaidINR ?? 0) > 0) return true;
      return false;
    }
    if (activeDuo === 'DUO_B') {
      if (e.paidBy === DUO_B_SON.name) return true;
      if (e.paidBy === 'Multiple' && (e.paymentSplits?.shreyasPaidINR ?? 0) > 0) return true;
      return false;
    }
    return true;
  });

  return (
    <div className="relative space-y-4 pb-28">
      {/* 1. Apple Card-Grade Balance Hero */}
      <GullakBalanceHero summary={summary} onOpenAddModal={() => setIsAddSheetOpen(true)} />

      {/* 2. Bilateral 50/50 Settlement Gauge & 1-Tap WhatsApp Dispatcher */}
      <SettlementGauge summary={summary} />

      {/* 3. Yatra Memorial & 50/50 Final Certificate Launcher */}
      {onOpenMemorial && (
        <button
          type="button"
          onClick={onOpenMemorial}
          className="tap-active w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/40 text-amber-200 text-xs font-bold flex items-center justify-between shadow-lg transition-all min-h-touch"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-amber-500/20 text-temple-gold">
              <Award className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-white font-extrabold block">Generate Yatra Memorial & Certificate</span>
              <span className="text-[10px] text-amber-300/80 font-mono">Print-ready 50/50 audit keepsake</span>
            </div>
          </div>
          <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-lg border border-amber-500/30">
            PDF Export
          </span>
        </button>
      )}

      {/* 4. Category Filter Chips Strip */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs px-1">
          <span className="font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
            <ReceiptText className="w-3.5 h-3.5 text-temple-gold" />
            <span>Transaction Ledger</span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">
            {filteredExpenses.length} Records
          </span>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all tap-active ${
              selectedCategory === 'ALL'
                ? 'bg-temple-saffron text-slate-950 shadow-md font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All Items ({expenses.length})
          </button>
          {(['FOOD', 'TOLL_TAXI', 'RITUAL', 'HOTEL', 'PORTER_DANDI', 'MISC'] as ExpenseCategory[]).map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all tap-active flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-slate-200 text-slate-950 font-black shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {getCategoryIcon(cat)}
              <span>{cat.replace('_', ' ')}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 5. Itemized Transaction Ledger */}
      <div className="space-y-2">
        {filteredExpenses.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 space-y-2">
            <p className="text-xs font-medium">No expenses logged under this filter.</p>
            <button
              type="button"
              onClick={() => setIsAddSheetOpen(true)}
              className="text-xs text-temple-gold font-bold underline"
            >
              Log an expense now
            </button>
          </div>
        ) : (
          filteredExpenses.map(expense => (
            <div
              key={expense.id}
              className="p-3.5 rounded-2xl bg-slate-900/85 border border-slate-800/80 flex items-center justify-between shadow-sm hover:border-slate-700 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                  {getCategoryIcon(expense.category)}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-extrabold text-white leading-tight truncate">
                    {expense.title}
                  </h4>
                  <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5 mt-1 font-mono">
                    {expense.paidBy === 'Multiple' && expense.paymentSplits ? (
                      <span className="text-amber-300 font-bold bg-amber-500/15 px-1.5 py-0.5 rounded-md border border-amber-500/30">
                        Paid: Utkarsh ₹{expense.paymentSplits.utkarshPaidINR} • Shreyas ₹{expense.paymentSplits.shreyasPaidINR}
                      </span>
                    ) : (
                      <span className="text-amber-300/90 font-semibold">
                        Paid by {expense.paidBy}
                      </span>
                    )}

                    {expense.splitMode === 'FULL_FAMILY_A' && (
                      <span className="text-emerald-300 font-bold bg-emerald-500/15 px-1.5 py-0.5 rounded-md border border-emerald-500/30">
                        100% Fam A
                      </span>
                    )}
                    {expense.splitMode === 'FULL_FAMILY_B' && (
                      <span className="text-sky-300 font-bold bg-sky-500/15 px-1.5 py-0.5 rounded-md border border-sky-500/30">
                        100% Fam B
                      </span>
                    )}
                    {expense.splitMode === 'CUSTOM_AMOUNTS' && expense.owedSplits && (
                      <span className="text-indigo-300 font-bold bg-indigo-500/15 px-1.5 py-0.5 rounded-md border border-indigo-500/30">
                        Split: ₹{expense.owedSplits.utkarshOwesINR} / ₹{expense.owedSplits.shreyasOwesINR}
                      </span>
                    )}

                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{new Date(expense.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0 ml-2">
                {expense.receiptUrl && (
                  <button
                    type="button"
                    onClick={() => setViewingReceipt({
                      url: expense.receiptUrl!,
                      title: expense.title,
                      amount: expense.amountINR,
                      paidBy: expense.paidBy === 'Multiple' && expense.paymentSplits 
                        ? `Utkarsh (₹${expense.paymentSplits.utkarshPaidINR}) & Shreyas (₹${expense.paymentSplits.shreyasPaidINR})` 
                        : expense.paidBy
                    })}
                    className="p-1 px-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold flex items-center gap-1 hover:bg-amber-500/20 tap-active"
                    title="View Receipt Proof"
                  >
                    <ReceiptText className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bill</span>
                  </button>
                )}
                <span className="text-sm font-black font-mono text-white">
                  ₹{expense.amountINR.toLocaleString('en-IN')}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteExpense(expense.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 tap-active"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 6. Floating Action Button (FAB) for Adding Expenses */}
      <div className="fixed bottom-[calc(max(0.75rem,env(safe-area-inset-bottom,0px))+4.5rem)] right-4 sm:right-auto sm:left-1/2 sm:translate-x-32 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={() => setIsAddSheetOpen(true)}
          className="tap-active flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-temple-saffron via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-2xl shadow-amber-950/80 border border-amber-300/60 hover:scale-105 active:scale-95 transition-all min-h-touch"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* 7. Frictionless Add Expense Bottom Sheet */}
      <AddExpenseSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
        onAddExpense={handleAddExpense}
      />

      {/* 8. Receipt Proof Viewer Modal */}
      {viewingReceipt && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in"
          onClick={() => setViewingReceipt(null)}
        >
          <div 
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="min-w-0 pr-2">
                <h3 className="text-sm font-extrabold text-white truncate flex items-center gap-1.5">
                  <ReceiptText className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{viewingReceipt.title}</span>
                </h3>
                <p className="text-[11px] font-mono text-amber-300 font-bold">
                  ₹{viewingReceipt.amount.toLocaleString('en-IN')} {viewingReceipt.paidBy ? `• Paid by ${viewingReceipt.paidBy}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={viewingReceipt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 tap-active"
                  title="Open Original"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setViewingReceipt(null)}
                  className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 tap-active"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Receipt Image Display */}
            <div className="p-3 overflow-y-auto flex-1 flex items-center justify-center bg-slate-950/80">
              <img
                src={viewingReceipt.url}
                alt={viewingReceipt.title}
                className="max-h-[65vh] w-auto max-w-full rounded-2xl object-contain border border-slate-800 shadow-lg"
              />
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs tap-active min-h-touch min-w-touch flex items-center justify-center"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
