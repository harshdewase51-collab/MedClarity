import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while processing the request.',
  onRetry,
}) {
  return (
    <div className="bg-rose-50/70 border border-rose-200 rounded-3xl p-6 sm:p-8 text-center max-w-lg mx-auto space-y-4">
      <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
        <AlertCircle className="w-6 h-6" />
      </div>

      <div className="space-y-1">
        <h3 className="text-base font-bold text-rose-900">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-rose-700 leading-relaxed max-w-sm mx-auto">
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-rose-300 text-rose-800 hover:bg-rose-100 font-semibold text-xs shadow-soft transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
