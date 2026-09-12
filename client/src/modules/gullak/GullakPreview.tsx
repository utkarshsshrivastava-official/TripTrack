import React, { useState } from 'react';
import { Expense, ExpenseCategory, DuoId } from '../../shared/types';
import { 
  PlusCircle, 
  Wallet, 
  Car, 
  Flame, 
  Utensils, 
  Hotel, 
  Accessibility, 
  MoreHorizontal 
} from 'lucide-react';

interface GullakPreviewProps {
  activeDuo: DuoId | 'ALL';
}

const SAMPLE_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Haridwar to Joshimath Mountain Cab Advance',
    amountINR: 12500,
    paidBy: 'Utkarsh',
    category: 'TOLL_TAXI',
    createdAt: '2026-09-24T18:00:00Z'
  },
  {
    id: 'exp-2',
    title: 'Brahma Kapal Ritual Samagri & Dakshina Advance',
    amountINR: 5100,
    paidBy: 'Cousin',
    category: 'RITUAL',
    createdAt: '2026-09-25T14:30:00Z'
  },
  {
    id: 'exp-3',
    title: 'Cheetal Grand Lunch (4 Satvik Thalis + Chai)',
    amountINR: 1840,
    paidBy: 'Utkarsh',
    category: 'FOOD',
    createdAt: '2026-09-25T14:45:00Z'
  },
  {
    id: 'exp-4',
    title: 'Warm Woolen Shawls & Thermal Gloves for Elders',
    amountINR: 3200,
    paidBy: 'Cousin',
    category: 'MISC',
    createdAt: '2026-09-26T17:00:00Z'
  }
];

export const GullakPreview: React.FC<GullakPreviewProps> = () => {
  const [expenses, setExpenses] = useState<Expense[]>(SAMPLE_EXPENSES);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState<ExpenseCategory>('FOOD');
  const [newPaidBy, setNewPaidBy] = useState<'Utkarsh' | 'Cousin'>('Utkarsh');
  const [showAddForm, setShowAddForm] = useState(false);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amountINR, 0);
  const utkarshPaid = expenses.filter(e => e.paidBy === 'Utkarsh').reduce((sum, e) => sum + e.amountINR, 0);
  const cousinPaid = expenses.filter(e => e.paidBy === 'Cousin').reduce((sum, e) => sum + e.amountINR, 0);

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newAmount) return;

    const added: Expense = {
      id: `exp-${Date.now()}`,
      title: newTitle,
      amountINR: parseFloat(newAmount),
      paidBy: newPaidBy,
      category: newCategory,
      createdAt: new Date().toISOString()
    };

    setExpenses([added, ...expenses]);
    setNewTitle('');
    setNewAmount('');
    setShowAddForm(false);
  };

  const getCategoryIcon = (cat: ExpenseCategory) => {
    switch (cat) {
      case 'RITUAL': return <Flame className="w-4 h-4 text-amber-400" />;
      case 'TOLL_TAXI': return <Car className="w-4 h-4 text-sky-400" />;
      case 'FOOD': return <Utensils className="w-4 h-4 text-emerald-400" />;
      case 'PORTER_DANDI': return <Accessibility className="w-4 h-4 text-rose-400" />;
      case 'HOTEL': return <Hotel className="w-4 h-4 text-purple-400" />;
      case 'MISC': return <MoreHorizontal className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Pool Header Summary Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-br from-amber-950/60 via-alpine-900 to-slate-950 border border-amber-700/50 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-900/60 border border-amber-600 text-amber-300">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-400">
                Shared Yatra Cash Pool
              </span>
              <h3 className="text-xl font-black text-white">
                ₹{totalSpent.toLocaleString('en-IN')}
              </h3>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="tap-active px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-temple-saffron text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-amber-950/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Cash</span>
          </button>
        </div>

        {/* Pair Split Ratio */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 font-bold block">Utkarsh Paid</span>
            <strong className="text-blue-400 font-mono text-sm">₹{utkarshPaid.toLocaleString('en-IN')}</strong>
          </div>
          <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-[10px] text-slate-400 font-bold block">Cousin Paid</span>
            <strong className="text-emerald-400 font-mono text-sm">₹{cousinPaid.toLocaleString('en-IN')}</strong>
          </div>
        </div>
      </div>

      {/* Add Expense Drawer/Form */}
      {showAddForm && (
        <form onSubmit={handleAddExpense} className="p-4 rounded-2xl bg-alpine-900 border border-slate-700 space-y-3 animate-in fade-in">
          <div className="text-xs font-bold text-white uppercase tracking-wider">
            Record Shared Pilgrimage Expense
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block font-semibold mb-1">Expense Title</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g., Pind Daan Samagri / Tea break"
              required
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-slate-400 block font-semibold mb-1">Amount (₹)</label>
              <input
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                placeholder="500"
                required
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block font-semibold mb-1">Paid By</label>
              <select
                value={newPaidBy}
                onChange={(e) => setNewPaidBy(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Utkarsh">Utkarsh (Duo A)</option>
                <option value="Cousin">Cousin (Duo B)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block font-semibold mb-1">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as any)}
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="FOOD">Food & Warm Meals</option>
              <option value="RITUAL">Ritual (Brahma Kapal / Puja)</option>
              <option value="TOLL_TAXI">Cab, Diesel & Tolls</option>
              <option value="PORTER_DANDI">Elder Porter / Dandi</option>
              <option value="HOTEL">Hotels & Stays</option>
              <option value="MISC">Misc Items</option>
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="submit"
              className="tap-active flex-1 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400"
            >
              Save Entry
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="tap-active px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-bold text-xs"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Expenses History */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Recent Cash Outflows
        </div>

        {expenses.map((exp) => (
          <div
            key={exp.id}
            className="p-3 rounded-2xl bg-alpine-900/80 border border-slate-800 flex items-center justify-between gap-2"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700">
                {getCategoryIcon(exp.category)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {exp.title}
                </h4>
                <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-medium">
                    {exp.paidBy}
                  </span>
                  <span>•</span>
                  <span>{new Date(exp.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs font-mono font-black text-amber-300">
                ₹{exp.amountINR.toLocaleString('en-IN')}
              </div>
              <span className="text-[9px] text-slate-500 font-semibold uppercase">
                {exp.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
