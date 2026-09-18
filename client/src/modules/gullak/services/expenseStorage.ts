import { localDB, OfflineExpenseRecord } from '../../../shared/db/dexie';
import { Expense, ExpenseCategory } from '../../../shared/types';
import { DUO_A_SON, DUO_B_SON } from '../../../shared/config/travellers.config';
import { onFamilyEvent, emitFamilyEvent } from '../../../shared/services/socketClient';

const INITIAL_EXPENSE_SEEDS: OfflineExpenseRecord[] = [];
const LEGACY_MOCK_EXPENSE_IDS = ['exp-1', 'exp-2', 'exp-3', 'exp-4'];

export interface GullakFinancialSummary {
  totalSpentINR: number;
  paidByUtkarshINR: number;
  paidByShreyasINR: number;
  fairSharePerCoordinatorINR: number;
  netSettlement: {
    debtorName: string;
    creditorName: string;
    amountINR: number;
    isSettled: boolean;
  };
  categoryTotals: Record<ExpenseCategory, number>;
}

let socketListenersInitialized = false;

function setupExpenseSocketListeners() {
  if (socketListenersInitialized || typeof window === 'undefined') return;
  socketListenersInitialized = true;

  // Listen for real-time expenses added by other family members
  onFamilyEvent('receive_expense', async (expenseData: any) => {
    try {
      if (!expenseData?.id) return;
      const record: OfflineExpenseRecord = {
        id: expenseData.id,
        title: expenseData.title,
        amountINR: Number(expenseData.amountINR),
        paidBy: expenseData.paidBy,
        category: expenseData.category,
        receiptUrl: expenseData.receiptUrl,
        paymentSplits: expenseData.paymentSplits,
        splitMode: expenseData.splitMode,
        owedSplits: expenseData.owedSplits,
        createdAt: expenseData.createdAt || new Date().toISOString(),
        isSynced: true
      };
      await localDB.offlineExpenses.put(record);
      window.dispatchEvent(new CustomEvent('triptrack_expense_update', { detail: record }));
    } catch (err) {
      console.warn('⚠️ [Gullak Sync] Failed to store incoming live expense in Dexie:', err);
    }
  });

  // Listen for expense deletions by other family members
  onFamilyEvent('expense_removed', async (data: { id: string }) => {
    try {
      if (!data?.id) return;
      await localDB.offlineExpenses.delete(data.id);
      window.dispatchEvent(new CustomEvent('triptrack_expense_update', { detail: { id: data.id, deleted: true } }));
    } catch (err) {
      console.warn('⚠️ [Gullak Sync] Failed to delete expense from Dexie:', err);
    }
  });

  // Listen for clear all
  onFamilyEvent('expenses_cleared', async () => {
    try {
      await localDB.offlineExpenses.clear();
      window.dispatchEvent(new CustomEvent('triptrack_expense_update', { detail: { cleared: true } }));
    } catch (err) {
      console.warn('⚠️ [Gullak Sync] Failed to clear expenses from Dexie:', err);
    }
  });

  // Auto-sync whenever socket or network reconnects
  window.addEventListener('triptrack_network_sync', () => {
    syncExpensesWithCloud().catch(err => console.warn('Background expense sync error:', err));
  });
}

// Immediately wire socket listeners
setupExpenseSocketListeners();

/**
 * Reconcile local Dexie database with MongoDB Atlas cloud ledger
 */
export async function syncExpensesWithCloud(): Promise<Expense[]> {
  try {
    const pin = localStorage.getItem('triptrack_family_pin') || '2026';

    // 1. First, push any locally created offline expenses that have not been synced yet
    const unsynced = await localDB.offlineExpenses.filter(e => e.isSynced === false).toArray();
    if (unsynced.length > 0 && navigator.onLine) {
      try {
        await fetch('/api/expenses/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-family-pin': pin
          },
          body: JSON.stringify({ expenses: unsynced })
        });
        // Mark as synced locally
        for (const u of unsynced) {
          await localDB.offlineExpenses.update(u.id, { isSynced: true });
        }
      } catch (syncErr) {
        console.warn('⚠️ [Gullak Cloud Sync] Failed to flush offline expenses to cloud:', syncErr);
      }
    }

    // 2. Fetch the latest complete ledger from MongoDB Atlas
    const res = await fetch('/api/expenses', {
      headers: { 'x-family-pin': pin }
    });

    if (!res.ok) {
      return await getExpensesFromDexie();
    }

    const json = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      return await getExpensesFromDexie();
    }

    const cloudExpenses: any[] = json.data;
    const cloudIds = new Set(cloudExpenses.map(e => e.id));

    // Reconcile: Purge any local synced records that were deleted on cloud
    const localRecords = await localDB.offlineExpenses.toArray();
    for (const local of localRecords) {
      if (local.isSynced && !cloudIds.has(local.id)) {
        await localDB.offlineExpenses.delete(local.id);
      }
    }

    // Upsert cloud expenses into local Dexie
    for (const c of cloudExpenses) {
      await localDB.offlineExpenses.put({
        id: c.id,
        title: c.title,
        amountINR: Number(c.amountINR),
        paidBy: c.paidBy,
        category: c.category,
        receiptUrl: c.receiptUrl,
        paymentSplits: c.paymentSplits,
        splitMode: c.splitMode,
        owedSplits: c.owedSplits,
        createdAt: c.createdAt,
        isSynced: true
      });
    }

    const finalRecords = await localDB.offlineExpenses.toArray();
    finalRecords.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return finalRecords.map(toExpense);
  } catch (err) {
    console.warn('⚠️ [Gullak Cloud Sync] Offline or API unreachable, using local Dexie:', err);
    return await getExpensesFromDexie();
  }
}

/**
 * Initialize Dexie with sample expenses if empty, and scrub legacy dummy data
 */
export async function initializeExpenseStorage(): Promise<OfflineExpenseRecord[]> {
  try {
    await localDB.offlineExpenses.bulkDelete(LEGACY_MOCK_EXPENSE_IDS);

    // Initial background sync with cloud
    syncExpensesWithCloud().then(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('triptrack_expense_update'));
      }
    }).catch(() => {});

    const count = await localDB.offlineExpenses.count();
    if (count === 0 && INITIAL_EXPENSE_SEEDS.length > 0) {
      await localDB.offlineExpenses.bulkAdd(INITIAL_EXPENSE_SEEDS);
      return INITIAL_EXPENSE_SEEDS;
    }
    const saved = await localDB.offlineExpenses.toArray();
    return saved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('⚠️ [Dexie Gullak] Failed to load offline expenses', err);
    return [];
  }
}

/**
 * Fetch all expenses from Dexie (ensures clean state without mock seeds)
 */
export async function getExpensesFromDexie(): Promise<Expense[]> {
  try {
    await localDB.offlineExpenses.bulkDelete(LEGACY_MOCK_EXPENSE_IDS);

    const records = await localDB.offlineExpenses.toArray();
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return records.map(toExpense);
  } catch (err) {
    console.error('Failed to get expenses from Dexie', err);
    return [];
  }
}

/**
 * Save new expense to Dexie and broadcast live via Socket.io and REST
 */
export async function saveExpenseToDexie(expense: Omit<Expense, 'id'>): Promise<Expense> {
  const newRecord: OfflineExpenseRecord = {
    ...expense,
    id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    createdAt: expense.createdAt || new Date().toISOString(),
    isSynced: navigator.onLine
  };

  // 1. Optimistic local persistence
  await localDB.offlineExpenses.put(newRecord);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triptrack_expense_update', { detail: newRecord }));
  }

  // 2. Real-time broadcast and MongoDB persistence if online
  if (navigator.onLine) {
    // Broadcast via socket immediately
    emitFamilyEvent('send_expense', newRecord);

    // Persist via API
    fetch('/api/expenses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-family-pin': localStorage.getItem('triptrack_family_pin') || '2026'
      },
      body: JSON.stringify(newRecord)
    }).then(async (res) => {
      if (res.ok) {
        await localDB.offlineExpenses.update(newRecord.id, { isSynced: true });
      }
    }).catch(err => {
      console.warn('⚠️ [Gullak] Deferred cloud expense sync:', err);
    });
  }

  return toExpense(newRecord);
}

/**
 * Delete expense from Dexie and broadcast deletion live
 */
export async function deleteExpenseFromDexie(id: string): Promise<void> {
  await localDB.offlineExpenses.delete(id);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triptrack_expense_update', { detail: { id, deleted: true } }));
  }

  if (navigator.onLine) {
    emitFamilyEvent('delete_expense', { id });

    fetch(`/api/expenses/${id}`, {
      method: 'DELETE',
      headers: {
        'x-family-pin': localStorage.getItem('triptrack_family_pin') || '2026'
      }
    }).catch(err => console.warn('⚠️ [Gullak] Deferred delete expense sync:', err));
  }
}

/**
 * Calculate 50/50 Coordinator split and financial summary
 */
export function calculateGullakSummary(expenses: Expense[]): GullakFinancialSummary {
  const categoryTotals: Record<ExpenseCategory, number> = {
    FOOD: 0,
    TOLL_TAXI: 0,
    RITUAL: 0,
    PORTER_DANDI: 0,
    HOTEL: 0,
    MISC: 0
  };

  let totalSpentINR = 0;
  let paidByUtkarshINR = 0;
  let paidByShreyasINR = 0;
  let totalUtkarshFairShareINR = 0;
  let totalShreyasFairShareINR = 0;

  expenses.forEach(e => {
    totalSpentINR += e.amountINR;
    if (categoryTotals[e.category] !== undefined) {
      categoryTotals[e.category] += e.amountINR;
    }

    // 1. Calculate Actual Paid Contribution
    let uPaid = 0;
    let sPaid = 0;

    if (e.paymentSplits) {
      uPaid = Number(e.paymentSplits.utkarshPaidINR) || 0;
      sPaid = Number(e.paymentSplits.shreyasPaidINR) || 0;
    } else {
      if (e.paidBy === DUO_A_SON.name) {
        uPaid = e.amountINR;
      } else if (e.paidBy === DUO_B_SON.name) {
        sPaid = e.amountINR;
      }
    }

    paidByUtkarshINR += uPaid;
    paidByShreyasINR += sPaid;

    // 2. Calculate Fair Share Owed
    let uOwes = 0;
    let sOwes = 0;

    if (e.owedSplits) {
      uOwes = Number(e.owedSplits.utkarshOwesINR) || 0;
      sOwes = Number(e.owedSplits.shreyasOwesINR) || 0;
    } else if (e.splitMode === 'FULL_FAMILY_A') {
      uOwes = e.amountINR;
      sOwes = 0;
    } else if (e.splitMode === 'FULL_FAMILY_B') {
      uOwes = 0;
      sOwes = e.amountINR;
    } else {
      // Default: 50/50 Equal Split
      uOwes = e.amountINR / 2;
      sOwes = e.amountINR / 2;
    }

    totalUtkarshFairShareINR += uOwes;
    totalShreyasFairShareINR += sOwes;
  });

  const fairSharePerCoordinatorINR = Math.round(totalSpentINR / 2);

  // Net Balance: (Utkarsh Paid) - (Utkarsh Fair Share)
  const utkarshNet = Math.round(paidByUtkarshINR - totalUtkarshFairShareINR);

  let netSettlement = {
    debtorName: '',
    creditorName: '',
    amountINR: 0,
    isSettled: true
  };

  if (utkarshNet > 0) {
    netSettlement = {
      debtorName: DUO_B_SON.name,
      creditorName: DUO_A_SON.name,
      amountINR: utkarshNet,
      isSettled: false
    };
  } else if (utkarshNet < 0) {
    netSettlement = {
      debtorName: DUO_A_SON.name,
      creditorName: DUO_B_SON.name,
      amountINR: Math.abs(utkarshNet),
      isSettled: false
    };
  }

  return {
    totalSpentINR,
    paidByUtkarshINR,
    paidByShreyasINR,
    fairSharePerCoordinatorINR,
    netSettlement,
    categoryTotals
  };
}

function toExpense(rec: OfflineExpenseRecord): Expense {
  return {
    id: rec.id,
    title: rec.title,
    amountINR: rec.amountINR,
    paidBy: rec.paidBy,
    category: rec.category,
    receiptUrl: rec.receiptUrl,
    paymentSplits: rec.paymentSplits,
    splitMode: rec.splitMode,
    owedSplits: rec.owedSplits,
    createdAt: rec.createdAt
  };
}
