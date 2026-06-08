import { useCallback, useEffect, useMemo, useState } from 'react';
import { availableMonths, summarizeMonth } from '../lib/dashboard';
import type { Transaction } from '../types/transaction';

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `txn-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// ---------------------------------------------------------------------------
// API helpers — inject JWT token from localStorage
// ---------------------------------------------------------------------------

function getToken() {
  return localStorage.getItem('hisaab_token') ?? '';
}

async function apiFetch(path: string, init?: RequestInit) {
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...init?.headers,
    },
    ...init,
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState<string>(
    () => new Date().toISOString().slice(0, 7),
  );

  useEffect(() => {
    setLoading(true);
    apiFetch('/api/transactions')
      .then((data: Transaction[]) => {
        setTransactions(data);
        const months = availableMonths(data);
        if (months.length > 0) setSelectedMonth(months[0]);
        setLoading(false);
      })
      .catch(() => {
        setTransactions([]);
        setLoading(false);
      });
  }, []);

  const addTransaction = useCallback(
    async (input: Omit<Transaction, 'id' | 'created_at'>) => {
      const transaction: Transaction = {
        ...input,
        id: newId(),
        created_at: new Date().toISOString(),
      };
      setTransactions((prev) => [transaction, ...prev]);
      apiFetch('/api/transactions', {
        method: 'POST',
        body: JSON.stringify(transaction),
      }).catch((err) => console.error('[Hisaab] Failed to persist transaction:', err));
      return transaction;
    },
    [],
  );

  const updateTransaction = useCallback((id: string, patch: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
    apiFetch(`/api/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(patch),
    }).catch((err) => console.error('[Hisaab] Failed to update transaction:', err));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    apiFetch(`/api/transactions/${id}`, { method: 'DELETE' }).catch((err) =>
      console.error('[Hisaab] Failed to delete transaction:', err),
    );
  }, []);

  const months = useMemo(() => availableMonths(transactions), [transactions]);
  const summary = useMemo(() => summarizeMonth(transactions, selectedMonth), [transactions, selectedMonth]);
  const monthTransactions = useMemo(
    () => transactions.filter((t) => t.date.slice(0, 7) === selectedMonth),
    [transactions, selectedMonth],
  );

  return {
    transactions,
    monthTransactions,
    months,
    selectedMonth,
    setSelectedMonth,
    summary,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  };
}

export type UseTransactionsReturn = ReturnType<typeof useTransactions>;
