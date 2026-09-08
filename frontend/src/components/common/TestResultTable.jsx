import React from 'react';
import { AlertTriangle, TrendingDown, TrendingUp, Check, HelpCircle, Info } from 'lucide-react';
import { getTestDetailedExplanation } from '../../utils/simplificationHelper';

export default function TestResultTable({ tests = [], language = 'en' }) {
  if (!tests || tests.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
        No individual biomarkers listed in this report.
      </div>
    );
  }

  return (
    <div>
      {/* 1. MOBILE RESPONSIVE CARDS VIEW (< 768px): clean stacked cards, no horizontal scrolling */}
      <div className="md:hidden space-y-3">
        {tests.map((test) => {
          const detail = getTestDetailedExplanation(test, language);
          const status = (test.status || 'unable_to_determine').toLowerCase();
          const isAttention = status === 'low' || status === 'high' || status === 'attention' || status === 'abnormal';

          const displayRange = test.referenceRange && test.referenceRange !== 'Not Specified'
            ? test.referenceRange
            : 'Not Specified';

          return (
            <div
              key={test.id}
              className={`p-4 rounded-2xl border transition-all ${
                isAttention
                  ? 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-900/60 shadow-soft'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-soft'
              }`}
            >
              {/* Header: Test name & Status badge */}
              <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-slate-100 dark:border-slate-800">
                <div className="min-w-0">
                  <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                    {detail.name || test.name}
                  </div>
                  {detail.categoryTag && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {detail.categoryTag}
                    </span>
                  )}
                </div>

                <div className="shrink-0">
                  {status === 'low' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                      <TrendingDown className="w-3 h-3" />
                      Low
                    </span>
                  )}
                  {status === 'high' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                      <TrendingUp className="w-3 h-3" />
                      High
                    </span>
                  )}
                  {status === 'normal' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                      <Check className="w-3 h-3" />
                      Normal
                    </span>
                  )}
                  {(status === 'unable_to_determine' || (!['low', 'high', 'normal'].includes(status))) && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                      <HelpCircle className="w-3 h-3" />
                      Review
                    </span>
                  )}
                </div>
              </div>

              {/* Value & Reference Range */}
              <div className="grid grid-cols-2 gap-2 my-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Your Result
                  </span>
                  <span className={`text-base font-bold block ${
                    status === 'low' ? 'text-rose-600 dark:text-rose-400' :
                    status === 'high' ? 'text-amber-600 dark:text-amber-400' :
                    'text-slate-900 dark:text-white'
                  }`}>
                    {test.value} {test.unit || ''}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
                    Normal Range
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mt-0.5">
                    {displayRange}
                  </span>
                </div>
              </div>

              {/* Simple explanation */}
              {detail.whatItMeans && (
                <div className={`p-2.5 rounded-xl text-xs leading-relaxed ${
                  isAttention
                    ? 'bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200'
                    : 'bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}>
                  <span className="font-semibold text-slate-900 dark:text-white block mb-0.5">
                    What this means:
                  </span>
                  {detail.whatItMeans}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. DESKTOP TABLE VIEW (>= 768px): Clean, modern table with full dark mode */}
      <div className="hidden md:block overflow-x-auto border border-slate-200/90 dark:border-slate-800 rounded-2xl">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[11px] tracking-wider">
            <tr>
              <th className="py-4 px-5 sm:px-6">BIOMARKER / TEST</th>
              <th className="py-4 px-4 whitespace-nowrap">YOUR RESULT</th>
              <th className="py-4 px-4 whitespace-nowrap">NORMAL RANGE</th>
              <th className="py-4 px-4 whitespace-nowrap">STATUS</th>
              <th className="py-4 px-5 min-w-[280px] max-w-sm">WHAT IT MEANS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/90 dark:divide-slate-800 font-medium bg-white dark:bg-slate-900/50">
            {tests.map((test) => {
              const detail = getTestDetailedExplanation(test, language);
              const status = (test.status || 'unable_to_determine').toLowerCase();
              const isAttention = status === 'low' || status === 'high' || status === 'attention' || status === 'abnormal';

              const displayRange = test.referenceRange && test.referenceRange !== 'Not Specified'
                ? test.referenceRange
                : 'Not Specified';

              return (
                <tr
                  key={test.id}
                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                >
                  {/* 1. BIOMARKER / TEST */}
                  <td className="py-4 px-5 sm:px-6 align-top">
                    <div className="flex items-start gap-1.5">
                      {isAttention && (
                        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-sm">
                          {detail.name || test.name}
                        </div>
                        {detail.simpleMeaning && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5 leading-snug">
                            {detail.simpleMeaning}
                          </div>
                        )}
                        {detail.categoryTag && (
                          <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            {detail.categoryTag}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* 2. YOUR RESULT */}
                  <td className="py-4 px-4 align-top whitespace-nowrap">
                    <span className={`text-base font-bold ${
                      status === 'low' ? 'text-rose-600 dark:text-rose-400' :
                      status === 'high' ? 'text-amber-600 dark:text-amber-400' :
                      'text-slate-900 dark:text-white'
                    }`}>
                      {test.value}
                    </span>
                    {test.unit && (
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-normal ml-1">
                        {test.unit}
                      </span>
                    )}
                  </td>

                  {/* 3. NORMAL RANGE */}
                  <td className="py-4 px-4 align-top whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-mono text-slate-700 dark:text-slate-300 font-medium">
                      {displayRange}
                    </span>
                  </td>

                  {/* 4. STATUS */}
                  <td className="py-4 px-4 align-top whitespace-nowrap">
                    {status === 'low' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
                        <TrendingDown className="w-3 h-3" />
                        Low
                      </span>
                    )}
                    {status === 'high' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
                        <TrendingUp className="w-3 h-3" />
                        High
                      </span>
                    )}
                    {status === 'normal' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
                        <Check className="w-3 h-3" />
                        Normal
                      </span>
                    )}
                    {(status === 'unable_to_determine' || (!['low', 'high', 'normal'].includes(status))) && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                        <HelpCircle className="w-3 h-3" />
                        Needs Review
                      </span>
                    )}
                  </td>

                  {/* 5. WHAT IT MEANS (SIMPLE EXPLANATION) */}
                  <td className="py-4 px-5 align-top">
                    <div className={`rounded-2xl p-3.5 text-xs leading-relaxed font-normal ${
                      isAttention
                        ? 'bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200'
                        : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {detail.whatItMeans}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
