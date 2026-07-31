import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { Card } from '../ui';

export interface StatWidgetCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
}

export const StatWidgetCard: React.FC<StatWidgetCardProps> = ({
  title,
  value,
  change,
  trend = 'neutral',
  subtitle,
  icon,
  badge,
  onClick,
}) => {
  return (
    <Card onClick={onClick} className="relative overflow-hidden group">
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-2xl font-extrabold text-slate-900 dark:text-zinc-100 tracking-tight">
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>

        {change && (
          <span
            className={`inline-flex items-center text-xs font-bold px-1.5 py-0.5 rounded-md ${
              trend === 'up'
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                : trend === 'down'
                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                : 'bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400'
            }`}
          >
            {trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
            {trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
            {trend === 'neutral' && <Minus className="w-3 h-3 mr-0.5" />}
            {change}
          </span>
        )}
      </div>

      {(subtitle || badge) && (
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100 dark:border-zinc-800/80 text-[11px] text-slate-400 dark:text-zinc-500">
          <span>{subtitle || 'Updated live'}</span>
          {badge && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300">
              {badge}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
