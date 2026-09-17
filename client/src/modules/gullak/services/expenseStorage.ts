import { localDB, OfflineExpenseRecord } from '../../../shared/db/dexie';
import { Expense, ExpenseCategory } from '../../../shared/types';
import { DUO_A_SON, DUO_B_SON } from '../../../shared/config/travellers.config';

const INITIAL_EXPENSE_SEEDS: OfflineExpenseRecord[] = [];

// Legacy mock expense IDs to scrub clean
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

/**
 * Initialize Dexie with sample expenses if empty, and scrub legacy dummy data
 */
export async function initializeExpenseStorage(): Promise<OfflineExpenseRecord[]> {
  try {
    // Purge any legacy mock seeds from previous builds
    await localDB.offlineExpenses.bulkDelete(LEGACY_MOCK_EXPENSE_IDS);

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
    // Scrub legacy mock seeds
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
 * Save new expense to Dexie
 */
export async function saveExpenseToDexie(expense: Omit<Expense, 'id'>): Promise<Expense> {
  const newRecord: OfflineExpenseRecord = {
    ...expense,
    id: `exp-${Date.now()}`,
    isSynced: navigator.onLine
  };

  await localDB.offlineExpenses.add(newRecord);
  return toExpense(newRecord);
}

/**
 * Delete expense from Dexie
 */
export async function deleteExpenseFromDexie(id: string): Promise<void> {
  await localDB.offlineExpenses.delete(id);
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

  expenses.forEach(e => {
    totalSpentINR += e.amountINR;
    if (categoryTotals[e.category] !== undefined) {
      categoryTotals[e.category] += e.amountINR;
    }

    if (e.paidBy === DUO_A_SON.name) {
      paidByUtkarshINR += e.amountINR;
    } else if (e.paidBy === DUO_B_SON.name) {
      paidByShreyasINR += e.amountINR;
    }
  });

  const fairSharePerCoordinatorINR = Math.round(totalSpentINR / 2);
  const diff = paidByUtkarshINR - paidByShreyasINR;
  const halfDiff = Math.round(Math.abs(diff) / 2);

  let netSettlement = {
    debtorName: '',
    creditorName: '',
    amountINR: 0,
    isSettled: true
  };

  if (diff > 0) {
    // Utkarsh paid more -> Shreyas owes Utkarsh
    netSettlement = {
      debtorName: DUO_B_SON.name,
      creditorName: DUO_A_SON.name,
      amountINR: halfDiff,
      isSettled: false
    };
  } else if (diff < 0) {
    // Shreyas paid more -> Utkarsh owes Shreyas
    netSettlement = {
      debtorName: DUO_A_SON.name,
      creditorName: DUO_B_SON.name,
      amountINR: halfDiff,
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
    createdAt: rec.createdAt
  };
}
