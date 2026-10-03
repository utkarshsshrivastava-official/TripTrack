import { Expense, ExpenseCategory } from '../../../shared/types';
import { GullakFinancialSummary } from './expenseStorage';
import { DUO_A_SON, DUO_B_SON } from '../../../shared/config/travellers.config';

export function generateWhatsAppSummary(expenses: Expense[], summary: GullakFinancialSummary): string {
  const net = summary.netSettlement;
  const settlementText = net.isSettled
    ? '✅ *All accounts are completely balanced (₹0 debt)!*'
    : `⚖️ *Final Settlement Math:*\n👉 *${net.debtorName}* transfers *₹${net.amountINR.toLocaleString('en-IN')}* to *${net.creditorName}* to balance the 50/50 pool.`;

  const catIcons: Record<ExpenseCategory, string> = {
    FOOD: '🍲 Food & Tea',
    TOLL_TAXI: '🚕 Cab & Toll',
    HOTEL: '🏨 Hotel & Stay',
    SHOPPING: '🛍️ Shopping & Woolens',
    RITUAL: '🪔 Pujas & Rituals',
    PORTER_DANDI: '🧳 Porter / Dandi',
    MEDICAL: '💊 Medical & Vitals',
    MISC: '🏷️ Misc & Cash'
  };

  const categoryLines = Object.entries(summary.categoryTotals)
    .filter(([_, amt]) => amt > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `• ${catIcons[cat as ExpenseCategory] || cat}: ₹${amt.toLocaleString('en-IN')}`)
    .join('\n');

  return `🏔️ *TRIPTRACK — BADRINATH DHAM 2026*
*Official Pilgrimage Expense & Settlement Report*
━━━━━━━━━━━━━━━━━━━━
💰 *Total Trip Spend:* ₹${summary.totalSpentINR.toLocaleString('en-IN')}
🧾 *Total Receipts Logged:* ${expenses.length} items

👥 *Out-of-Pocket Expenditure:*
• 🔵 ${DUO_A_SON.name} (Family A): ₹${summary.paidByUtkarshINR.toLocaleString('en-IN')}
• 🟢 ${DUO_B_SON.name} (Family B): ₹${summary.paidByShreyasINR.toLocaleString('en-IN')}
• ⚖️ 50/50 Fair Target: ₹${summary.fairSharePerCoordinatorINR.toLocaleString('en-IN')} each

${settlementText}

📊 *Category Breakdown:*
${categoryLines || '• No expenses recorded'}
━━━━━━━━━━━━━━━━━━━━
_Generated via TripTrack by Ut-tech • Zero-Signal Offline PWA_`;
}

export function exportExpensesToCSV(expenses: Expense[]): void {
  const headers = [
    'Date',
    'Time',
    'Description',
    'Category',
    'Amount (INR)',
    'Paid By',
    'Split Mode',
    'Payment Method',
    'Venue Name',
    'Venue Location',
    'Tags',
    'Receipt URL'
  ];

  const escapeCSV = (val?: string | number | null): string => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const sorted = [...expenses].sort((a, b) => {
    return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
  });

  const rows = sorted.map(exp => {
    const d = new Date(exp.createdAt || 0);
    const dateStr = !isNaN(d.getTime()) ? d.toLocaleDateString('en-IN') : '';
    const timeStr = !isNaN(d.getTime()) ? d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '';
    const tagsStr = exp.tags && exp.tags.length > 0 ? exp.tags.map(t => `#${t}`).join(', ') : '';

    return [
      escapeCSV(dateStr),
      escapeCSV(timeStr),
      escapeCSV(exp.title),
      escapeCSV(exp.category),
      exp.amountINR,
      escapeCSV(exp.paidBy),
      escapeCSV(exp.splitMode || 'EQUAL_50_50'),
      escapeCSV(exp.paymentMethod || 'UPI'),
      escapeCSV(exp.venueName || ''),
      escapeCSV(exp.venueLocation || ''),
      escapeCSV(tagsStr),
      escapeCSV(exp.receiptUrl || '')
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `TripTrack_Badrinath_Expenses_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface DailySpendPoint {
  dateKey: string;
  displayDate: string;
  totalINR: number;
  itemCount: number;
}

export function calculateDailySpendSeries(expenses: Expense[]): DailySpendPoint[] {
  const map = new Map<string, { displayDate: string; total: number; count: number }>();

  expenses.forEach(exp => {
    const d = new Date(exp.createdAt || 0);
    if (isNaN(d.getTime())) return;
    const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const displayDate = d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

    if (!map.has(dateKey)) {
      map.set(dateKey, { displayDate, total: 0, count: 0 });
    }
    const pt = map.get(dateKey)!;
    pt.total += Number(exp.amountINR) || 0;
    pt.count += 1;
  });

  return Array.from(map.entries())
    .map(([dateKey, val]) => ({
      dateKey,
      displayDate: val.displayDate,
      totalINR: val.total,
      itemCount: val.count
    }))
    .sort((a, b) => a.dateKey.localeCompare(b.dateKey));
}
