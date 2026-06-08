import { useCallback, useEffect, useState } from 'react';
import type { ExpenseCategory } from '../types/transaction';

export type BudgetMap = Partial<Record<ExpenseCategory, number>>;

function getToken() {
  return localStorage.getItem('hisaab_token') ?? '';
}

const AUTH_HEADERS = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export function useBudgets() {
  const [budgets, setBudgetsState] = useState<BudgetMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/budgets', { headers: AUTH_HEADERS() })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: Array<{ category: string; monthly_limit: string }>) => {
        const map: BudgetMap = {};
        for (const row of rows) {
          map[row.category as ExpenseCategory] = parseFloat(row.monthly_limit);
        }
        setBudgetsState(map);
      })
      .catch(() => setBudgetsState({}))
      .finally(() => setLoading(false));
  }, []);

  // Save a full replacement of all budgets at once
  const saveBudgets = useCallback(async (next: BudgetMap) => {
    const body = Object.entries(next)
      .filter(([, limit]) => limit != null && limit > 0)
      .map(([category, monthly_limit]) => ({ category, monthly_limit }));

    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: AUTH_HEADERS(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Could not save budgets');
    setBudgetsState(next);
  }, []);

  return { budgets, saveBudgets, loading };
}
