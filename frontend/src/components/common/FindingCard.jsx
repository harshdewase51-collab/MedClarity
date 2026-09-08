import React from 'react';
import StatusBadge from './StatusBadge';
import { Info, Stethoscope, HelpCircle, CheckCircle } from 'lucide-react';
import { getTestDetailedExplanation } from '../../utils/simplificationHelper';

export default function FindingCard({
  finding,
  language = 'en',
}) {
  const detail = getTestDetailedExplanation(finding, language);

  const status = detail.status;
  const isAttention = status === 'high' || status === 'low' || status === 'attention' || status === 'abnormal';
  const isUnable = status === 'unable_to_determine';

  // Localized UI Labels
  const labels = {
    en: {
      test: 'Test',
      status: 'Status',
      simpleMeaning: 'What this measures',
      yourResult: 'Your result',
      referenceRange: 'Normal range',
      whatItMeans: 'What this result means',
      whatToDiscuss: 'Questions for your doctor',
    },
    hi: {
      test: 'परीक्षण (Test)',
      status: 'स्थिति (Status)',
      simpleMeaning: 'यह क्या मापता है',
      yourResult: 'आपका परिणाम',
      referenceRange: 'सामान्य सीमा',
      whatItMeans: 'इस परिणाम का क्या मतलब है',
      whatToDiscuss: 'डॉक्टर से क्या पूछें',
    },
    hinglish: {
      test: 'Test',
      status: 'Status',
      simpleMeaning: 'Ye test kya measure karta hai',
      yourResult: 'Aapka result',
      referenceRange: 'Normal range',
      whatItMeans: 'Is result ka kya matlab hai',
      whatToDiscuss: 'Doctor se kya discuss karein',
    },
  }[language] || {
    test: 'Test',
    status: 'Status',
    simpleMeaning: 'What this measures',
    yourResult: 'Your result',
    referenceRange: 'Normal range',
    whatItMeans: 'What this result means',
    whatToDiscuss: 'Questions for your doctor',
  };

  return (
    <div
      className={`bg-white dark:bg-slate-900 rounded-2xl border p-4 sm:p-5 shadow-soft space-y-3.5 transition-all ${
        isAttention
          ? 'border-amber-200/90 dark:border-amber-900/60 hover:border-amber-300 dark:hover:border-amber-700'
          : isUnable
          ? 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          : 'border-emerald-200/80 dark:border-emerald-900/60 hover:border-emerald-300 dark:hover:border-emerald-700'
      }`}
    >
      {/* 1. Header: Test & Status */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-0.5">
            {labels.test}
          </span>
          <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white break-words leading-tight">
            {detail.testName}
          </h4>
        </div>
        <div className="shrink-0">
          <StatusBadge status={detail.status} size="sm" />
        </div>
      </div>

      {/* 2. Simple Meaning (What this test measures) */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>{labels.simpleMeaning}</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
          {detail.simpleMeaning}
        </p>
      </div>

      {/* 3. Your Result & Reference Range */}
      <div className="grid grid-cols-2 gap-2 p-2.5 sm:p-3 bg-slate-50/90 dark:bg-slate-800/50 rounded-xl border border-slate-200/70 dark:border-slate-800 text-xs">
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-medium block text-[11px]">
            {labels.yourResult}
          </span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block break-words">
            {detail.yourResult}
          </span>
        </div>
        <div>
          <span className="text-slate-400 dark:text-slate-500 font-medium block text-[11px]">
            {labels.referenceRange}
          </span>
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1 block break-words">
            {detail.referenceRange}
          </span>
        </div>
      </div>

      {/* 4. What this result means */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          {isAttention ? (
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          ) : (
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
          <span>{labels.whatItMeans}</span>
        </div>
        <div
          className={`p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm leading-relaxed ${
            isAttention
              ? 'bg-amber-50/70 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/60 text-amber-950 dark:text-amber-200'
              : isUnable
              ? 'bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 text-slate-700 dark:text-slate-300'
              : 'bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200'
          }`}
        >
          {detail.whatItMeans}
        </div>
      </div>

      {/* 5. What to discuss with a doctor */}
      <div className="space-y-1 pt-0.5">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wider">
          <Stethoscope className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span>{labels.whatToDiscuss}</span>
        </div>
        <div className="p-2.5 sm:p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-xs sm:text-sm text-blue-950 dark:text-blue-200 leading-relaxed font-normal">
          {detail.whatToDiscuss}
        </div>
      </div>
    </div>
  );
}
