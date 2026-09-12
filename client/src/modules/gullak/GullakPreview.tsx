import React, { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, DuoId } from '../../shared/types';
import { 
  PlusCircle, 
  Wallet, 
  Car, 
  Flame, 
  Utensils, 
  Hotel, 
  Accessibility, 
  MoreHorizontal,
  X,
  Trash2,
  CheckCircle,
  ArrowRightLeft,
  DollarSign
} from 'lucide-react';
import { 
  COORDINATOR_MEMBERS, 
  DUO_A_SON, 
  DUO_B_SON 
} from '../../shared/config/travellers.config';
import { 
  getExpensesFromDexie, 
  saveExpenseToDexie, 
  deleteExpenseFromDexie, 
  calculateGullakSummary 
} from './services/expenseStorage';

interface GullakPreviewProps {
  activeDuo: DuoId | 'ALL';
}

export const GullakPreview: React.FC<GullakPreviewProps> = ({ activeDuo }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newPaidBy, setNewPaidBy] = useState<string>(DUO_A_SON.name);
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('FOOD');
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'ALL'>('ALL');

  useEffect(() => {
    getExpensesFromDexie().then(setExpenses);
  }, []);

  const summary = calculateGullakSummary(expenses);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAmount || isNaN(Number(newAmount))) return;

    const added = await saveExpenseToDexie({
      title: newTitle.trim(),
      amountINR: Math.round(Number(newAmount)),
      paidBy: newPaidBy,
      category: newCategory,
      createdAt: new Date().toISOString()
    });

    setExpenses(prev => [added, ...prev]);
    setNewTitle('');
    setNewAmount('');
    setShowAddModal(false);
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

    if (activeDuo === 'DUO_A') return e.paidBy === DUO_A_SON.name;
    if (activeDuo === 'DUO_B') return e.paidBy === DUO_B_SON.name;
    return true;
  });

  return (
    <div className="space-y-4 pb-20">
      {/* Total Pool & 50/50 Split Settlement Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-slate-900 via-alpine-900 to-slate-950 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-temple-gold/20 text-temple-gold flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">
                Pilgrimage Shared Cash Pool
              </span>
              <span className="text-xs font-bold text-white">Yatra Gullak (50/50 Split)</span>
            </div>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-temple-saffron to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md tap-active"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Big Total Spend */}
        <div className="text-center py-1">
          <span className="text-xs text-slate-400 block font-medium">Total Collective Trip Outlay</span>
          <div className="text-3xl font-black font-mono text-white mt-0.5 tracking-tight">
            ₹{summary.totalSpentINR.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Equal Coordinator Share: ₹{summary.fairSharePerCoordinatorINR.toLocaleString('en-IN')} each
          </span>
        </div>

        {/* 50/50 Coordinator Breakdown */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
          <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-bold text-sky-400 uppercase">Paid by {DUO_A_SON.name}</div>
            <div className="text-base font-mono font-bold text-white">
              ₹{summary.paidByUtkarshINR.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-2.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-[10px] font-bold text-emerald-400 uppercase">Paid by {DUO_B_SON.name}</div>
            <div className="text-base font-mono font-bold text-white">
              ₹{summary.paidByShreyasINR.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Net Settlement Banner */}
        <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-950/40 via-alpine-900 to-slate-950 border border-amber-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="w-4 h-4 text-amber-400 shrink-0" />
            <div className="text-xs">
              {summary.netSettlement.isSettled ? (
                <span className="text-emerald-300 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>All expenses are currently even!</span>
                </span>
              ) : (
                <span className="text-slate-200">
                  <strong className="text-amber-300 font-bold">{summary.netSettlement.debtorName}</strong> owes{' '}
                  <strong className="text-white font-bold">{summary.netSettlement.creditorName}</strong>
                </span>
              )}
            </div>
          </div>
          {!summary.netSettlement.isSettled && (
            <span className="text-sm font-black font-mono text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-800/80">
              ₹{summary.netSettlement.amountINR.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all tap-active ${
            selectedCategory === 'ALL'
              ? 'bg-temple-saffron text-slate-950'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Items ({expenses.length})
        </button>
        {(['TOLL_TAXI', 'FOOD', 'RITUAL', 'HOTEL', 'MISC'] as ExpenseCategory[]).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all tap-active flex items-center gap-1.5 ${
              selectedCategory === cat
                ? 'bg-slate-200 text-slate-950 font-black'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {getCategoryIcon(cat)}
            <span>{cat.replace('_', ' ')}</span>
          </button>
        ))}
      </div>

      {/* Expense List */}
      <div className="space-y-2">
        {filteredExpenses.map(expense => (
          <div
            key={expense.id}
            className="p-3 rounded-2xl bg-alpine-900/90 border border-slate-800 flex items-center justify-between shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                {getCategoryIcon(expense.category)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-tight">{expense.title}</h4>
                <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                  <span className="text-amber-300/90 font-medium">Paid by: {expense.paidBy}</span>
                  <span>•</span>
                  <span className="font-mono">{new Date(expense.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-bold font-mono text-white">
                ₹{expense.amountINR.toLocaleString('en-IN')}
              </span>
              <button
                onClick={() => handleDeleteExpense(expense.id)}
                className="p-1.5 text-slate-500 hover:text-rose-400 tap-active"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div 
            className="w-full max-w-lg bg-slate-900 border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Add Pilgrimage Expense</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Expense Description
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="e.g. Badrinath Temple Special Entry Ticket"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Amount (₹ INR)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newAmount}
                    onChange={e => setNewAmount(e.target.value)}
                    placeholder="e.g. 2500"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white font-mono placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Paid By
                  </label>
                  <select
                    value={newPaidBy}
                    onChange={e => setNewPaidBy(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
                  >
                    {COORDINATOR_MEMBERS.map(member => (
                      <option key={member.id} value={member.name}>
                        {member.name} ({member.duoId === 'DUO_A' ? 'Family A' : 'Family B'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['FOOD', 'TOLL_TAXI', 'RITUAL', 'HOTEL', 'PORTER_DANDI', 'MISC'] as ExpenseCategory[]).map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setNewCategory(cat)}
                      className={`p-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        newCategory === cat
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {getCategoryIcon(cat)}
                      <span className="text-[10px]">{cat.replace('_', ' ')}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-temple-saffron to-amber-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/40 tap-active min-h-[48px]"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Save to Gullak Pool</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
