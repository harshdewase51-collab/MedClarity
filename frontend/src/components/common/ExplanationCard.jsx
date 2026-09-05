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
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-soft space-y-3">
      {/* 1. Medical Term */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Medical Term
          </span>
          {item.relatedTest && (
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              Test: {item.relatedTest}
            </span>
          )}
        </div>
        <h4 className="text-base font-bold text-slate-900">
          {term}
        </h4>
      </div>

      {/* Down indicator */}
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600">
        <ArrowDown className="w-3.5 h-3.5" />
        <span>Simple Meaning</span>
      </div>

      {/* 2. Simple Meaning */}
      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
        {meaning}
      </div>

      {/* Down indicator */}
      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-600">
        <ArrowDown className="w-3.5 h-3.5" />
        <span>Easy Explanation</span>
      </div>

      {/* 3. Easy Explanation */}
      <div className="bg-blue-50/50 rounded-xl p-3.5 border border-blue-100 text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
        {explanation}
      </div>
    </div>
  );
}
