import React from 'react';
import { Info } from 'lucide-react';

export default function Disclaimer({ compact = false }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 py-2 border-t border-slate-200 dark:border-slate-800">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <p>
          <strong>Notice:</strong> This tool helps explain medical reports in simple language. It does not provide medical diagnosis or treatment advice.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 p-4 sm:p-5 shadow-soft">
      <div className="flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
          <Info className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Medical Disclaimer
          </h5>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
            This tool helps explain medical reports in simple language. It does not provide medical diagnosis or treatment advice.
          </p>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 pt-0.5">
            Always consult a qualified healthcare provider regarding any health condition or diagnostic test results.
          </p>
        </div>
      </div>
    </div>
  );
}
