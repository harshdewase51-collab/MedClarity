import React from 'react';

export default function ReferenceGauge({ value, min, max, unit, status }) {
  const numericVal = parseFloat(value);
  const isNumeric = !isNaN(numericVal) && min !== undefined && max !== undefined && min !== max;

  if (!isNumeric) {
    return (
      <div className="text-xs text-slate-400 italic">
        Reference: Qualitative assessment
      </div>
    );
  }

  const rangeSpan = max - min;
  let percent = 50;

  if (numericVal < min) {
    const diff = min - numericVal;
    const ratio = Math.min(diff / (rangeSpan * 0.8), 1);
    percent = Math.max(25 - ratio * 20, 5);
  } else if (numericVal > max) {
    const diff = numericVal - max;
    const ratio = Math.min(diff / (rangeSpan * 0.8), 1);
    percent = Math.min(75 + ratio * 20, 95);
  } else {
    const ratio = (numericVal - min) / rangeSpan;
    percent = 25 + ratio * 50;
  }

  const normalizedStatus = (status || '').toLowerCase();
  const markerColor =
    normalizedStatus === 'normal'
      ? 'bg-emerald-600 ring-emerald-100'
      : normalizedStatus === 'high'
      ? 'bg-amber-600 ring-amber-100'
      : normalizedStatus === 'low'
      ? 'bg-rose-600 ring-rose-100'
      : 'bg-slate-600 ring-slate-100';

  return (
    <div className="w-full space-y-1.5 pt-1">
      <div className="relative h-2 w-full rounded-full bg-slate-100 overflow-hidden flex border border-slate-200/60">
        {/* Low zone (0 - 25%) */}
        <div className="w-1/4 h-full bg-rose-50 border-r border-slate-200" title="Below normal" />
        {/* Normal zone (25 - 75%) */}
        <div className="w-1/2 h-full bg-emerald-50 border-r border-slate-200" title="Standard reference range" />
        {/* High zone (75 - 100%) */}
        <div className="w-1/4 h-full bg-amber-50" title="Above normal" />
      </div>

      {/* Marker pointer */}
      <div className="relative h-2.5 w-full">
        <div
          className="absolute -top-2.5 -translate-x-1/2 flex flex-col items-center transition-all duration-300"
          style={{ left: `${percent}%` }}
        >
          <div className={`w-2.5 h-2.5 rounded-full border border-white shadow-sm ring-2 ${markerColor}`} />
        </div>
      </div>

      {/* Range boundary labels */}
      <div className="flex justify-between text-[11px] text-slate-400 font-medium px-0.5">
        <span className="text-rose-600">Low</span>
        <span className="text-emerald-700 font-semibold">{min} – {max} {unit} (Normal)</span>
        <span className="text-amber-700">High</span>
      </div>
    </div>
  );
}
