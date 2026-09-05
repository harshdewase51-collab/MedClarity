import React from 'react';
import StatusBadge from './StatusBadge';
import { MessageSquare, Info, Stethoscope, HelpCircle, CheckCircle } from 'lucide-react';
import { getTestDetailedExplanation } from '../../utils/simplificationHelper';

export default function FindingCard({
  finding,
  language = 'en',
}) {
  const detail = getTestDetailedExplanation(finding, language);

  const status = detail.status;
  const isAttention = status === 'high' || status === 'low';
  const isUnable = status === 'unable_to_determine';

  // Localized UI Labels
  const labels = {
    en: {
      test: 'Test',
      status: 'Status',
      simpleMeaning: 'Simple meaning (What this measures)',
      yourResult: 'Your result',
      referenceRange: 'Reference range',
      whatItMeans: 'What this result means',
      whatToDiscuss: 'What to discuss with a doctor',
    },
    hi: {
      test: 'परीक्षण (Test)',
      status: 'स्थिति (Status)',
      simpleMeaning: 'सरल अर्थ (यह क्या मापता है)',
      yourResult: 'आपका परिणाम',
      referenceRange: 'सामान्य सीमा (Reference Range)',
      whatItMeans: 'इस परिणाम का क्या मतलब है',
      whatToDiscuss: 'डॉक्टर से क्या चर्चा करें',
    },
    hinglish: {
      test: 'Test',
      status: 'Status',
      simpleMeaning: 'Simple meaning (Ye test kya measure karta hai)',
      yourResult: 'Aapka result',
      referenceRange: 'Reference range',
      whatItMeans: 'Is result ka kya matlab hai',
      whatToDiscuss: 'Doctor se kya discuss karein',
    },
  }[language] || {
    test: 'Test',
    status: 'Status',
    simpleMeaning: 'Simple meaning',
    yourResult: 'Your result',
    referenceRange: 'Reference range',
    whatItMeans: 'What this result means',
    whatToDiscuss: 'What to discuss with a doctor',
  };

  return (
    <div
      className={`bg-white rounded-2xl border p-5 shadow-soft space-y-4 transition-all ${
        isAttention
          ? 'border-amber-200/90 hover:border-amber-300'
          : isUnable
          ? 'border-slate-200 hover:border-slate-300'
          : 'border-emerald-200/80 hover:border-emerald-300'
      }`}
    >
      {/* 1. Header: Test & Status */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
            {labels.test}
          </span>
          <h4 className="text-base font-bold text-slate-900 break-words leading-tight">
            {detail.testName}
          </h4>
        </div>
        <div className="shrink-0">
          <StatusBadge status={detail.status} size="sm" />
        </div>
      </div>

      {/* 2. Simple Meaning (What this test measures) */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{labels.simpleMeaning}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          {detail.simpleMeaning}
        </p>
      </div>

      {/* 3. Your Result & Reference Range */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/90 rounded-xl border border-slate-200/70 text-xs">
        <div>
          <span className="text-slate-400 font-medium block text-[11px]">
            {labels.yourResult}
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 block break-words">
            {detail.yourResult}
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block text-[11px]">
            {labels.referenceRange}
          </span>
          <span className="text-xs font-semibold text-slate-700 mt-1 block break-words">
            {detail.referenceRange}
          </span>
        </div>
      </div>

      {/* 4. What this result means */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 uppercase tracking-wider">
          {isAttention ? (
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          )}
          <span>{labels.whatItMeans}</span>
        </div>
        <div
          className={`p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
            isAttention
              ? 'bg-amber-50/60 border border-amber-100/80 text-amber-950 font-normal'
              : isUnable
              ? 'bg-slate-50 border border-slate-200/80 text-slate-700 font-normal'
              : 'bg-emerald-50/60 border border-emerald-100/80 text-emerald-950 font-normal'
          }`}
        >
          {detail.whatItMeans}
        </div>
      </div>

      {/* 5. What to discuss with a doctor */}
      <div className="space-y-1 pt-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 uppercase tracking-wider">
          <Stethoscope className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{labels.whatToDiscuss}</span>
        </div>
        <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs sm:text-sm text-blue-950 leading-relaxed font-normal">
          {detail.whatToDiscuss}
        </div>
      </div>
    </div>
  );
}
