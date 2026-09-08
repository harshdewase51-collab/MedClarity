import React from 'react';
import { ArrowDown } from 'lucide-react';

export default function ExplanationCard({
  item,
  language = 'en',
}) {
  const term = typeof item.medicalTerm === 'object' ? item.medicalTerm[language] || item.medicalTerm.en : item.medicalTerm;
  const meaning = typeof item.simpleMeaning === 'object' ? item.simpleMeaning[language] || item.simpleMeaning.en : item.simpleMeaning;
  const explanation = typeof item.easyExplanation === 'object' ? item.easyExplanation[language] || item.easyExplanation.en : item.easyExplanation;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-soft space-y-3 transition-colors">
      {/* 1. Medical Term */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Medical Term
          </span>
          {item.relatedTest && (
            <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
              Test: {item.relatedTest}
            </span>
          )}
        </div>
        <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
          {term}
        </h4>
      </div>

      {/* Down indicator */}
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
        <ArrowDown className="w-3.5 h-3.5" />
        <span>Simple Meaning</span>
      </div>

      {/* 2. Simple Meaning */}
      <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 border border-slate-100 dark:border-slate-800 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">
        {meaning}
      </div>

      {/* Down indicator */}
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
        <ArrowDown className="w-3.5 h-3.5" />
        <span>Easy Explanation</span>
      </div>

      {/* 3. Easy Explanation */}
      <div className="bg-blue-50/50 dark:bg-blue-950/30 rounded-xl p-3.5 border border-blue-100 dark:border-blue-900/40 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
        {explanation}
      </div>
    </div>
  );
}
