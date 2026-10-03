import React, { useState, useEffect, useMemo } from 'react';
import { Expense, ExpenseCategory, DuoId, PaymentMethod } from '../../shared/types';
import { 
  Plus, 
  Car, 
  Flame, 
  Utensils, 
  Hotel, 
  Accessibility, 
  MoreHorizontal, 
  Trash2, 
  ReceiptText, 
  ExternalLink, 
  X, 
  Pencil, 
  Calendar, 
  Clock, 
  ArrowUpDown,
  ShoppingBag,
  HeartPulse,
  MapPin,
  Tag as TagIcon
} from 'lucide-react';
import { 
  DUO_A_SON, 
  DUO_B_SON 
} from '../../shared/config/travellers.config';
import { 
  getExpensesFromDexie, 
  saveExpenseToDexie, 
  updateExpenseInDexie,
  deleteExpenseFromDexie, 
  calculateGullakSummary,
  sortExpensesByDateDesc
} from './services/expenseStorage';
import { GullakBalanceHero } from './components/GullakBalanceHero';
import { SettlementGauge } from './components/SettlementGauge';
import { AddExpenseSheet, SaveExpenseData } from './components/AddExpenseSheet';

interface GullakPreviewProps {
  activeDuo: DuoId | 'ALL';
  onOpenMemorial?: () => void;
}

export const GullakPreview: React.FC<GullakPreviewProps> = ({ activeDuo, onOpenMemorial: _onOpenMemorial }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddSheetOpen, setIsAddSheetOpen] = useState<boolean>(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory | 'ALL'>('ALL');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grouped' | 'stream'>('grouped');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');
  const [viewingReceipt, setViewingReceipt] = useState<{
    url: string;
    title: string;
    amount: number;
    paidBy?: string;
  } | null>(null);

  useEffect(() => {
    getExpensesFromDexie().then(items => setExpenses(sortExpensesByDateDesc(items)));

    const handleUpdate = () => {
      getExpensesFromDexie().then(items => setExpenses(sortExpensesByDateDesc(items)));
    };
    window.addEventListener('triptrack_expense_update', handleUpdate);
    return () => window.removeEventListener('triptrack_expense_update', handleUpdate);
  }, []);

  const summary = calculateGullakSummary(expenses);

  const handleSaveExpense = async (data: SaveExpenseData) => {
    if (data.id) {
      // Editing existing expense - auto-adjusts order based on date/time
      const updated = await updateExpenseInDexie({
        id: data.id,
        title: data.title,
        amountINR: data.amountINR,
        paidBy: data.paidBy,
        category: data.category,
        paymentMethod: data.paymentMethod,
        tags: data.tags,
        venueName: data.venueName,
        venueLocation: data.venueLocation,
        receiptUrl: data.receiptUrl,
        paymentSplits: data.paymentSplits,
        splitMode: data.splitMode,
        owedSplits: data.owedSplits,
        createdAt: data.createdAt || new Date().toISOString()
      });
      setExpenses(prev => sortExpensesByDateDesc(prev.map(e => e.id === data.id ? updated : e)));
      setEditingExpense(null);
    } else {
      // Adding new expense - auto-adjusts into its exact chronological position
      const added = await saveExpenseToDexie({
        title: data.title,
        amountINR: data.amountINR,
        paidBy: data.paidBy,
        category: data.category,
        paymentMethod: data.paymentMethod,
        tags: data.tags,
        venueName: data.venueName,
        venueLocation: data.venueLocation,
        receiptUrl: data.receiptUrl,
        paymentSplits: data.paymentSplits,
        splitMode: data.splitMode,
        owedSplits: data.owedSplits,
        createdAt: data.createdAt || new Date().toISOString()
      });
      setExpenses(prev => sortExpensesByDateDesc([added, ...prev]));
    }
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
      case 'SHOPPING': return <ShoppingBag className="w-4 h-4 text-pink-400" />;
      case 'PORTER_DANDI': return <Accessibility className="w-4 h-4 text-orange-400" />;
      case 'MEDICAL': return <HeartPulse className="w-4 h-4 text-rose-400" />;
      case 'MISC': default: return <MoreHorizontal className="w-4 h-4 text-slate-400" />;
    }
  };

  const getPayerColorStyles = (paidBy: string) => {
    if (paidBy === DUO_A_SON.name) {
      return {
        cardBorder: 'border-l-4 border-l-sky-400 bg-slate-900/90 hover:bg-sky-950/20',
        badge: 'bg-sky-500/15 border-sky-400/40 text-sky-300',
        dot: 'bg-sky-400',
        label: DUO_A_SON.name
      };
    }
    if (paidBy === DUO_B_SON.name) {
      return {
        cardBorder: 'border-l-4 border-l-emerald-400 bg-slate-900/90 hover:bg-emerald-950/20',
        badge: 'bg-emerald-500/15 border-emerald-400/40 text-emerald-300',
        dot: 'bg-emerald-400',
        label: DUO_B_SON.name
      };
    }
    return {
      cardBorder: 'border-l-4 border-l-amber-400 bg-slate-900/90 hover:bg-amber-950/20',
      badge: 'bg-amber-500/15 border-amber-400/40 text-amber-300',
      dot: 'bg-amber-400',
      label: 'Both Shared'
    };
  };

  const getPaymentBadge = (method?: PaymentMethod) => {
    switch (method) {
      case 'CASH': return { icon: '💵', label: 'Cash' };
      case 'CARD': return { icon: '💳', label: 'Card' };
      case 'NET_BANKING': return { icon: '🏦', label: 'NetBank' };
      case 'OTHER': return { icon: '🏷️', label: 'Other' };
      case 'UPI':
      default:
        return { icon: '📱', label: 'UPI' };
    }
  };

  // Collect all unique tags across expenses
  const allUniqueTags = useMemo(() => {
    const set = new Set<string>();
    expenses.forEach(e => {
      e.tags?.forEach(t => {
        if (t && t.trim()) set.add(t.trim());
      });
    });
    return Array.from(set).sort();
  }, [expenses]);

  // Strictly sorted and auto-adjusted expenses filtered by Category, Tag, and Active Duo
  const sortedFilteredExpenses = useMemo(() => {
    const filtered = expenses.filter(e => {
      const matchesCategory = selectedCategory === 'ALL' || e.category === selectedCategory;
      if (!matchesCategory) return false;

      const matchesTag = !selectedTag || (e.tags && e.tags.includes(selectedTag));
      if (!matchesTag) return false;

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

    return [...filtered].sort((a, b) => {
      const timeA = new Date(a.createdAt || 0).getTime();
      const timeB = new Date(b.createdAt || 0).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [expenses, selectedCategory, selectedTag, activeDuo, sortOrder]);

  const filteredTotalINR = useMemo(() => {
    return sortedFilteredExpenses.reduce((acc, curr) => acc + (Number(curr.amountINR) || 0), 0);
  }, [sortedFilteredExpenses]);

  interface DayExpenseGroup {
    dateKey: string;
    displayDate: string;
    dayTotalINR: number;
    expenses: Expense[];
  }

  // Auto-group expenses by calendar day with day subtotals
  const groupedExpenses = useMemo<DayExpenseGroup[]>(() => {
    const groupsMap = new Map<string, { displayDate: string; total: number; list: Expense[] }>();

    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayKey = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

    sortedFilteredExpenses.forEach(expense => {
      const d = new Date(expense.createdAt || 0);
      const dateKey = !isNaN(d.getTime())
        ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
        : 'undated';

      let displayDate = 'Undated';
      if (dateKey === todayKey) {
        displayDate = 'Today';
      } else if (dateKey === yesterdayKey) {
        displayDate = 'Yesterday';
      } else if (dateKey !== 'undated') {
        displayDate = d.toLocaleDateString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: d.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
        });
      }

      if (!groupsMap.has(dateKey)) {
        groupsMap.set(dateKey, { displayDate, total: 0, list: [] });
      }

      const group = groupsMap.get(dateKey)!;
      group.total += Number(expense.amountINR) || 0;
      group.list.push(expense);
    });

    const result: DayExpenseGroup[] = [];
    groupsMap.forEach((val, key) => {
      result.push({
        dateKey: key,
        displayDate: val.displayDate,
        dayTotalINR: val.total,
        expenses: val.list
      });
    });

    return result;
  }, [sortedFilteredExpenses]);

  // Reusable Expense Card Renderer
  const renderExpenseCard = (expense: Expense, showDate: boolean = false) => {
    const payerStyles = getPayerColorStyles(expense.paidBy);
    const payment = getPaymentBadge(expense.paymentMethod);

    return (
      <div
        key={expense.id}
        className={`p-3.5 rounded-2xl border border-slate-800/80 flex items-center justify-between shadow-sm transition-all ${payerStyles.cardBorder}`}
      >
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 mt-0.5">
            {getCategoryIcon(expense.category)}
          </div>
          <div className="min-w-0 space-y-1">
            <h4 className="text-xs font-extrabold text-white leading-tight truncate">
              {expense.title}
            </h4>

            {/* Venue & Address (if present) */}
            {(expense.venueName || expense.venueLocation) && (
              <div className="flex items-center gap-1 text-[11px] text-slate-300 font-medium">
                <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="truncate">
                  {expense.venueName && <span className="font-bold text-white">{expense.venueName}</span>}
                  {expense.venueName && expense.venueLocation && <span className="text-slate-500"> • </span>}
                  {expense.venueLocation && <span className="text-slate-300">{expense.venueLocation}</span>}
                </span>
              </div>
            )}

            {/* Payer, Split & Payment Method Badges */}
            <div className="text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5 font-mono">
              {/* Color-Coded Payer Badge */}
              {expense.paidBy === 'Multiple' && expense.paymentSplits ? (
                <span className="text-amber-300 font-bold bg-amber-500/15 px-1.5 py-0.5 rounded-md border border-amber-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>U: ₹{expense.paymentSplits.utkarshPaidINR} • S: ₹{expense.paymentSplits.shreyasPaidINR}</span>
                </span>
              ) : (
                <span className={`font-bold px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${payerStyles.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${payerStyles.dot}`} />
                  <span>Paid by {payerStyles.label}</span>
                </span>
              )}

              {/* Payment Method Chip */}
              <span className="px-1.5 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-slate-300 flex items-center gap-1">
                <span>{payment.icon}</span>
                <span>{payment.label}</span>
              </span>

              {/* Split Mode Badges */}
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
              <span className="text-slate-400 flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-slate-500" />
                <span>
                  {showDate && `${new Date(expense.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} • `}
                  {new Date(expense.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                </span>
              </span>
            </div>

            {/* Clickable Tag Chips */}
            {expense.tags && expense.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 pt-0.5">
                {expense.tags.map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTag(prev => prev === t ? null : t);
                    }}
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-md border transition-all ${
                      selectedTag === t
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-950 border-slate-800 text-amber-300/80 hover:text-amber-300 hover:border-amber-400/50'
                    }`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
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
          <span className="text-sm font-black font-mono text-white mr-1">
            ₹{expense.amountINR.toLocaleString('en-IN')}
          </span>
          <button
            type="button"
            onClick={() => {
              setEditingExpense(expense);
              setIsAddSheetOpen(true);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-amber-400 hover:bg-amber-950/40 tap-active min-h-touch min-w-touch flex items-center justify-center transition-all"
            title="Edit Expense"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleDeleteExpense(expense.id)}
            className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 tap-active min-h-touch min-w-touch flex items-center justify-center transition-all"
            title="Delete Expense"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 pb-28 pt-2 px-3 animate-in fade-in">
      {/* 1. Gullak Top Hero Metrics Card */}
      <GullakBalanceHero 
        summary={summary}
        onOpenAddModal={() => {
          setEditingExpense(null);
          setIsAddSheetOpen(true);
        }}
      />

      {/* 2. Splitwise-Grade Dynamic Debt Settlement Gauge */}
      <SettlementGauge summary={summary} />

      {/* 3. Color Legend for Both Families */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px]">
        <div className="flex items-center gap-3">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Ledger Colors:</span>
          <div className="flex items-center gap-1.5 font-bold text-sky-400">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 ring-2 ring-sky-500/30" />
            <span>{DUO_A_SON.name} (Fam A)</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-emerald-500/30" />
            <span>{DUO_B_SON.name} (Fam B)</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-amber-500/30" />
            <span>Both Split</span>
          </div>
        </div>
        <div className="text-[10px] font-mono text-slate-500">
          Left stripe shows payer
        </div>
      </div>

      {/* 4. Filter Ribbon & Chronological Controls */}
      <div className="space-y-2">
        {/* Category Pills Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
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
          {(['FOOD', 'TOLL_TAXI', 'HOTEL', 'SHOPPING', 'RITUAL', 'PORTER_DANDI', 'MEDICAL', 'MISC'] as ExpenseCategory[]).map(cat => (
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

        {/* Layered Tag Filter Ribbon */}
        {allUniqueTags.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-[10px] uppercase font-bold text-slate-500 shrink-0 flex items-center gap-1">
              <TagIcon className="w-3 h-3 text-amber-400" />
              <span>Tags:</span>
            </span>
            <button
              type="button"
              onClick={() => setSelectedTag(null)}
              className={`px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold shrink-0 transition-all tap-active border ${
                selectedTag === null
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              All Tags
            </button>
            {allUniqueTags.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(prev => prev === tag ? null : tag)}
                className={`px-2.5 py-1 rounded-xl font-mono text-[10px] font-bold shrink-0 transition-all tap-active border ${
                  selectedTag === tag
                    ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-amber-300'
                }`}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        {/* Chronological & Grouping Auto-Adjust Controls Bar */}
        <div className="flex items-center justify-between gap-2 px-1 pt-0.5 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setViewMode(prev => prev === 'grouped' ? 'stream' : 'grouped')}
              className={`px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all tap-active min-h-touch ${
                viewMode === 'grouped'
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-bold'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle Day-wise Grouping vs Flat Stream"
            >
              <Calendar className="w-3.5 h-3.5 text-temple-gold" />
              <span>{viewMode === 'grouped' ? 'By Day' : 'Stream'}</span>
            </button>

            <button
              type="button"
              onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white flex items-center gap-1.5 transition-all tap-active min-h-touch"
              title="Toggle Sort: Newest vs Oldest"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-400" />
              <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>

          <div className="flex items-center gap-1 font-bold text-slate-300 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase">Total:</span>
            <span className="text-amber-400 font-mono text-xs">
              ₹{filteredTotalINR.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* 5. Itemized Transaction Ledger (Color-Coded & Auto-Adjusted by Date & Time) */}
      <div className="space-y-3">
        {sortedFilteredExpenses.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-slate-900/50 border border-slate-800 text-slate-400 space-y-2">
            <p className="text-xs font-medium">No expenses logged under this filter.</p>
            <button
              type="button"
              onClick={() => {
                setEditingExpense(null);
                setIsAddSheetOpen(true);
              }}
              className="text-xs text-temple-gold font-bold underline"
            >
              Log an expense now
            </button>
          </div>
        ) : viewMode === 'grouped' ? (
          groupedExpenses.map(group => (
            <div key={group.dateKey} className="space-y-2">
              {/* Day Section Header with Day Total Subtotal */}
              <div className="flex items-center justify-between px-2 pt-2.5 pb-1 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-temple-gold">
                    <Calendar className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-black text-slate-200 uppercase tracking-wide">
                    {group.displayDate}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    ({group.expenses.length} {group.expenses.length === 1 ? 'item' : 'items'})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Day Total:</span>
                  <span className="text-xs font-black font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/25">
                    ₹{group.dayTotalINR.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Transactions in this Day */}
              <div className="space-y-2">
                {group.expenses.map(expense => renderExpenseCard(expense, false))}
              </div>
            </div>
          ))
        ) : (
          <div className="space-y-2">
            {sortedFilteredExpenses.map(expense => renderExpenseCard(expense, true))}
          </div>
        )}
      </div>

      {/* 6. Floating Action Button (FAB) for Adding Expenses */}
      <div className="fixed bottom-[calc(max(0.75rem,env(safe-area-inset-bottom,0px))+4.5rem)] right-4 sm:right-auto sm:left-1/2 sm:translate-x-32 z-30 pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            setEditingExpense(null);
            setIsAddSheetOpen(true);
          }}
          className="tap-active flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-temple-saffron via-amber-500 to-amber-600 text-slate-950 font-black text-xs shadow-2xl shadow-amber-950/80 border border-amber-300/60 hover:scale-105 active:scale-95 transition-all min-h-touch"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* 7. Frictionless Add/Edit Expense Bottom Sheet */}
      <AddExpenseSheet
        isOpen={isAddSheetOpen}
        onClose={() => {
          setIsAddSheetOpen(false);
          setEditingExpense(null);
        }}
        editingExpense={editingExpense}
        onSaveExpense={handleSaveExpense}
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
