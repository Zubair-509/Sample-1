// Currency display rules — Hisaab_Design_Document.md §4.3
// Pakistani lakh grouping: last 3 digits, then pairs of digits to the left.
//   1,200 · 15,000 · 2,22,500 · 1,17,700

function groupDigits(digits: string): string {
  if (digits.length <= 3) return digits;
  const lastThree = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const grouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${grouped},${lastThree}`;
}

interface FormatPKROptions {
  /** Prefix positive amounts with "+" (used in ledger amount columns) */
  signed?: boolean;
}

export function formatPKR(amount: number, options: FormatPKROptions = {}): string {
  const isNegative = amount < 0;
  const digits = groupDigits(String(Math.round(Math.abs(amount))));
  const sign = isNegative ? '-' : options.signed ? '+' : '';
  return `${sign}Rs ${digits}`;
}

/** Plain "Rs 2,22,500" with no sign — for cards, totals, summaries */
export function formatAmount(amount: number): string {
  return `Rs ${groupDigits(String(Math.round(Math.abs(amount))))}`;
}

export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
  });
}

export function formatFullDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
