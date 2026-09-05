import React from 'react';
import StatusBadge from './StatusBadge';

export default function FindingCard({
  finding,
  language = 'en',
}) {
  const {
    testName,
    value,
    unit,
    referenceRange,
    status,
    explanation,
  } = finding;

  const expText =
    typeof explanation === 'object'
      ? explanation[language] || explanation.en
      : explanation;

  const isLow = status === 'low';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-soft space-y-3">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm sm:text-base font-bold text-slate-900">
            {testName}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Biomarker finding
          </p>
        </div>

        <StatusBadge status={status} size="sm" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 font-medium block">Result</span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 block">
            {value} <span className="text-xs font-semibold text-slate-500">{unit}</span>
          </span>
        </div>
        <div>
          <span className="text-slate-400 font-medium block">Reference Range</span>
          <span className="text-xs font-semibold text-slate-700 mt-1 block">
            {referenceRange}
          </span>
        </div>
      </div>

      {/* Simple Explanation - Calm, non-alarming tone */}
      <div className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-1">
        <strong className="text-slate-800 font-semibold block mb-0.5">
          Simple Explanation:
        </strong>
        {expText}
      </div>
    </div>
  );
}
