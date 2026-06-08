import { useMemo, useRef, useState } from 'react';
import { Download, Pencil, Search, Trash2, X } from 'lucide-react';
import { CategoryChip } from '../components/CategoryChip';
import { TransactionTypeBadge } from '../components/TransactionTypeBadge';
import { FilterSelect } from '../components/FilterSelect';
import { EmptyState } from '../components/EmptyState';
import { formatFullDate, formatPKR, formatShortDate } from '../lib/format';
import { CATEGORY_META } from '../lib/categories';
import { EXPENSE_CATEGORIES, type Transaction, type TransactionType } from '../types/transaction';
import { exportTransactionsToCsv } from '../lib/exportCsv';

interface LedgerScreenProps {
  transactions: Transaction[];
  selectedMonth: string;
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  onScanReceipt: () => void;
  onAddManually: () => void;
}

type TypeFilter = 'all' | TransactionType;
type CategoryFilter = 'all' | Transaction['category'];

const ALL_CATEGORIES: Transaction['category'][] = [...EXPENSE_CATEGORIES, 'Sales'];

function amountClass(type: TransactionType) {
  return type === 'income' ? 'text-income-text' : 'text-expense-text';
}

// Ledger screen — Hisaab_Design_Document.md §8.3 + §10.3 (mobile card view)
// FR-02: filterable by category and type; each row editable and deletable.
export function LedgerScreen({ transactions, selectedMonth, onEdit, onDelete, onScanReceipt, onAddManually }: LedgerScreenProps) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return [...transactions]
      .filter((t) => typeFilter === 'all' || t.transaction_type === typeFilter)
      .filter((t) => categoryFilter === 'all' || t.category === categoryFilter)
      .filter((t) =>
        q === '' ||
        t.vendor_name.toLowerCase().includes(q) ||
        (t.notes ?? '').toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
      )
      .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.created_at < a.created_at ? -1 : 1));
  }, [transactions, typeFilter, categoryFilter, searchQuery]);

  const totals = useMemo(() => {
    let income = 0;
    let expenses = 0;
    for (const t of filtered) {
      if (t.transaction_type === 'income') income += t.total_amount;
      else expenses += t.total_amount;
    }
    return { income, expenses };
  }, [filtered]);

  const categoriesPresent = useMemo(
    () => ALL_CATEGORIES.filter((c) => transactions.some((t) => t.category === c)),
    [transactions],
  );

  if (transactions.length === 0) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10">
        <EmptyState onScanReceipt={onScanReceipt} onAddManually={onAddManually} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1280px] space-y-4 px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      {/* Search bar */}
      <div className="relative">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
        <input
          ref={searchInputRef}
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by vendor, category or notes…"
          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-9 pr-9 font-body text-sm text-neutral-900 shadow-sm placeholder:text-neutral-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
          aria-label="Search transactions"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => { setSearchQuery(''); searchInputRef.current?.focus(); }}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-neutral-400 hover:text-neutral-600"
          >
            <X size={15} aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Filters + export */}
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-neutral-100 bg-white p-4 shadow-card">
        <FilterSelect
          label="Type"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
        >
          <option value="all">All</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </FilterSelect>
        <FilterSelect
          label="Category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
        >
          <option value="all">All</option>
          {categoriesPresent.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_META[c].label}
            </option>
          ))}
        </FilterSelect>
        <span className="font-body text-sm text-neutral-500">
          {filtered.length} {filtered.length === 1 ? 'transaction' : 'transactions'}
          {searchQuery && <span className="ml-1 text-primary-600">for "{searchQuery}"</span>}
        </span>
        <button
          type="button"
          onClick={() => exportTransactionsToCsv(filtered, selectedMonth)}
          disabled={filtered.length === 0}
          className="ml-auto flex items-center gap-1.5 rounded-md border border-neutral-200 bg-white px-3 py-1.5 font-body text-sm font-semibold text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Export visible transactions to CSV"
        >
          <Download size={14} aria-hidden="true" />
          Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-lg border border-neutral-100 bg-white px-6 py-12 text-center font-body text-sm text-neutral-500 shadow-card">
          No transactions match these filters.
        </p>
      ) : (
        <>
          {/* Desktop / tablet table */}
          <div className="hidden overflow-hidden rounded-lg border border-neutral-100 bg-white shadow-card md:block">
            <table className="w-full border-collapse">
              <caption className="sr-only">Transaction ledger</caption>
              <thead>
                <tr className="bg-cream">
                  <th scope="col" className="w-[12%] px-4 py-2.5 text-left font-body text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Date</th>
                  <th scope="col" className="w-[28%] px-4 py-2.5 text-left font-body text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Vendor / Source</th>
                  <th scope="col" className="w-[18%] px-4 py-2.5 text-left font-body text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Category</th>
                  <th scope="col" className="w-[12%] px-4 py-2.5 text-left font-body text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Type</th>
                  <th scope="col" className="w-[15%] px-4 py-2.5 text-right font-body text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Amount (PKR)</th>
                  <th scope="col" className="w-[15%] px-4 py-2.5 text-right font-body text-[11px] font-semibold uppercase tracking-wide text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtered.map((t, i) => (
                  <tr
                    key={t.id}
                    className={`group border-l-[3px] transition-colors animate-slide-down-in ${
                      t.transaction_type === 'income'
                        ? 'border-l-income-border hover:bg-primary-50'
                        : 'border-l-expense-border hover:bg-[#FFF5F5]'
                    } ${i % 2 === 1 ? 'bg-[#FAFAFA]' : 'bg-white'}`}
                  >
                    <td className="px-4 py-3 font-body text-sm text-neutral-700">{formatShortDate(t.date)}</td>
                    <td className="px-4 py-3">
                      <p className="font-body text-sm font-medium text-neutral-900">{t.vendor_name}</p>
                      {t.source === 'scan' && (
                        <span className="font-body text-xs text-neutral-500">Scanned receipt</span>
                      )}
                    </td>
                    <td className="px-4 py-3"><CategoryChip category={t.category} /></td>
                    <td className="px-4 py-3"><TransactionTypeBadge type={t.transaction_type} /></td>
                    <td className={`px-4 py-3 text-right font-mono text-[15px] font-medium tabular-nums ${amountClass(t.transaction_type)}`}>
                      {formatPKR(t.transaction_type === 'income' ? t.total_amount : -t.total_amount, { signed: true })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                        <button
                          type="button"
                          onClick={() => onEdit(t)}
                          aria-label={`Edit transaction: ${t.vendor_name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-primary-50 hover:text-primary-700"
                        >
                          <Pencil size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(t)}
                          aria-label={`Delete transaction: ${t.vendor_name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-expense-bg hover:text-expense-text"
                        >
                          <Trash2 size={15} aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-neutral-100 bg-cream">
                  <td colSpan={4} className="px-4 py-3 text-right font-body text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Totals
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-col items-end gap-0.5 font-mono text-sm tabular-nums">
                      <span className="text-income-text">{formatPKR(totals.income, { signed: true })}</span>
                      <span className="text-expense-text">{formatPKR(-totals.expenses, { signed: true })}</span>
                    </div>
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Mobile card list */}
          <ul className="space-y-3 md:hidden">
            {filtered.map((t) => (
              <li
                key={t.id}
                className={`animate-slide-down-in overflow-hidden rounded-lg border border-neutral-100 border-l-[3px] bg-white shadow-card ${
                  t.transaction_type === 'income' ? 'border-l-income-border' : 'border-l-expense-border'
                }`}
              >
                <button type="button" onClick={() => onEdit(t)} className="block w-full px-4 py-3.5 text-left">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-body text-sm font-semibold text-neutral-900">{t.vendor_name}</p>
                      <p className="mt-0.5 font-body text-xs text-neutral-500">
                        {formatFullDate(t.date)} · {CATEGORY_META[t.category].label}
                      </p>
                    </div>
                    <span className={`shrink-0 font-mono text-base font-semibold tabular-nums ${amountClass(t.transaction_type)}`}>
                      {formatPKR(t.transaction_type === 'income' ? t.total_amount : -t.total_amount, { signed: true })}
                    </span>
                  </div>
                  <div className="mt-2"><TransactionTypeBadge type={t.transaction_type} /></div>
                </button>
                <div className="flex border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => onEdit(t)}
                    className="flex flex-1 items-center justify-center gap-1.5 py-2.5 font-body text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
                  >
                    <Pencil size={13} aria-hidden="true" /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(t)}
                    className="flex flex-1 items-center justify-center gap-1.5 border-l border-neutral-100 py-2.5 font-body text-xs font-semibold text-expense-text transition-colors hover:bg-expense-bg"
                  >
                    <Trash2 size={13} aria-hidden="true" /> Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-neutral-100 bg-white px-4 py-3 font-mono text-sm tabular-nums shadow-card md:hidden">
            <span className="font-body text-xs font-semibold uppercase tracking-wide text-neutral-500">Totals</span>
            <div className="flex gap-4">
              <span className="text-income-text">{formatPKR(totals.income, { signed: true })}</span>
              <span className="text-expense-text">{formatPKR(-totals.expenses, { signed: true })}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
