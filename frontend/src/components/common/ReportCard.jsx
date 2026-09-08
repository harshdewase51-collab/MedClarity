import React from 'react';
import { Calendar, ArrowRight, FileText } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function ReportCard({
  report,
  onSelect,
  onView,
  isSelected = false,
}) {
  if (!report) return null;

  return (
    <div
      onClick={() => onSelect?.(report)}
      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer bg-white dark:bg-slate-900 ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-blue-900/60 shadow-sm'
          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-soft'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <StatusBadge status={report.status} size="sm" />
            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 truncate">
              {report.labName}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
            {report.name}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-0.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span>{report.date}</span>
            <span>•</span>
            <span>{report.totalTests} tests</span>
          </div>
        </div>

        {onView && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(report);
            }}
            className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-400 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-700 transition-colors shrink-0"
            aria-label="View report"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
