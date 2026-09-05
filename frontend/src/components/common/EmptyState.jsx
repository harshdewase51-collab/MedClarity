import React from 'react';
import { FileQuestion, ArrowRight } from 'lucide-react';

export default function EmptyState({
  icon: Icon = FileQuestion,
  title = 'No Data Found',
  description = 'There are no items to display at this moment.',
  actionText,
  onAction,
}) {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 text-center shadow-soft flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
          {description}
        </p>
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-all"
        >
          <span>{actionText}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
