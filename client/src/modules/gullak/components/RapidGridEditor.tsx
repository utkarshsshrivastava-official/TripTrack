import React, { useState } from 'react';
import { Expense, ExpenseCategory, ExpenseSplitMode, PaymentMethod } from '../../../shared/types';
import { DUO_A_SON, DUO_B_SON } from '../../../shared/config/travellers.config';
import { Plus, Trash2, CheckCircle2, Save } from 'lucide-react';

interface RapidGridEditorProps {
  expenses: Expense[];
  onSaveExpense: (expense: Partial<Expense> & { id?: string; title: string; amountINR: number; paidBy: string; category: ExpenseCategory }) => Promise<void>;
  onDeleteExpense: (id: string) => Promise<void>;
}

interface DraftRow {
  localId: string;
  isNew: boolean;
  id?: string;
  createdAt: string;
  title: string;
  venueName: string;
  venueLocation: string;
  amountINR: string;
  paidBy: string;
  splitMode: ExpenseSplitMode;
  paymentMethod: PaymentMethod;
  category: ExpenseCategory;
  isDirty?: boolean;
}

const CATEGORY_OPTIONS: { id: ExpenseCategory; label: string }[] = [
  { id: 'FOOD', label: 'Food & Tea' },
  { id: 'TOLL_TAXI', label: 'Cab & Toll' },
  { id: 'HOTEL', label: 'Hotel & Stay' },
  { id: 'SHOPPING', label: 'Shopping & Woolens' },
  { id: 'RITUAL', label: 'Pujas & Rituals' },
  { id: 'PORTER_DANDI', label: 'Porter / Dandi' },
  { id: 'MEDICAL', label: 'Medical & Vitals' },
  { id: 'MISC', label: 'Misc & Cash' },
];

const PAYMENT_OPTIONS: { id: PaymentMethod; label: string }[] = [
  { id: 'UPI', label: 'UPI' },
  { id: 'CASH', label: 'Cash' },
  { id: 'CARD', label: 'Card' },
  { id: 'NET_BANKING', label: 'NetBank' },
  { id: 'OTHER', label: 'Other' },
];

export const RapidGridEditor: React.FC<RapidGridEditorProps> = ({
  expenses,
  onSaveExpense,
  onDeleteExpense
}) => {
  const [rows, setRows] = useState<DraftRow[]>(() => {
    return expenses.map(exp => ({
      localId: exp.id,
      isNew: false,
      id: exp.id,
      createdAt: exp.createdAt ? exp.createdAt.slice(0, 10) : new Date().toISOString().slice(0, 10),
      title: exp.title,
      venueName: exp.venueName || '',
      venueLocation: exp.venueLocation || '',
      amountINR: String(exp.amountINR),
      paidBy: exp.paidBy || DUO_A_SON.name,
      splitMode: exp.splitMode || 'EQUAL_50_50',
      paymentMethod: exp.paymentMethod || 'UPI',
      category: exp.category || 'FOOD',
      isDirty: false
    }));
  });

  const [savingRows, setSavingRows] = useState<Record<string, boolean>>({});
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const updateRow = (localId: string, patch: Partial<DraftRow>) => {
    setRows(prev => prev.map(r => r.localId === localId ? { ...r, ...patch, isDirty: true } : r));
  };

  const handleCommitRow = async (row: DraftRow) => {
    if (!row.title.trim() || !row.amountINR || Number(row.amountINR) <= 0) return;

    setSavingRows(prev => ({ ...prev, [row.localId]: true }));
    try {
      const createdAtIso = row.createdAt ? new Date(row.createdAt + 'T12:00:00').toISOString() : new Date().toISOString();

      await onSaveExpense({
        id: row.isNew ? undefined : row.id,
        title: row.title.trim(),
        amountINR: Math.round(Number(row.amountINR)),
        paidBy: row.paidBy,
        splitMode: row.splitMode,
        paymentMethod: row.paymentMethod,
        category: row.category,
        venueName: row.venueName.trim() || undefined,
        venueLocation: row.venueLocation.trim() || undefined,
        createdAt: createdAtIso
      });

      setRows(prev => prev.map(r => r.localId === row.localId ? { ...r, isDirty: false, isNew: false } : r));
      setSaveSuccessNotice(`Saved ₹${row.amountINR} (${row.title.trim()})`);
      setTimeout(() => setSaveSuccessNotice(null), 3000);
    } catch (err) {
      console.error('Failed to commit row', err);
    } finally {
      setSavingRows(prev => ({ ...prev, [row.localId]: false }));
    }
  };

  const handleAddNewRow = () => {
    const lastRow = rows[rows.length - 1];
    const defaultDate = lastRow ? lastRow.createdAt : new Date().toISOString().slice(0, 10);
    const defaultPayer = lastRow ? lastRow.paidBy : DUO_A_SON.name;
    const defaultCategory = lastRow ? lastRow.category : 'FOOD';

    const newRow: DraftRow = {
      localId: 'draft-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      isNew: true,
      createdAt: defaultDate,
      title: '',
      venueName: '',
      venueLocation: '',
      amountINR: '',
      paidBy: defaultPayer,
      splitMode: 'EQUAL_50_50',
      paymentMethod: 'UPI',
      category: defaultCategory,
      isDirty: true
    };

    setRows(prev => [...prev, newRow]);
  };

  const handleDeleteRow = async (row: DraftRow) => {
    if (row.isNew || !row.id) {
      setRows(prev => prev.filter(r => r.localId !== row.localId));
      return;
    }

    try {
      await onDeleteExpense(row.id);
      setRows(prev => prev.filter(r => r.localId !== row.localId));
    } catch (err) {
      console.error('Failed to delete row', err);
    }
  };

  const totalGridINR = rows.reduce((acc, r) => acc + (Number(r.amountINR) || 0), 0);

  return (
    <div className="space-y-3 animate-in fade-in">
      {/* Rapid Grid Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-temple-gold border border-amber-500/40 flex items-center justify-center font-black">
            ⚡
          </div>
          <div>
            <h3 className="text-xs font-black text-white flex items-center gap-1.5">
              <span>Rapid Spreadsheet Batch Mode</span>
              <span className="text-[10px] text-amber-300 font-mono">({rows.length} rows)</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Tab through cells & hit Save row to instantly sync with Dexie & Cloud
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccessNotice && (
            <span className="text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1 bg-emerald-950/40 border border-emerald-500/30 px-2 py-1 rounded-lg animate-in fade-in">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span>{saveSuccessNotice}</span>
            </span>
          )}
          <div className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono font-bold text-amber-400">
            Total: ₹{totalGridINR.toLocaleString('en-IN')}
          </div>
          <button
            type="button"
            onClick={handleAddNewRow}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow flex items-center gap-1 transition-all tap-active"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
        </div>
      </div>

      {/* Spreadsheet Table Container */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-x-auto shadow-xl">
        <table className="w-full text-left border-collapse min-w-[760px] lg:min-w-full text-xs">
          <thead>
            <tr className="bg-slate-900/90 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400">
              <th className="p-2.5 pl-3 w-8">#</th>
              <th className="p-2.5 w-28">Date</th>
              <th className="p-2.5 min-w-[160px]">Description</th>
              <th className="p-2.5 min-w-[120px]">Venue / Town</th>
              <th className="p-2.5 w-24">Amount (₹)</th>
              <th className="p-2.5 w-28">Paid By</th>
              <th className="p-2.5 w-24">Split</th>
              <th className="p-2.5 w-20">Method</th>
              <th className="p-2.5 w-28">Category</th>
              <th className="p-2.5 pr-3 w-20 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {rows.map((row, idx) => {
              const isSaving = savingRows[row.localId];
              return (
                <tr 
                  key={row.localId}
                  className={`transition-colors ${row.isDirty ? 'bg-amber-950/20' : 'hover:bg-slate-900/40'}`}
                >
                  {/* Row Number */}
                  <td className="p-2 pl-3 font-mono text-[10px] text-slate-500">
                    {idx + 1}
                  </td>

                  {/* Date */}
                  <td className="p-1">
                    <input
                      type="date"
                      value={row.createdAt}
                      onChange={e => updateRow(row.localId, { createdAt: e.target.value })}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-white focus:outline-none focus:border-amber-400"
                    />
                  </td>

                  {/* Description */}
                  <td className="p-1">
                    <input
                      type="text"
                      value={row.title}
                      placeholder="e.g. Lunch & Chai"
                      onChange={e => updateRow(row.localId, { title: e.target.value })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleCommitRow(row);
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </td>

                  {/* Venue & Town */}
                  <td className="p-1">
                    <input
                      type="text"
                      value={row.venueLocation || row.venueName}
                      placeholder="Town / Hotel"
                      onChange={e => updateRow(row.localId, { venueLocation: e.target.value })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleCommitRow(row);
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </td>

                  {/* Amount */}
                  <td className="p-1">
                    <input
                      type="number"
                      min="1"
                      value={row.amountINR}
                      placeholder="0"
                      onChange={e => updateRow(row.localId, { amountINR: e.target.value })}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleCommitRow(row);
                      }}
                      className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                    />
                  </td>

                  {/* Paid By */}
                  <td className="p-1">
                    <select
                      value={row.paidBy}
                      onChange={e => updateRow(row.localId, { paidBy: e.target.value })}
                      className="w-full px-1.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value={DUO_A_SON.name}>🔵 {DUO_A_SON.name}</option>
                      <option value={DUO_B_SON.name}>🟢 {DUO_B_SON.name}</option>
                      <option value="Multiple">🟡 Both</option>
                    </select>
                  </td>

                  {/* Split */}
                  <td className="p-1">
                    <select
                      value={row.splitMode}
                      onChange={e => updateRow(row.localId, { splitMode: e.target.value as ExpenseSplitMode })}
                      className="w-full px-1.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="EQUAL_50_50">50/50</option>
                      <option value="FULL_FAMILY_A">Fam A</option>
                      <option value="FULL_FAMILY_B">Fam B</option>
                      <option value="CUSTOM_AMOUNTS">Custom</option>
                    </select>
                  </td>

                  {/* Payment Method */}
                  <td className="p-1">
                    <select
                      value={row.paymentMethod}
                      onChange={e => updateRow(row.localId, { paymentMethod: e.target.value as PaymentMethod })}
                      className="w-full px-1 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-white focus:outline-none focus:border-amber-400"
                    >
                      {PAYMENT_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </td>

                  {/* Category */}
                  <td className="p-1">
                    <select
                      value={row.category}
                      onChange={e => updateRow(row.localId, { category: e.target.value as ExpenseCategory })}
                      className="w-full px-1 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-white focus:outline-none focus:border-amber-400"
                    >
                      {CATEGORY_OPTIONS.map(opt => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </td>

                  {/* Action Buttons */}
                  <td className="p-1 pr-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      {row.isDirty && (
                        <button
                          type="button"
                          disabled={isSaving}
                          onClick={() => handleCommitRow(row)}
                          className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 tap-active"
                          title="Save this row"
                        >
                          <Save className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteRow(row)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 tap-active"
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between p-2">
        <button
          type="button"
          onClick={handleAddNewRow}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold flex items-center gap-1.5 tap-active"
        >
          <Plus className="w-3.5 h-3.5 text-temple-gold" />
          <span>+ Add Row Below</span>
        </button>

        <span className="text-[10px] font-mono text-slate-500">
          Tip: Hit <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Enter</kbd> to save row
        </span>
      </div>
    </div>
  );
};
