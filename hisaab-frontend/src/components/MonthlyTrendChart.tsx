import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { MonthTrendPoint } from '../lib/dashboard';
import { formatAmount } from '../lib/format';

interface TrendTooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function TrendTooltip({ active, payload, label }: TrendTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="min-w-[140px] rounded-md border border-neutral-100 bg-white px-3 py-2.5 shadow-card">
      <p className="mb-2 font-body text-xs font-semibold text-neutral-500">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <span className="font-body text-xs" style={{ color: entry.color }}>
            {entry.name}
          </span>
          <span className="font-mono text-xs font-medium" style={{ color: entry.color }}>
            {formatAmount(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

interface MonthlyTrendChartProps {
  data: MonthTrendPoint[];
}

export function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const hasData = data.some((d) => d.income > 0 || d.expenses > 0);

  if (!hasData) {
    return (
      <p className="flex h-52 items-center justify-center font-body text-sm text-neutral-400">
        No data yet — add transactions to see your trend.
      </p>
    );
  }

  if (!mounted) return <div className="h-52 w-full" />;

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }} barCategoryGap="30%">
          <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#9CA3AF', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => formatAmount(v)}
            tick={{ fontSize: 11, fill: '#9CA3AF', fontFamily: 'DM Sans' }}
            axisLine={false}
            tickLine={false}
            width={60}
          />
          <Tooltip content={<TrendTooltip />} cursor={{ fill: 'rgba(156,163,175,0.08)' }} />
          <Legend
            wrapperStyle={{ fontSize: 12, fontFamily: 'DM Sans', paddingTop: 8 }}
            iconType="circle"
            iconSize={8}
          />
          <Bar dataKey="income" name="Income" fill="#40916C" radius={[3, 3, 0, 0]} maxBarSize={28} />
          <Bar dataKey="expenses" name="Expenses" fill="#9B1C1C" radius={[3, 3, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
