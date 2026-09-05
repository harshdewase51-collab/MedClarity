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
      className={`p-5 rounded-2xl border transition-all cursor-pointer bg-white ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-100 shadow-sm'
          : 'border-slate-200 hover:border-slate-300 hover:shadow-soft'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <StatusBadge status={report.status} size="sm" />
            <span className="text-[11px] font-semibold text-slate-400 truncate">
              {report.labName}
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {report.name}
          </h3>

          <div className="flex items-center gap-2 text-xs text-slate-500 pt-0.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
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
            className="p-2 rounded-xl bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-200/80 transition-colors shrink-0"
            aria-label="View report"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
