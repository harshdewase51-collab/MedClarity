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
        className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}
      >
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>Normal</span>
      </span>
    );
  }

  if (normalized === 'high') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/90 ${sizeClasses}`}
      >
        <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>High</span>
      </span>
    );
  }

  if (normalized === 'low') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200/90 ${sizeClasses}`}
      >
        <ArrowDownRight className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        <span>Low</span>
      </span>
    );
  }

  if (normalized === 'attention') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200/90 ${sizeClasses}`}
      >
        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span>Attention</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 ${sizeClasses}`}
    >
      <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span>Unable to determine</span>
    </span>
  );
}
