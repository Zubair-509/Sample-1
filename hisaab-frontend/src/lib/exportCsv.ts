import type { Transaction } from '../types/transaction';

function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportTransactionsToCsv(transactions: Transaction[], monthKey: string): void {
  const headers = ['Date', 'Vendor / Source', 'Category', 'Type', 'Amount (PKR)', 'Tax (PKR)', 'Source', 'Notes'];

  const rows = transactions.map((t) => [
    t.date,
    t.vendor_name,
    t.category,
    t.transaction_type === 'income' ? 'Income' : 'Expense',
    t.transaction_type === 'income' ? t.total_amount : -t.total_amount,
    t.tax_amount ?? '',
    t.source === 'scan' ? 'Scanned receipt' : 'Manual entry',
    t.notes ?? '',
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsv).join(','))
    .join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `hisaab-${monthKey}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
