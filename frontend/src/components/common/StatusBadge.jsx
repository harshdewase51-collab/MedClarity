import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';

export default function StatusBadge({ status, size = 'md' }) {
  const normalized = (status || '').toLowerCase();

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs font-semibold',
    md: 'px-2.5 py-1 text-xs font-semibold',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  }[size] || 'px-2.5 py-1 text-xs font-semibold';

  if (normalized === 'normal') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 border border-emerald-200/80 dark:border-emerald-800/80 ${sizeClasses}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <span>Normal</span>
      </span>
    );
  }

  if (normalized === 'high') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 border border-amber-200/90 dark:border-amber-800/80 ${sizeClasses}`}
      >
        <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>High</span>
      </span>
    );
  }

  if (normalized === 'low') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200/90 dark:border-rose-800/80 ${sizeClasses}`}
      >
        <ArrowDownRight className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0" />
        <span>Low</span>
      </span>
    );
  }

  if (normalized === 'attention' || normalized === 'abnormal') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-400 border border-amber-200/90 dark:border-amber-800/80 ${sizeClasses}`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>Attention</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 ${sizeClasses}`}
    >
      <HelpCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
      <span>Unable to determine</span>
    </span>
  );
}
