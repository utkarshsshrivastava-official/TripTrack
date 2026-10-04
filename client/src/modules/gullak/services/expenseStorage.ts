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
  utkarshFairShareINR: number;
  shreyasFairShareINR: number;
  sharedPoolTotalINR: number;
  sharedPoolPerPersonINR: number;
  personalA_INR: number;
  personalB_INR: number;
  customA_INR: number;
  customB_INR: number;
  pure5050SettlementINR: number;
  hasCustomSplits: boolean;
  netSettlement: {
    debtorName: string;
    creditorName: string;
    amountINR: number;
    isSettled: boolean;
  };
  pure5050NetSettlement: {
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
        paymentMethod: expenseData.paymentMethod || 'UPI',
        tags: Array.isArray(expenseData.tags) ? expenseData.tags : [],
        venueName: expenseData.venueName,
        venueLocation: expenseData.venueLocation,
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
      const hasPaymentSplits = Boolean(
        c.paymentSplits && 
        (Number(c.paymentSplits.utkarshPaidINR) > 0 || Number(c.paymentSplits.shreyasPaidINR) > 0)
      );
      const hasOwedSplits = Boolean(
        c.owedSplits && 
        (typeof c.owedSplits.utkarshOwesINR === 'number' || typeof c.owedSplits.shreyasOwesINR === 'number')
      );

      await localDB.offlineExpenses.put({
        id: c.id,
        title: c.title,
        amountINR: Number(c.amountINR) || 0,
        paidBy: c.paidBy,
        category: c.category,
        paymentMethod: c.paymentMethod || 'UPI',
        tags: Array.isArray(c.tags) ? c.tags : [],
        venueName: c.venueName,
        venueLocation: c.venueLocation,
        receiptUrl: c.receiptUrl,
        paymentSplits: hasPaymentSplits ? c.paymentSplits : undefined,
        splitMode: c.splitMode || 'EQUAL_50_50',
        owedSplits: (c.splitMode === 'CUSTOM_AMOUNTS' && hasOwedSplits) ? c.owedSplits : undefined,
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
 * Auto-adjust and sort expenses by date and time in descending order (most recent first)
 */
export function sortExpensesByDateDesc<T extends { createdAt?: string }>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return timeB - timeA;
  });
}

/**
 * Fetch all expenses from Dexie (ensures clean state without mock seeds and strictly sorted by date/time)
 */
export async function getExpensesFromDexie(): Promise<Expense[]> {
  try {
    await localDB.offlineExpenses.bulkDelete(LEGACY_MOCK_EXPENSE_IDS);

    const records = await localDB.offlineExpenses.toArray();
    return sortExpensesByDateDesc(records.map(toExpense));
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
 * Update existing expense in Dexie and broadcast update live via Socket.io and REST PUT
 */
export async function updateExpenseInDexie(expense: Expense): Promise<Expense> {
  const updatedRecord: OfflineExpenseRecord = {
    ...expense,
    isSynced: navigator.onLine
  };

  // 1. Optimistic local persistence in Dexie
  await localDB.offlineExpenses.put(updatedRecord);
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('triptrack_expense_update', { detail: updatedRecord }));
  }

  // 2. Real-time broadcast and MongoDB persistence if online
  if (navigator.onLine) {
    emitFamilyEvent('send_expense', updatedRecord);

    fetch(`/api/expenses/${expense.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-family-pin': localStorage.getItem('triptrack_family_pin') || '2026'
      },
      body: JSON.stringify(updatedRecord)
    }).then(async (res) => {
      if (res.ok) {
        await localDB.offlineExpenses.update(updatedRecord.id, { isSynced: true });
      }
    }).catch(err => {
      console.warn('⚠️ [Gullak] Deferred cloud expense update sync:', err);
    });
  }

  return toExpense(updatedRecord);
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
    SHOPPING: 0,
    MEDICAL: 0,
    MISC: 0
  };

  let totalSpentINR = 0;
  let paidByUtkarshINR = 0;
  let paidByShreyasINR = 0;
  let totalUtkarshFairShareINR = 0;
  let totalShreyasFairShareINR = 0;
  let sharedPoolTotalINR = 0;
  let personalA_INR = 0;
  let personalB_INR = 0;
  let customA_INR = 0;
  let customB_INR = 0;
  let hasCustomSplits = false;

  expenses.forEach(e => {
    const amt = Number(e.amountINR) || 0;
    totalSpentINR += amt;
    if (categoryTotals[e.category] !== undefined) {
      categoryTotals[e.category] += amt;
    }

    // 1. Calculate Actual Paid Contribution
    let uPaid = 0;
    let sPaid = 0;

    const hasExplicitPaymentSplits = Boolean(
      e.paymentSplits && 
      (Number(e.paymentSplits.utkarshPaidINR) > 0 || Number(e.paymentSplits.shreyasPaidINR) > 0 || e.paidBy === 'Multiple')
    );

    if (hasExplicitPaymentSplits) {
      uPaid = Number(e.paymentSplits!.utkarshPaidINR) || 0;
      sPaid = Number(e.paymentSplits!.shreyasPaidINR) || 0;
    } else {
      const payer = (e.paidBy || '').trim().toLowerCase();
      if (payer === 'utkarsh' || payer === DUO_A_SON.name.toLowerCase()) {
        uPaid = amt;
      } else if (payer === 'shreyas' || payer === DUO_B_SON.name.toLowerCase()) {
        sPaid = amt;
      }
    }

    paidByUtkarshINR += uPaid;
    paidByShreyasINR += sPaid;

    // 2. Calculate Fair Share Owed
    let uOwes = 0;
    let sOwes = 0;

    const hasValidCustomOwed = Boolean(
      e.owedSplits && 
      (typeof e.owedSplits.utkarshOwesINR === 'number' || typeof e.owedSplits.shreyasOwesINR === 'number')
    );

    if (e.splitMode === 'CUSTOM_AMOUNTS' && hasValidCustomOwed) {
      uOwes = Number(e.owedSplits!.utkarshOwesINR) || 0;
      sOwes = Number(e.owedSplits!.shreyasOwesINR) || 0;
      customA_INR += uOwes;
      customB_INR += sOwes;
      hasCustomSplits = true;
    } else if (e.splitMode === 'FULL_FAMILY_A') {
      uOwes = amt;
      sOwes = 0;
      personalA_INR += amt;
      hasCustomSplits = true;
    } else if (e.splitMode === 'FULL_FAMILY_B') {
      uOwes = 0;
      sOwes = amt;
      personalB_INR += amt;
      hasCustomSplits = true;
    } else {
      // Default: 50/50 Equal Split (covers EQUAL_50_50 or missing splitMode)
      uOwes = amt / 2;
      sOwes = amt / 2;
      sharedPoolTotalINR += amt;
    }

    totalUtkarshFairShareINR += uOwes;
    totalShreyasFairShareINR += sOwes;
  });

  const fairSharePerCoordinatorINR = Math.round(totalSpentINR / 2);
  const utkarshFairShareINR = Math.round(totalUtkarshFairShareINR);
  const shreyasFairShareINR = Math.round(totalShreyasFairShareINR);
  const sharedPoolPerPersonINR = Math.round(sharedPoolTotalINR / 2);

  // Splitwise Net Balance: (Utkarsh Paid) - (Utkarsh Fair Share)
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

  // Pure Flat 50/50 Math (assuming all expenses were shared 50/50 regardless of personal items):
  const pure5050UtkarshNet = Math.round(paidByUtkarshINR - (totalSpentINR / 2));
  let pure5050NetSettlement = {
    debtorName: '',
    creditorName: '',
    amountINR: 0,
    isSettled: true
  };

  if (pure5050UtkarshNet > 0) {
    pure5050NetSettlement = {
      debtorName: DUO_B_SON.name,
      creditorName: DUO_A_SON.name,
      amountINR: pure5050UtkarshNet,
      isSettled: false
    };
  } else if (pure5050UtkarshNet < 0) {
    pure5050NetSettlement = {
      debtorName: DUO_A_SON.name,
      creditorName: DUO_B_SON.name,
      amountINR: Math.abs(pure5050UtkarshNet),
      isSettled: false
    };
  }

  return {
    totalSpentINR,
    paidByUtkarshINR,
    paidByShreyasINR,
    fairSharePerCoordinatorINR,
    utkarshFairShareINR,
    shreyasFairShareINR,
    sharedPoolTotalINR,
    sharedPoolPerPersonINR,
    personalA_INR,
    personalB_INR,
    customA_INR,
    customB_INR,
    pure5050SettlementINR: pure5050NetSettlement.amountINR,
    hasCustomSplits,
    netSettlement,
    pure5050NetSettlement,
    categoryTotals
  };
}

function toExpense(rec: OfflineExpenseRecord): Expense {
  const hasPaymentSplits = Boolean(
    rec.paymentSplits && 
    (Number(rec.paymentSplits.utkarshPaidINR) > 0 || Number(rec.paymentSplits.shreyasPaidINR) > 0)
  );
  const hasOwedSplits = Boolean(
    rec.owedSplits && 
    (typeof rec.owedSplits.utkarshOwesINR === 'number' || typeof rec.owedSplits.shreyasOwesINR === 'number')
  );

  return {
    id: rec.id,
    title: rec.title,
    amountINR: Number(rec.amountINR) || 0,
    paidBy: rec.paidBy,
    category: rec.category,
    paymentMethod: rec.paymentMethod || 'UPI',
    tags: Array.isArray(rec.tags) ? rec.tags : [],
    venueName: rec.venueName,
    venueLocation: rec.venueLocation,
    receiptUrl: rec.receiptUrl,
    paymentSplits: hasPaymentSplits ? rec.paymentSplits : undefined,
    splitMode: rec.splitMode || 'EQUAL_50_50',
    owedSplits: (rec.splitMode === 'CUSTOM_AMOUNTS' && hasOwedSplits) ? rec.owedSplits : undefined,
    createdAt: rec.createdAt
  };
}
