import { useEffect, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { EXPENSE_CATEGORIES, type MonthSummary } from '../types/transaction';
import { formatAmount } from '../lib/format';

interface CategoryBarChartProps {
  expensesByCategory: MonthSummary['expensesByCategory'];
}

interface TooltipPayloadEntry {
  value: number;
}

function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: TooltipPayloadEntry[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-md border border-neutral-100 bg-white px-3 py-2 shadow-card">
      <p className="font-body text-xs font-semibold text-neutral-700">{label}</p>
      <p className="font-mono text-sm text-expense-text">{formatAmount(payload[0].value)}</p>
    </div>
  );
}

// Expenses-by-category chart — Hisaab_Design_Document.md §8.2 (dashboard grid)
// Horizontal bars on mobile per the responsive table in §10.2; vertical on larger screens.
export function CategoryBarChart({ expensesByCategory }: CategoryBarChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const data = EXPENSE_CATEGORIES.map((category) => ({
    category,
    amount: expensesByCategory[category],
  })).filter((d) => d.amount > 0);

  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center font-body text-sm text-neutral-500">
        No expenses recorded for this month yet.
      </p>
    );
  }

  if (!mounted) {
    return <div className="h-72 w-full" />;
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 4 }}>
          <CartesianGrid horizontal={false} stroke="#E5E7EB" strokeDasharray="3 3" />
          <XAxis
            type="number"
            tickFormatter={(v: number) => formatAmount(v)}
            tick={{ fontSize: 11, fill: '#6B7280', fontFamily: 'DM Sans' }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="category"
            width={84}
            tick={{ fontSize: 12, fill: '#374151', fontFamily: 'DM Sans', fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(64,145,108,0.06)' }} />
          <Bar dataKey="amount" fill="#9B1C1C" radius={[0, 4, 4, 0]} maxBarSize={22} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
