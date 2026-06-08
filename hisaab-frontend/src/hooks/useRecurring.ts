import { useCallback, useEffect, useState } from 'react';
import type { Category, TransactionType } from '../types/transaction';

export interface RecurringTemplate {
  id: string;
  vendor_name: string;
  category: Category;
  transaction_type: TransactionType;
  total_amount: number;
  day_of_month: number;
  notes: string | null;
  is_active: boolean;
  created_at: string;
}

function getToken() {
  return localStorage.getItem('hisaab_token') ?? '';
}

const authHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

export function useRecurring() {
  const [templates, setTemplates] = useState<RecurringTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/recurring', { headers: authHeaders() })
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: RecurringTemplate[]) =>
        setTemplates(rows.map((r) => ({ ...r, total_amount: parseFloat(String(r.total_amount)) }))),
      )
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false));
  }, []);

  const createTemplate = useCallback(
    async (input: Omit<RecurringTemplate, 'id' | 'is_active' | 'created_at'>) => {
      const res = await fetch('/api/recurring', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error('Could not create recurring template');
      const created: RecurringTemplate = await res.json();
      created.total_amount = parseFloat(String(created.total_amount));
      setTemplates((prev) => [created, ...prev]);
      return created;
    },
    [],
  );

  const updateTemplate = useCallback(
    async (id: string, patch: Partial<Omit<RecurringTemplate, 'id' | 'created_at'>>) => {
      const res = await fetch(`/api/recurring/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(patch),
      });
      if (!res.ok) throw new Error('Could not update recurring template');
      const updated: RecurringTemplate = await res.json();
      updated.total_amount = parseFloat(String(updated.total_amount));
      setTemplates((prev) => prev.map((t) => (t.id === id ? updated : t)));
      return updated;
    },
    [],
  );

  const deleteTemplate = useCallback(async (id: string) => {
    await fetch(`/api/recurring/${id}`, { method: 'DELETE', headers: authHeaders() });
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Auto-generate transactions for a given month from active templates
  // Returns the number of new transactions created
  const applyForMonth = useCallback(async (monthKey: string): Promise<number> => {
    const res = await fetch('/api/recurring/apply', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ monthKey }),
    });
    if (!res.ok) return 0;
    const { created } = await res.json();
    return created ?? 0;
  }, []);

  const activeTemplates = templates.filter((t) => t.is_active);

  return { templates, activeTemplates, loading, createTemplate, updateTemplate, deleteTemplate, applyForMonth };
}
