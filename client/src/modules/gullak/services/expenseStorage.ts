import { localDB, OfflineExpenseRecord } from '../../../shared/db/dexie';
import { Expense, ExpenseCategory } from '../../../shared/types';
import { DUO_A_SON, DUO_B_SON } from '../../../shared/config/travellers.config';

const INITIAL_EXPENSE_SEEDS: OfflineExpenseRecord[] = [
  {
    id: 'exp-1',
    title: 'Haridwar to Joshimath Mountain Cab Advance',
    amountINR: 12500,
    paidBy: DUO_A_SON.name,
    category: 'TOLL_TAXI',
    createdAt: '2026-09-24T18:00:00Z',
    isSynced: true
  },
  {
    id: 'exp-2',
    title: 'Brahma Kapal Ritual Samagri & Dakshina Advance',
    amountINR: 5100,
    paidBy: DUO_B_SON.name,
    category: 'RITUAL',
    createdAt: '2026-09-25T14:30:00Z',
    isSynced: true
  },
  {
    id: 'exp-3',
    title: 'Cheetal Grand Lunch (4 Satvik Thalis + Chai)',
    amountINR: 1840,
    paidBy: DUO_A_SON.name,
    category: 'FOOD',
    createdAt: '2026-09-25T14:45:00Z',
    isSynced: true
  },
  {
    id: 'exp-4',
    title: 'Warm Woolen Shawls & Thermal Gloves for Elders',
    amountINR: 3200,
    paidBy: DUO_B_SON.name,
    category: 'MISC',
    createdAt: '2026-09-26T17:00:00Z',
    isSynced: true
  }
];

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
 * Initialize Dexie with sample expenses if empty
 */
export async function initializeExpenseStorage(): Promise<OfflineExpenseRecord[]> {
  try {
    const count = await localDB.offlineExpenses.count();
    if (count === 0) {
      await localDB.offlineExpenses.bulkAdd(INITIAL_EXPENSE_SEEDS);
      console.log(`💰 [Dexie Gullak] Initialized ${INITIAL_EXPENSE_SEEDS.length} sample pilgrimage expenses.`);
      return INITIAL_EXPENSE_SEEDS;
    }
    const saved = await localDB.offlineExpenses.toArray();
    return saved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (err) {
    console.warn('⚠️ [Dexie Gullak] Failed to load offline expenses', err);
    return INITIAL_EXPENSE_SEEDS;
  }
}

/**
 * Fetch all expenses from Dexie
 */
export async function getExpensesFromDexie(): Promise<Expense[]> {
  try {
    const records = await localDB.offlineExpenses.toArray();
    if (!records || records.length === 0) {
      const initialized = await initializeExpenseStorage();
      return initialized.map(toExpense);
    }
    records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return records.map(toExpense);
  } catch (err) {
    console.error('Failed to get expenses from Dexie', err);
    return INITIAL_EXPENSE_SEEDS.map(toExpense);
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
